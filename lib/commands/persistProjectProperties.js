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
      ...projectProperties
    }

    return `${JSON.stringify(properties, null, 4)}\n`
  }
}
