import * as React from 'react'
// view components
import { SideBar } from '@md-components/side-bar'
// libs
import styled from 'styled-components'

const ContentContainer = styled.div`
  padding: 1px 30px 20px 165px;
  background-color: #282c34;
  min-height: 100vh;
  font-size: calc(10px + 2vmin);
  color: white;

  pre {
    margin: 0;
  }

  code {
    font-size: calc(5px + 2vmin);
  }
`

const MainLayout: React.FC = ({ children }) => (
  <>
    <SideBar />
    <ContentContainer className='App-header'>{children}</ContentContainer>
  </>
)

export { MainLayout }
