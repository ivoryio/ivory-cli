const { Observable, iif } = require('rxjs')
const { concatMap, tap } = require('rxjs/operators')

const clc = require('cli-color')
const scaffold = require('./scaffold')
const changeToRootDirectory = require('./changeToRootDirectory')
const persistProjectProperties = require('../../persistProjectProperties')
const addProjectDependencies = require('./addProjectDependencies')
const inquireProjectName = require('./inquireProjectName')

module.exports = (log, projectTemplate) => iif(
  () => projectTemplate.startsWith('hello'),
  createHelloProject(log),
  createMarketplaceProject(log)
)

const createHelloProject = (log) => inquireProjectName().pipe(
  tap(logScaffoldProject(log)),
  concatMap(scaffold),
  concatMap(changeToRootDirectory),
  concatMap(persistProjectProperties),
  tap(logInstallDependencies(log)),
  concatMap(addProjectDependencies)
)

const createMarketplaceProject = (log) => Observable.create((observer) => {
  process.stdout.write(clc.blue('Coming soon to a repository near you...\n'))
  observer.complete()
})

const logScaffoldProject = (log) => (projectName) => {
  log.text = `Scaffolding Ivory project ${projectName} ....`
  log.start()
}

const logInstallDependencies = (log) => () => {
  log.text = `Installing project dependencies ...`
}
