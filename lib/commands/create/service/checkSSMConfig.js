const AWS = require('aws-sdk')
const { Observable } = require('rxjs')

module.exports = projectProperties =>
  Observable.create(observer => {
    if (!projectProperties.region) {
      observer.next(projectProperties)
      observer.complete()

      return
    }

    const ssm = new AWS.SSM({ region: projectProperties.region })
    const params = { Name: 'ivory-config' }

    ssm.getParameter(params, (err, data) => {
      if (err) {
        observer.error(new Error(err))

        return
      }

      observer.next(data)
      observer.complete()
    })
  })
