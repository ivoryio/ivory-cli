const { Observable } = require('rxjs')

const inquirer = require('inquirer')

module.exports = () =>
  Observable.create(observer => {
    const prompt = inquirer.createPromptModule()
    function validatePodName (podName) {
      const pod = podName.trim()
      if (!pod.length) {
        return 'Pod name cannot be empty.'
      }
      if (!/^[a-zA-Z]*$/.test(pod)) {
        return 'Invalid pod name format. Please use only upper and lowercase letters.'
      }
      return true
    }
    prompt([
      {
        type: 'input',
        name: 'podName',
        message: 'What is the name of the pod?',
        validate: value => validatePodName(value)
      }
    ])
      .then(answer => {
        observer.next(answer.podName)
        observer.complete()
      })
      .catch(err => observer.error(err))
  })
