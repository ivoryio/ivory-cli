const ora = require('ora')
const clc = require('cli-color')
const { iif, of } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const inquireWhatToDeploy = require('./inquireWhatToDeploy')
const deployPod = require('./pod')

function create () {
  const log = ora('')
  const deployProject$ = of('We are working on it!')

  let isProject
  inquireWhatToDeploy().pipe(
    concatMap(answer => {
      isProject = answer === 'project'
      return iif(
        () => isProject,
        deployProject$,
        deployPod(log)
      )
    })
  ).subscribe(onNext, onError, onComplete)

  function onNext () { }

  function onError (err) {
    if (isProject) {
      log.fail(clc.red('Failed to deploy the project!'))
    } else {
      log.fail(clc.red('Failed to deploy the pod microservice!'))
    }
    process.stdout.write(clc.red(`Reason: ${err.message}\n`))
  }

  function onComplete () {
    if (isProject) {
      log.succeed(clc.green("Project deployed successfully! (It's a lie, we are working on it"))
    } else {
      log.succeed(clc.green('Pod microservice deployed successfully!'))
    }
  }
}

module.exports = create
