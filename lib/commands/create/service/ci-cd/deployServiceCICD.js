const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = config =>
  Observable.create(observer => {
    try {
      shell.cd('../../z-ci-cd')
      const packagePath = `${shell.pwd()}/package.json`
      const deployCmd = require(packagePath).scripts.deploy

      shell.exec(deployCmd, { silent: true }, (code, _, stderr) => {
        if (code !== 0) {
          observer.error(new Error(stderr))
          return
        }

        observer.next(config)
        observer.complete()
      })
    } catch (err) {
      observer.error(err)
    }
  })
