const { iif, throwError } = require('rxjs')
const { concatMap, tap } = require('rxjs/operators')

const deleteStack = require('./deleteStack')
const detectPods = require('../../detectPods')
const inquirePodName = require('./inquirePodName')
const deleteLogGroups = require('./deleteLogGroups')
const deletePodEntries = require('./deletePodEntries')
const deleteApiEntries = require('./deleteApiEntries')
const describeLogGroups = require('./describeLogGroups')

module.exports = (log) => detectPods().pipe(
  concatMap(inquirePodName),
  tap(logDeletePod(log)),
  concatMap(decideWhatToDo))

const decideWhatToDo = ({ pods, podName }) => iif(
  () => pods.indexOf(podName) > -1,
  deletePod(podName),
  abort(podName)
)

const deletePod = (podName) => deleteStack(podName).pipe(
  concatMap(deletePodEntries(podName)),
  concatMap(deleteApiEntries(podName)),
  concatMap(describeLogGroups(podName)),
  concatMap(deleteLogGroups)
)

const abort = (podName) => throwError(new Error(`No action proceded. There is no pod with the name ${podName}`))

const logDeletePod = (log) => ({ podName }) => {
  log.text = `Deleting ${podName} ...\n`
  log.start()
}
