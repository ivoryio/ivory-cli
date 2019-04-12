const inquirer = require('inquirer')
const { Observable } = require('rxjs')

module.exports = (projectProperties) => Observable.create((observer) => {
  const prompt = inquirer.createPromptModule()

  prompt([{
    type: 'input',
    name: 'subdomain',
    message: 'Please enter the name of the subdomain to use:',
    validate: (answer) => {
      if (!answer) {
        return 'Please enter a subdomain name'
      }

      return true
    }
  }])
    .then(answer => {
      observer.next({
        ...projectProperties,
        subdomain: answer.subdomain
      })
      observer.complete()
    })
    .catch(err => observer.error(err))
})
