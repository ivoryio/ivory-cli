import { createApp } from 'frint'
import { RegionService } from 'frint-react'

import MainEntry from './app/MainEntry'

const app = createApp({
  name: 'POD_NAME_LOWER',
  providers: [
    {
      name: 'component',
      useValue: MainEntry
    },
    {
      name: 'region',
      useClass: RegionService
    }
  ]
});

(window.app = window.app || []).push([
  app,
  {
    regions: ['POD_NAME_LOWER']
  }
])
