const { concatMap, tap } = require('rxjs/operators')

const scaffold = require('./scaffold')
const changeToRootDirectory = require('./changeToRootDirectory')
const persistProjectProperties = require('../../persistProjectProperties')
const addProjectDependencies = require('./addProjectDependencies')
const inquireProjectName = require('./inquireProjectName')

module.exports = (log) => {
  return inquireProjectName().pipe(
    tap(projectName => {
      log.text = `Scaffolding Ivory project ${projectName} ....`
      log.start()
    }),
    concatMap((projectName) => scaffold(projectName)),
    concatMap((projectName) => changeToRootDirectory(projectName)),
    concatMap((projectName) => persistProjectProperties({ name: projectName })),
    tap(() => {
      log.text = `Installing project dependencies ...`
    }),
    concatMap(() => addProjectDependencies())
  )
}
