const clc = require('cli-color')
const checkPrerequisites = require('./checkPrerequisites')

module.exports = function () {
  checkPrerequisites()
    .catch(handleErrors)

  function handleErrors (err) {
    process.stdout.write(clc.red(err.message))
  }
}
