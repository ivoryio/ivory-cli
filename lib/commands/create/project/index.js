const clc = require('cli-color')
const { Observable, iif } = require('rxjs')
const { concatMap, tap } = require('rxjs/operators')

const retrieveRepo = require('./retrieveRepo')
const addTemplates = require('./addTemplates')
const initializeRepos = require('./initializaRepos')
const inquireProjectName = require('./inquireProjectName')
const createProjectStructure = require('./createProjectStructure')


module.exports = (log, projectTemplate) => iif(
  () => projectTemplate.startsWith('hello'),
  createHelloProject(log),
  createMarketplaceProject(log)
)

const createHelloProject = (log) => inquireProjectName().pipe(
  tap(logScaffoldProject(log)),
  concatMap(createProjectStructure),
  concatMap(retrieveRepo),
  concatMap(addTemplates),
  concatMap(initializeRepos)
)

const createMarketplaceProject = (log) => Observable.create((observer) => {
  process.stdout.write(clc.blue('Coming soon to a repository near you...\n'))
  observer.complete()
})

const logScaffoldProject = (log) => (projectName) => {
  log.text = `Scaffolding Ivory project ${projectName} ....`
  log.start()
}

