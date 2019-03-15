const ora = require('ora')
const clc = require('cli-color')
const { iif, of } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const inquireWhatToDeploy = require('./inquireWhatToDeploy')
const deployPod = require('./pod')

function create() {
  const log = ora('')
  const deployProject$ = of('We are working on it!')

  inquireWhatToDeploy().pipe(
    concatMap(answer =>
      iif(
        () => answer === 'project',
        deployProject$,
        deployPod(log)
      ))
  ).subscribe(onNext, onError, onComplete)

  function onNext() { }

  function onError(err) {
    log.fail('Failed!')
    process.stdout.write(clc.red(`Reason: ${err.message}\n`))
  }

  function onComplete() {
    log.succeed('Done!')
  }
}

module.exports = create
