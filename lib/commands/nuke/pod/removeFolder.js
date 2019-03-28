const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = podName => Observable.create(observer => {
  const cmdRemoveFolder = `rm -rf ${shell.pwd()}/src/pods/${podName}`

  shell.exec(cmdRemoveFolder, code => {
    if (code !== 0) observer.error(new Error('Failed to delete the folder'))
    observer.next()
    observer.complete()
  })
})
