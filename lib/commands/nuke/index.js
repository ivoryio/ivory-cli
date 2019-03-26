const ora = require('ora')
const clc = require('cli-color')
const { iif, from } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const deleteProject = require('./project')
const checkIsIvoryApp = require('../checkIsIvoryApp')
const inquireWhatToDelete = require('./inquireWhatToDelete')

module.exports = () => {
  let isProject
  const log = ora()

  const deletePod = () => from('deletePod')

  checkIsIvoryApp().pipe(
    concatMap(() => inquireWhatToDelete()),
    concatMap(answer => {
      isProject = answer === 'project'
      return iif(
        () => isProject,
        deleteProject(log),
        deletePod()
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
