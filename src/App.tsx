import * as React from 'react'
// libs
import styled from 'styled-components'
// containers
import { FunctionContainer } from '@md-containers/function'
import { OptionContainer } from '@md-containers/option'
import { EitherContainer } from '@md-containers/either'
import { ArrayContainer } from '@md-containers/array'
import { TaskContainer } from '@md-containers/task'
import { TaskEitherContainer } from '@md-containers/taskEither'
import { EqContainer } from '@md-containers/eq'
import { OrdContainer } from '@md-containers/ord'
import { SemigroupContainer } from '@md-containers/semigroup'
import { ValidationContainer } from '@md-containers/validation'
// components
import { SideBar } from '@md-components/side-bar'

const ContentContainer = styled.div`
  padding: 1px 30px 20px calc(115px + 8vmin);
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

const App = () => (
  <div className='App'>
    <SideBar />
    <ContentContainer className='App-header'>
      <FunctionContainer />
      <OptionContainer />
      <EitherContainer />
      <ArrayContainer />
      <TaskContainer />
      <TaskEitherContainer />
      <EqContainer />
      <OrdContainer />
      <SemigroupContainer />
      <ValidationContainer />
    </ContentContainer>
  </div>
)

export default App
