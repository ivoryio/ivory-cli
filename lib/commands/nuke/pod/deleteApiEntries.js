const fs = require('fs')
const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = podName => Observable.create(observer => {
  const apiConfigPath = `${shell.pwd()}/src/config/api.config.json`
  const apiConfig = require(apiConfigPath)

  const apiEntries = apiConfig.filter(api => api.name !== podName)

  fs.writeFile(apiConfigPath, JSON.stringify(apiEntries), 'utf8', err => {
    if (err) observer.error(err)

    observer.next(podName)
    observer.complete()
  })
})
