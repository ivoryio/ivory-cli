const { Observable } = require('rxjs')

const inquirer = require('inquirer')

module.exports = Observable.create((observer) => {
  const prompt = inquirer.createPromptModule()

  prompt([{
    type: 'input',
    name: 'projectName',
    message: 'What is the name of your project?'
  }])
    .then(answer => {
      observer.next(answer.projectName)
      observer.complete()
    })
    .catch(err => observer.error(err))
})
