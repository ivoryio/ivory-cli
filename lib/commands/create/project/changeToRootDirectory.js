const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = (projectName) => Observable.create((observer) => {
  shell.cd(`./${projectName}`)
  observer.next(projectName)
  observer.complete()
})
