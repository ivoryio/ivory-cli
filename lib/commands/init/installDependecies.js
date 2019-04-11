const shell = require('shelljs')
const { Observable } = require('rxjs')
const { concatMap } = require('rxjs/operators')

module.exports = () => addCommitizen().pipe(
  concatMap(yarn)
)

const addCommitizen = () => Observable.create((observer) => {
  const cmd = 'npm install commitizen -g'

  shell.exec(cmd, { silent: true }, code => {
    if (code !== 0) {
      return observer.error('Failed to install commitizen globally')
    }
  })

  observer.next()
  observer.complete()
})

const yarn = () => Observable.create((observer) => {
  const cmd = 'yarn'

  shell.exec(cmd, { silent: true }, code => {
    if (code !== 0) {
      return observer.error('Failed to install dependencies')
    }
    observer.next()
    observer.complete()
  })
})
