const ora = require('ora')
const clc = require('cli-color')
const { iif } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const inquireWhatToCreate = require('./inquireWhatToCreate')
const createProject = require('./project')
const createPod = require('./pod')

module.exports = () => {
  let isProject
  const log = ora()

  inquireWhatToCreate().pipe(
    concatMap(answer => {
      isProject = answer === 'project'
      return iif(
        () => isProject,
        createProject(log),
        createPod(log)
      )
    })
  ).subscribe(onNext, onError, onComplete)

  function onNext () { }

  function onComplete () {
    if (isProject) {
      log.succeed(clc.green('Done! Please run ivory configure in the root directory of the project.'))
    } else {
      log.succeed(clc.green('Done! Please run <ivory deploy> to deploy the pod microservice.'))
    }
  }

  function onError (err) {
    log.fail('Failed!')
    process.stdout.write(clc.red(`Reason: ${err.message}\n`))
  }
}
