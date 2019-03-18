const clc = require('cli-color')
const { concatMap } = require('rxjs/operators')

const checkPrerequisites = require('../checkPrerequisites')
const checkIsIvoryApp = require('../checkIsIvoryApp')
const readProjectProperties = require('../readProjectProperties')
const inquireCredentials = require('./aws/credentials/inquireCredentials')
const createS3ArtefactsBucket = require('./aws/createS3ArtefactsBucket')
const persistProjectProperties = require('../persistProjectProperties')

module.exports = function () {
  checkIsIvoryApp()
    .pipe(
      concatMap(() => checkPrerequisites()),
      concatMap(() => readProjectProperties()),
      concatMap((projectProperties) => inquireCredentials(projectProperties)),
      concatMap((projectProperties) => createS3ArtefactsBucket(projectProperties)),
      concatMap((projectProperties) => persistProjectProperties(projectProperties))
    ).subscribe(onNext, onError, onComplete)

  function onNext () { }

  function onComplete () {
    const msg = clc.blue('INFO: Before running the app you should deploy all pod microservice by running the <ivory deploy> command\n')
    process.stdout.write(msg)
  }

  function onError (err) {
    const message = clc.red(`Failed! ${err.message}\n`)
    process.stdout.write(message)
  }
}
