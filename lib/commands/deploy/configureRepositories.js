const AWS = require('aws-sdk')
const { Observable } = require('rxjs')


module.exports = (config) => Observable.create(observer => {
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