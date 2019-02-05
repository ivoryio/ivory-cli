const { Subject } = require('rxjs')
const inquirer = require('inquirer')
const StateMachine = require('javascript-state-machine')
const AWS = require('aws-sdk')
const clc = require("cli-color")

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
      checkAWSCredentials()
    }
  }

  function onError(error) {
    process.stdout.write(clc.red(`We encounter the following error: ${error.messsage}\n`))
  }

  function onComplete() {
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
      message: 'AccessKeyId:',
      validate: (value) => value ? true : 'Please enter a value'
    })
  }

  function askForAWSSecretAccessKey() {
    prompts.next({
      type: 'password',
      mask: '*',
      name: 'awsSecretAccessKey',
      message: 'SecretAccessKey:',
      validate: (value) => value ? true : 'Please enter a value'
    })
  }


  function checkAWSCredentials() {
    AWS.config.credentials =  new AWS.Credentials(fsm.awsCredentials.accessKeyId, fsm.awsCredentials.secretAccessKey)

    var cf = new AWS.CloudFormation({region: fsm.awsCredentials.region})

    cf.listStacks().promise().then(() => {
      process.stdout.write('All good!\n')
      prompts.complete()
    }).catch(err => {
      process.stdout.write(clc.red(`We encountered the following error: ${err.code} - ${err.message}\n`))
      prompts.complete()
    })
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
      }
    },
    transitions: [
      { name: 'toProjectName', from: 'welcome', to: 'projectName' },
      { name: 'toAWSRegion', from: 'projectName', to: 'awsRegion' },
      { name: 'toAWSAccessKeyId', from: 'awsRegion', to: 'awsAccessKeyId' },
      { name: 'toAWSSecretAccessKey', from: 'awsAccessKeyId', to: 'awsSecretAccessKey' },
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
        }
      }
    }
  })
}

module.exports = create
