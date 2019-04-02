const shell = require('shelljs')
const clc = require('cli-color')
const { Observable, concat } = require('rxjs')
const { concatMap, tap } = require('rxjs/operators')

const deployPod = require('../../deploy/pod/deployPod')
const detectPods = require('../../detectPods')
const readProjectProperties = require('../../readProjectProperties')
// const inquireWhatPodToDeploy = require('./inquireWhatPodToDeploy')

var AWS = require('aws-sdk')

const createCNAME = (projectProperties) => Observable.create((observer) => {
  const { credentials } = projectProperties

  AWS.config.update({
    region: credentials.region,
    credentials: new AWS.SharedIniFileCredentials({ profile: credentials.profile })
  })

  var route53 = new AWS.Route53()

  route53.listHostedZones({}, function (err, data) {
    if (err) {
      return observer.error(err)
    }

    const zone = data.HostedZones.filter(z => z.Name === `${projectProperties.domain}.`)[0]
    route53.listResourceRecordSets({ HostedZoneId: zone.Id }, (err, data) => {
      if (err) {
        return observer.error(err)
      }

      const CNAME = data.ResourceRecordSets.filter(resource => resource.Name === `${projectProperties.subdomain}.${projectProperties.domain}.`)[0]
      if (CNAME) {
        observer.next()
        return observer.complete()
      }

      const params = {
        'HostedZoneId': zone.Id,
        'ChangeBatch': {
          'Changes': [
            {
              'Action': 'CREATE',
              'ResourceRecordSet': {
                'Name': `${projectProperties.subdomain}.${projectProperties.domain}`,
                'Type': 'CNAME',
                'TTL': 60,
                'ResourceRecords': [
                  {
                    'Value': `${projectProperties.subdomain}.${projectProperties.domain}.s3-website-us-east-1.amazonaws.com`
                  }
                ]
              }
            }
          ]
        }
      }

      route53.changeResourceRecordSets(params, function (err, data) {
        if (err) {
          return observer.error(err)
        }

        observer.next()
        observer.complete()
      })
    })
  })
})

const createDeploymentBucket = (projectProperties) => Observable.create((observer) => {
  try {
    const { credentials } = projectProperties

    AWS.config.update({
      region: credentials.region,
      credentials: new AWS.SharedIniFileCredentials({ profile: credentials.profile })
    })

    const s3 = new AWS.S3()
    const bucketName = `${projectProperties.subdomain}.${projectProperties.domain}`
    s3.createBucket({ Bucket: bucketName, ACL: 'public-read' }, (err, data) => {
      if (err) {
        return observer.error(err)
      }

      var readOnlyAnonUserPolicy = {
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'AddPerm',
            Effect: 'Allow',
            Principal: '*',
            Action: [
              's3:GetObject'
            ],
            Resource: [
              `arn:aws:s3:::${bucketName}/*`
            ]
          }
        ]
      }

      var bucketPolicyParams = { Bucket: bucketName, Policy: JSON.stringify(readOnlyAnonUserPolicy) }

      s3.putBucketPolicy(bucketPolicyParams, function (err, data) {
        if (err) {
          return observer.error(err)
        }

        var staticHostParams = {
          Bucket: bucketName,
          WebsiteConfiguration: {
            ErrorDocument: {
              Key: 'error.html'
            },
            IndexDocument: {
              Suffix: 'index.html'
            }
          }
        }

        s3.putBucketWebsite(staticHostParams, function (err, data) {
          if (err) {
            return observer.error(err)
          }

          observer.next(projectProperties)
          observer.complete()
        })
      })
    })
  } catch (err) {
    observer.error(err)
  }
})

const syncWebApp = (projectProperties) => Observable.create((observer) => {
  shell.exec('yarn build', { silent: true }, (code, stdout, stderr) => {
    if (code !== 0) {
      return observer.error(new Error(stderr))
    }
    const cmd = `aws s3 sync ./build/ s3://${projectProperties.subdomain}.${projectProperties.domain} --profile ${projectProperties.credentials.profile}`
    shell.exec(cmd, { silent: true }, (code, stdout, stderr) => {
      if (code !== 0) {
        return observer.error(new Error(stderr))
      }
      observer.next(projectProperties)
      observer.complete()
    })
  })
})

const deployPods = (projectProperties) => Observable.create((observer) => {
  const { pods } = projectProperties
  const userPod = pods.splice(pods.indexOf('user'), 1)

  if (userPod) {
    pods.unshift('user')
  }
  const tasks = pods.map(podName => readProjectProperties().pipe(
    concatMap((projectProperties) => deployPod({ projectProperties, podName })
    )
  ))

  concat(...tasks)
    .subscribe({
      next: () => { },
      error: (err) => observer.error(err),
      complete: () => {
        observer.next(projectProperties)
        observer.complete()
      }
    })
})

module.exports = (log) => readProjectProperties().pipe(
  tap(() => {
    process.stdout.write(clc.yellow('This will take a few minutes!\n'))
    log.text = `Deploying pod microservices...`
    log.start()
  }),
  concatMap((projectProperties) => detectPods(projectProperties)),
  concatMap((projectProperties) => deployPods(projectProperties)),
  tap(() => {
    log.text = `Deploying web application...`
    log.start()
  }),
  concatMap(projectProperties => createDeploymentBucket(projectProperties)),
  concatMap(projectProperties => syncWebApp(projectProperties)),
  concatMap(projectProperties => createCNAME(projectProperties))
)
