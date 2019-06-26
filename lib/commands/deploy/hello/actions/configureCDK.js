const fs = require('fs')
const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = log => config =>
  Observable.create(observer => {
    const packageJsonPath = `${shell.pwd()}/z-ci-cd/package.json`

    if (!shell.test('-e', packageJsonPath)) {
      return observer.error(
        new Error(
          'Make sure you are running the command in the root folder of the project'
        )
      )
    }

    const packageJson = require(packageJsonPath)
    packageJson.scripts['deploy'] = config.deployCmd

    const content = JSON.stringify(packageJson, null, 2)

    fs.writeFile(packageJsonPath, content, 'utf8', err => {
      if (err) {
        return observer.error(err)
      }
      return observer.complete()
    })
  })
