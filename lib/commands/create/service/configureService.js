const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = projectProperties =>
  Observable.create(observer => {
    const servicePath = `${shell.pwd()}`
    const arr = shell.pwd().stdout.split('/')
    const projectName = arr[arr.length - 3]

    try {
      shell.sed('-i', 'SERVICE_NAME', projectProperties.serviceName, [
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

      observer.next(projectProperties)
      observer.complete()
    } catch (err) {
      observer.error(err)
    }
  })
