const ora = require('ora')
const clc = require('cli-color')
const { iif } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const createPod = require('./pod')
const createProject = require('./project')
const checkPrerequisites = require('../checkPrerequisites')
const inquireWhatToCreate = require('./inquireWhatToCreate')

module.exports = () => {
  const log = ora()

  checkPrerequisites().pipe(
    concatMap(inquireWhatToCreate),
    concatMap(decideWhatToCreate(log))
  ).subscribe(onNext, onError, onComplete)

  function onNext () { }

  function onComplete () {
    log.succeed(clc.green('Done!'))
  }

  function onError (err) {
    log.fail('Failed!')
    process.stdout.write(clc.red(`Reason: ${err.message}\n`))
  }
}

const decideWhatToCreate = (log) => (answer) => iif(
  () => answer.endsWith('project'),
  createProject(log, answer),
  createPod(log)
)
