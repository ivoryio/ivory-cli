const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = (log) => Observable.create((observer) => {
  const scriptsPath = `${shell.pwd()}/src/pods/catalog/api/scripts`
  if (shell.test('-e', scriptsPath)) {
    shell.ls(scriptsPath).forEach(file => {
      const obs = require(`${scriptsPath}/${file}`)
      obs.subscribe((v) => log.warn(v))
      observer.next()
      observer.complete()
    })
  }
})
