const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = () => Observable.create((observer) => {
  const isIvoryApp = () => shell.test('-e', '.ivory.json')

  if (!isIvoryApp()) {
    observer.error(new Error("The current folder isn't an Ivory app (.ivory.json file not found). Run <ivory create> command"))
  }

  observer.next()
  observer.complete()
})
