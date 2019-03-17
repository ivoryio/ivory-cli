const { concatMap } = require('rxjs/operators')

const scaffold = require('./scaffold')
const wire = require('./wire')
const inquirePodName = require('./inquirePodName')
const checkPrerequisites = require('../../checkPrerequisites')

module.exports = (log) => {
  return inquirePodName()
    .pipe(
      concatMap((podName) => checkPrerequisites(podName)),
      concatMap((podName) => scaffold(podName)),
      concatMap((podName) => wire(podName)))
}
