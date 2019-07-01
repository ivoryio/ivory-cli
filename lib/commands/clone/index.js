const ora = require('ora')
const clc = require('cli-color')
const { concatMap } = require('rxjs/operators')

const {
  cloneProject,
  inquireRegion,
  inquireProfile,
  retrieveIvoryConfig,
  inquireWhatProjectToClone
} = require('./actions')

const checkPrerequisites = require('../checkPrerequisites')

module.exports = () => {
  const log = ora()

  checkPrerequisites()
    .pipe(
      concatMap(inquireRegion),
      concatMap(inquireProfile),
      concatMap(retrieveIvoryConfig),
      concatMap(inquireWhatProjectToClone),
      concatMap(cloneProject(log))
    )
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
