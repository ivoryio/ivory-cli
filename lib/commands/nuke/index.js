const ora = require('ora')
const clc = require('cli-color')
const { iif } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const deleteProject = require('./project')
const deletePod = require('./pod')
const inquireWhatToDelete = require('./inquireWhatToDelete')

module.exports = () => {
  let isProject
  const log = ora()

  inquireWhatToDelete().pipe(
    concatMap(answer => {
      isProject = answer === 'project'
      return iif(
        () => isProject,
        deleteProject(log),
        deletePod(log)
      )
    })
  )
    .subscribe(onNext, onError, onComplete)

  function onNext () { }

  function onComplete () {
    if (isProject) {
      log.succeed(clc.green('Done! The infrastructure of the project has been deleted.'))
    } else {
      log.succeed(clc.green('Done! The Ivory pod you selected has been deleted.'))
    }
  }

  function onError (err) {
    log.fail('Failed!')
    process.stdout.write(clc.red(`Reason: ${err.message}\n`))
  }
}
