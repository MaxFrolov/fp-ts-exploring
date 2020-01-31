import * as React from 'react'
// view components
import { CodeBlock } from '@md-components/code-block'
// views
import { ModuleContainer, Title } from '@md-views'
// libs
import { array } from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { getFunctorComposition } from 'fp-ts/lib/Functor'

export const FunctorContainer = () => {
  // common types
  const commonTypesTx = `
  interface Functor<F> {
    readonly URI: F
    readonly map: <A, B>(
      fa: HKT<F, A>,
      f: (a: A) => B
    ) => HKT<F, B>
  }
  
  interface Functor1<F extends URIS> {
    readonly URI: F
    readonly map: <A, B>(
      fa: Kind<F, A>,
      f: (a: A) => B
    ) => Kind<F, B>
  }
  
  interface Functor2<F extends URIS2> {
    readonly URI: F
    readonly map: <E, A, B>(
      fa: Kind2<F, E, A>,
      f: (a: A) => B
    ) => Kind2<F, E, B>
  }
  
  interface Functor2C<F extends URIS2, E> {
    readonly URI: F
    readonly _E: E
    readonly map: <A, B>(
      fa: Kind2<F, E, A>,
      f: (a: A) => B
    ) => Kind2<F, E, B>
  }
  
  interface Functor3<F extends URIS3> {
    readonly URI: F
    readonly map: <R, E, A, B>(
      fa: Kind3<F, R, E, A>,
      f: (a: A) => B
    ) => Kind3<F, R, E, B>
  }
  
  interface Functor3C<F extends URIS3, E> {
    readonly URI: F
    readonly _E: E
    readonly map: <R, A, B>(
      fa: Kind3<F, R, E, A>,
      f: (a: A) => B
    ) => Kind3<F, R, E, B>
  }
  
  interface Functor4<F extends URIS4> {
    readonly URI: F
    readonly map: <S, R, E, A, B>(
      fa: Kind4<F, S, R, E, A>,
      f: (a: A) => B
    ) => Kind4<F, S, R, E, B>
  }
  
  interface FunctorComposition<F, G> {
    readonly map: <A, B>(
      fa: HKT<F, HKT<G, A>>,
      f: (a: A) => B
    ) => HKT<F, HKT<G, B>>
  }
  
  interface FunctorCompositionHKT1<F, G extends URIS> {
    readonly map: <A, B>(
      fa: HKT<F, Kind<G, A>>,
      f: (a: A) => B
    ) => HKT<F, Kind<G, B>>
  }
  
  interface FunctorCompositionHKT2<F, G extends URIS2> {
    readonly map: <E, A, B>(
      fa: HKT<F, Kind2<G, E, A>>,
      f: (a: A) => B
    ) => HKT<F, Kind2<G, E, B>>
  }
  
  interface FunctorCompositionHKT2C<F, G extends URIS2, E> {
    readonly map: <A, B>(
      fa: HKT<F, Kind2<G, E, A>>,
      f: (a: A) => B
    ) => HKT<F, Kind2<G, E, B>>
  }
  
  interface FunctorComposition11<F extends URIS, G extends URIS> {
    readonly map: <A, B>(
      fa: Kind<F, Kind<G, A>>,
      f: (a: A) => B
    ) => Kind<F, Kind<G, B>>
  }
  
  interface FunctorComposition12<F extends URIS, G extends URIS2> {
    readonly map: <E, A, B>(
      fa: Kind<F, Kind2<G, E, A>>,
      f: (a: A) => B
    ) => Kind<F, Kind2<G, E, B>>
  }
  
  interface FunctorComposition12C<F extends URIS, G extends URIS2, E> {
    readonly map: <A, B>(
      fa: Kind<F, Kind2<G, E, A>>,
      f: (a: A) => B
    ) => Kind<F, Kind2<G, E, B>>
  }
  
  interface FunctorComposition21<F extends URIS2, G extends URIS> {
    readonly map: <E, A, B>(
      fa: Kind2<F, E, Kind<G, A>>,
      f: (a: A) => B
    ) => Kind2<F, E, Kind<G, B>>
  }
  
  interface FunctorComposition2C1<F extends URIS2, G extends URIS, E> {
    readonly map: <A, B>(
      fa: Kind2<F, E, Kind<G, A>>,
      f: (a: A) => B
    ) => Kind2<F, E, Kind<G, B>>
  }
  
  interface FunctorComposition22<F extends URIS2, G extends URIS2> {
    readonly map: <FE, GE, A, B>(
      fa: Kind2<F, FE, Kind2<G, GE, A>>,
      f: (a: A) => B
    ) => Kind2<F, FE, Kind2<G, GE, B>>
  }
  
  interface FunctorComposition22C<F extends URIS2, G extends URIS2, E> {
    readonly map: <FE, A, B>(
      fa: Kind2<F, FE, Kind2<G, E, A>>,
      f: (a: A) => B
    ) => Kind2<F, FE, Kind2<G, E, B>>
  }
  
  interface FunctorComposition23<F extends URIS2, G extends URIS3> {
    readonly map: <FE, R, E, A, B>(
      fa: Kind2<F, FE, Kind3<G, R, E, A>>,
      f: (a: A) => B
    ) => Kind2<F, FE, Kind3<G, R, E, B>>
  }
  
  interface FunctorComposition23C<F extends URIS2, G extends URIS3, E> {
    readonly map: <FE, R, A, B>(
      fa: Kind2<F, FE, Kind3<G, R, E, A>>,
      f: (a: A) => B
    ) => Kind2<F, FE, Kind3<G, R, E, B>>
  }
  `

  // getFunctorComposition
  const getFunctorCompositionTx = `
  function getFunctorComposition<F extends URIS2, G extends URIS3, E>(
    F: Functor2<F>,
    G: Functor3C<G, E>
  ): FunctorComposition23C<F, G, E>
  
  getFunctorComposition<F extends URIS2, G extends URIS2, E>(
    F: Functor2<F>,
    G: Functor2C<G, E>
  ): FunctorComposition22C<F, G, E>
  
  getFunctorComposition<F extends URIS2, G extends URIS2>(
    F: Functor2<F>,
    G: Functor2<G>
  ): FunctorComposition22<F, G>
  
  getFunctorComposition<F extends URIS2, G extends URIS, E>(
    F: Functor2C<F, E>,
    G: Functor1<G>
  ): FunctorComposition2C1<F, G, E>
  
  getFunctorComposition<F extends URIS2, G extends URIS>(
    F: Functor2<F>,
    G: Functor1<G>
  ): FunctorComposition21<F, G>
  
  getFunctorComposition<F extends URIS, G extends URIS2, E>(
    F: Functor1<F>,
    G: Functor2C<G, E>
  ): FunctorComposition12C<F, G, E>
  
  getFunctorComposition<F extends URIS, G extends URIS2>(
    F: Functor1<F>,
    G: Functor2<G>
  ): FunctorComposition12<F, G>
  
  getFunctorComposition<F extends URIS, G extends URIS>(
    F: Functor1<F>,
    G: Functor1<G>
  ): FunctorComposition11<F, G>
  
  getFunctorComposition<F, G>(F: Functor<F>, G: Functor<G>): FunctorComposition<F, G>
  getFunctorComposition<F, G>(F: Functor<F>, G: Functor<G>): FunctorComposition<F, G> {
    return {
      map: (fa, f) => F.map(fa, ga => G.map(ga, f))
    }
  }
  
  /* examples */
  
  import { array } from 'fp-ts/lib/Array'
  import * as O from 'fp-ts/lib/Option'
  import * as E from 'fp-ts/lib/Either'
  
  getFunctorComposition(array, O.option).map(
    [O.some(1), O.some(10)],
    (a: number) => a * 2
  ) // ${JSON.stringify(getFunctorComposition(array, O.option).map([O.some(1), O.some(10)], (a: number) => a * 2))}
  
  getFunctorComposition(E.either, option.option).map(
    E.right(O.some(1)),
    (a: number) => a * 2
  ) // ${JSON.stringify(getFunctorComposition(E.either, O.option).map(E.right(O.some(1)), (a: number) => a * 2))}
  `

  return (
    <ModuleContainer id='functor'>
      <Title>FP-TS (Functor)</Title>
      <CodeBlock label='commonTypes' codeTx={commonTypesTx} />
      <CodeBlock label='getFunctorComposition' codeTx={getFunctorCompositionTx} />
    </ModuleContainer>
  )
}
