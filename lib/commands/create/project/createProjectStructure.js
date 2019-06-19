const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = (projectName) => Observable.create((observer) => {
  const creteProjectCmd = `mkdir ${projectName}`

  shell.exec(creteProjectCmd, { silent: true }, (code) => {
    if (code !== 0) {
      return observer.error(new Error(`Failed to create ${projectName} folder.`))
    }
    shell.cd(`./${projectName}`)
    shell.mkdir(['z-ci-cd', 'web','services'])

    observer.next(projectName)
    observer.complete()
  })
})