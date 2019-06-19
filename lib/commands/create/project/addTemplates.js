const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = () => Observable.create((observer) => {
  shell.mv('web', '../../')
  shell.mv('ci-cd/*', '../../z-ci-cd')
  shell.mv(['data-gateway-service', 'greeter-service', 'user-service'], '../../services')
  shell.cd('../../')
  shell.rm('-rf', 'tmp')
  
  observer.next()
  observer.complete()
})