const fs = require('fs')
const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = (podName) => Observable.create((observer) => {
    try {
      const podPath = `${shell.pwd()}/src/pods/${podName}`

      const lowercasePodName = podName.toLowerCase()
      const capitalizedPodName = podName.charAt(0).toUpperCase() + podName.slice(1)

      shell.sed('-i', 'POD_NAME', capitalizedPodName, `${podPath}/api/infrastructure.yaml`)
      shell.sed('-i', 'POD_NAME_LOWER', lowercasePodName, `${podPath}/api/package.json`)

      shell.sed('-i', 'POD_NAME_LOWER', lowercasePodName, `${podPath}/web/index.js`)
      shell.sed('-i', 'POD_NAME', capitalizedPodName, `${podPath}/web/app/screens/Hello.js`)
      shell.sed('-i', 'POD_NAME_LOWER', lowercasePodName, `${podPath}/web/app/services/Provider.js`)

      const podEntriesPath = `${shell.pwd()}/pod-entries.json`
      const podEntries = require(podEntriesPath)
      podEntries.indexEntries.push(`src/pods/${podName}/web/index.js`)
      podEntries.srcEntries.push(`src/pods/${podName}/web`)

      fs.writeFile(podEntriesPath, JSON.stringify(podEntries), 'utf8', (err) => {
        if (err) {
          observer.error(err)
        }
        observer.complete()
      })
    } catch (err) {
      observer.error(err)
    }
  })
