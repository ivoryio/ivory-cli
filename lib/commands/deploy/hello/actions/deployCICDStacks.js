const AWS = require('aws-sdk')
const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = (config, log) =>
  Observable.create(observer => {
    AWS.config.credentials = new AWS.SharedIniFileCredentials({
      profile: config.profile
    })

    log.text =
      'Deploying CI/CD stacks, it might take between 30-45 minutes...\n'
    log.start()

    const arr = shell.pwd().split('/')
    const projectName = arr[arr.length - 1]
    shell.cd('z-ci-cd')

    if (!shell.test('-e', 'bin/app.ts')) {
      return observer.error(
        new Error(
          'Make sure you are running the command in the root folder of the project'
        )
      )
    }

    var route53 = new AWS.Route53({
      apiVersion: '2013-04-01',
      region: config.region
    })

    if (config.createARecords) {
      route53.listHostedZones({}, (err, data) => {
        if (err) {
          return observer.error(err)
        }

        const hostedZoneId = data.HostedZones.find(
          hz => hz.Name === `${config.domainName}.`
        )
        if (!hostedZoneId) {
          return observer.error(
            new Error(`No hosted zone found for ${config.domainName}`)
          )
        }

        const acm = new AWS.ACM({
          apiVersion: '2015-12-08',
          region: config.region
        })

        const params = { CertificateStatuses: ['ISSUED'] }
        acm.listCertificates(params, (err, data) => {
          if (err) {
            return observer.error(err)
          }

          const certificate = data.CertificateSummaryList.find(
            c => c.DomainName === config.domainName
          )
          if (!certificate) {
            return observer.error(
              new Error(
                `No issued certificate found in AWS Certificate Manager for ${
                  config.domainName
                }`
              )
            )
          }

          runCDKDeploy(
            hostedZoneId.Id.split('/')[2],
            config.domainName,
            certificate.CertificateArn
          )
        })
      })
    } else {
      runCDKDeploy()
    }

    function runCDKDeploy (hostedZoneId, domainName, certificateARN) {
      let cmd

      if (hostedZoneId && domainName && certificateARN) {
        cmd = `npm i && PROJECT_NAME=${projectName} HOSTED_ZONE_ID=${hostedZoneId} APP_DOMAIN_NAME=${domainName} CERTIFICATE_ARN=${certificateARN} npx cdk deploy --profile ${
          config.profile
        } --require-approval never`
      } else {
        cmd = `npm i && PROJECT_NAME=${projectName} npx cdk deploy --profile ${
          config.profile
        } --require-approval never`
      }

      shell.exec(cmd, { silent: true }, (code, _, stderr) => {
        if (code !== 0) {
          return observer.error(new Error(stderr))
        }

        shell.cd('..')
        observer.next({ ...config, projectName })
        observer.complete()
      })
    }
  })
