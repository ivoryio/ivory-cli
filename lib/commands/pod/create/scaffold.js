const shell = require('shelljs')

module.exports = (podName) => () => {
  return new Promise((resolve, reject) => {
    const podPath = `${shell.pwd()}/src/pods/${podName}`
    if (shell.test('-e', [podPath])) {
      return reject(new Error('A Pod with the same name already exists!'))
    }

    try {
      shell.mkdir('-p', podPath)

      shell.cp('-R', `${__dirname}/template/api`, podPath)
      shell.cp('-R', `${__dirname}/template/web`, podPath)

      resolve()
    } catch (err) {
      reject(err)
    }
  })
}
