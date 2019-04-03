const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = (log) => Observable.create((observer) => {
  const scripts = []
  const scriptsPath = `${shell.pwd()}/src/pods/catalog/api/scripts`
  if (shell.test('-e', scriptsPath)) {
    shell.ls(scriptsPath).forEach(file => {
      scripts.push(require(`${scriptsPath}/${file}`))
    })
    if (scripts !== 0) {
      observer.next(scripts)
      observer.complete()
    }
  }
  // observer.complete()
})
