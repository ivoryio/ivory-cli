const { iif, throwError } = require('rxjs')
const { concatMap, tap } = require('rxjs/operators')

const deleteLogs = require('./deleteLogs')
const deleteStacks = require('./deleteStacks')
const inquireWarning = require('./inquireWarning')
const resetApiConfig = require('./resetApiConfig')
const deleteS3Buckets = require('./deleteS3Buckets')
const getStacksToDelete = require('./getStacksToDelete')
const deleteRoute53Records = require('./deleteRoute53Records')
const readProjectProperties = require('../../readProjectProperties')

module.exports = (log) => inquireWarning(log).pipe(
  tap(logDeleteProject(log)),
  concatMap(decideWhatToDo)
)

const decideWhatToDo = (answer) => readProjectProperties().pipe(
  concatMap(projectProperties => iif(
    () => projectProperties.name.toLowerCase() === answer.toLowerCase(),
    deleteProject(),
    abort(answer)
  ))
)

const deleteProject = () => getStacksToDelete().pipe(
  concatMap(deleteStacks),
  concatMap(deleteS3Buckets),
  concatMap(resetApiConfig),
  concatMap(deleteLogs),
  concatMap(deleteRoute53Records)
)

const abort = (projectName) => throwError(`No action proceded. There is no project with the name ${projectName}`)

const logDeleteProject = (log) => (projectName) => {
  log.text = `Deleting ${projectName} project ...\n`
  log.start()
}
