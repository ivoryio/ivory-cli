const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = ({ serviceName, projectName }) =>
  Observable.create(observer => {
    try {
      shell.cd('../../z-ci-cd')
      const packagePath = `${shell.pwd()}/package.json`
      
      const deployCmd = require(packagePath).scripts.deploy

      shell.exec(deployCmd, { silent: true }, (code, _, stderr) => {
        if (code !== 0) {
          return observer.error(stderr)
        }

        observer.next({ serviceName, projectName })
        observer.complete()
      })
    } catch (err) {
      observer.error(err)
    }
  })
