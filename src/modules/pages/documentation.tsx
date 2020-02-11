import * as React from 'react'
// containers
import { FunctionContainer } from '@md-containers/fp-ts/function'
import { OptionContainer } from '@md-containers/fp-ts/option'
import { EitherContainer } from '@md-containers/fp-ts/either'
import { ArrayContainer } from '@md-containers/fp-ts/array'
import { TaskContainer } from '@md-containers/fp-ts/task'
import { TaskEitherContainer } from '@md-containers/fp-ts/taskEither'
import { EqContainer } from '@md-containers/fp-ts/eq'
import { OrdContainer } from '@md-containers/fp-ts/ord'
import { SemigroupContainer } from '@md-containers/fp-ts/semigroup'
import { ValidationContainer } from '@md-containers/fp-ts/validation'
import { FunctorContainer } from '@md-containers/fp-ts/functor'
import { MonadContainer } from '@md-containers/fp-ts/monad'
import { MonoidContainer } from '@md-containers/fp-ts/monoid'
import { TraversableContainer } from '@md-containers/fp-ts/traversable'
import { FoldableContainer } from '@md-containers/fp-ts/foldable'
import { ApplyContainer } from '@md-containers/fp-ts/apply'
import { ReaderContainer } from '@md-containers/fp-ts/reader'
import { RecordContainer } from '@md-containers/fp-ts/record'
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
    <RecordContainer />
  </MainLayout>
)

export { DocumentationPage }
