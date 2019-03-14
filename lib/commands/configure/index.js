const clc = require('cli-color')
const { concatMap } = require('rxjs/operators')

const checkPrerequisites = require('../checkPrerequisites')
const readProjectProperties = require('../readProjectProperties')
const inquireCredentials = require('./aws/credentials/inquireCredentials')
const createS3ArtefactsBucket = require('./aws/createS3ArtefactsBucket')
const persistProjectProperties = require('../persistProjectProperties')

module.exports = function () {
  checkPrerequisites()
    .pipe(
      concatMap(() => readProjectProperties()),
      concatMap((projectProperties) => inquireCredentials(projectProperties)),
      concatMap((projectProperties) => createS3ArtefactsBucket(projectProperties)),
      concatMap((projectProperties) => persistProjectProperties(projectProperties))
    ).subscribe(onNext, onError, onComplete)

  function onNext () {}

  function onComplete () {
    process.stdout.write(clc.blue('INFO: Before running the app you should deploy all the Pods by running <ivory pod deploy>\n'))
  }

  function onError (err) {
    const message = clc.red(`Reason: ${err.message}\n`)
    process.stdout.write(message)
  }
}
