const { concatMap, tap } = require('rxjs/operators')

const deployPod = require('./deployPod')
const detectPods = require('./detectPods')
const validateProperties = require('./validateProperties')
const checkIvoryProject = require('../../checkIvoryProject')
const checkAWSCLI = require('../../checkAWSCLI')
const readProjectProperties = require('../../readProjectProperties')
const inquireWhatPodToDeploy = require('./inquireWhatPodToDeploy')

module.exports = (log) => {
  return checkIvoryProject().pipe(
    concatMap(() => checkAWSCLI()),
    concatMap(() => readProjectProperties()),
    concatMap((projectProperties) => validateProperties(projectProperties)),
    concatMap((projectProperties) => detectPods(projectProperties)),
    concatMap((projectProperties) => inquireWhatPodToDeploy(projectProperties)),
    tap((context) => {
      const msg = '1.The lambda source code is uploaded to S3.\n 2.The CloudFormation stack is created or updated\n 3.We configure AWS Amplify with the stack outputs'
      log.text = `Deploying ${context.podName} ...\n ${msg}`
      log.start()
    }),
    concatMap((context) => deployPod(context))
  )
}
