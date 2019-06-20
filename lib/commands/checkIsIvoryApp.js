const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = () =>
  Observable.create(observer => {
    const files = shell.ls().stdout

    const isIvoryApp = () => /services\nweb\nz-ci-cd/g.test(files)

    if (!isIvoryApp()) {
      observer.error(
        new Error(
          "The current folder isn't an Ivory app. Go in the root folder of your project or run <ivory create> command for a new project"
        )
      )
    }

    observer.next()
    observer.complete()
  })

