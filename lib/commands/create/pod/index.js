const { concatMap } = require('rxjs/operators')

const scaffold = require('./scaffold')
const wire = require('./wire')
const checkIsIvoryApp = require('../../checkIsIvoryApp')
const inquirePodName = require('./inquirePodName')

module.exports = () => {
  return checkIsIvoryApp()
    .pipe(
      concatMap(() => inquirePodName()),
      concatMap((podName) => scaffold(podName)),
      concatMap((podName) => wire(podName))
    )
}
