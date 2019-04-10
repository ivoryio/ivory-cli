const fs = require('fs')
const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = podName => () => Observable.create(observer => {
  const podEntriesPath = `${shell.pwd()}/pod-entries.json`
  const podEntries = require(podEntriesPath)

  const indexes = podEntries.indexEntries.filter(path => path !== `src/pods/${podName}/web/index.js`)
  const entries = podEntries.srcEntries.filter(path => path !== `src/pods/${podName}/web`)

  podEntries.indexEntries = indexes.slice(0)
  podEntries.srcEntries = entries.slice(0)

  fs.writeFile(podEntriesPath, JSON.stringify(podEntries), 'utf8', err => {
    if (err) observer.error(err)
    observer.next(podName)
    observer.complete()
  })
})
