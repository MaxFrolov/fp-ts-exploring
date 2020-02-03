import * as React from 'react'
// view components
import { CodeBlock } from '@md-components/code-block'
// views
import { ModuleContainer, Title } from '@md-views'
// libs
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import * as Tr from 'fp-ts/lib/Traversable'

const TraversableContainer = () => {
  // common types
  const commonTypesTx = `
  // \`Traversable\` represents data structures which can be _traversed_ accumulating results and effects in some
  // \`Applicative\` functor.
  
  // \`traverse\` signature:
  
  <F>(F: Applicative<F>) => <A, B>(ta: HKT<T, A>, f: (a: A) => HKT<F, B>) => HKT<F, HKT<T, B>>
  
  // \`sequence\` signature:
  
  <F>(F: Applicative<F>) => <A>(ta: HKT<T, HKT<F, A>>) => HKT<F, HKT<T, A>>
  
  // Traversable
  
  interface Traversable<T> extends Functor<T>, Foldable<T> {
    /**
     * Runs an action for every element in a data structure and accumulates the results
     */
    readonly traverse: Traverse<T>
    readonly sequence: Sequence<T>
  }
  
  interface Traversable1<T extends URIS> extends Functor1<T>, Foldable1<T> {
    readonly traverse: Traverse1<T>
    readonly sequence: Sequence1<T>
  }
  
  interface Traversable2<T extends URIS2> extends Functor2<T>, Foldable2<T> {
    readonly traverse: Traverse2<T>
    readonly sequence: Sequence2<T>
  }
  
  interface Traversable2C<T extends URIS2, TL> extends Functor2C<T, TL>, Foldable2C<T, TL> {
    readonly traverse: Traverse2C<T, TL>
    readonly sequence: Sequence2C<T, TL>
  }
  
  interface Traversable3<T extends URIS3> extends Functor3<T>, Foldable3<T> {
    readonly traverse: Traverse3<T>
    readonly sequence: Sequence3<T>
  }
  
  // Traverse
  
  interface Traverse<T> {
    <F extends URIS3>(F: Applicative3<F>): <A, R, E, B>(
      ta: HKT<T, A>,
      f: (a: A) => Kind3<F, R, E, B>
    ) => Kind3<F, R, E, HKT<T, B>>
    <F extends URIS3, E>(F: Applicative3C<F, E>): <A, R, B>(
      ta: HKT<T, A>,
      f: (a: A) => Kind3<F, R, E, B>
    ) => Kind3<F, R, E, HKT<T, B>>
    <F extends URIS2>(F: Applicative2<F>): <A, E, B>(ta: HKT<T, A>, f: (a: A) => Kind2<F, E, B>) => Kind2<F, E, HKT<T, B>>
    <F extends URIS2, E>(F: Applicative2C<F, E>): <A, B>(
      ta: HKT<T, A>,
      f: (a: A) => Kind2<F, E, B>
    ) => Kind2<F, E, HKT<T, B>>
    <F extends URIS>(F: Applicative1<F>): <A, B>(ta: HKT<T, A>, f: (a: A) => Kind<F, B>) => Kind<F, HKT<T, B>>
    <F>(F: Applicative<F>): <A, B>(ta: HKT<T, A>, f: (a: A) => HKT<F, B>) => HKT<F, HKT<T, B>>
  }
  
  interface Traverse1<T extends URIS> {
    <F extends URIS3>(F: Applicative3<F>): <A, R, E, B>(
      ta: Kind<T, A>,
      f: (a: A) => Kind3<F, R, E, B>
    ) => Kind3<F, R, E, Kind<T, B>>
    <F extends URIS3, E>(F: Applicative3C<F, E>): <A, R, B>(
      ta: Kind<T, A>,
      f: (a: A) => Kind3<F, R, E, B>
    ) => Kind3<F, R, E, Kind<T, B>>
    <F extends URIS2>(F: Applicative2<F>): <A, E, B>(
      ta: Kind<T, A>,
      f: (a: A) => Kind2<F, E, B>
    ) => Kind2<F, E, Kind<T, B>>
    <F extends URIS2, E>(F: Applicative2C<F, E>): <A, B>(
      ta: Kind<T, A>,
      f: (a: A) => Kind2<F, E, B>
    ) => Kind2<F, E, Kind<T, B>>
    <F extends URIS>(F: Applicative1<F>): <A, B>(ta: Kind<T, A>, f: (a: A) => Kind<F, B>) => Kind<F, Kind<T, B>>
    <F>(F: Applicative<F>): <A, B>(ta: Kind<T, A>, f: (a: A) => HKT<F, B>) => HKT<F, Kind<T, B>>
  }
  
  interface Traverse2<T extends URIS2> {
    <F extends URIS3>(F: Applicative3<F>): <TE, A, R, FE, B>(
      ta: Kind2<T, TE, A>,
      f: (a: A) => Kind3<F, R, FE, B>
    ) => Kind3<F, R, FE, Kind2<T, TE, B>>
    <F extends URIS2>(F: Applicative2<F>): <TE, A, FE, B>(
      ta: Kind2<T, TE, A>,
      f: (a: A) => Kind2<F, FE, B>
    ) => Kind2<F, FE, Kind2<T, TE, B>>
    <F extends URIS2, FE>(F: Applicative2C<F, FE>): <TE, A, B>(
      ta: Kind2<T, TE, A>,
      f: (a: A) => Kind2<F, FE, B>
    ) => Kind2<F, FE, Kind2<T, TE, B>>
    <F extends URIS>(F: Applicative1<F>): <E, A, B>(
      ta: Kind2<T, E, A>,
      f: (a: A) => Kind<F, B>
    ) => Kind<F, Kind2<T, E, B>>
    <F>(F: Applicative<F>): <E, A, B>(ta: Kind2<T, E, A>, f: (a: A) => HKT<F, B>) => HKT<F, Kind2<T, E, B>>
  }
  
  interface Traverse2C<T extends URIS2, E> {
    <F extends URIS3>(F: Applicative3<F>): <A, R, FE, B>(
      ta: Kind2<T, E, A>,
      f: (a: A) => Kind3<F, R, FE, B>
    ) => Kind3<F, R, FE, Kind2<T, E, B>>
    <F extends URIS2>(F: Applicative2<F>): <A, FE, B>(
      ta: Kind2<T, E, A>,
      f: (a: A) => Kind2<F, FE, B>
    ) => Kind2<F, FE, Kind2<T, E, B>>
    <F extends URIS2, FE>(F: Applicative2C<F, FE>): <A, B>(
      ta: Kind2<T, E, A>,
      f: (a: A) => Kind2<F, FE, B>
    ) => Kind2<F, FE, Kind2<T, E, B>>
    <F extends URIS>(F: Applicative1<F>): <A, B>(ta: Kind2<T, E, A>, f: (a: A) => Kind<F, B>) => Kind<F, Kind2<T, E, B>>
    <F>(F: Applicative<F>): <A, B>(ta: Kind2<T, E, A>, f: (a: A) => HKT<F, B>) => HKT<F, Kind2<T, E, B>>
  }

  interface Traverse3<T extends URIS3> {
    <F extends URIS3>(F: Applicative3<F>): <TR, TE, A, FR, FE, B>(
      ta: Kind3<T, TR, TE, A>,
      f: (a: A) => Kind3<F, FR, FE, B>
    ) => Kind3<F, FR, FE, Kind3<T, TR, TE, B>>
    <F extends URIS2>(F: Applicative2<F>): <TR, A, TE, FE, B>(
      ta: Kind3<T, TR, TE, A>,
      f: (a: A) => Kind2<F, FE, B>
    ) => Kind2<F, FE, Kind3<T, TR, TE, B>>
    <F extends URIS2, FE>(F: Applicative2C<F, FE>): <R, TE, A, B>(
      ta: Kind3<T, R, TE, A>,
      f: (a: A) => Kind2<F, FE, B>
    ) => Kind2<F, FE, Kind3<T, R, TE, B>>
    <F extends URIS>(F: Applicative1<F>): <R, E, A, B>(
      ta: Kind3<T, R, E, A>,
      f: (a: A) => Kind<F, B>
    ) => Kind<F, Kind3<T, R, E, B>>
    <F>(F: Applicative<F>): <R, E, A, B>(ta: Kind3<T, R, E, A>, f: (a: A) => HKT<F, B>) => HKT<F, Kind3<T, R, E, B>>
  }
  
  // Sequence
  
  interface Sequence<T> {
    <F extends URIS3>(F: Applicative3<F>): <R, E, A>(ta: HKT<T, Kind3<F, R, E, A>>) => Kind3<F, R, E, HKT<T, A>>
    <F extends URIS3, E>(F: Applicative3C<F, E>): <R, A>(ta: HKT<T, Kind3<F, R, E, A>>) => Kind3<F, R, E, HKT<T, A>>
    <F extends URIS2>(F: Applicative2<F>): <E, A>(ta: HKT<T, Kind2<F, E, A>>) => Kind2<F, E, HKT<T, A>>
    <F extends URIS2, E>(F: Applicative2C<F, E>): <A>(ta: HKT<T, Kind2<F, E, A>>) => Kind2<F, E, HKT<T, A>>
    <F extends URIS>(F: Applicative1<F>): <A>(ta: HKT<T, Kind<F, A>>) => Kind<F, HKT<T, A>>
    <F>(F: Applicative<F>): <A>(ta: HKT<T, HKT<F, A>>) => HKT<F, HKT<T, A>>
  }
  
  interface Sequence1<T extends URIS> {
    <F extends URIS3>(F: Applicative3<F>): <R, E, A>(ta: Kind<T, Kind3<F, R, E, A>>) => Kind3<F, R, E, Kind<T, A>>
    <F extends URIS3, E>(F: Applicative3C<F, E>): <R, A>(ta: Kind<T, Kind3<F, R, E, A>>) => Kind3<F, R, E, Kind<T, A>>
    <F extends URIS2>(F: Applicative2<F>): <E, A>(ta: Kind<T, Kind2<F, E, A>>) => Kind2<F, E, Kind<T, A>>
    <F extends URIS2, E>(F: Applicative2C<F, E>): <A>(ta: Kind<T, Kind2<F, E, A>>) => Kind2<F, E, Kind<T, A>>
    <F extends URIS>(F: Applicative1<F>): <A>(ta: Kind<T, Kind<F, A>>) => Kind<F, Kind<T, A>>
    <F>(F: Applicative<F>): <A>(ta: Kind<T, HKT<F, A>>) => HKT<F, Kind<T, A>>
  }
  
  interface Sequence2<T extends URIS2> {
    <F extends URIS3>(F: Applicative3<F>): <TE, R, FE, A>(
      ta: Kind2<T, TE, Kind3<F, R, FE, A>>
    ) => Kind3<F, R, FE, Kind2<T, TE, A>>
    <F extends URIS2>(F: Applicative2<F>): <TE, FE, A>(ta: Kind2<T, TE, Kind2<F, FE, A>>) => Kind2<F, FE, Kind2<T, TE, A>>
    <F extends URIS2, FE>(F: Applicative2C<F, FE>): <TE, A>(
      ta: Kind2<T, TE, Kind2<F, FE, A>>
    ) => Kind2<F, FE, Kind2<T, TE, A>>
    <F extends URIS>(F: Applicative1<F>): <E, A>(ta: Kind2<T, E, Kind<F, A>>) => Kind<F, Kind2<T, E, A>>
    <F>(F: Applicative<F>): <E, A>(ta: Kind2<T, E, HKT<F, A>>) => HKT<F, Kind2<T, E, A>>
  }
  
  interface Sequence2C<T extends URIS2, E> {
    <F extends URIS3>(F: Applicative3<F>): <R, FE, A>(
      ta: Kind2<T, E, Kind3<F, R, FE, A>>
    ) => Kind3<F, R, FE, Kind2<T, E, A>>
    <F extends URIS2>(F: Applicative2<F>): <FE, A>(ta: Kind2<T, E, Kind2<F, FE, A>>) => Kind2<F, FE, Kind2<T, E, A>>
    <F extends URIS2, FE>(F: Applicative2C<F, FE>): <A>(ta: Kind2<T, E, Kind2<F, FE, A>>) => Kind2<F, FE, Kind2<T, E, A>>
    <F extends URIS>(F: Applicative1<F>): <A>(ta: Kind2<T, E, Kind<F, A>>) => Kind<F, Kind2<T, E, A>>
    <F>(F: Applicative<F>): <A>(ta: Kind2<T, E, HKT<F, A>>) => HKT<F, Kind2<T, E, A>>
  }
  
  interface Sequence3<T extends URIS3> {
    <F extends URIS3>(F: Applicative3<F>): <TR, TE, FR, FE, A>(
      ta: Kind3<T, TR, TE, Kind3<F, FR, FE, A>>
    ) => Kind3<F, FR, FE, Kind3<T, TR, TE, A>>
    <F extends URIS2>(F: Applicative2<F>): <R, TE, FE, A>(
      ta: Kind3<T, R, TE, Kind2<F, FE, A>>
    ) => Kind2<F, FE, Kind3<T, R, TE, A>>
    <F extends URIS2, FE>(F: Applicative2C<F, FE>): <R, TE, A>(
      ta: Kind3<T, R, TE, Kind2<F, FE, A>>
    ) => Kind2<F, FE, Kind3<T, R, TE, A>>
    <F extends URIS>(F: Applicative1<F>): <R, E, A>(ta: Kind3<T, R, E, Kind<F, A>>) => Kind<F, Kind3<T, R, E, A>>
    <F>(F: Applicative<F>): <R, E, A>(ta: Kind3<T, R, E, HKT<F, A>>) => HKT<F, Kind3<T, R, E, A>>
  }
  
  // TraversableComposition
  
  interface TraversableComposition<F, G> extends FoldableComposition<F, G>, FunctorComposition<F, G> {
    readonly traverse: <H>(
      H: Applicative<H>
    ) => <A, B>(fga: HKT<F, HKT<G, A>>, f: (a: A) => HKT<H, B>) => HKT<H, HKT<F, HKT<G, B>>>
    readonly sequence: <H>(H: Applicative<H>) => <A>(fga: HKT<F, HKT<G, HKT<H, A>>>) => HKT<H, HKT<F, HKT<G, A>>>
  }
  
  interface TraverseComposition11<F extends URIS, G extends URIS> {
    <H extends URIS3>(H: Applicative3<H>): <R, E, A, B>(
      fga: Kind<F, Kind<G, A>>,
      f: (a: A) => Kind3<H, R, E, B>
    ) => Kind3<H, R, E, Kind<F, Kind<G, B>>>
    <H extends URIS2>(H: Applicative2<H>): <E, A, B>(
      fga: Kind<F, Kind<G, A>>,
      f: (a: A) => Kind2<H, E, B>
    ) => Kind2<H, E, Kind<F, Kind<G, B>>>
    <H extends URIS2, E>(H: Applicative2C<H, E>): <A, B>(
      fga: Kind<F, Kind<G, A>>,
      f: (a: A) => Kind2<H, E, B>
    ) => Kind2<H, E, Kind<F, Kind<G, B>>>
    <H extends URIS>(H: Applicative1<H>): <A, B>(
      fga: Kind<F, Kind<G, A>>,
      f: (a: A) => Kind<H, B>
    ) => Kind<H, Kind<F, Kind<G, B>>>
    <H>(H: Applicative<H>): <A, B>(fga: Kind<F, Kind<G, A>>, f: (a: A) => HKT<H, B>) => HKT<H, Kind<F, Kind<G, B>>>
  }
  
  // SequenceComposition
  
  interface SequenceComposition11<F extends URIS, G extends URIS> {
    <H extends URIS3>(H: Applicative3<H>): <R, E, A>(
      fga: Kind<F, Kind<G, Kind3<H, R, E, A>>>
    ) => Kind3<H, R, E, Kind<F, Kind<G, A>>>
    <H extends URIS2>(H: Applicative2<H>): <E, A>(
      fga: Kind<F, Kind<G, Kind2<H, E, A>>>
    ) => Kind2<H, E, Kind<F, Kind<G, A>>>
    <H extends URIS2, E>(H: Applicative2C<H, E>): <A>(
      fga: Kind<F, Kind<G, Kind2<H, E, A>>>
    ) => Kind2<H, E, Kind<F, Kind<G, A>>>
    <H extends URIS>(H: Applicative1<H>): <A>(fga: Kind<F, Kind<G, Kind<H, A>>>) => Kind<H, Kind<F, Kind<G, A>>>
    <H>(H: Applicative<H>): <A>(fga: Kind<F, Kind<G, HKT<H, A>>>) => HKT<H, Kind<F, Kind<G, A>>>
  }
  
  interface TraversableComposition11<F extends URIS, G extends URIS>
    extends FoldableComposition11<F, G>,
      FunctorComposition11<F, G> {
    readonly traverse: TraverseComposition11<F, G>
    readonly sequence: SequenceComposition11<F, G>
  }
  `

  // getTraversableComposition
  const T = Tr.getTraversableComposition(A.array, O.option)

  const getTraversableCompositionTx = `
  function getTraversableComposition<F extends URIS, G extends URIS>(
    F: Traversable1<F>,
    G: Traversable1<G>
  ): TraversableComposition11<F, G>
  function getTraversableComposition<F, G>(F: Traversable<F>, G: Traversable<G>): TraversableComposition<F, G>
  function getTraversableComposition<F, G>(F: Traversable<F>, G: Traversable<G>): TraversableComposition<F, G> {
    return {
      ...getFunctorComposition(F, G),
      ...getFoldableComposition(F, G),
      traverse: H => {
        const traverseF = F.traverse(H)
        const traverseG = G.traverse(H)
        return (fga, f) => traverseF(fga, ga => traverseG(ga, f))
      },
      sequence: H => {
        const sequenceF = F.sequence(H)
        const sequenceG = G.sequence(H)
        return fgha => sequenceF(F.map(fgha, sequenceG))
      }
    }
  }
  
  // examples
  import * as A from 'fp-ts/lib/Array'
  import * as O from 'fp-ts/lib/Option'
  import * as Tr from 'fp-ts/lib/Traversable'
  
  const T = Tr.getTraversableComposition(A.array, O.option)
  
  T.traverse(O.option)([O.some(1), O.some(2)], (n: number) => (n <= 2 ? O.some(n * 2) : O.none)) // ${JSON.stringify(
    T.traverse(O.option)([O.some(1), O.some(2)], (n: number) => (n <= 2 ? O.some(n * 2) : O.none))
  )}
  
  T.traverse(O.option)([O.some(1), O.some(3)], (n: number) => (n <= 2 ? O.some(n * 2) : O.none)) // ${JSON.stringify(
    T.traverse(O.option)([O.some(1), O.some(3)], (n: number) => (n <= 2 ? O.some(n * 2) : O.none))
  )}
  
  T.sequence(O.option)([O.some(O.some(1)), O.some(O.some(2))]) // ${JSON.stringify(
    T.sequence(O.option)([O.some(O.some(1)), O.some(O.some(2))])
  )}
  
  T.sequence(O.option)([O.some(O.some(1)), O.none]) // ${JSON.stringify(
    T.sequence(O.option)([O.some(O.some(1)), O.none])
  )}
  
  T.sequence(O.option)([O.some(O.some(1)), O.some(O.none)]) // ${JSON.stringify(
    T.sequence(O.option)([O.some(O.some(1)), O.some(O.none)])
  )}
  `

  return (
    <ModuleContainer id='traversable'>
      <Title>FP-TS (Traversable)</Title>
      <CodeBlock label='common types' codeTx={commonTypesTx} />
      <CodeBlock label='getTraversableComposition' codeTx={getTraversableCompositionTx} />
    </ModuleContainer>
  )
}

export { TraversableContainer }
