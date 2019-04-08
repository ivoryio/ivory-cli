const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = (log) => Observable.create((observer) => {
  const scriptsPath = `${shell.pwd()}/src/pods/catalog/api/scripts`
  log.start('Runing custom scripts ...')
  if (shell.test('-e', scriptsPath)) {
    shell.ls(scriptsPath).forEach(file => {
      const obs = require(`${scriptsPath}/${file}`)()
      obs.subscribe({
        next: () => { },
        complete: () => {
          observer.next()
          observer.complete()
        },
        error: err => observer.error(err)
      })
    })
  }
})
