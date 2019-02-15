const fs = require('fs')
const shell = require('shelljs')

module.exports = (projectProperties) => {
  return new Promise((resolve, reject) => {
    fs.writeFile('./.ivory.json', JSON.stringify({...projectProperties}), (err) => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}
