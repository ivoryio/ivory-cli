const StateMachine = require('javascript-state-machine')

module.exports = new StateMachine({
  init: 'welcome',
  data: {
    projectName: null,
    awsCredentials: {
      region: null,
      profile: null
    },
    error: {
      code: null,
      message: null
    }
  },
  transitions: [
    { name: 'toProjectName', from: 'welcome', to: 'projectName' },
    { name: 'toDefaultAWSProfile', from: 'projectName', to: 'defaultAWSProfile' },
    { name: 'toNamedAWSProfile', from: 'projectName', to: 'namedAWSProfile' },
    { name: 'toAWSRegion', from: 'defaultAWSProfile', to: 'awsRegion' },
    { name: 'toAWSRegion', from: 'namedAWSProfile', to: 'awsRegion' },
    { name: 'completeWithSuccess', from: 'awsRegion', to: 'success' },
    { name: 'completeWithError', from: '*', to: 'error' }
  ],
  methods: {
    onTransition: function (lifecycle, data) {
      switch (lifecycle.to) {
        case 'projectName': {
          this.projectName = data
          break
        }
        case 'awsRegion': {
          this.awsCredentials.region = data
          break
        }
        case 'defaultAWSProfile': {
          this.awsCredentials.profile = 'default'
          break
        }
        case 'namedAWSProfile': {
          this.awsCredentials.profile = data
          break
        }
        case 'error': {
          this.error = {
            code: data.code,
            message: data.message
          }
        }
      }
    }
  }
})
