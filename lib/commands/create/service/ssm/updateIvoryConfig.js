const AWS = require('aws-sdk')
const { Observable } = require('rxjs')

module.exports = config =>
  Observable.create(observer => {
    const ssm = new AWS.SSM({ region: config.region })
    const { projectName, repositorySshUrl, serviceName, ivoryConfig } = config

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
          observer.error(err)
          return
        }
        observer.next()
        observer.complete()
      })
    }
  })
