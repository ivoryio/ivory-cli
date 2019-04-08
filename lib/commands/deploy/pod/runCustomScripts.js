const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = ({ podName, projectProperties }) => Observable.create((observer) => {
  const scriptsDirectory = `${shell.pwd()}/src/pods/${podName}/api/scripts`

  if (shell.test('-e', scriptsDirectory)) {
    let fileName = shell.ls(scriptsDirectory)[0]
    let scriptPath = `${scriptsDirectory}/${fileName}`

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
