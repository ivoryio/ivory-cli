const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = serviceName =>
  Observable.create(observer => {
    const serviceRepositorySshUrl = `ssh://git-codecommit.us-east-1.amazonaws.com/v1/repos/${serviceName}`

    const cmd = `git init &&
      git remote add origin ${serviceRepositorySshUrl} &&
      git add . && \
      git commit -m 'Initial Ivory commit' && \
      git push --set-upstream origin master`

    shell.exec(cmd, { silent: true }, (code, _, stderr) => {
      if (code !== 0) {
        return observer.error(stderr)
      }

      observer.next()
      observer.complete()
    })
  })
