const AWS = require('aws-sdk')
const shell = require('shelljs')
const { Observable, concat } = require('rxjs')
const { concatMap, tap } = require('rxjs/operators')

const templateComponents = require('../templateComponents')

module.exports = log => config =>
  Observable.create(observer => {
    const tasks = templateComponents.map(comp => createTask(comp))

    concat(...tasks).subscribe({
      next: () => {},
      error: err => observer.error(err),
      complete: () => {
        observer.next()
        observer.complete()
      }
    })

    function createTask (component) {
      return waitForPreviousComponent().pipe(
        concatMap(getRepositorySshUrl),
        tap(logInstallDependencies),
        concatMap(installDependencies),
        tap(logTriggerPipeline),
        concatMap(gitInitialCommitPush)
      )

      function waitForPreviousComponent () {
        return Observable.create(observer => {
          if (component.previous) {
            const cloudformation = new AWS.CloudFormation({
              region: config.region
            })

            const params = {
              StackName: `${config.projectName}-${component.previous}-staging`
            }

            const interval = setInterval(() => {
              cloudformation.describeStacks(params, (_, data) => {
                if (data) {
                  clearInterval(interval)

                  cloudformation.waitFor('stackCreateComplete', params, err => {
                    if (err) {
                      return observer.error(err)
                    }

                    observer.next()
                    observer.complete()
                  })
                }
              })
            }, 1000 * 30)
          } else {
            observer.next()
            observer.complete()
          }
        })
      }

      function getRepositorySshUrl () {
        return Observable.create(observer => {
          const cloudformation = new AWS.CloudFormation({
            region: config.region
          })

          let params = {
            StackName: `${config.projectName}-${component.current}-ci-cd`
          }

          if (component.current === 'z-ci-cd') {
            params.StackName = `${config.projectName}-ci-cd`
          }

          cloudformation.describeStacks(params, (err, data) => {
            if (err) {
              return observer.error(err)
            }
            const output = data.Stacks[0].Outputs.find(
              output => output.OutputKey === 'repositorysshurl'
            )
            if (!output) {
              return observer.error(
                new Error(
                  `No repositorysshurl in stack ${params.StackName} output`
                )
              )
            }

            observer.next(output.OutputValue)
            observer.complete()
          })
        })
      }

      function installDependencies (repositorySshUrl) {
        return Observable.create(observer => {
          const moveUp = moveToDirectory(component)

          const cmd = 'npm i'
          shell.exec(cmd, { silent: true }, (code, _, stderr) => {
            if (code !== 0) {
              return observer.error(new Error(stderr))
            }
            shell.cd(moveUp)
            observer.next(repositorySshUrl)
            observer.complete()
          })
        })
      }

      function gitInitialCommitPush (repositorySshUrl) {
        return Observable.create(observer => {
          const moveUp = moveToDirectory(component)

          const cmd = `git remote add origin ${repositorySshUrl} && \
git add . && \
git commit -m 'Initial Ivory commit' && \
git push --set-upstream origin master`
          shell.exec(cmd, { silent: true }, (code, _, stderr) => {
            if (code !== 0) {
              return observer.error(new Error(stderr))
            }
            shell.cd(moveUp)
            observer.next()
            observer.complete()
          })
        })
      }

      function moveToDirectory () {
        let moveUp

        if (shell.test('-e', `${shell.pwd()}/services/${component.current}`)) {
          shell.cd(`${shell.pwd()}/services/${component.current}`)
          moveUp = '../..'
        } else {
          shell.cd(`${shell.pwd()}/${component.current}`)
          moveUp = '..'
        }

        return moveUp
      }

      function logInstallDependencies () {
        log.text = `Installing dependencies for ${component.current}...\n`
        log.start()
      }

      function logTriggerPipeline () {
        log.text = `Running pipeline for ${component.current}...\n`
        log.start()
      }
    }
  })
