import * as React from 'react'
// components
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
// pages
import { DocumentationPage } from '@md-pages/documentation'
import { DiagramsPage } from '@md-pages/diagrams'
import { TrainingPage } from '@md-pages/training'
import { Example } from '@md-containers/training/example'

const App = () => (
  <Router>
    <Switch>
      <Route path='/' exact>
        <DocumentationPage />
      </Route>
      <Route path='/diagrams'>
        <DiagramsPage />
      </Route>
      <Route path='/training'>
        <TrainingPage />
      </Route>
      <Route path='/example'>
        <Example />
      </Route>
    </Switch>
  </Router>
)

export default App
