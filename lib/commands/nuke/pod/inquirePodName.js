const inquirer = require('inquirer')
const { Observable } = require('rxjs')

module.exports = pods => Observable.create(observer => {
  const prompt = inquirer.createPromptModule()

  prompt([{
    type: 'input',
    name: 'podName',
    message: 'If you are willing to procced, please type the name of the pod:'
  }])
    .then(podName => {
      observer.next({ pods, ...podName })
      observer.complete()
    })
    .catch(err => observer.err(err))
})
