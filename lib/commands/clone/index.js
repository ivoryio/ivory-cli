const ora = require('ora')
const clc = require('cli-color')
//const { iif } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const {
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
      concatMap(inquireWhatProjectToClone)
    )
    .subscribe(onNext, onError, onComplete)

  function onNext (config) {
    console.info(config)
  }

  function onComplete () {
    log.succeed(clc.green('Done!'))
  }

  function onError (err) {
    log.fail('Failed!')
    process.stdout.write(clc.red(`Reason: ${err.message}\n`))
  }
}

// const decideWhatToDo = (log) => (answer) => iif(
//   () => answer.endsWith('project'),
//   createProject(log, answer),
//   createPod()
// )
