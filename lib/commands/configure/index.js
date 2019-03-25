const ora = require('ora')
const clc = require('cli-color')
const { concatMap, tap } = require('rxjs/operators')

const checkPrerequisites = require('../checkPrerequisites')
const checkIsIvoryApp = require('../checkIsIvoryApp')
const readProjectProperties = require('../readProjectProperties')
const validateAWSCredentials = require('./aws/credentials/validateAWSCredentials')
const inquireCredentials = require('./aws/credentials/inquireCredentials')
const createS3ArtefactsBucket = require('./aws/createS3ArtefactsBucket')
const persistProjectProperties = require('../persistProjectProperties')

module.exports = function () {
  const log = ora()

  checkIsIvoryApp()
    .pipe(
      concatMap(() => checkPrerequisites()),
      concatMap(() => readProjectProperties()),
      concatMap((projectProperties) => inquireCredentials(projectProperties)),
      tap(() => {
        log.text = 'Validating credentials ...'
        log.start()
      }),
      concatMap((projectProperties) => validateAWSCredentials(projectProperties)),
      tap(() => {
        log.text = 'Creating S3 artefacts bucket ...'
      }),
      concatMap((projectProperties) => createS3ArtefactsBucket(projectProperties)),
      concatMap((projectProperties) => persistProjectProperties(projectProperties))
    ).subscribe(onNext, onError, onComplete)

  function onNext () { }

  function onComplete () {
    log.succeed('Done!')
    const msg = clc.blue('INFO: Before running the app you should deploy all pod microservice by running the <ivory deploy> command\n')
    process.stdout.write(msg)
  }

  function onError (err) {
    log.fail('Failed!')
    const message = clc.red(`${err.message}\n`)
    process.stdout.write(message)
  }
}
