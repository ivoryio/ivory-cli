const inquirer = require('inquirer')
const { Observable } = require('rxjs')

module.exports = ivoryConfig =>
  Observable.create(observer => {
    if (ivoryConfig.projects.length === 0) {
      observer.error(new Error(`No Ivory projects were deployed in`))
    }

    const choices = ivoryConfig.projects.map(project => ({
      name: project.projectName,
      value: project.projectName
    }))

    const prompt = inquirer.createPromptModule()
    prompt({
      type: 'list',
      name: 'name',
      message: 'Please choose a project to',
      choices
    })
      .then(answer => {
        const projectConfig = ivoryConfig.projects.find(
          p => p.projectName === answer.name
        )
        observer.next(projectConfig)
        observer.complete()
        return
      })
      .catch(err => {
        observer.error(err)
      })
  })
