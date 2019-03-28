const { concatMap, tap } = require('rxjs/operators')

const deployPod = require('./deployPod')
const detectPods = require('../../detectPods')
const validateProperties = require('./validateProperties')
const readProjectProperties = require('../../readProjectProperties')
const inquireWhatPodToDeploy = require('./inquireWhatPodToDeploy')

module.exports = (log) => readProjectProperties().pipe(
  concatMap((projectProperties) => validateProperties(projectProperties)),
  concatMap((projectProperties) => detectPods(projectProperties)),
  concatMap((projectProperties) => inquireWhatPodToDeploy(projectProperties)),
  tap((context) => {
    const bucketLocation = context.projectProperties.buildArtifactsBucket.location
    const msg = `1.Lambda source code is uploaded to S3 (${bucketLocation}).\n 2.CloudFormation stack is created/updated.\n 3.AWS Amplify is configured based on the stack outputs.`
    log.text = `Deploying ${context.podName} ...\n ${msg}`
    log.start()
  }),
  concatMap((context) => deployPod(context))
)
