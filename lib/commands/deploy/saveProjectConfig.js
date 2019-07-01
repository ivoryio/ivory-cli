const AWS = require('aws-sdk')
const { Observable } = require('rxjs')

module.exports = config =>
  Observable.create(observer => {
    AWS.config.credentials = new AWS.SharedIniFileCredentials({
      profile: config.profile
    })

    const parameterName = 'ivory-config'
    const ssm = new AWS.SSM({ apiVersion: '2014-11-06', region: config.region })

    ssm.getParameter({ Name: parameterName }, (err, data) => {
      if (err && err.code !== 'ParameterNotFound') {
        return observer.error(err)
      }

      if (err && err.code === 'ParameterNotFound') {
        createNewParameter()
      } else {
        appendToParameter(data.Parameter)
      }
    })

    function createNewParameter () {
      const params = {
        Name: parameterName,
        Type: 'String',
        Value: JSON.stringify({ projects: [config] })
      }
      ssm.putParameter(params, (err, _) => {
        if (err) {
          return observer.error(err)
        }

        observer.next()
        observer.complete()
      })
    }

    function appendToParameter (parameter) {
      try {
        const parameterValue = JSON.parse(parameter.Value)
        parameterValue.projects.push(config)

        const params = {
          Name: parameterName,
          Type: 'String',
          Overwrite: true,
          Value: JSON.stringify(parameterValue)
        }
        ssm.putParameter(params, (err, _) => {
          if (err) {
            return observer.error(err)
          }

          observer.next()
          observer.complete()
        })
      } catch (err) {
        observer.error(err)
      }
    }
  })
