const clc = require('cli-color')

const checkPrerequisites = require('../../checkPrerequisites')
const readProjectProperties = require('../../readProjectProperties')
const createS3ArtefactsBucket = require('./aws/createS3ArtefactsBucket')
const inquireCredentials = require('./aws/credentials/inquireCredentials')
const persistProjectProperties = require('../../persistProjectProperties')

module.exports = function () {
  checkPrerequisites()
    .then(readProjectProperties)
    .then(inquireCredentials)
    .then(createS3ArtefactsBucket)
    .then(persistProjectProperties)
    .then(complete)
    .catch(handleErrors)

  function handleErrors (err) {
    const message = clc.red(`Reason: ${err.message}\n`)
    process.stdout.write(message)
  }

  function complete () {
    process.stdout.write(clc.blue('INFO: Before running the app you should deploy all the Pods by running <ivory pod deploy>\n'))
  }
}
