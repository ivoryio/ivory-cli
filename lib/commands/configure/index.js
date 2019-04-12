const ora = require('ora')
const clc = require('cli-color')
const { concatMap } = require('rxjs/operators')

const checkIsIvoryApp = require('../checkIsIvoryApp')
const checkPrerequisites = require('../checkPrerequisites')
const inquireCredentials = require('./aws/credentials/inquireCredentials')
const createS3ArtefactsBucket = require('./aws/createS3ArtefactsBucket')
const persistProjectProperties = require('../persistProjectProperties')

const inquireDomainName = require('./aws/inquireDomainName')
const inquireSubdomainName = require('./aws/inquireSubdomainName')
const listDomainNames = require('./aws/listDomainNames')

module.exports = () => {
  const log = ora()

  checkIsIvoryApp()
    .pipe(
      concatMap(checkPrerequisites),
      concatMap(inquireCredentials),
      concatMap(listDomainNames),
      concatMap(inquireDomainName),
      concatMap(inquireSubdomainName),
      concatMap(createS3ArtefactsBucket),
      concatMap(persistProjectProperties)
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
