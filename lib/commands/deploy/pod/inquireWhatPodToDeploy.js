const { Observable } = require('rxjs')

const inquirer = require('inquirer')

module.exports = (pods) => Observable.create((observer) => {
  const prompt = inquirer.createPromptModule()

  prompt([{
    type: 'list',
    name: 'pod',
    message: 'What pod microservice do you want to deploy?',
    choices: pods.map(pod => ({ name: pod, value: pod }))
  }])
    .then(answer => {
      observer.next(answer.pod)
      observer.complete()
    })
    .catch(err => observer.error(err))
})
