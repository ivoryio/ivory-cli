const ora = require('ora')
const shell = require('shelljs')
const clc = require('cli-color')
const scaffold = require('./scaffold')
const persistProjectInfo = require('../../persistProjectProperties')
const addProjectDependencies = require('./addProjectDependencies')

function create (projectName) {
  const log = ora('Creating the initial project structure and installing dependencies...').start()
  scaffold(projectName)
    .then(() => Promise.resolve(shell.cd(`./${projectName}`)))
    .then(() => persistProjectInfo({ name: projectName }))
    .then(addProjectDependencies)
    .then(complete)
    .catch(handleErrors)

  function complete () {
    log.succeed('Project structure successfully created!')
    process.stdout.write(clc.green(`cd ${projectName} && ivory project configure\n`))
    process.stdout.write(clc.blue(`INFO: You must run all other Ivory CLI command in the root directory of an Ivory project i.e. a project created with ivory project create command!\n`))
    process.stdout.write(clc.red(`Warning: You can't run the app until you run <ivory project configure> in the root directory of the app!\n`))
  }
  function handleErrors (err) {
    log.fail(`Failed to create the initial project structure!`)
    process.stdout.write(clc.red(`Reason: ${err.message}\n`))
  }
}

module.exports = create
