import React, { createContext, useState } from 'react'
import { API } from 'aws-amplify'
import PropTypes from 'prop-types'
import { map } from 'rxjs/operators'
import { observe } from 'frint-react'

export const Context = createContext({})

const Provider = ({ children, theme, regionData }) => {
  const { Provider } = Context
  const [message, setMessage] = useState('')

  const fetchMessage = async () => {
    const response = await API.get('POD_NAME_LOWER', '/message')
    setMessage(response.message)
  }

  return (
    <Provider
      value={{
        message,
        fetchMessage,
        theme
      }}
    >
      <div>{children}</div>
    </Provider>
  )
}

const ObservedProvider = observe((app, props$) => {
  const region = app.get('region')
  const regionData$ = region
    .getData$()
    .pipe(map(regionData => ({ regionData })))
  return regionData$
})(Provider)

ObservedProvider.propTypes = {
  regionData: PropTypes.object
}

export default ObservedProvider
