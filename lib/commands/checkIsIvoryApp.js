const { Observable } = require('rxjs')

const isIvoryApp = require('./isIvoryApp')

module.exports = () =>
  Observable.create(observer => {
    if (!isIvoryApp()) {
      return observer.error(
        new Error(
          "The current folder isn't an Ivory app. Go in the root folder of your project or run <ivory create> command for a new project"
        )
      )
    }

    observer.next()
    observer.complete()
  })
