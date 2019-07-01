const AWS = require('aws-sdk')
const { Observable } = require('rxjs')

module.exports = projectProperties =>
  Observable.create(observer => {
    const { region } = projectProperties
    if (!region) {
      observer.complete()

      return
    }

    const ssm = new AWS.SSM({ region })
    const params = { Name: 'ivory-config' }

    ssm.getParameter(params, (err, data) => {
      if (err) {
        observer.error(new Error(err))

        return
      }

      observer.next({
        ...projectProperties,
        ivoryConfig: JSON.parse(data.Parameter.Value)
      })
      observer.complete()
    })
  })
