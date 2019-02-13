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
    process.stdout.write(clc.green(`cd ${projectName} && ivory project deploy\n`))
    process.stdout.write(clc.yellow(`Warning: You must run all other Ivory CLI command in the root directory of an Ivory project i.e. a project created with ivory project create command!\n`))
    process.stdout.write(clc.yellow(`Warning: You can't run the app until you run <ivory project deploy> in the root directory of the app!\n`))
  }
  function handleErrors (err) {
    log.fail(`Failed to create the initial project structure!`)
    process.stdout.write(clc.red(`Reason: ${err.message}\n`))
  }
}

module.exports = create
