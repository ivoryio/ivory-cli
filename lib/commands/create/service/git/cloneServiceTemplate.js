const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = (projectProperties) =>
  Observable.create(observer => {
    const cmd = `git clone git@github.com:ivoryio/service-template.git ${projectProperties.serviceName}`

    shell.cd('services')
    shell.exec(cmd, { silent: true }, (code, _, stderr) => {
      if (code !== 0) {
        return observer.error(stderr)
      }
      shell.cd(`${projectProperties.serviceName}`)
      shell.rm('-rf', '.git')

      observer.next(projectProperties)
      observer.complete()
    })
  })
