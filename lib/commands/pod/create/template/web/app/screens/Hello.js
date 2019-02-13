import React from 'react'
import { map } from 'rxjs/operators'
import { observe } from 'frint-react'
import styled from 'styled-components'

const Hello = () => {
  return (
    <Container>
      <Header>
        Hello POD_NAME!
      </Header>
    </Container>
  )
}

const Container = styled.div`
  text-align: center;
  margin-block-start: 80px;
`

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #282c34;
  font-size: calc(10px + 2vmin);
  color: white;
`

const ObservedGreeter = observe((app) => {
  const region = app.get('region')
  const regionData$ = region
    .getData$()
    .pipe(map(regionData => ({ regionData })))
  return regionData$
})(Hello)

export default ObservedGreeter
