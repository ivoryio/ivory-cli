const { Observable, iif } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const deletePod = require('./deletePod')
const inquirePodName = require('./inquirePodName')

module.exports = (log, projectProperties) => {
  let isPodExisting

  const abortDelete = () => Observable.create((observer) => {
    observer.error(new Error('No action proceded.'))
  })

  return inquirePodName(log).pipe(
    concatMap(podDetails => {
      isPodExisting = projectProperties.pods.indexOf(podDetails.podName) > -1

      return iif(
        () => isPodExisting,
        deletePod(log, projectProperties, podDetails.podName, podDetails.enviroment),
        abortDelete()
      )
    })
  )
}
