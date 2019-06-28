const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = serviceName => Observable.create(observer => {
  const cmd = `git clone git@github.com:ivoryio/service-template.git ${serviceName}`
  
  shell.cd('services')
  shell.exec(cmd, { silent: true }, (code, _, stderr) => {
    if (code !== 0) {
      return observer.error(stderr)
    }
    shell.cd(`${serviceName}`)
    shell.rm('-rf', '.git')

    observer.next(serviceName)
    observer.complete()
  })

})