const clc = require('cli-color')

const deployPods = require('./deployPods')
const detectPods = require('./detectPods')
const validateProperties = require('./validateProperties')
const checkPrerequisites = require('../../checkPrerequisites')
const readProjectProperties = require('../../readProjectProperties')

module.exports = function () {
  checkPrerequisites()
    .then(readProjectProperties)
    .then(validateProperties)
    .then(detectPods)
    .then(deployPods)
    .then(complete)
    .catch(handleErrors)

  function handleErrors (err) {
    const message = clc.red(`${err.message}\n`)
    process.stdout.write(message)
    process.exit()
  }

  function complete () {
    process.exit()
  }
}
