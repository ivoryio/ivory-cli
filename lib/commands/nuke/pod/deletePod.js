const fs = require('fs')
const AWS = require('aws-sdk')
const shell = require('shelljs')
const { Observable } = require('rxjs')
const { concatMap } = require('rxjs/operators')

module.exports = (log, { podName, name, credentials }) => Observable.create(observer => {
  log.start('Waiting for the pod to be deleted...')

  deleteStack({}).pipe(
    concatMap(() => deletePodEntries(podName)),
    concatMap(() => deleteApiEntries(podName)),
    concatMap(() => removeFolder(podName))
  ).subscribe(onNext, onError, onComplete)

  function onNext () { }
  function onError (err) { observer.error(err) }
  function onComplete () { observer.complete() }
})

const deleteStack = (answer) => Observable.create(observer => {
  const cloudformation = new AWS.CloudFormation({
    region: answer.credentials.region
  })

  const StackName = `ivory-${answer.name}-dev-${answer.podName}`
  let params = { StackName }

  cloudformation.deleteStack(params, (err, data) => {
    if (err) observer.error(err)
    cloudformation.waitFor('stackDeleteComplete', { StackName }, (err, data) => {
      if (err) observer.error(new Error(`Failed to delete stack ${StackName}.`))
      observer.next()
      observer.complete()
    })
  })
})

const removeFolder = podName => Observable.create(observer => {
  const cmdRemoveFolder = `rm -rf ${shell.pwd()}/src/pods/${podName}`

  shell.exec(cmdRemoveFolder, code => {
    if (code !== 0) observer.error(new Error('Failed to delete the folder'))
    observer.next()
    observer.complete()
  })
})

const deletePodEntries = podName => Observable.create(observer => {
  const podEntriesPath = `${shell.pwd()}/pod-entries.json`
  const podEntries = require(podEntriesPath)

  const indexes = podEntries.indexEntries.filter(path => path !== `src/pods/${podName}/web/index.js`)
  const entries = podEntries.srcEntries.filter(path => path !== `src/pods/${podName}/web`)

  podEntries.indexEntries = indexes.slice(0)
  podEntries.srcEntries = entries.slice(0)

  fs.writeFile(podEntriesPath, JSON.stringify(podEntries), 'utf8', err => {
    if (err) observer.error(err)
    observer.next()
    observer.complete()
  })
})

const deleteApiEntries = podName => Observable.create(observer => {
  const apiConfigPath = `${shell.pwd()}/src/config/api.config.json`
  const apiConfig = require(apiConfigPath)

  const apiEntries = apiConfig.filter(api => api.name !== podName)

  fs.writeFile(apiConfigPath, JSON.stringify(apiEntries), 'utf8', err => {
    if (err) observer.error(err)
    observer.next()
    observer.complete()
  })
})
