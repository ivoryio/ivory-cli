const ora = require('ora')
const clc = require('cli-color')
const scaffold = require('./scaffold')
const persistProjectInfo = require('./persistProjectProperties')

function create (projectName) {
  const log = ora('Creating the initial project structure and installing dependencies...').start()
  scaffold(projectName)
    .then(persistProjectInfo(projectName))
    .then(complete)
    .catch(handleErrors)

  function complete () {
    log.succeed('Project structure successfully created!')
  }
  function handleErrors (err) {
    log.fail(`Failed to create the initial project structure!`)
    process.stdout.write(clc.red(`Reason: ${err.message}\n`))
  }
}

module.exports = create
