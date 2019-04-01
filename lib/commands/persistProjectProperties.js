const fs = require('fs')
const { Observable } = require('rxjs')

module.exports = projectProperties => Observable.create((observer) => {
  fs.writeFile('./.ivory.json', generateFileContent(), (err) => {
    if (err) {
      return observer.error(err)
    }
    observer.next()
    observer.complete()
  })

  function generateFileContent () {
    const properties = {
      ...projectProperties
    }
    return `${JSON.stringify(properties, null, 4)}\n`
  }
})
