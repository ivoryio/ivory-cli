const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = projectProperties =>
  Observable.create(observer => {
    const { repositorySshUrl } = projectProperties
    const cmd = ` git remote add origin ${repositorySshUrl} && \
      git add . && \
      git commit -m 'Initial commit' && \
      git push --set-upstream origin master`

    const services = require(`/${shell.pwd()}/bin/services.json`)
    const serviceName = services[services.length -1].name
    
    shell.cd(`../services/${serviceName}`)
    shell.exec(cmd, { silent: true }, (code, _, stderr) => {
      if (code !== 0) {
        return observer.error(new Error(stderr))
      }

      observer.next()
      observer.complete()
    })
  })
