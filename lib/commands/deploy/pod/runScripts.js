const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = (log) => Observable.create((observer) => {
  const scriptPath = `${shell.pwd()}/src/pods/catalog/api/scripts/deploy.js`
  log.start('Runing custom scripts ...')

  if (shell.test('-e', scriptPath)) {
    const obs = require(scriptPath)()
    obs.subscribe({
      next: () => { },
      complete: () => {
        observer.next()
        observer.complete()
      },
      error: err => observer.error(err)
    })
  }
})
