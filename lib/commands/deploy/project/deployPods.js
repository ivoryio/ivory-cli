const { Observable, concat } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const deployPod = require('../../deploy/pod/deployPod')

module.exports = (pods) => createDeploymentTasks(pods).pipe(
  concatMap(queueTasks)
)

const createDeploymentTasks = (pods) => Observable.create(observer => {
  const userPod = pods.splice(pods.indexOf('user'), 1)
  if (userPod) {
    pods.unshift('user')
  }

  const tasks = pods.map(podName => deployPod(podName))
  observer.next(tasks)
  observer.complete()
})

const queueTasks = (tasks) => concat(...tasks)
