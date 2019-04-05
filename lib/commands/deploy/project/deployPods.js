const { Observable, concat } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const deployPod = require('../../deploy/pod/deployPod')
const readProjectProperties = require('../../readProjectProperties')

module.exports = (pods) => readProjectProperties().pipe(
  concatMap(createDeploymentTasks(pods)),
  concatMap(queueTasks)
)

const createDeploymentTasks = (pods) => (projectProperties) => Observable.create(observer => {
  const userPod = pods.splice(pods.indexOf('user'), 1)
  if (userPod) {
    pods.unshift('user')
  }

  const tasks = pods.map(podName => deployPod(podName))

  observer.next(tasks)
  observer.complete()
})

const queueTasks = (tasks) => concat(...tasks)
