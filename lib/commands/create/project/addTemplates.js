const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = () => Observable.create((observer) => {
  shell.mv('web', '../../')
  shell.mv('ci-cd/*', '../../z-ci-cd')
  shell.mv('data-gateway-service', '../../services/data-gateway')
  shell.mv('greeter-service', '../../services/greeter')
  shell.mv('user-service', '../../services/user')
  shell.cd('../../')
  shell.rm('-rf', 'tmp')
  
  observer.next()
  observer.complete()
})