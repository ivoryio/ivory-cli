const { Observable, iif } = require('rxjs')
const { concatMap } = require('rxjs/operators')

const deleteProject = require('./deleteProject')
const inquireWarning = require('./inquireWarning')

module.exports = (log) => {
  let isDelete

  const abortDelete = () => Observable.create((observer) => {
    observer.error(new Error('No action proceded.'))
  })

  return inquireWarning(log).pipe(
    concatMap(answer => {
      isDelete = answer.toLowerCase() === 'delete'
      return iif(
        () => isDelete,
        deleteProject(),
        abortDelete()
      )
    })
  )
}