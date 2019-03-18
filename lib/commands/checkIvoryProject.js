const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = () => {
  return Observable.create((observer) => {
    if (!currentFolderContainsAnIvoryApp()) {
      observer.error(notAnIvoryAppError())
    } else {
      observer.next()
      observer.complete()
    }

    function currentFolderContainsAnIvoryApp () {
      return shell.test('-e', '.ivory.json')
    }
    function notAnIvoryAppError () {
      return new Error("The current folder isn't an Ivory app (.ivory.json file not found). Run <ivory create> command")
    }
  })
}
