import React from 'react'
import { ThemeConsumer } from 'styled-components'

import Hello from './screens/Hello'
import Provider from './services/Provider'

const MainEntry = () => (
  <ThemeConsumer>
    {theme => (
      <Provider theme={theme}>
        <Hello />
      </Provider>
    )}
  </ThemeConsumer>
)

export default MainEntry
