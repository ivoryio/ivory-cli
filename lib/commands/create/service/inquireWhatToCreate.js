const inquirer = require('inquirer')
const { Observable } = require('rxjs')

module.exports = () =>
  Observable.create(observer => {
    const prompt = inquirer.createPromptModule()

    prompt([
      {
        type: 'list',
        name: 'type',
        message: 'What would you like to create?',
        choices: [
          {
            name: 'An Ivory service',
            value: 'service'
          },
          {
            name: 'An Ivory package',
            value: 'package'
          }
        ]
      }
    ])
      .then(answer => {
        observer.next(answer.type)
        observer.complete()

        return
      })
      .catch(err => observer.error(err))
  })
