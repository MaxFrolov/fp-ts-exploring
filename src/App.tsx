import * as React from 'react'
// containers
import { FunctionContainer } from '@md-containers/function'
import { OptionContainer } from '@md-containers/option'
import { EitherContainer } from '@md-containers/either'
import { ArrayContainer } from '@md-containers/array'
import { TaskContainer } from '@md-containers/task'
// styles
import './App.css'

const App = () => (
  <div className='App'>
    <header className='App-header'>
      <FunctionContainer />
      <OptionContainer />
      <EitherContainer />
      <ArrayContainer />
      <TaskContainer />
    </header>
  </div>
)

export default App
