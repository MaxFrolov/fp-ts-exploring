import * as React from 'react'
// layouts
import { MainLayout } from '@md-layouts/main'
// containers
import { IOContainer } from '@md-containers/training/io'
import { IOEContainer } from '@md-containers/training/ioe'
import { UsageContainer } from '@md-containers/training/usage'

const TrainingPage = () => {
  return (
    <MainLayout>
      <IOContainer />
      <IOEContainer />
      <UsageContainer />
    </MainLayout>
  )
}

export { TrainingPage }
