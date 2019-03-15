const ora = require('ora')
const clc = require('cli-color')
const { iif, of } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const inquireWhatToCreate = require('./inquireWhatToCreate')
const createProject = require('./project')

module.exports = () => {
  const createPod$ = of('Deploying Project...')
  const log = ora()

  inquireWhatToCreate().pipe(
    concatMap(answer =>
      iif(
        () => answer === 'project',
        createProject(log),
        createPod$
      ))
  ).subscribe(onNext, onError, onComplete)

  function onNext () {}

  function onComplete () {
    log.succeed('Done!')
  }

  function onError (err) {
    log.fail('Failed!')
    process.stdout.write(clc.red(`Reason: ${err.message}\n`))
  }
}
