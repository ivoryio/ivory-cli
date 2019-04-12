const { Observable } = require('rxjs')

const inquirer = require('inquirer')

module.exports = () => Observable.create((observer) => {
  const prompt = inquirer.createPromptModule()

  prompt([{
    type: 'list',
    name: 'type',
    message: 'What would you like to deploy?',
    choices: [{
      name: 'Project',
      value: 'project'
    }, {
      name: 'Pod',
      value: 'pod'
    }]
  }])
    .then(answer => {
      observer.next(answer.type)
      observer.complete()
    })
    .catch(err => observer.err(err))
})
