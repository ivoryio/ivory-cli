const ora = require('ora')
const clc = require('cli-color')

const scaffold = require('./scaffold')
const wire = require('./wire')
const checkPrerequisites = require('../../checkPrerequisites')

function create (podName) {
  const log = ora('Creating and wirring the new Pod...').start()
  checkPrerequisites()
    .then(scaffold(podName))
    .then(wire(podName))
    .then(complete)
    .catch(handleErrors)

  function complete () {
    log.succeed(`Pod ${podName} created successfully. Happy coding!`)
  }
  function handleErrors (err) {
    log.fail(`Failed to create the Pod`)
    process.stdout.write(clc.red(`Reason: ${err.message}\n`))
  }
}

module.exports = create
