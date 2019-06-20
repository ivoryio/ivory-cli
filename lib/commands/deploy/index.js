const ora = require('ora')
const clc = require('cli-color')
const { concatMap } = require('rxjs/operators')

const inquireRegion = require('./inquireRegion')
const inquireProfile = require('./inquireProfile')
const checkIsIvoryProject = require('../checkIsIvoryApp')
const checkPrerequisites = require('../checkPrerequisites')

module.exports = () => {
  const log = ora('')

  checkIsIvoryProject()
    .pipe(
      concatMap(checkPrerequisites),
      concatMap(inquireRegion),
      concatMap(inquireProfile)
    )
    .subscribe(onNext, onError, onComplete)

  function onNext () {}

  function onError (err) {
    log.fail('Failed!')
    process.stdout.write(clc.red(`Reason: ${err.message}\n`))
  }

  function onComplete () {
    log.succeed(clc.green('Done!'))
  }
}
