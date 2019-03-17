const ora = require('ora')
const clc = require('cli-color')
const { iif } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const inquireWhatToCreate = require('./inquireWhatToCreate')
const createProject = require('./project')
const createPod = require('./pod')

module.exports = () => {
  const log = ora()

  inquireWhatToCreate().pipe(
    concatMap(answer =>
      iif(
        () => answer === 'project',
        createProject(log),
        createPod(log)
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
