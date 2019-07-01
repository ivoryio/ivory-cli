const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = projectProperties => Observable.create(observer => {
  const cmd = 'git init'

  shell.cd(`../services/${projectProperties.serviceName}`)
  shell.exec(cmd, { silent: true }, (code, _, stderr) => {
    if (code !== 0) {
      return observer.error(new Error(stderr))
    }

    observer.next(projectProperties)
    observer.complete()
  })
})