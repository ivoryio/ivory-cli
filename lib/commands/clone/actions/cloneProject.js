const shell = require('shelljs')
const { Observable, concat } = require('rxjs')

module.exports = log => projectConfig =>
  Observable.create(observer => {
    const { projectName } = projectConfig
    const path = `${shell.pwd()}/${projectName}`

    if (shell.test('-e', path)) {
      return observer.error(
        new Error(`A folder with the name ${projectName} already exists`)
      )
    }

    createFolderStructure(path)

    const tasks = projectConfig.components.map(createCloneTask)

    concat(...tasks).subscribe({
      next: () => {},
      error: err => observer.error(err),
      complete: () => {
        observer.next()
        observer.complete()
      }
    })

    function createCloneTask (component) {
      return Observable.create(observer => {
        logCloning()

        if (component.type === 'service') {
          shell.cd(`${path}/services`)
        }

        const cmd = `git clone ${component.repositorySshUrl} ${component.name}`
        shell.exec(cmd, { silent: true }, (code, _, stderr) => {
          if (code !== 0) {
            return observer.error(new Error(stderr))
          }

          if (component.type === 'service') {
            shell.cd('..')
          }

          observer.next()
          observer.complete()
        })
      })

      function logCloning () {
        log.text = `Cloning ${component.name}...`
        log.start()
      }
    }

    function createFolderStructure (path) {
      shell.mkdir(path)
      shell.mkdir(`${path}/web`)
      shell.mkdir(`${path}/services`)
      shell.mkdir(`${path}/z-ci-cd`)
    }
  })
