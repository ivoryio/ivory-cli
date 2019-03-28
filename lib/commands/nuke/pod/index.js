const { Observable, iif } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const deletePod = require('./deletePod')
const inquirePodName = require('./inquirePodName')
const detectPods = require('../../detectPods')

module.exports = (log, projectProperties) => {
  let isPodExisting

  const abortDelete = () => Observable.create((observer) => {
    observer.error(new Error('No action proceded.'))
  })

  return inquirePodName(log).pipe(
    concatMap(podName => detectPods(projectProperties, podName)),
    concatMap(answer => {
      isPodExisting = answer.pods.indexOf(answer.podName) > -1
      return iif(
        () => isPodExisting,
        deletePod(log, answer),
        abortDelete()
      )
    })
  )
}
