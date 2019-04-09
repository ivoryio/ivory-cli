const AWS = require('aws-sdk')
const { Observable, iif } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const deleteLogs = require('./deleteLogs')
const deleteStacks = require('./deleteStacks')
const inquireWarning = require('./inquireWarning')
const resetApiConfig = require('./resetApiConfig')
const deleteS3Buckets = require('./deleteS3Buckets')
const getStacksToDelete = require('./getStacksToDelete')
const readProjectProperties = require('../../readProjectProperties')

const route53 = new AWS.Route53()

module.exports = (log, projectProperties) => {
  let isDelete
  const { credentials, name } = projectProperties

  const abortDelete = (projectName) => Observable.create((observer) => {
    observer.error(new Error(`No action proceded. There is no project with the name ${projectName}`))
  })

  return inquireWarning(log).pipe(
    concatMap(projectName => {
      isDelete = projectName.toLowerCase() === name
      return iif(
        () => isDelete,
        getStacksToDelete(credentials, name),
        abortDelete(projectName)
      )
    }),
    concatMap(stacks => deleteStacks(credentials, log, stacks)),
    concatMap(deleteS3Buckets),
    concatMap(() => resetApiConfig()),
    concatMap(deleteLogs(credentials, name)),
    concatMap(deleteRoute53Records)
  )
}

const deleteRoute53Records = () => readProjectProperties().pipe(
  concatMap(getHostedZone)
)

const getHostedZone = (projectProperties) => Observable.create((observer) => {
  const params = { }

  route53.listHostedZones(params, (err, data) => {
    if (err) observer.error(err)

    const hostedZone = data.HostedZones.filter(zone => zone['Name'] === `${projectProperties.domain}.`)
    observer.next(hostedZone)
    observer.complete()
  })
})
