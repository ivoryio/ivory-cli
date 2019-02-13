import { createApp } from 'frint'
import { RegionService } from 'frint-react'

import Hello from './screens/Hello'

export default createApp({
  name: 'POD_NAME',
  providers: [
    {
      name: 'component',
      useValue: Hello
    },
    {
      name: 'region',
      useClass: RegionService
    }
  ]
})
