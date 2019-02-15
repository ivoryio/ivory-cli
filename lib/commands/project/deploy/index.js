const clc = require('cli-color')

const deployCFStacks = require('./deployCFStacks')
const checkPrerequisites = require('./checkPrerequisites')
const readProjectProperties = require('./readProjectProperties')
const updateProjectProperties = require('./updateProjectProperties')

module.exports = function () {
  checkPrerequisites()
    .then(readProjectProperties)
    .then(deployCFStacks)
    .then(updateProjectProperties)
    .then(complete)
    .catch(handleErrors)

  function handleErrors (err) {
    const message = clc.red(`Reason: ${err.message}\n`)
    process.stdout.write(message)
  }

  function complete () {
    process.stdout.write(clc.green('yarn start && Happy coding!\n'))
  }
}
