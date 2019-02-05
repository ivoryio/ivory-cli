const { Subject } = require('rxjs')
const inquirer = require('inquirer')
const StateMachine = require('javascript-state-machine')

function create () {
  printWelcomeMessage()

  const fsm = createStateMachine()

  const prompts = new Subject()

  inquirer.prompt(prompts).ui.process.subscribe(onAnswer, onError, onComplete)

  askForProjectName()

  function onAnswer (answer) {
    if (fsm.is('welcome') && answer.name === 'projectName') {
      fsm.toProjectName(answer.answer)
      askForAWSCredentials()
    }
    if (fsm.is('projectName') && answer.name === 'awsCredentials') {
      fsm.toAWSCredentials(answer.answer)
      prompts.complete()
    }
  }

  function onError (error) {
    process.stdout.write('We encounter the following error\n')
    process.stdout.write(error)
  }

  function onComplete () {
    process.stdout.write('Thank you! To be continued...\n')
  }

  function askForProjectName () {
    prompts.next({
      type: 'input',
      name: 'projectName',
      message: 'What is the project name?',
      validate: (value) => value ? true : 'Please enter a name'
    })
  }

  function askForAWSCredentials () {
    prompts.next({
      type: 'list',
      name: 'awsCredentials',
      message: 'In order to create the CloudFormation stacks we will need valid AWS credentials. Where can we find them?',
      choices: [{
        name: 'Default profile in ~/.aws/credentials',
        value: 'default'
      }, {
        name: 'Named profile in ~/.aws/credentials',
        value: 'named'
      }]
    })
  }
}

function printWelcomeMessage () {
  const fiveSpaces = '     '
  process.stdout.write('Welcome! The create command will do the follwong:\n')
  process.stdout.write(`${fiveSpaces}1. Create the initial project structure\n`)
  process.stdout.write(`${fiveSpaces}2. Create the AWS CloudFormation dev stacks for development\n`)
  process.stdout.write(`${fiveSpaces}3. Configure AWS Amplify to point to the development environment\n`)

  process.stdout.write(`Before we start we need additional information. Please answer the following questions.\n`)
}

function createStateMachine () {
  return new StateMachine({
    init: 'welcome',
    data: {
      projectName: null,
      awsProfile: null
    },
    transitions: [
      { name: 'toProjectName', from: 'welcome', to: 'projectName' },
      { name: 'toAWSCredentials', from: 'projectName', to: 'awsCredentials' }
    ],
    methods: {
      onTransition: function (lifecycle, arg) {
        switch (lifecycle.to) {
          case 'projectName': {
            this.projectName = arg
            break
          }
          case 'awsCredentials': {
            this.awsProfile = arg
            break
          }
        }
      }
    }
  })
}

module.exports = create
