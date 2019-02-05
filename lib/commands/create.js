const { Subject } = require('rxjs')
const inquirer = require('inquirer')
const StateMachine = require('javascript-state-machine')
const AWS = require('aws-sdk')
const clc = require('cli-color')
const ora = require('ora')
const shell = require('shelljs')

function create() {
  printWelcomeMessage()

  const fsm = createStateMachine()

  const prompts = new Subject()

  inquirer.prompt(prompts).ui.process.subscribe(onAnswer, onError, onComplete)

  askForProjectName()

  function onAnswer(answer) {
    if (fsm.is('welcome') && answer.name === 'projectName') {
      fsm.toProjectName(answer.answer)
      askForAWSRegion()
    }

    if (fsm.is('projectName') && answer.name === 'awsRegion') {
      fsm.toAWSRegion(answer.answer)
      askForAWSAccessKeyID()
    }

    if (fsm.is('awsRegion') && answer.name === 'awsAccessKeyId') {
      fsm.toAWSAccessKeyId(answer.answer)
      askForAWSSecretAccessKey()
    }

    if (fsm.is('awsAccessKeyId') && answer.name === 'awsSecretAccessKey') {
      fsm.toAWSSecretAccessKey(answer.answer)
      configureAWS()
        .then(scaffoldProject)
        .then(complete)
        .catch(err => {
          fsm.completeWithError(err)
          prompts.complete()
        })
    }
  }

  function onError(error) {
    process.stdout.write(clc.red(`We encounter the following error: ${error.messsage}\n`))
  }

  function onComplete() {
    if(fsm.is('success')) {
      process.stdout.write(clc.green('Happy coding!\n'))
    }

    if(fsm.is('error')) {
      process.stdout.write(clc.red(`We encounterd and error. Code: ${fsm.error.code}, Message: ${fsm.error.message}`))
    }
  }

  function askForProjectName() {
    prompts.next({
      type: 'input',
      name: 'projectName',
      message: 'What is the project name?',
      validate: (value) => value ? true : 'Please enter a name'
    })
  }

  function askForAWSRegion() {
    prompts.next({
      type: 'input',
      name: 'awsRegion',
      default: 'us-east-1',
      message: 'In what AWS region should we create the CloudFormation stacks:'
    })
  }

  function askForAWSAccessKeyID() {
    prompts.next({
      type: 'input',
      name: 'awsAccessKeyId',
      message: 'AWS access key id:',
      validate: (value) => value ? true : 'Please enter a value'
    })
  }

  function askForAWSSecretAccessKey() {
    prompts.next({
      type: 'password',
      mask: '*',
      name: 'awsSecretAccessKey',
      message: 'AWS secret access key:',
      validate: (value) => value ? true : 'Please enter a value'
    })
  }

  function configureAWS() {
    AWS.config.credentials =  new AWS.Credentials(fsm.awsCredentials.accessKeyId, fsm.awsCredentials.secretAccessKey)
    return Promise.resolve()
  }

  function scaffoldProject() {
    const log = ora('Creating project structure and installing dependencies').start()

    return new Promise((resolve, reject) => {
      shell.exec(`npx create-react-app ${fsm.projectName.toLowerCase()} --scripts-version @ivoryio/ivory-react-scripts`, { silent: true }, (code, stdout, stderr) => {

        if (code !== 0) {
          log.fail()
          return reject(stderr)
        }

        log.succeed()
        resolve()
      })
    })
  }

  function complete() {
    fsm.completeWithSuccess()
    prompts.complete()
  }
}

function printWelcomeMessage() {
  const fiveSpaces = '     '
  process.stdout.write('Welcome! The create command will do the follwong:\n')
  process.stdout.write(`${fiveSpaces}1. Create the initial project structure\n`)
  process.stdout.write(`${fiveSpaces}2. Create the AWS CloudFormation dev stacks for development\n`)
  process.stdout.write(`${fiveSpaces}3. Configure AWS Amplify to point to the development environment\n`)

  process.stdout.write(`Before we start we need additional information. Please answer the following questions.\n`)
}

function createStateMachine() {
  return new StateMachine({
    init: 'welcome',
    data: {
      projectName: null,
      awsCredentials: {
        region: null,
        accessKeyId: null,
        secretAccessKey: null,
      },
      error: {
        code: null,
        message: null
      }
    },
    transitions: [
      { name: 'toProjectName', from: 'welcome', to: 'projectName' },
      { name: 'toAWSRegion', from: 'projectName', to: 'awsRegion' },
      { name: 'toAWSAccessKeyId', from: 'awsRegion', to: 'awsAccessKeyId' },
      { name: 'toAWSSecretAccessKey', from: 'awsAccessKeyId', to: 'awsSecretAccessKey' },
      { name: 'completeWithSuccess', from: 'awsSecretAccessKey', to: 'success'},
      { name: 'completeWithError', from: 'awsSecretAccessKey', to: 'error'}
    ],
    methods: {
      onTransition: function (lifecycle, data) {
        switch (lifecycle.to) {
          case 'projectName': {
            this.projectName = data
            break
          }
          case 'awsRegion': {
            this.awsCredentials.region = data
            break
          }
          case 'awsAccessKeyId': {
            this.awsCredentials.accessKeyId = data
            break
          }
          case 'awsSecretAccessKey': {
            this.awsCredentials.secretAccessKey = data
            break
          }
          case 'error': {
            this.error = {
              code: data.code,
              message: data.message
            }
          }
        }
      }
    }
  })
}

module.exports = create
