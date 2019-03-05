const clc = require('cli-color')

const configureAWS = require('./configureAWS')
const checkPrerequisites = require('../../checkPrerequisites')
const readProjectProperties = require('../../readProjectProperties')
const persistProjectProperties = require('../../persistProjectProperties')

module.exports = function () {
  checkPrerequisites()
    .then(readProjectProperties)
    .then(configureAWS)
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
