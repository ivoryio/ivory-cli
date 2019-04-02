const AWS = require('aws-sdk')
const { Observable } = require('rxjs')

module.exports = (projectProperties) => Observable.create((observer) => {
  const { credentials } = projectProperties
  try {
    AWS.config.update({
      region: credentials.region,
      credentials: new AWS.SharedIniFileCredentials({ profile: credentials.profile })
    })

    var route53domains = new AWS.Route53Domains()

    route53domains.listDomains({}, (err, data) => {
      if (err) {
        return observer.error(err)
      }

      observer.next({
        ...projectProperties,
        domains: data.Domains.map((d) => d.DomainName)
      })
      observer.complete()
    })
  } catch (err) {
    observer.error(err)
  }
})
