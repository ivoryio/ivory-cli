const inquirer = require('inquirer')
const { Observable } = require('rxjs')

module.exports = pods => Observable.create(observer => {
  const prompt = inquirer.createPromptModule()

  prompt([{
    type: 'input',
    name: 'podName',
    message: 'If you are willing to procced, please type the name of the pod:'
  }])
    .then(answer => {
      observer.next({ podName: answer.podName, pods })
      observer.complete()
    })
    .catch(err => observer.err(err))
})
