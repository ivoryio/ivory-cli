import React, { createContext, useState } from 'react'
import { API } from 'aws-amplify'
import PropTypes from 'prop-types'
import { map } from 'rxjs/operators'
import { observe } from 'frint-react'

export const Context = createContext({})

const Provider = ({ children, theme }) => {
  const [message, setMessage] = useState('')

  const fetchMessage = async () => {
    try {
      const response = await API.get('POD_NAME_LOWER', '/message')
      setMessage(response.message)
    } catch (err) {
      console.error("* Error caught in Provider's fetchMessage", err)
    }
  }

  return (
    <Context.Provider
      value={{
        message,
        fetchMessage,
        theme
      }}
    >
      {children}
    </Context.Provider>
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

Provider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  theme: PropTypes.object
}

export default ObservedProvider
