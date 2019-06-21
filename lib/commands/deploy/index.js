const ora = require('ora')
const clc = require('cli-color')
const AWS = require('aws-sdk')
const { Observable } = require('rxjs')

const { concatMap } = require('rxjs/operators')

const inquireRegion = require('./inquireRegion')
const inquireProfile = require('./inquireProfile')
const deployCICDStacks = require('./deployCICDStacks')
const checkIsIvoryProject = require('../checkIsIvoryApp')
const checkPrerequisites = require('../checkPrerequisites')

module.exports = () => {
  const log = ora('')

  checkIsIvoryProject()
    .pipe(
      concatMap(checkPrerequisites),
      concatMap(inquireRegion),
      concatMap(inquireProfile),
      concatMap(deployCICDStacks),
      concatMap(configureRepositories)
    )
    .subscribe(onNext, onError, onComplete)

  function onNext () {}

  function onError (err) {
    log.fail('Failed!')
    process.stdout.write(clc.red(`Reason: ${err.message}\n`))
  }

  function onComplete () {
    log.succeed(clc.green('Done!'))
  }
}

const configureRepositories = (config) => Observable.create(observer => {
  const cloudformation = new AWS.CloudFormation({
    region: config.region
  })
  const params = {
    StackName : `lactiss-user-ci-cd-stack`
  }

  cloudformation.describeStacks(params, (err, data) => {
    if(err) {
      observer.error(err)
      return
    }
    const output = data.Stacks[0].Outputs.find(output => output.OutputKey === 'repositorysshurl')
    if(!output) {
      observer.error(new Error(`No repositorysshurl in stack ${params.StackName} output`))
      return
    }
    
  })

})