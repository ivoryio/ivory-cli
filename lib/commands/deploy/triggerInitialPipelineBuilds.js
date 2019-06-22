const AWS = require('aws-sdk')
const shell = require('shelljs')
const { Observable, concat } = require('rxjs')
const { concatMap, tap } = require('rxjs/operators')

module.exports = log => config =>
  Observable.create(observer => {
    AWS.config.credentials = new AWS.SharedIniFileCredentials({
      profile: config.profile
    })

    const helloTemplateComponents = [
      {
        current: 'user',
        previous: null
      },
      {
        current: 'greeter',
        previous: 'user'
      },
      {
        current: 'data-gateway',
        previous: 'greeter'
      },
      {
        current: 'web',
        previous: 'data-gateway'
      }
    ]

    const tasks = helloTemplateComponents.map(comp => createTask(comp))

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

          const params = {
            StackName: `${config.projectName}-${component.current}-ci-cd`
          }

          cloudformation.describeStacks(params, (err, data) => {
            if (err) {
              observer.error(err)
              return
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

      function gitInitialCommitPush (repositorySshUrl) {
        return Observable.create(observer => {
          const moveUp = moveToDirectory()

          console.info(repositorySshUrl)

          const cmd = `git remote add origin ${repositorySshUrl} && \
git add . && \
git commit -m 'Initial Ivory commit' && \
git push --set-upstream origin master
`
          shell.exec(cmd, { silent: true }, (code, _, stderr) => {
            if (code !== 0) {
              return observer.error(new Error(stderr))
            }
            shell.cd(moveUp)
            observer.next()
            observer.complete()
          })
        })

        function moveToDirectory () {
          let moveUp

          if (
            shell.test('-e', `${shell.pwd()}/services/${component.current}`)
          ) {
            shell.cd(`${shell.pwd()}/services/${component.current}`)
            moveUp = '../..'
          } else {
            shell.cd(`${shell.pwd()}/${component.current}`)
            moveUp = '..'
          }

          return moveUp
        }
      }

      function logTriggerPipeline () {
        log.text = `Running pipeline for ${component.current}...`
        log.start()
      }
    }
  })
