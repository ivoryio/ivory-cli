const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = (podName) => Observable.create((observer) => {
  const podPath = `${shell.pwd()}/src/pods/${podName}`
  if (shell.test('-e', [podPath])) {
    observer.error(new Error('A Pod with the same name already exists!'))
  }

  try {
    shell.mkdir('-p', podPath)

    shell.cp('-R', `${__dirname}/template/api`, podPath)
    shell.cp('-R', `${__dirname}/template/web`, podPath)

    observer.next(podName)
    observer.complete()
  } catch (err) {
    observer.error(err)
  }
})
