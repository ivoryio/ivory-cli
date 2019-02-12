const shell = require('shelljs')

module.exports = function scaffold (projectName) {
  return new Promise((resolve, reject) => {
    if (!projectName || typeof projectName !== 'string') {
      return reject(new Error('Please specify a name for your project'))
    }

    if (shell.test('-e', projectName)) {
      return reject(new Error('A folder with the same name already exists.'))
    }

    const cmd = `npx create-react-app ${projectName.toLowerCase()} --scripts-version @ivoryio/ivory-react-scripts`
    shell.exec(cmd, { silent: true }, (code) => {
      if (code !== 0) {
        return reject(new Error('create-react-app with @ivoryio/ivory-react-scripts failed.'))
      }

      removeGitRepo()

      resolve()
    })
  })

  function removeGitRepo () {
    shell.cd(`./${projectName}`)
    if (shell.test('-e', '.git')) {
      shell.rm('-rf', './.git')
    }
    shell.cd('..')
  }
}
