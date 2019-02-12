const clc = require('cli-color')

const checkPrerequisites = require('./checkPrerequisites')
const readProjectProperties = require('./readProjectProperties')

module.exports = function () {
  checkPrerequisites()
    .then(readProjectProperties)
    .catch(handleErrors)

  function handleErrors (err) {
    const message = clc.red(`Reason: ${err.message}\n`)
    process.stdout.write(message)
  }
}
