import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import { Context } from '../services/Provider'

const Hello = () => {
  const { message, fetchMessage } = useContext(Context)

  useEffect(() => {
    fetchMessage()
  }, [])

  return (
    <Container>
      <Header>
        {message} POD_NAME
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

export default Hello
