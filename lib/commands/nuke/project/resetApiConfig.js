const fs = require('fs')
const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = () => Observable.create((observer) => {
  const apiConfigPath = `${shell.pwd()}/src/config/api.config.json`
  let apiConfig = require(apiConfigPath)

  apiConfig.length = 0
  fs.writeFile(apiConfigPath, JSON.stringify(apiConfig), 'utf8', (err) => {
    if (err) observer.error(new Error('Failed to write in api.config.json'))

    observer.next()
    observer.complete()
  })
})
