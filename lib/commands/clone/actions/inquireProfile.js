const inquirer = require('inquirer')
const { Observable } = require('rxjs')

module.exports = config =>
  Observable.create(observer => {
    const prompt = inquirer.createPromptModule()
    prompt({
      type: 'list',
      name: 'awsProfile',
      message:
        'What profile was used to deploy the app:',
      choices: [
        {
          name: 'Default profile in ~/.aws/credentials',
          value: 'default'
        },
        {
          name: 'Named profile in ~/.aws/credentials',
          value: 'named'
        }
      ]
    })
      .then(answer => {
        if (answer.awsProfile === 'default') {
          observer.next({ ...config, profile: answer.awsProfile })
          observer.complete()
          return
        }

        return prompt({
          type: 'input',
          name: 'awsNamedProfile',
          message: 'What is the AWS profile name:',
          validate: value => (value ? true : 'Please enter a value')
        })
      })
      .then(profileAnswer => {
        if (profileAnswer) {
          observer.next({ ...config, profile: profileAnswer.awsNamedProfile })
          observer.complete()
        }
        return
      })
      .catch(err => {
        observer.error(err)
      })
  })
