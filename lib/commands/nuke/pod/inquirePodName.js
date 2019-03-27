const inquirer = require('inquirer')
const { Observable } = require('rxjs')

module.exports = log => Observable.create(observer => {
  const prompt = inquirer.createPromptModule()

  prompt([{
    type: 'input',
    name: 'podName',
    message: 'If you are willing to procced, please type the name of the pod:'
  },
  {
    type: 'input',
    name: 'enviroment',
    message: 'Please type the enviroment of the pod to be deleted:'
  }
  ])
    .then(answer => {
      observer.next(answer)
      observer.complete()
    })
    .catch(err => observer.err(err))
})
