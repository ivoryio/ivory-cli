const { Observable, iif } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const deleteStacks = require('./deleteStacks')
const deleteS3Bucket = require('./deleteS3Bucket')
const inquireWarning = require('./inquireWarning')
const resetApiConfig = require('./resetApiConfig')
const getStacksToDelete = require('./getStacksToDelete')

module.exports = (log, projectProperties) => {
  let isDelete

  const abortDelete = () => Observable.create((observer) => {
    observer.error(new Error('No action proceded.'))
  })

  return inquireWarning(log).pipe(
    concatMap(answer => {
      isDelete = answer.toLowerCase() === projectProperties.name
      return iif(
        () => isDelete,
        getStacksToDelete(projectProperties),
        abortDelete()
      )
    }),
    concatMap((stacks) => deleteStacks(projectProperties, log, stacks)),
    concatMap(() => deleteS3Bucket(projectProperties)),
    concatMap(() => resetApiConfig())
  )
}
