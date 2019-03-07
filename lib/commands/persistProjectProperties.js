const fs = require('fs')

module.exports = projectProperties => {
  return new Promise((resolve, reject) => {
    fs.writeFile('./.ivory.json', generateFileContent(), (err) => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })

  function generateFileContent () {
    const properties = {
      warning: "DON'T MODIFY THIS FILE UNLESS YOU KNOW WHAT YOU ARE DOING! ",
      ...projectProperties
    }

    return `${JSON.stringify(properties, null, 4)}\n`
  }
}
