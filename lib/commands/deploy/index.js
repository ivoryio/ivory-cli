const ora = require('ora')
const clc = require('cli-color')
const { concatMap } = require('rxjs/operators')

const inquireProfile = require('./inquireProfile')
const deployCICDStacks = require('./deployCICDStacks')
const checkIsIvoryProject = require('../checkIsIvoryApp')
const checkPrerequisites = require('../checkPrerequisites')
const configureRepositories = require('./configureRepositories')

module.exports = () => {
  const log = ora('')

  checkIsIvoryProject()
    .pipe(
      concatMap(checkPrerequisites),
      concatMap(inquireProfile),
      concatMap(deployCICDStacks),
      concatMap(configureRepositories)
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

