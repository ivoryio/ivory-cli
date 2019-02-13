const shell = require('shelljs')

module.exports = function () {
  return new Promise((resolve, reject) => {
    if (!shell.test('-e', '.ivory.json')) {
      return reject(new Error("The current directory isn't an Ivory app (.ivory.json file not found). Please run the command in a directory created with ivory project create."))
    }
    return resolve()
  })
}
