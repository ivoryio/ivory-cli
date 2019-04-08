const { concatMap, tap } = require('rxjs/operators')

const deployPod = require('./deployPod')
const detectPods = require('../../detectPods')
const inquireWhatPodToDeploy = require('./inquireWhatPodToDeploy')

module.exports = (log) => detectPods().pipe(
  concatMap(inquireWhatPodToDeploy),
  tap(logDeployPod(log)),
  concatMap(deployPod)
)

const logDeployPod = (log) => (podName) => {
  log.text = `Deploying ${podName} ...\n`
  log.start()
}
