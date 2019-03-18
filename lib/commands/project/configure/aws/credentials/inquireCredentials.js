const clc = require('cli-color')
const inquirer = require('inquirer')

const prompt = require('./prompt')
const fsm = require('./stateMachine')
const validateAWSCredentials = require('./validateAWSCredentials')

module.exports = function (projectProperties) {
  return new Promise((resolve, reject) => {
    fsm.toProjectName(projectProperties.name)

    inquirer.prompt(prompt.subject).ui.process.subscribe(onAnswer, onError, onComplete)

    prompt.askForAWSProfile()

    function onAnswer (answer) {
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
        validateAWSCredentials(fsm.awsCredentials)
          .then(complete)
          .catch(err => {
            fsm.completeWithError(err)
            prompt.done()
          })
      }

      function complete () {
        fsm.completeWithSuccess()
        prompt.done()
      }
    }

    function onError (error) {
      reject(error)
    }

    function onComplete () {
      if (fsm.is('success')) {
        return resolve({
          ...projectProperties,
          credentials: {
            ...fsm.awsCredentials
          }
        })
      }

      if (fsm.is('error')) {
        return reject(clc.red(`We encounterd and error. Code: ${fsm.error.code}, Message: ${fsm.error.message}\n`))
      }
    }
  })
}
