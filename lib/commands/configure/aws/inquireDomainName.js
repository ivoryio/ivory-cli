const inquirer = require('inquirer')
const { Observable } = require('rxjs')

module.exports = ({ name, domains, credentials }) => Observable.create((observer) => {
  const prompt = inquirer.createPromptModule()

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
      observer.next({
        name,
        credentials,
        domain: answer.domain
      })
      observer.complete()
    })
    .catch(err => observer.error(err))
})
