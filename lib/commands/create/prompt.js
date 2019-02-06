const { Subject } = require('rxjs')

class Prompt {
  constructor () {
    this.subject = new Subject()
  }

  askForProjectName () {
    this.subject.next({
      type: 'input',
      name: 'projectName',
      message: 'What is the project name:',
      validate: (value) => value ? true : 'Please enter a name'
    })
  }

  askForAWSRegion () {
    this.subject.next({
      type: 'input',
      name: 'awsRegion',
      default: 'us-east-1',
      message: 'In what AWS region should we create the CloudFormation stacks:'
    })
  }

  askForAWSProfile () {
    this.subject.next({
      type: 'list',
      name: 'awsProfile',
      message: 'In order to create the CloudFormation stacks we need to know what AWS profile to use:',
      choices: [{
        name: 'Default profile in ~/.aws/credentials',
        value: 'default'
      }, {
        name: 'Named profile in ~/.aws/credentials',
        value: 'named'
      }]
    })
  }

  askForAWSNamedProfile () {
    this.subject.next({
      type: 'input',
      name: 'awsNamedProfile',
      message: 'What is the AWS profile name found in ~/.aws/credentials',
      validate: (value) => value ? true : 'Please enter a value'
    })
  }

  done () {
    this.subject.complete()
  }
}

module.exports = new Prompt()
