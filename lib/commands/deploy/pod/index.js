const { concatMap } = require('rxjs/operators')

const deployPod = require('./deployPod')
const detectPods = require('../../detectPods')
const inquireWhatPodToDeploy = require('./inquireWhatPodToDeploy')

module.exports = (log) => detectPods().pipe(
  concatMap(inquireWhatPodToDeploy),
  concatMap(deployPod(log))
)
