const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = () => Observable.create(observer => {
  const path = shell.pwd()
  const initializeCmd = `git init`
  const folders = ['web', 'z-ci-cd', 'services/data-gateway', 'services/greeter', 'services/user']
  
  folders.forEach(dir => {
    shell.cd(`${path}/${dir}`)
    shell.exec(initializeCmd, { silent: true }, (code, _, stderr) => {
      if (code !== 0) {
        return observer.error(stderr)
      }
  
      observer.next()
      observer.complete()
    })
  })
})