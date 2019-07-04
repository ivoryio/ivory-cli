const { Observable } = require('rxjs')

const inquirer = require('inquirer')

module.exports = () =>
  Observable.create(observer => {
    const prompt = inquirer.createPromptModule()

    prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is the name of your project?',
        validate: projectName => validateProjectName(projectName)
      }
    ])
      .then(answer => {
        observer.next(answer.projectName)
        observer.complete()

        return
      })
      .catch(err => observer.error(err))

    function validateProjectName (projectName) {
      if (!projectName) {
        return 'The project name cannot be empty.'
      }
      if (!/^[0-9A-Za-z-]*$/.test(projectName)) {
        return 'Invalid project name format. Use only lowercase and uppercase letters, digits and dashes.'
      }

      return true
    }
  })
