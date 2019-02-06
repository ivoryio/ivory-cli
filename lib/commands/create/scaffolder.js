const ora = require('ora')
const shell = require('shelljs')

module.exports = {
  scaffoldProject: function (fsm) {
    const log = ora('Creating project structure and installing dependencies').start()

    return new Promise((resolve, reject) => {
      shell.exec(`npx create-react-app ${fsm.projectName.toLowerCase()} --scripts-version @ivoryio/ivory-react-scripts`, { silent: true }, (code, stdout, stderr) => {
        if (code !== 0) {
          log.fail()
          return reject(stderr)
        }

        log.succeed()
        resolve()
      })
    })
  }
}
