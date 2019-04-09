const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = ({ podName, projectProperties }) => Observable.create((observer) => {
  const scriptPath = `${shell.pwd()}/src/pods/${podName}/api/scripts/deploy.js`

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
  } else {
    observer.complete()
  }
})
