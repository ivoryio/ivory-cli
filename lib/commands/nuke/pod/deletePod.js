const fs = require('fs')
const AWS = require('aws-sdk')
const shell = require('shelljs')
const { Observable } = require('rxjs')

module.exports = (log, answer) => Observable.create(observer => {
  const cloudformation = new AWS.CloudFormation({
    region: answer.credentials.region
  })

  log.start('Waiting for the pod to be deleted...')

  const cmdRemoveFolder = `rm -rf ${shell.pwd()}/src/pods/${answer.podName}`

  const StackName = `ivory-${answer.name}-dev-${answer.podName}`
  const params = { StackName }

  const podEntriesPath = `${shell.pwd()}/pod-entries.json`
  const apiConfigPath = `${shell.pwd()}/src/config/api.config.json`

  const apiConfig = require(apiConfigPath)
  const podEntries = require(podEntriesPath)

  shell.exec(cmdRemoveFolder, code => {
    if (code !== 0) {
      return observer.error(new Error('Failed to delete the folder'))
    }

    const indexes = podEntries.indexEntries.filter(path => path !== `src/pods/${answer.podName}/web/index.js`)
    const entries = podEntries.srcEntries.filter(path => path !== `src/pods/${answer.podName}/web`)
    const apiEntries = apiConfig.filter(api => api.name !== answer.podName)

    podEntries.indexEntries = indexes.slice(0)
    podEntries.srcEntries = entries.slice(0)

    fs.writeFile(podEntriesPath, JSON.stringify(podEntries), 'utf8', (err) => {
      if (err) {
        observer.error(err)
      }
      fs.writeFile(apiConfigPath, JSON.stringify(apiEntries), 'utf8', (err) => {
        if (err) {
          observer.error(err)
        }
        cloudformation.deleteStack(params, (err, data) => {
          if (err) observer.error(err)
          cloudformation.waitFor('stackDeleteComplete', { StackName }, (err, data) => {
            if (err) observer.error(err)
            observer.complete()
          })
        })
      })
    })
  })
})
