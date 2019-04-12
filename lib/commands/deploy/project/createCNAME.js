const AWS = require('aws-sdk')
const { Observable, iif, empty } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const readProjectProperties = require('../../readProjectProperties')

module.exports = () => readProjectProperties().pipe(
  concatMap(updateAWSConfig),
  concatMap(listHostedZones),
  concatMap(retrieveCNAME),
  concatMap(({ domain, subdomain, zone, CNAME }) => iif(
    () => CNAME,
    empty(),
    changeResourceRecordSets({ domain, subdomain, zone }))
  )
)

const updateAWSConfig = (projectProperties) => Observable.create(observer => {
  try {
    const { credentials } = projectProperties

    AWS.config.update({
      region: credentials.region,
      credentials: new AWS.SharedIniFileCredentials({ profile: credentials.profile })
    })

    observer.next({ domain: projectProperties.domain, subdomain: projectProperties.subdomain })
    observer.complete()
  } catch (err) {
    observer.error(err)
  }
})
const listHostedZones = ({ domain, subdomain }) => Observable.create(observer => {
  var route53 = new AWS.Route53()

  route53.listHostedZones({}, function (err, data) {
    if (err) {
      return observer.error(err)
    }
    const zone = data.HostedZones.filter(z => z.Name === `${domain}.`)[0]

    observer.next({ domain, subdomain, zone })
    observer.complete()
  })
})
const retrieveCNAME = ({ domain, subdomain, zone }) => Observable.create(observer => {
  var route53 = new AWS.Route53()

  route53.listResourceRecordSets({ HostedZoneId: zone.Id }, (err, data) => {
    if (err) {
      return observer.error(err)
    }

    const CNAME = data.ResourceRecordSets.filter(resource => resource.Name === `${subdomain}.${domain}.`)[0]
    observer.next({ domain, subdomain, zone, CNAME })
    observer.complete()
  })
})
const changeResourceRecordSets = ({ domain, subdomain, zone }) => Observable.create(observer => {
  var route53 = new AWS.Route53()

  const params = {
    HostedZoneId: zone.Id,
    ChangeBatch: {
      Changes: [{
        Action: 'CREATE',
        ResourceRecordSet: {
          Name: `${subdomain}.${domain}`,
          Type: 'CNAME',
          TTL: 60,
          ResourceRecords: [{
            Value: `${subdomain}.${domain}.s3-website-us-east-1.amazonaws.com`
          }]
        }
      }]
    }
  }

  route53.changeResourceRecordSets(params, function (err) {
    if (err) {
      return observer.error(err)
    }
    observer.next()
    observer.complete()
  })
})
