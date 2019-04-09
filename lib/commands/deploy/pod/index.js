const { concatMap, tap } = require('rxjs/operators')

const deployPod = require('./deployPod')
const detectPods = require('../../detectPods')
const inquireWhatPodToDeploy = require('./inquireWhatPodToDeploy')
const runCustomScripts = require('./runCustomScripts')

module.exports = (log) => detectPods().pipe(
  concatMap(inquireWhatPodToDeploy),
  tap(logDeployPod(log)),
  concatMap(deployPod),
  tap(logRunCustomScripts(log)),
  concatMap(runCustomScripts)
)

const logDeployPod = (log) => (podName) => {
  log.text = `Deploying ${podName} ...\n`
  log.start()
}

const logRunCustomScripts = (log) => ({ podName, projectProperties }) => {
  log.text = `Runing custom scripts from ${podName} ...`
  log.start()
}
