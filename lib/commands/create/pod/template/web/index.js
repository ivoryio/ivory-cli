import React from 'react'
import { createApp } from 'frint'
import { RegionService } from 'frint-react'
import { ThemeConsumer } from 'styled-components'

import Entry from './apps/POD_NAME/Entry'

const entries = [
  { name: 'POD_NAME', Component: Entry, regions: ['POD_NAME_LOWER'] }
]

entries.forEach(entry => {
  const App = createApp({
    name: entry.name,
    providers: [
      {
        name: 'component',
        useFactory () {
          return () => {
            const { Component } = entry
            return (
              <ThemeConsumer>
                {theme => <Component theme={theme} />}
              </ThemeConsumer>
            )
          }
        }
      },
      {
        name: 'region',
        useClass: RegionService // `useClass` because `RegionService` will be instantiated
      }
    ]
  })
  ;(window.app = window.app || []).push([App, { regions: entry.regions }])
})
