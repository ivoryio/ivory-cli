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
        name: 'project',
        value: 'project'
      }, {
        name: 'pod',
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
