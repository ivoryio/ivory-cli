const { concatMap } = require('rxjs/operators')

const scaffold = require('./scaffold')
const wire = require('./wire')
const checkIvoryProject = require('../../checkIvoryProject')
const inquirePodName = require('./inquirePodName')
const checkPrerequisites = require('../../checkAWSCLI')

module.exports = () => {
  return checkIvoryProject()
    .pipe(
      concatMap(() => inquirePodName()),
      concatMap((podName) => checkPrerequisites(podName)),
      concatMap((podName) => scaffold(podName)),
      concatMap((podName) => wire(podName))
    )
}
