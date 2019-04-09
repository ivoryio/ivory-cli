const { Observable, iif } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const deleteLogs = require('./deleteLogs')
const deleteStacks = require('./deleteStacks')
const inquireWarning = require('./inquireWarning')
const resetApiConfig = require('./resetApiConfig')
const deleteS3Buckets = require('./deleteS3Buckets')
const getStacksToDelete = require('./getStacksToDelete')
const deleteRoute53Records = require('./deleteRoute53Records')

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
