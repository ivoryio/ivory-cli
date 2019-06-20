const inquirer = require('inquirer')
const { Observable } = require('rxjs')

module.exports = () =>
  Observable.create(observer => {
    const prompt = inquirer.createPromptModule()
    prompt({
      type: 'input',
      name: 'awsRegion',
      default: 'us-east-1',
      message: 'In what AWS region should deploy the app:'
    })
      .then(answer => {
        observer.next({ region: answer.awsRegion })
        observer.complete()
        return
      })
      .catch(err => observer.err(err))
  })
