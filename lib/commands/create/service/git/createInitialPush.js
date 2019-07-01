const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = config =>
  Observable.create(observer => {
    const { serviceName, repositorySshUrl } = config
    const cmd = ` git remote add origin ${repositorySshUrl} && \
      git add . && \
      git commit -m 'Initial commit' && \
      git push --set-upstream origin master`

    
    shell.cd(`../services/${serviceName}`)
    shell.exec(cmd, { silent: true }, (code, _, stderr) => {
      if (code !== 0) {
        return observer.error(new Error(stderr))
      }

      observer.next(config)
      observer.complete()
    })
  })
