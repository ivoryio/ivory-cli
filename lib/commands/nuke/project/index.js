const { Observable, iif } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const deleteS3Bucket = require('./deleteS3Bucket')
const deleteStacks = require('./deleteStacks')
const inquireWarning = require('./inquireWarning')

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
        deleteStacks(projectProperties, log),
        abortDelete()
      )
    }),
    concatMap(() => deleteS3Bucket(projectProperties, log))
  )
}
