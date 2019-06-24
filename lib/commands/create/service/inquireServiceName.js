const inquirer = require('inquirer')
const { Observable } = require('rxjs')

module.exports = () => Observable.create((observer) => {
  const prompt = inquirer.createPromptModule()

  prompt([{
    type: 'input',
    name: 'serviceName',
    message: 'What is the service name?'
  }])
    .then(answer => {
      observer.next(answer.serviceName)
      observer.complete()

      return
    })
    .catch(err => observer.error(err))
})