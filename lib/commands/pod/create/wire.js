const fs = require('fs')
const shell = require('shelljs')

module.exports = (podName) => () => {
  return new Promise((resolve, reject) => {
    try {
      const podPath = `${shell.pwd()}/src/pods/${podName}`

      shell.sed('-i', 'POD_NAME', podName, `${podPath}/web/app/screens/Hello.js`)
      shell.sed('-i', 'POD_NAME', podName.toLowerCase(), `${podPath}/web/index.js`)
      shell.sed('-i', 'POD_NAME', podName.toLowerCase(), `${podPath}/web/app/index.js`)
      shell.sed('-i', 'POD_NAME', podName.toLowerCase(), `${podPath}/web/app/index.js`)

      const podEntriesPath = `${shell.pwd()}/pod-entries.json`
      const podEntries = require(podEntriesPath)
      podEntries.indexEntries.push(`src/pods/${podName}/web/index.js`)
      podEntries.srcEntries.push(`src/pods/${podName}/web`)

      fs.writeFile(podEntriesPath, JSON.stringify(podEntries), 'utf8', (err) => {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    } catch (err) {
      reject(err)
    }
  })
}
