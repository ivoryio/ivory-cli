const ora = require('ora')
const clc = require('cli-color')
const { iif } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const deleteProject = require('./project')
const deletePod = require('./pod')
const readProjectProperties = require('../readProjectProperties')
const inquireWhatToDelete = require('./inquireWhatToDelete')

module.exports = () => {
  let isProject
  const log = ora()

  readProjectProperties()
    .pipe(
      concatMap((projectProperties) => inquireWhatToDelete(projectProperties)),
      concatMap((result) => {
        isProject = result.answer === 'project'
        return iif(
          () => isProject,
          deleteProject(log, result.projectProperties),
          deletePod(log, result.projectProperties)
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
