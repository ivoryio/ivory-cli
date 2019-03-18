const shell = require('shelljs')

module.exports = function (projectProperties) {
  return new Promise((resolve, reject) => {
    try {
      let pods = []
      shell.ls('src/pods').forEach(file => {
        if (shell.test('-e', `src/pods/${file}/api/infrastructure.yaml`)) {
          pods.push(file)
        }
      })

      return resolve({ ...projectProperties, pods })
    } catch (err) {
      return reject(err)
    }
  })
}
