const inquirer = require('inquirer')

const { Observable } = require('rxjs')

module.exports = (projectProperties) => Observable.create((observer) => {
  const prompt = inquirer.createPromptModule()
  const { domains } = projectProperties

  prompt([{
    type: 'list',
    name: 'domain',
    message: 'What domain name should we use when deploying the app?',
    choices: domains.map((domain) => ({
      name: domain,
      value: domain
    }))
  }])
    .then(answer => {
      delete projectProperties.domains
      observer.next({
        ...projectProperties,
        domain: answer.domain
      })
      observer.complete()
    })
    .catch(err => observer.error(err))
})
