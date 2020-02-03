import * as React from 'react'
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
import { FunctorContainer } from '@md-containers/functor'
import { MonadContainer } from '@md-containers/monad'
import { MonoidContainer } from '@md-containers/monoid'
import { TraversableContainer } from '@md-containers/traversable'
import { FoldableContainer } from '@md-containers/foldable'
import { ApplyContainer } from '@md-containers/apply'
import { ReaderContainer } from '@md-containers/reader'
// components
import { MainLayout } from '@md-layouts/main'

const DocumentationPage = () => (
  <MainLayout>
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
    <FunctorContainer />
    <MonadContainer />
    <MonoidContainer />
    <FoldableContainer />
    <TraversableContainer />
    <ApplyContainer />
    <ReaderContainer />
  </MainLayout>
)

export { DocumentationPage }
