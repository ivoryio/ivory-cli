const fs = require('fs')
const { Observable } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const checkIsIvoryApp = require('./checkIsIvoryApp')

module.exports = () => checkIsIvoryApp().pipe(
  concatMap(readProjectProperties)
)

const readProjectProperties = () => Observable.create((observer) => {
  fs.readFile('.ivory.json', 'utf8', function (err, data) {
    if (err) {
      observer.error(err)
    }

    try {
      const projectProperties = JSON.parse(data)
      observer.next(projectProperties)
      observer.complete()
    } catch (err) {
      observer.error(new Error("Couldn't parse .ivory.json. Make sure the file has not been tempered with."))
    }
  })
})
