const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = function scaffold (projectName) {
  return Observable.create((observer) => {
    if (!projectName || typeof projectName !== 'string') {
      return observer.error(new Error('Please specify a name for your project'))
    }

    if (shell.test('-e', projectName)) {
      return observer.error(new Error('A folder with the same name already exists.'))
    }

    const cmd = `npx create-react-app ${projectName.toLowerCase()} --scripts-version @ivoryio/ivory-react-scripts`
    shell.exec(cmd, { silent: true }, (code) => {
      if (code !== 0) {
        return observer.error(new Error('create-react-app with @ivoryio/ivory-react-scripts failed.'))
      }

      removeGitRepo()

      observer.next(projectName)
      observer.complete()

      function removeGitRepo () {
        shell.cd(`./${projectName}`)
        if (shell.test('-e', '.git')) {
          shell.rm('-rf', './.git')
        }
        shell.cd('..')
      }
    })
  })
}
