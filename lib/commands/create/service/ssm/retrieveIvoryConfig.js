const AWS = require('aws-sdk')
const { Observable } = require('rxjs')

module.exports = projectProperties =>
  Observable.create(observer => {
    const { region } = projectProperties
    if (!region) {
      return observer.complete()
    }

    const ssm = new AWS.SSM({ region })
    const params = { Name: 'ivory-config' }

    ssm.getParameter(params, (err, data) => {
      if (err) {
        return observer.error(new Error(err))
      }

      observer.next({
        ...projectProperties,
        ivoryConfig: JSON.parse(data.Parameter.Value)
      })
      observer.complete()
    })
  })
