const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = ({ serviceName, projectName }) =>
  Observable.create(observer => {
    const serviceRepositorySshUrl = `ssh://git-codecommit.us-east-1.amazonaws.com/v1/repos/${projectName}-${serviceName}-repository`
    const cmd = `git init && \
      git remote add origin ${serviceRepositorySshUrl} && \
      git add . && \
      git commit -m 'Initial commit' && \
      git push --set-upstream origin master`

    shell.cd(`../services/${serviceName}`)
    shell.exec(cmd, { silent: true }, (code, _, stderr) => {
      if (code !== 0) {
        return observer.error(stderr)
      }

      observer.next()
      observer.complete()
    })
  })
