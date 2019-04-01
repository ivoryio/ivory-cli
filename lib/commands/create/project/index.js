const { Observable, iif } = require('rxjs')
const { concatMap, tap } = require('rxjs/operators')

const clc = require('cli-color')
const scaffold = require('./scaffold')
const changeToRootDirectory = require('./changeToRootDirectory')
const persistProjectProperties = require('../../persistProjectProperties')
const addProjectDependencies = require('./addProjectDependencies')
const inquireProjectName = require('./inquireProjectName')

module.exports = (log, projectTemplate) => {
  return iif(
    () => projectTemplate.startsWith('hello'),
    createHelloProject(log),
    createMarketplaceProject(log)
  )

  function createHelloProject (log) {
    inquireProjectName().pipe(
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

  function createMarketplaceProject (log) {
    return Observable.create((observer) => {
      process.stdout.write(clc.blue('Coming soon to a repository near you...\n'))
      observer.complete()
    })
  }
}
