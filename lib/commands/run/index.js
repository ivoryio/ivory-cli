const shell = require('shelljs')

function run () {
  process.stdout.write('The run command must be executed in the root directory of an Ivory app.\n')

  shell.exec('yarn start', { silent: false }, () => {
  })
}

module.exports = run
