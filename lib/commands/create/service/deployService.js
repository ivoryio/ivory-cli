const fs = require('fs')
const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = serviceName =>
  Observable.create(observer => {
    try {
      shell.cd('../z-ci-cd')
      const packagePath = `${shell.pwd()}/package.json`
      const servicesPath = `${shell.pwd()}/bin/services.json`
      const services = require(servicesPath)

      services.push({ name: serviceName })
      fs.writeFile(
        servicesPath,
        JSON.stringify(services, null, 2),
        'utf8',
        err => {
          if (err) {
            observer.error(err)
          }

          observer.next()
          observer.complete()
        }
      )
      const deployCmd = require(packagePath).scripts.deploy

      shell.exec(deployCmd, code => {
        if (code !== 0) {
          return observer.error(new Error(`Failed to deploy ${serviceName}.`))
        }

        observer.next(serviceName)
        observer.complete()
      })
    } catch (err) {
      observer.error(err)
    }
  })
