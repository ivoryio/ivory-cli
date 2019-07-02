const inquirer = require('inquirer')
const { Observable } = require('rxjs')

module.exports = serviceName =>
  Observable.create(observer => {
    const prompt = inquirer.createPromptModule()

    prompt([
      {
        type: 'input',
        name: 'region',
        message:
          'In what region is you project deployed? Leave empty if there is no project deployed',
        validate: region => validateRegion(region)
      }
    ])
      .then(answer => {
        observer.next({ region: answer.region, serviceName })
        observer.complete()

        return
      })
      .catch(err => observer.error(err))

    const validateRegion = region =>
      /^$|^[a-z]+-[a-z]+-[1-3]{1}/g.test(region)
        ? true
        : 'Invalid region format.'
  })
