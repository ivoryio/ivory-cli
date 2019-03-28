const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = function (projectProperties) {
  return Observable.create((observer) => {
    try {
      let pods = []
      shell.ls('src/pods').forEach(file => {
        if (shell.test('-e', `src/pods/${file}/api/infrastructure.yaml`)) {
          pods.push(file)
        }
      })
      observer.next({ ...projectProperties, pods })
      observer.complete()
    } catch (err) {
      observer.error(err)
    }
  })
}
