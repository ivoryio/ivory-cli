const ora = require('ora')
const clc = require('cli-color')
const { iif } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const deletePod = require('./pod')
const deleteProject = require('./project')
const inquireWhatToDelete = require('./inquireWhatToDelete')

module.exports = () => {
  const log = ora()

  inquireWhatToDelete().pipe(
    concatMap(decideWhatToDelete(log))
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

const decideWhatToDelete = (log) => (answer) => iif(
  () => answer === 'project',
  deleteProject(log),
  deletePod(log)
)
