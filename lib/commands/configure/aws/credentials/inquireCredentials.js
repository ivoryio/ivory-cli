const clc = require('cli-color')
const inquirer = require('inquirer')
const { Observable } = require('rxjs')

const prompt = require('./prompt')
const fsm = require('./stateMachine')
const validateAWSCredentials = require('./validateAWSCredentials')

module.exports = function (projectProperties) {
  return Observable.create((observer) => {
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
          .subscribe({
            next: () => {},
            error: (err) => {
              fsm.completeWithError(err)
              prompt.done()
            },
            complete: () => {
              fsm.completeWithSuccess()
              prompt.done()
            } })
      }
    }

    function onError (error) {
      observer.error(error)
    }

    function onComplete () {
      if (fsm.is('success')) {
        observer.next({
          ...projectProperties,
          credentials: {
            ...fsm.awsCredentials
          }
        })
        observer.complete()
      }

      if (fsm.is('error')) {
        observer.error(clc.red(`We encounterd and error. Code: ${fsm.error.code}, Message: ${fsm.error.message}\n`))
      }
    }
  })
}
