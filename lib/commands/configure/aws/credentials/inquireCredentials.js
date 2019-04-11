const clc = require('cli-color')
const inquirer = require('inquirer')
const { Observable } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const prompt = require('./prompt')
const fsm = require('./stateMachine')
const readProjectProperties = require('../../../readProjectProperties')

module.exports = () => readProjectProperties().pipe(
  concatMap(inquireCredentials)
)

const inquireCredentials = ({ name }) => Observable.create((observer) => {
  fsm.toProjectName(name)

  inquirer.prompt(prompt.subject).ui.process.subscribe(onAnswer, onError, onComplete)

  prompt.askForAWSProfile()

  function onAnswer ({ answer, name }) {
    if (fsm.is('projectName') && name === 'awsProfile') {
      if (answer === 'named') {
        prompt.askForAWSNamedProfile()
      } else {
        fsm.toDefaultAWSProfile()
        prompt.askForAWSRegion()
      }
    }

    if (fsm.is('projectName') && name === 'awsNamedProfile') {
      fsm.toNamedAWSProfile(answer)
      prompt.askForAWSRegion()
    }

    if ((fsm.is('defaultAWSProfile') || fsm.is('namedAWSProfile')) && name === 'awsRegion') {
      fsm.toAWSRegion(answer)
      fsm.completeWithSuccess()
      prompt.done()
    }
  }

  function onError (error) {
    observer.error(error)
  }

  function onComplete () {
    if (fsm.is('success')) {
      observer.next({
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
