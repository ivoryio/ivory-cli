const ora = require('ora')
const { iif } = require('rxjs')
const clc = require('cli-color')
const { concatMap } = require('rxjs/operators')

const createProject = require('./project')
const createService = require('./service')
const isIvoryApp = require('../isIvoryApp')
const checkPrerequisites = require('../checkPrerequisites')

module.exports = () => {
  const log = ora()

  checkPrerequisites()
    .pipe(concatMap(decideWhatToDo(log)))
    .subscribe(onNext, onError, onComplete)

  function onNext () {}

  function onComplete () {
    log.succeed(clc.green('Done!'))
  }

  function onError (err) {
    log.fail('Failed!')
    process.stdout.write(clc.red(`Reason: ${err.message}\n`))
  }
}

const decideWhatToDo = log => () =>
  iif(() => isIvoryApp(), createService(log), createProject(log))
