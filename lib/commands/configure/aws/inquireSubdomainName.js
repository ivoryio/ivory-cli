const { Observable } = require('rxjs')

const inquirer = require('inquirer')

module.exports = (projectProperties) => Observable.create((observer) => {
  const prompt = inquirer.createPromptModule()

  prompt([{
    type: 'input',
    name: 'subdomain',
    message: "Please enter the name of the subdomain to use (leave empty if you don't want to use a subdomain):"
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
