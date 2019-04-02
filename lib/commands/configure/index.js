const ora = require('ora')
const clc = require('cli-color')
const { concatMap } = require('rxjs/operators')

const checkIsIvoryApp = require('../checkIsIvoryApp')
const checkPrerequisites = require('../checkPrerequisites')
const readProjectProperties = require('../readProjectProperties')
const inquireCredentials = require('./aws/credentials/inquireCredentials')
const createS3ArtefactsBucket = require('./aws/createS3ArtefactsBucket')
const persistProjectProperties = require('../persistProjectProperties')

const inquireDomainName = require('./aws/inquireDomainName')
const inquireSubdomainName = require('./aws/inquireSubdomainName')
const listDomainNames = require('./aws/listDomainNames')

module.exports = function () {
  const log = ora()

  checkIsIvoryApp()
    .pipe(
      concatMap(() => checkPrerequisites()),
      concatMap(() => readProjectProperties()),
      concatMap((projectProperties) => inquireCredentials(projectProperties)),
      concatMap((projectProperties) => listDomainNames(projectProperties)),
      concatMap((projectProperties) => inquireDomainName(projectProperties)),
      concatMap((projectProperties) => inquireSubdomainName(projectProperties)),
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
