import * as React from 'react'
// libs
import { ModuleContainer, Title } from '@md-views'
import { CodeBlock } from '@md-components/code-block'
//
import * as O from 'fp-ts/lib/Option'
import * as Foldable from 'fp-ts/lib/Foldable'
import { io } from 'fp-ts/lib/IO'
import { array } from 'fp-ts/lib/Array'
import { monoidString, monoidSum } from 'fp-ts/lib/Monoid'

export const FoldableContainer: React.FunctionComponent = () => {
  // common types
  const commonTypesTx = `
  interface Foldable<F> {
    readonly URI: F
    readonly reduce: <A, B>(fa: HKT<F, A>, b: B, f: (b: B, a: A) => B) => B
    readonly foldMap: <M>(M: Monoid<M>) => <A>(fa: HKT<F, A>, f: (a: A) => M) => M
    readonly reduceRight: <A, B>(fa: HKT<F, A>, b: B, f: (a: A, b: B) => B) => B
  }
  
  interface Foldable1<F extends URIS> {
    readonly URI: F
    readonly reduce: <A, B>(fa: Kind<F, A>, b: B, f: (b: B, a: A) => B) => B
    readonly foldMap: <M>(M: Monoid<M>) => <A>(fa: Kind<F, A>, f: (a: A) => M) => M
    readonly reduceRight: <A, B>(fa: Kind<F, A>, b: B, f: (a: A, b: B) => B) => B
  }
  
  interface Foldable2<F extends URIS2> {
    readonly URI: F
    readonly reduce: <E, A, B>(fa: Kind2<F, E, A>, b: B, f: (b: B, a: A) => B) => B
    readonly foldMap: <M>(M: Monoid<M>) => <E, A>(fa: Kind2<F, E, A>, f: (a: A) => M) => M
    readonly reduceRight: <E, A, B>(fa: Kind2<F, E, A>, b: B, f: (a: A, b: B) => B) => B
  }
  
  interface Foldable2C<F extends URIS2, E> {
    readonly URI: F
    readonly _E: E
    readonly reduce: <A, B>(fa: Kind2<F, E, A>, b: B, f: (b: B, a: A) => B) => B
    readonly foldMap: <M>(M: Monoid<M>) => <A>(fa: Kind2<F, E, A>, f: (a: A) => M) => M
    readonly reduceRight: <A, B>(fa: Kind2<F, E, A>, b: B, f: (a: A, b: B) => B) => B
  }
  
  interface Foldable3<F extends URIS3> {
    readonly URI: F
    readonly reduce: <R, E, A, B>(fa: Kind3<F, R, E, A>, b: B, f: (b: B, a: A) => B) => B
    readonly foldMap: <M>(M: Monoid<M>) => <R, E, A>(fa: Kind3<F, R, E, A>, f: (a: A) => M) => M
    readonly reduceRight: <R, E, A, B>(fa: Kind3<F, R, E, A>, b: B, f: (a: A, b: B) => B) => B
  }
  
  interface Foldable3C<F extends URIS3, E> {
    readonly URI: F
    readonly _E: E
    readonly reduce: <R, A, B>(fa: Kind3<F, R, E, A>, b: B, f: (b: B, a: A) => B) => B
    readonly foldMap: <M>(M: Monoid<M>) => <R, A>(fa: Kind3<F, R, E, A>, f: (a: A) => M) => M
    readonly reduceRight: <R, A, B>(fa: Kind3<F, R, E, A>, b: B, f: (a: A, b: B) => B) => B
  }
  
  interface Foldable4<F extends URIS4> {
    readonly URI: F
    readonly reduce: <S, R, E, A, B>(fa: Kind4<F, S, R, E, A>, b: B, f: (b: B, a: A) => B) => B
    readonly foldMap: <M>(M: Monoid<M>) => <S, R, E, A>(fa: Kind4<F, S, R, E, A>, f: (a: A) => M) => M
    readonly reduceRight: <S, R, E, A, B>(fa: Kind4<F, S, R, E, A>, b: B, f: (a: A, b: B) => B) => B
  }
  
  interface FoldableComposition<F, G> {
    readonly reduce: <A, B>(fga: HKT<F, HKT<G, A>>, b: B, f: (b: B, a: A) => B) => B
    readonly foldMap: <M>(M: Monoid<M>) => <A>(fa: HKT<F, HKT<G, A>>, f: (a: A) => M) => M
    readonly reduceRight: <A, B>(fa: HKT<F, HKT<G, A>>, b: B, f: (a: A, b: B) => B) => B
  }
  
  interface FoldableComposition11<F extends URIS, G extends URIS> {
    readonly reduce: <A, B>(fga: Kind<F, Kind<G, A>>, b: B, f: (b: B, a: A) => B) => B
    readonly foldMap: <M>(M: Monoid<M>) => <A>(fa: Kind<F, Kind<G, A>>, f: (a: A) => M) => M
    readonly reduceRight: <A, B>(fa: Kind<F, Kind<G, A>>, b: B, f: (a: A, b: B) => B) => B
  }
  
  interface FoldableComposition12<F extends URIS, G extends URIS2> {
    readonly reduce: <E, A, B>(fga: Kind<F, Kind2<G, E, A>>, b: B, f: (b: B, a: A) => B) => B
    readonly foldMap: <M>(M: Monoid<M>) => <E, A>(fa: Kind<F, Kind2<G, E, A>>, f: (a: A) => M) => M
    readonly reduceRight: <E, A, B>(fa: Kind<F, Kind2<G, E, A>>, b: B, f: (a: A, b: B) => B) => B
  }
  
  interface FoldableComposition12C<F extends URIS, G extends URIS2, E> {
    readonly reduce: <A, B>(fga: Kind<F, Kind2<G, E, A>>, b: B, f: (b: B, a: A) => B) => B
    readonly foldMap: <M>(M: Monoid<M>) => <A>(fa: Kind<F, Kind2<G, E, A>>, f: (a: A) => M) => M
    readonly reduceRight: <A, B>(fa: Kind<F, Kind2<G, E, A>>, b: B, f: (a: A, b: B) => B) => B
  }
  
  interface FoldableComposition21<F extends URIS2, G extends URIS> {
    readonly reduce: <E, A, B>(fga: Kind2<F, E, Kind<G, A>>, b: B, f: (b: B, a: A) => B) => B
    readonly foldMap: <M>(M: Monoid<M>) => <E, A>(fa: Kind2<F, E, Kind<G, A>>, f: (a: A) => M) => M
    readonly reduceRight: <E, A, B>(fa: Kind2<F, E, Kind<G, A>>, b: B, f: (a: A, b: B) => B) => B
  }
  
  interface FoldableComposition2C1<F extends URIS2, G extends URIS, E> {
    readonly reduce: <A, B>(fga: Kind2<F, E, Kind<G, A>>, b: B, f: (b: B, a: A) => B) => B
    readonly foldMap: <M>(M: Monoid<M>) => <A>(fa: Kind2<F, E, Kind<G, A>>, f: (a: A) => M) => M
    readonly reduceRight: <A, B>(fa: Kind2<F, E, Kind<G, A>>, b: B, f: (a: A, b: B) => B) => B
  }
  
  interface FoldableComposition22<F extends URIS2, G extends URIS2> {
    readonly reduce: <FE, GE, A, B>(fga: Kind2<F, FE, Kind2<G, GE, A>>, b: B, f: (b: B, a: A) => B) => B
    readonly foldMap: <M>(M: Monoid<M>) => <FE, GE, A>(fa: Kind2<F, FE, Kind2<G, GE, A>>, f: (a: A) => M) => M
    readonly reduceRight: <FE, GE, A, B>(fa: Kind2<F, FE, Kind2<G, GE, A>>, b: B, f: (a: A, b: B) => B) => B
  }
  
  interface FoldableComposition22C<F extends URIS2, G extends URIS2, E> {
    readonly reduce: <FE, A, B>(fga: Kind2<F, FE, Kind2<G, E, A>>, b: B, f: (b: B, a: A) => B) => B
    readonly foldMap: <M>(M: Monoid<M>) => <FE, A>(fa: Kind2<F, FE, Kind2<G, E, A>>, f: (a: A) => M) => M
    readonly reduceRight: <FE, A, B>(fa: Kind2<F, FE, Kind2<G, E, A>>, b: B, f: (a: A, b: B) => B) => B
  }
  `

  // getFoldableComposition
  const F = Foldable.getFoldableComposition(array, O.option)

  const getFoldableCompositionTx = `
  function getFoldableComposition<F extends URIS2, G extends URIS2, E>(
    F: Foldable2<F>,
    G: Foldable2C<G, E>
  ): FoldableComposition22C<F, G, E>
  
  getFoldableComposition<F extends URIS2, G extends URIS2>(
    F: Foldable2<F>,
    G: Foldable2<G>
  ): FoldableComposition22<F, G>
  
  getFoldableComposition<F extends URIS2, G extends URIS, E>(
    F: Foldable2C<F, E>,
    G: Foldable1<G>
  ): FoldableComposition2C1<F, G, E>
  
  getFoldableComposition<F extends URIS2, G extends URIS>(
    F: Foldable2<F>,
    G: Foldable1<G>
  ): FoldableComposition21<F, G>
  
  getFoldableComposition<F extends URIS, G extends URIS2, E>(
    F: Foldable1<F>,
    G: Foldable2C<G, E>
  ): FoldableComposition12C<F, G, E>
  
  getFoldableComposition<F extends URIS, G extends URIS2>(
    F: Foldable1<F>,
    G: Foldable2<G>
  ): FoldableComposition12<F, G>
  
  getFoldableComposition<F extends URIS, G extends URIS>(
    F: Foldable1<F>,
    G: Foldable1<G>
  ): FoldableComposition11<F, G>
  
  getFoldableComposition<F, G>(F: Foldable<F>, G: Foldable<G>): FoldableComposition<F, G>
  getFoldableComposition<F, G>(F: Foldable<F>, G: Foldable<G>): FoldableComposition<F, G> {
    return {
      reduce: (fga, b, f) => F.reduce(fga, b, (b, ga) => G.reduce(ga, b, f)),
      foldMap: M => {
        const foldMapF = F.foldMap(M)
        const foldMapG = G.foldMap(M)
        return (fa, f) => foldMapF(fa, ga => foldMapG(ga, f))
      },
      reduceRight: (fa, b, f) => F.reduceRight(fa, b, (ga, b) => G.reduceRight(ga, b, f))
    }
  }
  
  /* examples */
  
  import * as O from 'fp-ts/lib/Option'
  import { array } from 'fp-ts/lib/Array'
  import { monoidString } from 'fp-ts/lib/Monoid'
 
  const F = getFoldableComposition(array, O.option)
  
  
  /* examples: reduce */

  F.reduce(
    [O.some('a'), O.some('b'), O.some('c')],
    '',
    monoidString.concat
  ) // ${F.reduce([O.some('a'), O.some('b'), O.some('c')], '', monoidString.concat)}
  
  F.reduce(
    [O.none, O.some('b'), O.none],
    '',
    monoidString.concat
  ) // ${F.reduce([O.none, O.some('b'), O.none], '', monoidString.concat)}
  
  F.reduce(
    [O.none, O.none, O.none],
    '',
    monoidString.concat
  ) // ''
  
  F.reduce([], '', monoidString.concat) // ''
   
   
  /* examples: foldMap */

  F.foldMap(monoidString)(
    [O.some('a'), O.some('b'), O.some('c')],
    a => a
  ) // ${F.foldMap(monoidString)([O.some('a'), O.some('b'), O.some('c')], a => a)}
  
  
  F.foldMap(monoidString)(
    [O.none, O.some('b'), O.none],
    a => a
  ) // ${F.foldMap(monoidString)([O.some('a'), O.some('b'), O.none], a => a)}
  
  F.foldMap(monoidString)(
    [O.none, O.none, O.none],
    a => a
  ) // ''
  
  F.foldMap(monoidString)([], (a: string) => a) // ''  


  /* examples: reduceRight */

  F.reduceRight(
    [O.some('a'), O.some('b'), O.some('c')],
    '',
    monoidString.concat
  ) // ${F.reduceRight([O.some('a'), O.some('b'), O.some('c')], '', monoidString.concat)}
  
  F.reduceRight(
    [O.none, O.some('b'), O.none],
    '',
    monoidString.concat
  ) // ${F.reduceRight([O.none, O.some('b'), O.none], '', monoidString.concat)}
  
  F.reduceRight(
    [O.none, O.none, O.none],
    '',
    monoidString.concat
  ) // ''
  
  F.reduceRight([], '', monoidString.concat) // ''
  `

  // foldM
  const F1 = Foldable.foldM(O.option, array)

  const foldMTx = `
  function foldM<M extends URIS3, F extends URIS>(
    M: Monad3<M>,
    F: Foldable1<F>
  ): <R, E, A, B>(
    fa: Kind<F, A>,
    b: B,
    f: (b: B, a: A) => Kind3<M, R, E, B>
  ) => Kind3<M, R, E, B>
  
  foldM<M extends URIS3, F extends URIS, E>(
    M: Monad3C<M, E>,
    F: Foldable1<F>
  ): <R, A, B>(
    fa: Kind<F, A>,
    b: B,
    f: (b: B, a: A) => Kind3<M, R, E, B>
  ) => Kind3<M, R, E, B>
  
  foldM<M extends URIS2, F extends URIS>(
    M: Monad2<M>,
    F: Foldable1<F>
  ): <E, A, B>(
    fa: Kind<F, A>, 
    b: B, 
    f: (b: B, a: A) => Kind2<M, E, B>
  ) => Kind2<M, E, B>
  
  foldM<M extends URIS2, F extends URIS, E>(
    M: Monad2C<M, E>,
    F: Foldable1<F>
  ): <A, B>(
    fa: Kind<F, A>, 
    b: B, 
    f: (b: B, a: A) => Kind2<M, E, B>
  ) => Kind2<M, E, B>
  
  foldM<M extends URIS, F extends URIS>(
    M: Monad1<M>,
    F: Foldable1<F>
  ): <A, B>(
    fa: Kind<F, A>, 
    b: B, 
    f: (b: B, a: A) => Kind<M, B>
  ) => Kind<M, B>
  
  foldM<M, F>(
    M: Monad<M>,
    F: Foldable<F>
  ): <A, B>(
    fa: HKT<F, A>, 
    b: B, 
    f: (b: B, a: A) => HKT<M, B>
  ) => HKT<M, B>
  
  foldM<M, F>(
    M: Monad<M>,
    F: Foldable<F>
  ): <A, B>(
    fa: HKT<F, A>, 
    b: B, 
    f: (b: B, a: A) => HKT<M, B>
  ) => HKT<M, B> {
    return (fa, b, f) => F.reduce(fa, M.of(b), (mb, a) => M.chain(mb, b => f(b, a)))
  }
  
  /* examples */
  
  import { array } from 'fp-ts/lib/Array'
  import * as O from 'fp-ts/lib/Option'
  
  const F = foldM(O.option, array)
   
  F([], 1, () => O.none)
  // ${JSON.stringify(F1([], 1, () => O.none))}
  
  F([2], 1, () => O.none),
  // ${JSON.stringify(F1([2], 1, () => O.none))}
  
  F([2], 1, (b, a) => O.some(b + a))
  // ${JSON.stringify(F1([2], 1, (b, a) => O.some(b + a)))}
  `

  // intercalate
  const intercalateTx = `
  function intercalate<M, F extends URIS3>(
    M: Monoid<M>,
    F: Foldable3<F>
  ): <R, E>(sep: M, fm: Kind3<F, R, E, M>) => M
  
  intercalate<M, F extends URIS2>(M: Monoid<M>, F: Foldable2<F>): <E>(sep: M, fm: Kind2<F, E, M>) => M
  
  intercalate<M, F extends URIS2, E>(M: Monoid<M>, F: Foldable2C<F, E>): (sep: M, fm: Kind2<F, E, M>) => M
  
  intercalate<M, F extends URIS>(M: Monoid<M>, F: Foldable1<F>): (sep: M, fm: Kind<F, M>) => M
  
  intercalate<M, F>(M: Monoid<M>, F: Foldable<F>): (sep: M, fm: HKT<F, M>) => M
  
  intercalate<M, F>(M: Monoid<M>, F: Foldable<F>): (sep: M, fm: HKT<F, M>) => M {
    interface Acc<M> {
      init: boolean
      acc: M
    }
    return (sep, fm) => {
      const go = ({ init, acc }: Acc<M>, x: M): Acc<M> =>
        init ? { init: false, acc: x } : { init: false, acc: M.concat(M.concat(acc, sep), x) }
      return F.reduce(fm, { init: true, acc: M.empty }, go).acc
    }
  }
  
  /* examples */
  
  import * as O from 'fp-ts/lib/Option'
  import { array } from 'fp-ts/lib/Array'
  import { monoidString, monoidSum } from 'fp-ts/lib/Monoid'
  
  intercalate(monoidString, array)(',', ['a', 'b', 'c']) // ${JSON.stringify(
    Foldable.intercalate(monoidString, array)(',', ['a', 'b', 'c'])
  )}
  
  intercalate(monoidSum, array)(0, [1, 1, 1]) // ${JSON.stringify(Foldable.intercalate(monoidSum, array)(0, [1, 1, 1]))}
  intercalate(monoidSum, array)(1, [1, 1, 1]) // ${JSON.stringify(Foldable.intercalate(monoidSum, array)(1, [1, 1, 1]))}
  `

  // traverse_
  let log = ''

  const append = (s: string) => () => (log += s)
  Foldable.traverse_(io, array)(['a', 'b', 'c'], append)()

  const traverse_Tx = `
  function traverse_<M extends URIS3, F extends URIS>(
    M: Applicative3<M>,
    F: Foldable1<F>
  ): <R, E, A, B>(
    fa: Kind<F, A>,
    f: (a: A) => Kind3<M, R, E, B>
  ) => Kind3<M, R, E, void>
  
  traverse_<M extends URIS2, F extends URIS>(
    M: Applicative2<M>,
    F: Foldable1<F>
  ): <E, A, B>(
    fa: Kind<F, A>,
    f: (a: A) => Kind2<M, E, B>
  ) => Kind2<M, E, void>
  
  traverse_<M extends URIS2, F extends URIS, E>(
    M: Applicative2C<M, E>,
    F: Foldable1<F>
  ): <A, B>(
    fa: Kind<F, A>,
    f: (a: A) => Kind2<M, E, B>
  ) => Kind2<M, E, void>
  
  traverse_<M extends URIS, F extends URIS>(
    M: Applicative1<M>,
    F: Foldable1<F>
  ): <A, B>(
    fa: Kind<F, A>,
    f: (a: A) => Kind<M, B>
  ) => Kind<M, void>
  
  traverse_<M, F>(
    M: Applicative<M>,
    F: Foldable<F>
  ): <A, B>(
    fa: HKT<F, A>,
    f: (a: A) => HKT<M, B>
  ) => HKT<M, void>
  
  traverse_<M, F>(
    M: Applicative<M>,
    F: Foldable<F>
  ): <A, B>(
    fa: HKT<F, A>,
    f: (a: A) => HKT<M, B>
  ) => HKT<M, void> {
    const applyFirst = <B>(mu: HKT<M, void>, mb: HKT<M, B>): HKT<M, void> => M.ap(M.map(mu, constant), mb)
    const mu: HKT<M, void> = M.of(undefined)
    return (fa, f) => F.reduce(fa, mu, (mu, a) => applyFirst(mu, f(a)))
  }
  
  /* examples */
  
  import * as O from 'fp-ts/lib/Option'
  
  import { io } from 'fp-ts/lib/IO'
  import { array } from 'fp-ts/lib/Array'
  import { monoidString, monoidSum } from 'fp-ts/lib/Monoid'
  
  let log = ''
  const append = (s: string) => () => (log += s)
  
  traverse_(io, array)(['a', 'b', 'c'], append)() // log: '${log}'
  `

  return (
    <ModuleContainer id='foldable'>
      <Title>FP-TS (Foldable)</Title>
      <CodeBlock label='commonTypes' codeTx={commonTypesTx} />
      <CodeBlock label='getFoldableComposition' codeTx={getFoldableCompositionTx} />
      <CodeBlock label='foldM' codeTx={foldMTx} />
      <CodeBlock label='intercalate' codeTx={intercalateTx} />
      <CodeBlock label='traverse' codeTx={traverse_Tx} />
    </ModuleContainer>
  )
}
