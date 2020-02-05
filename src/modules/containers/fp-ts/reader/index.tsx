import * as React from 'react'
// view components
import { CodeBlock } from '@md-components/code-block'
// views
import { ModuleContainer, Title } from '@md-views'
// libs
import * as R from 'fp-ts/lib/Reader'
import { pipe } from 'fp-ts/lib/pipeable'
import { monoidSum } from 'fp-ts/lib/Monoid'
import { semigroupSum } from 'fp-ts/lib/Semigroup'

export const ReaderContainer = () => {
  // commonTypes
  const commonTypesTx = `
  declare module './HKT' {
    interface URItoKind2<E, A> {
      Reader: Reader<E, A>
    }
  }
  
  export const URI = 'Reader'
  export type URI = typeof URI
  
  export interface Reader<R, A> {
    (r: R): A
  }
  `

  // commonConstants
  const commonConstantsTx = `
  import { identity } from 'fp-ts/lib/Identity'
  import { getReaderM } from 'fp-ts/lib/ReaderT'
  
  const T = getReaderM(identity)
  
  const ask: <R>() => Reader<R, R> = T.ask
  
  const asks: <R, A>(f: (r: R) => A) => Reader<R, A> = T.asks
  
  const of: <R, A>(a: A) => Reader<R, A> = T.of
  `

  // local
  const localTx = `
  function local<Q, R>(f: (d: Q) => R): <A>(ma: Reader<R, A>) => Reader<Q, A> {
    return ma => T.local(ma, f)
  }
  
  /* examples */
  
  import { pipe } from 'fp-ts/lib/pipeable'
  
  const read = pipe(
    (s: string) => s.length,
    local((e: { name: string }}) => e.name)
  )
   
  read({ name: 'abc' }) // ${pipe(
    (s: string) => s.length,
    R.local((e: { name: string }) => e.name)
  )({ name: 'abc' })}
  `

  // getSemigroup
  const getSemigroupTx = `
  function getSemigroup<R, A>(S: Semigroup<A>): Semigroup<Reader<R, A>> {
    return {
      concat: (x, y) => e => S.concat(x(e), y(e))
    }
  }
  
  /* examples */
  
  import * as R from 'fp-ts/lib/Reader'
  import { semigroupSum } from 'fp-ts/lib/Semigroup'

  const S = getSemigroup(semigroupSum)
  
  S.concat(R.reader.of(1), R.reader.of(2))({}) // ${R.getSemigroup(semigroupSum).concat(
    R.reader.of(1),
    R.reader.of(2)
  )({})}
  `

  // getMonoid
  const M = R.getMonoid(monoidSum)

  const getMonoidTx = `
  function getMonoid<R, A>(M: Monoid<A>): Monoid<Reader<R, A>> {
    return {
      concat: getSemigroup<R, A>(M).concat,
      empty: () => M.empty
    }
  }
  
  /* examples */
  
  import * as R from 'fp-ts/lib/Reader'
  import { monoidSum } from 'fp-ts/lib/Monoid'

  const M = getMonoid(monoidSum)
  
  M.concat(R.reader.of(1), M.empty)({}) // ${M.concat(R.reader.of(1), M.empty)({})}
  M.concat(M.empty, R.reader.of(2))({}) // ${M.concat(M.empty, R.reader.of(2))({})}
  `

  // reader
  const readerTx = `
  const reader: Monad2<URI> & Profunctor2<URI> & Category2<URI> & Strong2<URI> & Choice2<URI> = {
    URI,
    map: (ma, f) => e => f(ma(e)),
    of,
    ap: T.ap,
    chain: T.chain,
    promap: (mbc, f, g) => a => g(mbc(f(a))),
    compose: (ab, la) => l => ab(la(l)),
    id: () => id,
    first: pab => ([a, c]) => [pab(a), c],
    second: pbc => ([a, b]) => [a, pbc(b)],
    left: <A, B, C>(pab: Reader<A, B>): Reader<E.Either<A, C>, E.Either<B, C>> =>
      E.fold<A, C, E.Either<B, C>>(a => E.left(pab(a)), E.right),
    right: <A, B, C>(pbc: Reader<B, C>): Reader<E.Either<A, B>, E.Either<A, C>> =>
      E.fold<A, B, E.Either<A, C>>(E.left, b => E.right(pbc(b)))
  }
  
  /* examples: map */
  
  R.reader.map(
    () => 1,
    (n: number): number => n * 2
  )({}) // ${R.reader.map(
    () => 1,
    (n: number): number => n * 2
  )({})}


  /* examples: of */

  R.reader.of(1)({}) // ${R.reader.of(1)({})}
  
  
  /* examples: ap */
  
  R.reader.ap(
    R.reader.of((n: number): number => n * 2),
    R.reader.of(1)
  )({}) // ${R.reader.ap(
    R.reader.of((n: number): number => n * 2),
    R.reader.of(1)
  )({})}
  
  
  /* examples: chain */
  
  R.reader.chain(
    () => 'foo', 
    (s: string): R.Reader<object, number> => R.reader.of(s.length)
  )({}) // ${R.reader.chain(
    () => 'foo',
    (s: string): R.Reader<object, number> => R.reader.of(s.length)
  )({})}
  
  
   /* examples: promap */
  
  const y = R.reader.promap(
    (s: string) => s.length,
    (a: { name: string }) => a.name,
    n => n >= 2
  )
 
  y({ name: 'a' }) // ${R.reader.promap(
    (s: string) => s.length,
    (a: { name: string }) => a.name,
    n => n >= 2
  )({ name: 'a' })}
  y({ name: 'foo' }) // ${R.reader.promap(
    (s: string) => s.length,
    (a: { name: string }) => a.name,
    n => n >= 2
  )({ name: 'foo' })}
  
  
  /* examples: id */
  
  R.reader.id<number>()(1) // ${R.reader.id<number>()(1)}
  
  
  /* examples: compose */

  const z = R.reader.compose(
    (n: number) => n >= 2,
    (s: string) => s.length
  )

  z('a') // ${R.reader.compose(
    (n: number) => n >= 2,
    (s: string) => s.length
  )('a')}
  z('foo') // ${R.reader.compose(
    (n: number) => n >= 2,
    (s: string) => s.length
  )('foo')}
  `

  return (
    <ModuleContainer id='reader'>
      <Title>FP-TS (Reader)</Title>
      <CodeBlock label='commonTypes' codeTx={commonTypesTx} />
      <CodeBlock label='commonConstants' codeTx={commonConstantsTx} />
      <CodeBlock label='local' codeTx={localTx} />
      <CodeBlock label='getSemigroup' codeTx={getSemigroupTx} />
      <CodeBlock label='getMonoid' codeTx={getMonoidTx} />
      <CodeBlock label='reader' codeTx={readerTx} />
    </ModuleContainer>
  )
}
