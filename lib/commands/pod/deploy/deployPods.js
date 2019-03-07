const ora = require('ora')
const clc = require('cli-color')
const { Subject } = require('rxjs')
const inquirer = require('inquirer')

const deployPod = require('./deployPod')

module.exports = function (projectProperties) {
  return new Promise((resolve, reject) => {
    const subject = new Subject()
    inquirer.prompt(subject).ui.process.subscribe(onAnswer, onError, onComplete)

    let choices = [{ name: 'All', value: 'all' }].concat(projectProperties.pods.map(pod => ({ name: pod, value: pod })))

    subject.next({
      type: 'list',
      name: 'pod',
      message: 'What Pod microservices do you want to deploy:',
      choices: choices
    })

    function onAnswer(answer) {
      if (answer.answer === 'all') {
        let podsNotDeployed = []
        let log = ora(`Deploying pods ...`).start()

        const podDeployTasks = projectProperties.pods.map(podName =>
          deployPod(projectProperties, podName).catch(err => {
            podsNotDeployed.push(podName)
            log.fail(`Failed to deploy ${podName}`)
            process.stdout.write(clc.red(`${err.message}\n`))
            log = ora(`Deploying pods ...`).start()
          })
        )

        Promise.all(podDeployTasks)
          .then(() => {
            if (podsNotDeployed.length) {
              log.warn()
              subject.error(new Error(`The following Pod microservices were not deployed: ${podsNotDeployed.join(',')}.`))
            } else {
              log.succeed('All Pod microservices deployed successfully')
              subject.complete()
            }
          })
          .catch((err) => {
            log.fail()
            subject.error(err)
          })

      } else {
        const podName = answer.answer
        const log = ora(`Deploying ${podName} ...`).start()

        deployPod(projectProperties, podName)
          .then(() => {
            log.succeed(`${podName} successfully deployed.`)
            subject.complete()
          })
          .catch((err) => {
            log.fail()
            subject.error(err)
          })
      }
    }

    function onError(err) {
      reject(err)
    }

    function onComplete() {
      resolve()
    }
  })
}
