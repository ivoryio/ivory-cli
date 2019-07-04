const shell = require('shelljs')

module.exports = () => {
  const files = shell.ls().stdout

  return /services\nweb\nz-ci-cd/g.test(files)
}
