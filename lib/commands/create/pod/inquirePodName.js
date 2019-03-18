const { Observable } = require('rxjs')

const inquirer = require('inquirer')

module.exports = () => {
  return Observable.create((observer) => {
    const prompt = inquirer.createPromptModule()

    prompt([{
      type: 'input',
      name: 'podName',
      message: 'What is the name of the pod?'
    }])
      .then(answer => {
        observer.next(answer.podName)
        observer.complete()
      })
      .catch(err => observer.error(err))
  })
}
