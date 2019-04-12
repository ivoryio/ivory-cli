const ora = require('ora')
const clc = require('cli-color')
const { iif } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const deployPod = require('./pod')
const deployProject = require('./project')
const checkIsIvoryProject = require('../checkIsIvoryApp')
const checkPrerequisites = require('../checkPrerequisites')
const inquireWhatToDeploy = require('./inquireWhatToDeploy')

module.exports = () => {
  const log = ora('')

  checkIsIvoryProject().pipe(
    concatMap(checkPrerequisites),
    concatMap(inquireWhatToDeploy),
    concatMap(decideWhatToDo(log))
  ).subscribe(onNext, onError, onComplete)

  function onNext () { }

  function onError (err) {
    log.fail('Failed!')
    process.stdout.write(clc.red(`Reason: ${err.message}\n`))
  }

  function onComplete () {
    log.succeed(clc.green('Done!'))
  }
}

const decideWhatToDo = (log) => (answer) => iif(
  () => answer === 'project',
  deployProject(log),
  deployPod(log))
