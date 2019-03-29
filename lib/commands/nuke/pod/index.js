const { Observable, iif } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const detectPods = require('../../detectPods')
const inquirePodName = require('./inquirePodName')
const deleteStack = require('./deleteStack')
const deletePodEntries = require('./deletePodEntries')
const deleteApiEntries = require('./deleteApiEntries')
const removeFolder = require('./removeFolder')

module.exports = (log, projectProperties) => {
  const { credentials, name } = projectProperties
  let isPodExisting

  const abortDelete = (podName) => Observable.create((observer) => {
    observer.error(new Error(`No action proceded. There is no pod with the name ${podName}`))
  })

  return detectPods().pipe(
    concatMap(pods => inquirePodName(pods)),
    concatMap(podSetup => {
      isPodExisting = podSetup.pods.indexOf(podSetup.podName) > -1
      log.start('Waiting for the pod to be deleted...')

      return iif(
        () => isPodExisting,
        deleteStack(credentials.region, name, podSetup.podName),
        abortDelete(podSetup.podName)
      )
    }),
    concatMap(podName => deletePodEntries(podName)),
    concatMap(podName => deleteApiEntries(podName)),
    concatMap(podName => removeFolder(podName))
  )
}
