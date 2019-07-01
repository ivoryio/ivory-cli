const AWS = require('aws-sdk')
const { Observable } = require('rxjs')

module.exports = projectProperties =>
  Observable.create(observer => {
    const { region, projectName } = projectProperties
    if (!region) {
      observer.next(projectProperties)
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
      const props = JSON.parse(data.Parameter.Value).projects.find(
        project => project.projectName === projectName
      )

      if (!props) {
        observer.error(
          new Error(`No ${projectName} project in the ivory-config parameters`)
        )
        return
      }

      observer.next(props)
      observer.complete()
    })
  })
