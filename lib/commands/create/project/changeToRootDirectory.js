const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = function scaffold (projectName) {
  return Observable.create((observer) => {
    shell.cd(`./${projectName}`)
    observer.next()
    observer.complete()
  })
}
