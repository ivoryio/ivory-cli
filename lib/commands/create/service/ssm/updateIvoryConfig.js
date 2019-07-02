const AWS = require('aws-sdk')
const { Observable } = require('rxjs')

module.exports = config =>
  Observable.create(observer => {
    const {
      region,
      projectName,
      repositorySshUrl,
      serviceName,
      ivoryConfig
    } = config
    const ssm = new AWS.SSM({ region })

    try {
      const index = ivoryConfig.projects.findIndex(
        project => project.projectName === projectName
      )

      ivoryConfig.projects[index].components.push({
        type: 'service',
        repositorySshUrl,
        name: serviceName
      })

      updateIvoryConfig(ivoryConfig)
    } catch (err) {
      observer.error(err)
    }

    function updateIvoryConfig (config) {
      const params = {
        Type: 'String',
        Overwrite: true,
        Value: JSON.stringify(config),
        Name: 'ivory-config'
      }
      ssm.putParameter(params, err => {
        if (err) {
          return observer.error(err)
        }
        observer.next()
        observer.complete()
      })
    }
  })
