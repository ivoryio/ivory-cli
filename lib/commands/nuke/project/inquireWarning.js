const clc = require('cli-color')
const inquirer = require('inquirer')
const { Observable } = require('rxjs')

module.exports = (log) => Observable.create((observer) => {
  const prompt = inquirer.createPromptModule()

  log.warn(clc.yellow('Warning! This operation will delete the entire infrastructure of your project, meaning all the stacks and the S3 bucket. The following operation will be irreversible.'))

  prompt([{
    type: 'input',
    name: 'projectName',
    message: 'If you are willing to procced, please type the name of your project:'
  }])
    .then(answer => {
      observer.next(answer.projectName)
      observer.complete()
    })
    .catch(err => observer.err(err))
})
