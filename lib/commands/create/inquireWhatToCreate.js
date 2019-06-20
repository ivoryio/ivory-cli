const { Observable } = require('rxjs')

const inquirer = require('inquirer')

module.exports = () => Observable.create((observer) => {
  const prompt = inquirer.createPromptModule()

  prompt([{
    type: 'list',
    name: 'type',
    message: 'What would you like to create?',
    choices: [{
      name: 'An Ivory Hello project',
      value: 'hello-project'
    }, {
      name: 'An Ivory Marketplace project',
      value: 'marketplace-project'
    }, {
      name: 'An Ivory Pod',
      value: 'pod'
    }]
  }])
    .then(answer => {
      observer.next(answer.type)
      observer.complete()

      return
    })
    .catch(err => observer.error(err))
})
