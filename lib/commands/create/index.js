const inquirer = require('inquirer')
const clc = require('cli-color')

const aws = require('./aws')
const prompt = require('./prompt')
const greeter = require('./greeter')
const fsm = require('./stateMachine')
const scaffolder = require('./scaffolder')
const prerequisites = require('./prerequisites')

function create () {
  prerequisites.awsCLI()
  greeter.showWelcomeMessage()

  inquirer.prompt(prompt.subject).ui.process.subscribe(onAnswer, onError, onComplete)

  prompt.askForProjectName()

  function onAnswer (answer) {
    if (fsm.is('welcome') && answer.name === 'projectName') {
      fsm.toProjectName(answer.answer)
      prompt.askForAWSProfile()
    }

    if (fsm.is('projectName') && answer.name === 'awsProfile') {
      if (answer.answer === 'named') {
        prompt.askForAWSNamedProfile()
      } else {
        fsm.toDefaultAWSProfile()
        prompt.askForAWSRegion()
      }
    }

    if (fsm.is('projectName') && answer.name === 'awsNamedProfile') {
      fsm.toNamedAWSProfile(answer.answer)
      prompt.askForAWSRegion()
    }

    if ((fsm.is('defaultAWSProfile') || fsm.is('namedAWSProfile')) && answer.name === 'awsRegion') {
      fsm.toAWSRegion(answer.answer)
      aws.configure(fsm)
        .then(() => scaffolder.scaffoldProject(fsm))
        .then(complete)
        .catch(err => {
          fsm.completeWithError(err)
          prompt.done()
        })
    }
  }
  function onError (error) {
    process.stdout.write(clc.red(`We encounter the following error: ${error.messsage}\n`))
  }
  function onComplete () {
    if (fsm.is('success')) {
      process.stdout.write(clc.green('Happy coding!\n'))
    }

    if (fsm.is('error')) {
      process.stdout.write(clc.red(`We encounterd and error. Code: ${fsm.error.code}, Message: ${fsm.error.message}\n`))
    }
  }

  function complete () {
    fsm.completeWithSuccess()
    prompt.done()
  }
}

module.exports = create
