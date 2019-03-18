const { concatMap, tap } = require('rxjs/operators')

const deployPod = require('./deployPod')
const detectPods = require('./detectPods')
const validateProperties = require('./validateProperties')
const checkPrerequisites = require('../../checkPrerequisites')
const readProjectProperties = require('../../readProjectProperties')
const inquireWhatPodToDeploy = require('./inquireWhatPodToDeploy')

module.exports = (log) => {
  return checkPrerequisites().pipe(
    concatMap(() => readProjectProperties()),
    concatMap((projectProperties) => validateProperties(projectProperties)),
    concatMap((projectProperties) => detectPods(projectProperties)),
    concatMap((projectProperties) => inquireWhatPodToDeploy(projectProperties)),
    tap((context) => {
      log.text = `Deploying ${context.podName}`
      log.start()
    }),
    concatMap((context) => deployPod(context))
  )
}
