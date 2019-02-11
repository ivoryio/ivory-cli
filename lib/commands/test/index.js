const shell = require('shelljs')

function run () {
  const cmd = 'yarn add --dev mocha && ./node_modules/.bin/cypress run'
  shell.exec(cmd, { silent: false }, () => {
  })
}

module.exports = run
