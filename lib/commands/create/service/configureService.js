const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = serviceName =>
  Observable.create(observer => {
    const cmd = 'git init'
    const arr = shell.pwd().stdout.split('/')
    const servicePath = `${shell.pwd()}/${serviceName}`
    const projectName = arr[arr.length - 2]

    try {
      shell.sed('-i', 'SERVICE_NAME', serviceName, [
        `${servicePath}/package.json`,
        `${servicePath}/package-lock.json`,
        `${servicePath}/infrastructure.yaml`
      ])
      shell.sed('-i', 'PROJECT_NAME', projectName, `${servicePath}/package.json`)
      shell.exec(cmd, { silent: true }, (code) => {
        if (code !== 0) {
          return observer.error(new Error(`Failed to initialize git repository.`))
        }
    
        observer.next(serviceName)
        observer.complete()
      })
    } catch (err) {
      observer.error(err)
    }
  })
