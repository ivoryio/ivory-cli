const { Observable } = require('rxjs')

const inquirer = require('inquirer')

module.exports = () => {
  return Observable.create((observer) => {
    const prompt = inquirer.createPromptModule()

    prompt([{
      type: 'list',
      name: 'type',
      message: 'What would you like to create?',
      choices: [{
        name: 'project',
        value: 'project'
      }, {
        name: 'pod',
        value: 'pod'
      }]
    }])
      .then(answer => {
        observer.next(answer.type)
        observer.complete()
      })
      .catch(err => observer.error(err))
  })
}
