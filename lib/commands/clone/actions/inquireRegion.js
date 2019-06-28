const inquirer = require('inquirer')
const { Observable } = require('rxjs')

module.exports = () =>
  Observable.create(observer => {
    const prompt = inquirer.createPromptModule()
    prompt({
      type: 'input',
      name: 'awsRegion',
      default: 'us-east-1',
      validate: (input) => {
        if(!input) {
          return 'Please specify a region'
        }

        return true
      },
      message: 'In what AWS region was the project deployed:'
    })
      .then(answer => {
        observer.next({ region: answer.awsRegion })
        observer.complete()
        return
      })
      .catch(err => observer.err(err))
  })
