const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = serviceName =>
  Observable.create(observer => {
    const servicePath = `${shell.pwd()}/${serviceName}`
    const arr = shell.pwd().stdout.split('/')
    const projectName = arr[arr.length - 2]

    try {
      shell.sed('-i', 'SERVICE_NAME', serviceName, [
        `${servicePath}/package.json`,
        `${servicePath}/package-lock.json`,
        `${servicePath}/infrastructure.yaml`
      ])
      shell.sed(
        '-i',
        'PROJECT_NAME',
        projectName,
        `${servicePath}/package.json`
      )

      observer.next(serviceName)
      observer.complete()
    } catch (err) {
      observer.error(err)
    }
  })
