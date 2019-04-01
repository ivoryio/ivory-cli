const { Observable, iif } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const deleteStacks = require('./deleteStacks')
const deleteS3Bucket = require('./deleteS3Bucket')
const inquireWarning = require('./inquireWarning')
const resetApiConfig = require('./resetApiConfig')
const deleteLogs = require('./deleteLogs')
const getStacksToDelete = require('./getStacksToDelete')

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
    concatMap(() => deleteS3Bucket(name)),
    concatMap(() => resetApiConfig()),
    concatMap(() => deleteLogs(credentials, name))
  )
}
