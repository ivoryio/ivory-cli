const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = projectProperties =>
  Observable.create(observer => {
    const { deployCmd } = projectProperties

    shell.cd('../../z-ci-cd')
    shell.exec(deployCmd, { silent: true }, (code, _, stderr) => {
      if (code !== 0) {
        return observer.error(new Error(stderr))
      }

      observer.next(projectProperties)
      observer.complete()
    })
  })
