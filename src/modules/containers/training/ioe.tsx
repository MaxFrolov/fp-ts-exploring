import * as React from 'react'
// views
import { ModuleContainer, Title } from '@md-views'
// components
import { CodeBlock } from '@md-components/code-block'

const ioeTx = `
import { Monad2 } from 'fp-ts/lib/Monad'
import * as IO from './io'
import * as EI from 'fp-ts/lib/Either'
import * as EIT from 'fp-ts/lib/EitherT'
import { Bifunctor2 } from 'fp-ts/lib/Bifunctor'
import { Alt2 } from 'fp-ts/lib/Alt'
import { MonadThrow2 } from 'fp-ts/lib/MonadThrow'
import { pipeable } from 'fp-ts/lib/pipeable'

/**
 * Training module, models an IO operation that can fail and can be sync or async
 */

export const IoeURI = '@training/IOE'

export type IoeURI = typeof IoeURI

export type IOE<E, A> = IO.IO<EI.Either<E, A>>

declare module 'fp-ts/lib/HKT' {
  interface URItoKind2<E, A> {
    [IoeURI]: IOE<E, A>
  }
}

/**
 * We use getEitherM from the either transformer implementation
 * this takes a Monad1<F> and transformes it into a generic extension
 * that matches Monad2<G> and others (highlight for details)
 */
const M = EIT.getEitherM(IO.io)

export interface IOEMonad extends Monad2<IoeURI>, Bifunctor2<IoeURI>, Alt2<IoeURI>, MonadThrow2<IoeURI> {}

export const ioe: IOEMonad = {
  URI: IoeURI,
  alt: M.alt,
  ap: M.ap,
  bimap: M.bimap,
  chain: M.chain,
  map: M.map,
  mapLeft: M.mapLeft,
  of: M.of,
  throwError: M.left
}

export const {
  alt,
  ap,
  apFirst,
  apSecond,
  bimap,
  chain,
  chainFirst,
  filterOrElse,
  flatten,
  fromEither,
  fromOption,
  fromPredicate,
  map,
  mapLeft
} = pipeable(ioe)

export const pure = <A = unknown>(a: A): IOE<never, A> => IO.pure(EI.right(a))

export const raise = <E>(e: E): IOE<E, never> => IO.pure(EI.left(e))

export const async = <E = never, A = unknown>(io: () => Promise<A>, onError: (e: any) => E): IOE<E, A> =>
  IO.async(() =>
    io()
      .then(a => Promise.resolve(EI.right(a)))
      .catch(e => Promise.resolve(EI.left(onError(e))))
  )

export const asyncTotal = <A = unknown>(io: () => Promise<A>): IOE<never, A> =>
  IO.async(() => io().then(a => Promise.resolve(EI.right(a))))

export const run = <E, A>(io: IOE<E, A>): () => Promise<EI.Either<E, A>> => IO.run(io)
`

const IOEContainer = () => (
  <ModuleContainer>
    <Title>IOE</Title>
    <CodeBlock label='(IO with Either) implementation' codeTx={ioeTx} />
  </ModuleContainer>
)

export { IOEContainer }
