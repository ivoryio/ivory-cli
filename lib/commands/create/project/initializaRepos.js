const shell = require('shelljs')
const { Observable } = require('rxjs')


module.exporst = () => Observable.create((observer) => {
  const path = shell.pwd()
  const initializeCmd = `git init && git add . && git commit -m "first commit" `
  const folders = ['web', 'z-ci-cd', 'services/data-gateway-service', 'services/greeter-service', 'services/user-service']
  
  folders.forEach(dir => {
    shell.cd(`${path}/${dir}`)
    shell.exec(initializeCmd, { silent: true }, (code) => {
      if (code !== 0) {
        return observer.error(new Error(`Failed to initialize git in ${dir}.`))
      }
  
      observer.next()
      observer.complete()
    })
  })
})