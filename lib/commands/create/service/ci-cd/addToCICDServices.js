const fs = require('fs')
const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = projectProperties => Observable.create(observer => {
  shell.cd('../../z-ci-cd')
  const servicesPath = `${shell.pwd()}/bin/services.json`
      const services = require(servicesPath)

      services.push({ name: projectProperties.serviceName })
      fs.writeFile(
        servicesPath,
        JSON.stringify(services, null, 2),
        'utf8',
        err => {
          if (err) {
            observer.error(err)
          }

          observer.next(projectProperties)
          observer.complete()
        }
      )
})