import * as React from 'react'
// components
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
// pages
import { DocumentationPage } from '@md-pages/documentation'
import { DiagramsPage } from '@md-pages/diagrams'
import { TrainingPage } from '@md-pages/training'

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
    </Switch>
  </Router>
)

export default App
