const { Observable } = require('rxjs')

const inquirer = require('inquirer')

module.exports = () => Observable.create((observer) => {
  const prompt = inquirer.createPromptModule()

  prompt([{
    type: 'list',
    name: 'type',
    message: 'What would you like to delete?',
    choices: [{
      name: 'The infrastruture of the project',
      value: 'project'
    }, {
      name: 'An Ivory pod',
      value: 'pod'
    }]
  }])
    .then(answer => {
      observer.next(answer.type)
      observer.complete()
    })
    .catch(err => observer.err(err))
})
