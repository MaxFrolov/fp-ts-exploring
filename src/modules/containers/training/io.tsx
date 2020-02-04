import * as React from 'react'
// views
import { ModuleContainer, Title } from '@md-views'
// components
import { CodeBlock } from '@md-components/code-block'

const ioTx = `
import { Monad1 } from 'fp-ts/lib/Monad'

/**
 *  Training module, models an IO operation that can't fail and can be sync or async
 */

export const IoURI = '@training/IO'

export type IoURI = typeof IoURI

export type IO<A> = { _tag: 'sync'; io: () => A } | { _tag: 'async'; io: () => Promise<A> }

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    [IoURI]: IO<A>
  }
}

export type IOMonad = Monad1<IoURI>

const chain_: <A, B>(fa: IO<A>, f: (a: A) => IO<B>) => IO<B> = (fa, f) =>
  fa._tag === 'sync'
    ? f(fa.io())
    : {
      _tag: 'async',
      io: () =>
        fa.io().then(a => {
          const r = f(a)
          return r._tag === 'sync' ? Promise.resolve(r.io()) : r.io()
        })
    }

const map_: <A, B>(fa: IO<A>, f: (a: A) => B) => IO<B> = (fa, f) =>
  fa._tag === 'sync'
    ? { _tag: 'sync', io: () => f(fa.io()) }
    : { _tag: 'async', io: () => fa.io().then(a => Promise.resolve(f(a))) }

export const io: IOMonad = {
  URI: IoURI,
  of: a => ({ _tag: 'sync', io: () => a }),
  map: map_,
  chain: chain_,
  ap: (fab, fa) => chain_(fa, a => map_(fab, f => f(a)))
}

export const run = <A>(io: IO<A>): (() => Promise<A>) => () => (io._tag === 'sync' ? Promise.resolve(io.io()) : io.io())

export const pure = <A>(a: A): IO<A> => ({ _tag: 'sync', io: () => a })

export const async = <A>(io: () => Promise<A>): IO<A> => ({ _tag: 'async', io })
`

const IOContainer = () => (
  <ModuleContainer>
    <Title>IO</Title>
    <CodeBlock label='custom implementation' codeTx={ioTx} />
  </ModuleContainer>
)

export { IOContainer }
