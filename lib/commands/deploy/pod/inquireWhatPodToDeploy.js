const { Observable } = require('rxjs')

const inquirer = require('inquirer')

module.exports = function (projectProperties) {
  return Observable.create((observer) => {
    const prompt = inquirer.createPromptModule()

    prompt([{
      type: 'list',
      name: 'pod',
      message: 'What pod microservice do you want to deploy?',
      choices: projectProperties.pods.map(pod => ({ name: pod, value: pod }))
    }])
      .then(answer => {
        observer.next({ podName: answer.pod, projectProperties })
        observer.complete()
      })
      .catch(err => observer.error(err))
  })
}
