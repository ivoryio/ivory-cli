
const fs = require('fs')
const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = function () {
  return Observable.create((observer) => {
    if (!currentFolderContainsAnIvoryApp()) {
      observer.error(notAnIvoryAppError())
    }

    fs.readFile('.ivory.json', 'utf8', function (err, data) {
      if (err) {
        observer.error(err)
      }

      try {
        const projectProperties = JSON.parse(data)
        observer.next(projectProperties)
        observer.complete()
      } catch (err) {
        observer.error(parsingError())
      }
    })
  })

  function currentFolderContainsAnIvoryApp () {
    return shell.test('-e', '.ivory.json')
  }
  function notAnIvoryAppError () {
    return new Error("The current folder isn't an Ivory app (.ivory.json file not found). Run ivory project create <project-name>")
  }
  function parsingError () {
    return new Error("Couldn't parse .ivory.json. Make sure the file has not been tempered with.")
  }
}
