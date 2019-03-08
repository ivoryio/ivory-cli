const ora = require('ora')
const clc = require('cli-color')
const { Subject } = require('rxjs')
const inquirer = require('inquirer')

const deployPod = require('./deployPod')

module.exports = function (projectProperties) {
  return new Promise((resolve, reject) => {
    const subject = new Subject()
    let podsDeployed = []
    let podsNotDeployed = []
    inquirer.prompt(subject).ui.process.subscribe(onAnswer, onError, onComplete)

    let choices = projectProperties.pods.map(pod => ({ name: pod, value: pod }))

    subject.next({
      type: 'list',
      name: 'pod',
      message: 'What Pod microservices do you want to deploy:',
      choices: choices
    })

    function onAnswer (answer) {
      const podName = answer.answer
      const log = ora(`Deploying ${podName} ...`).start()

      deployPod(projectProperties, podName)
        .then(() => {
          podsDeployed.push(podName)
          log.succeed(`${podName} successfully deployed.`)
          subject.complete()
        })
        .catch((err) => {
          log.fail()
          subject.error(err)
        })
    }

    function onError (err) {
      reject(err)
    }

    function onComplete () {
      resolve({ projectProperties, podsDeployed, podsNotDeployed })
    }
  })
}
