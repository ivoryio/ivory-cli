const fs = require('fs')
const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = serviceName =>
  Observable.create(observer => {
    shell.cd('../z-ci-cd/bin')
    const servicesPath = `${shell.pwd()}/services.json`
    const services = require(servicesPath)

    services.push({ name: serviceName })
    fs.writeFile(servicesPath, JSON.stringify(services, null, 2), 'utf8', err => {
      if (err) {
        observer.error(err)
      }
      
      observer.next()
      observer.complete()
    })
  })
