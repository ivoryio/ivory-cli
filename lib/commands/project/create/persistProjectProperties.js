const fs = require('fs')
const shell = require('shelljs')

module.exports = (projectName) => () => {
  return new Promise((resolve, reject) => {
    shell.cd(`./${projectName}`)

    fs.writeFile('./.ivory.json', generateFileContent(), (err) => {
      shell.cd('..')
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })

  function generateFileContent () {
    const properties = {
      warning: "DON'T MODIFY THIS FILE! YOU HAVE BEEN WARNED!!!",
      name: projectName
    }

    return `${JSON.stringify(properties)}\n`
  }
}
