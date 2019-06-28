const AWS = require('aws-sdk')
const { Observable } = require('rxjs')

module.exports = config =>
  Observable.create(observer => {
    AWS.config.credentials = new AWS.SharedIniFileCredentials({
      profile: config.profile
    })

    const params = { Name: 'ivory-config' }
    const ssm = new AWS.SSM({ apiVersion: '2014-11-06', region: config.region })

    ssm.getParameter(params, (err, data) => {
      if (err) {
        return observer.error(err)
      }

      try {
        const ivoryConfig = JSON.parse(data.Parameter.Value)

        if (ivoryConfig.projects.length === 0) {
          return observer.error(new Error(
            `No Ivory projects deployed in ${config.region} for AWS profile: ${
              config.profile
            }`)
          )
        }

        observer.next(ivoryConfig)
        observer.complete()
      } catch (err) {
        return observer.error(err)
      }
    })
  })
