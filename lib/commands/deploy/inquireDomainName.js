const AWS = require('aws-sdk')
const clc = require('cli-color')
const inquirer = require('inquirer')
const { Observable } = require('rxjs')

module.exports = config =>
  Observable.create(observer => {
    AWS.config.credentials = new AWS.SharedIniFileCredentials({
      profile: config.profile
    })

    var route53domains = new AWS.Route53Domains({
      apiVersion: '2014-05-15',
      region: config.region
    })

    let domainName

    route53domains
      .listDomains()
      .promise()
      .then(data => {
        const prompt = inquirer.createPromptModule()
        return prompt([
          {
            type: 'list',
            name: 'domain',
            message: `What domain name should we use?\n \
${clc.red(
  'Make sure to pick a domain that has a * (wildcard) certificate registerd in AWS Certificate Manager!'
)})`,
            choices: data.Domains.map(domain => ({
              name: domain.DomainName,
              value: domain.DomainName
            }))
          }
        ])
      })
      .then(data => {
        domainName = data.domain
        const prompt = inquirer.createPromptModule()
        const message = `We will create two A Records \
(app.${data.domain} and staging.${data.domain})? Should we create them?\n \
If not you will be able to access the app using the CloudFront DNS`
        return prompt([
          {
            type: 'confirm',
            name: 'createARecords',
            message
          }
        ])
      })
      .then(data => {
        const { createARecords } = data
        if (createARecords) {
          observer.next({ ...config, createARecords, domainName })
          return observer.complete()
        } else {
          observer.next({ ...config, createARecords })
          return observer.complete()
        }
      })
      .catch(err => {
        observer.error(err)
      })
  })
