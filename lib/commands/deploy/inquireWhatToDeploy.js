const { Observable } = require('rxjs')

const inquirer = require('inquirer')

module.exports = () => {
  return Observable.create((observe) => {
    const prompt = inquirer.createPromptModule()

    prompt([{
      type: 'list',
      name: 'type',
      message: 'What would you like to deploy?',
      choices: [{
        name: 'The entire project',
        value: 'project'
      }, {
        name: 'A pod microservice',
        value: 'pod'
      }]
    }])
      .then(answer => {
        observe.next(answer.type)
        observe.complete()
      })
      .catch(err => observe.err(err))
  })
}
