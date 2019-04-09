const AWS = require('aws-sdk')
const { Observable } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const readProjectProperties = require('../../readProjectProperties')

const route53 = new AWS.Route53()

module.exports = () => readProjectProperties().pipe(
  concatMap(getHostedZone),
  concatMap(getResourceRecord),
  concatMap(deleteRecords)
)

const getHostedZone = (projectProperties) => Observable.create((observer) => {
  const params = { }

  route53.listHostedZones(params, (err, data) => {
    if (err) observer.error(err)

    const hostedZone = data.HostedZones.find(zone => zone['Name'] === `${projectProperties.domain}.`)
    observer.next({ hostedZone, projectProperties })
    observer.complete()
  })
})

const getResourceRecord = ({ hostedZone, projectProperties }) => Observable.create((observer) => {
  const params = {
    HostedZoneId: hostedZone.Id,
    StartRecordName: `${projectProperties.subdomain}.${projectProperties.domain}`,
    StartRecordType: 'CNAME'
  }

  route53.listResourceRecordSets(params, (err, data) => {
    if (err) observer.error(err)
    const resource = data.ResourceRecordSets[0]
    observer.next({ resource, hostedZone })
    observer.complete()
  })
})

const deleteRecords = ({ resource, hostedZone }) => Observable.create((observer) => {
  const params = {
    ChangeBatch: {
      Changes: [{
        Action: 'DELETE',
        ResourceRecordSet: { ...resource }
      }]
    },
    HostedZoneId: hostedZone.Id
  }

  route53.changeResourceRecordSets(params, (err, data) => {
    if (err) observer.error(err)
    observer.next()
    observer.complete()
  })
})
