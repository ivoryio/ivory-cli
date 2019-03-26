const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = () =>
  Observable.create(observer => {
    const cmdYarn = 'yarn'
    const cmdAddCommitizen = 'npm install commitizen -g'
    shell.exec(cmdAddCommitizen, { silent: true }, code => {
      if (code !== 0) {
        return observer.error('Failed to install commitizen globally')
      }
      shell.exec(cmdYarn, { silent: true }, code => {
        if (code !== 0) {
          return observer.error('Failed to install dependencies')
        }
        observer.next()
        observer.complete()
      })
    })
  })
