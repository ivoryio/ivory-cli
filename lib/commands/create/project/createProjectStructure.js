const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = projectName => Observable.create(observer => {
  const creteProjectCmd = `mkdir ${projectName}`

  shell.exec(creteProjectCmd, { silent: true }, (code, _, stderr) => {
    if (code !== 0) {
      return observer.error(stderr)
    }
    shell.cd(`./${projectName}`)
    shell.mkdir(['z-ci-cd', 'web','services'])

    observer.next()
    observer.complete()
  })
})