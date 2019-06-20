const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = () => Observable.create((observer) => {
  const retrieveRepoCmd = `git clone git@github.com:ivoryio/hello-template.git tmp`

  shell.exec(retrieveRepoCmd, { silent: true }, (code) => {
    if (code !== 0) {
      return observer.error(new Error(`Failed to retrieve git repository.`))
    }
    shell.cd('tmp/templates')

    observer.next()
    observer.complete()
  })
})