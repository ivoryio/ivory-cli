const shell = require('shelljs')
const inquirer = require('inquirer')
const { Observable } = require('rxjs')


module.exports = () => Observable.create((observer) => {
  const prompt = inquirer.createPromptModule()

  prompt([{
    type: 'input',
    name: 'serviceName',
    message: 'What is the service name?',
    validate: serviceName => validateServiceName(serviceName)

  }])
    .then(answer => {
      observer.next(answer.serviceName)
      observer.complete()

      return
    })
    .catch(err => observer.error(err))
})

const validateServiceName = serviceName => {
  const servicePath = `${shell.pwd()}/services/${serviceName}`

  if (!serviceName) {
    return 'The service name cannot be empty.'
  }
  if (!/^[a-z-]*$/.test(serviceName)) {
    return 'Invalid service name format. Please use only lowercase letters and dashes.'
  }
  if (shell.test('-e', servicePath)) {
    return 'A service with the same name already exists!'
  }
  return true
}