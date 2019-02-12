
const fs = require('fs')
const shell = require('shelljs')

module.exports = function () {
  return new Promise((resolve, reject) => {
    if (!currentFolderContainsAnIvoryApp()) {
      return reject(notAnIvoryAppError())
    }

    fs.readFile('.ivory.json', 'utf8', function (err, data) {
      if (err) {
        return reject(err)
      }

      try {
        const projectProperties = JSON.parse(data)
        return resolve(projectProperties)
      } catch (err) {
        return reject(new Error("Couldn't parse .ivory.json. Make sure the file has not been tempered with."))
      }
    })
  })

  function currentFolderContainsAnIvoryApp () {
    return shell.test('-e', '.ivory.json')
  }
  function notAnIvoryAppError () {
    return new Error("The current folder isn't an Ivory app (.ivory.json file not found). Run ivory project create <project-name>")
  }
}
