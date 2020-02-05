import * as React from 'react'
// view components
import { CodeBlock } from '@md-components/code-block'
// views
import { ModuleContainer, Title } from '@md-views'
// libs
import * as A from 'fp-ts/lib/Apply'
import * as O from 'fp-ts/lib/Option'
import * as E from 'fp-ts/lib/Either'

const ApplyContainer = () => {
  // common types
  const commonTypesTx = `
  // The \`Apply\` class provides the \`ap\` which is used to apply a function to an argument under a type constructor.

  // \`Apply\` can be used to lift functions of two or more arguments to work on values wrapped with the type constructor
  // \`f\`.

  // Instances must satisfy the following law in addition to the \`Functor\` laws:

  // 1. Associative composition: \`F.ap(F.ap(F.map(fbc, bc => ab => a => bc(ab(a))), fab), fa) = F.ap(fbc, F.ap(fab, fa))\`
  
  // Formally, \`Apply\` represents a strong lax semi-monoidal endofunctor.
  
  interface Apply<F> extends Functor<F> {
    readonly ap: <A, B>(fab: HKT<F, (a: A) => B>, fa: HKT<F, A>) => HKT<F, B>
  }
  
  interface Apply1<F extends URIS> extends Functor1<F> {
    readonly ap: <A, B>(fab: Kind<F, (a: A) => B>, fa: Kind<F, A>) => Kind<F, B>
  }
  
  interface Apply2<F extends URIS2> extends Functor2<F> {
    readonly ap: <E, A, B>(fab: Kind2<F, E, (a: A) => B>, fa: Kind2<F, E, A>) => Kind2<F, E, B>
  }
  
  interface Apply2C<F extends URIS2, E> extends Functor2C<F, E> {
    readonly ap: <A, B>(fab: Kind2<F, E, (a: A) => B>, fa: Kind2<F, E, A>) => Kind2<F, E, B>
  }
  
  interface Apply3<F extends URIS3> extends Functor3<F> {
    readonly ap: <R, E, A, B>(fab: Kind3<F, R, E, (a: A) => B>, fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
  }
  
  interface Apply3C<F extends URIS3, E> extends Functor3C<F, E> {
    readonly ap: <R, A, B>(fab: Kind3<F, R, E, (a: A) => B>, fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
  }
  
  interface Apply4<F extends URIS4> extends Functor4<F> {
    readonly ap: <S, R, E, A, B>(fab: Kind4<F, S, R, E, (a: A) => B>, fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, B>
  }
  
  type EnforceNonEmptyRecord<R> = keyof R extends never ? never : R
  `

  // common functions
  const commonFunctionsTx = `
  function curried(f: Function, n: number, acc: Array<unknown>) {
    return function(x: unknown) {
      const combined = acc.concat([x])
      return n === 0 ? f.apply(null, combined) : curried(f, n - 1, combined)
    }
  }
  
  const tupleConstructors: Record<number, (a: unknown) => unknown> = {}
  
  function getTupleConstructor(len: number): (a: unknown) => any {
    if (!tupleConstructors.hasOwnProperty(len)) {
      tupleConstructors[len] = curried(tuple, len - 1, [])
    }
    
    return tupleConstructors[len]
  }
  
  function getRecordConstructor(keys: Array<string>) {
  const len = keys.length
  
  return curried(
    (...args: Array<unknown>) => {
      const r: Record<string, unknown> = {}
      for (let i = 0; i < len; i++) {
        r[keys[i]] = args[i]
      }
      return r
    },
    len - 1,
    []
  )
}
  `

  // sequenceT
  const sequenceTTx = `
  function sequenceT<F extends URIS4>(
    F: Apply4<F>
  ): <S, R, E, T extends Array<Kind4<F, S, R, E, any>>>(
    ...t: T & { 0: Kind4<F, S, R, E, any> }
  ) => Kind4<F, S, R, E, { [K in keyof T]: [T[K]] extends [Kind4<F, S, R, E, infer A>] ? A : never }>
  
  function sequenceT<F extends URIS3>(
    F: Apply3<F>
  ): <R, E, T extends Array<Kind3<F, R, E, any>>>(
    ...t: T & { 0: Kind3<F, R, E, any> }
  ) => Kind3<F, R, E, { [K in keyof T]: [T[K]] extends [Kind3<F, R, E, infer A>] ? A : never }>
  
  function sequenceT<F extends URIS3, E>(
    F: Apply3C<F, E>
  ): <R, T extends Array<Kind3<F, R, E, any>>>(
    ...t: T & { 0: Kind3<F, R, E, any> }
  ) => Kind3<F, R, E, { [K in keyof T]: [T[K]] extends [Kind3<F, R, E, infer A>] ? A : never }>
  
  function sequenceT<F extends URIS2>(
    F: Apply2<F>
  ): <E, T extends Array<Kind2<F, E, any>>>(
    ...t: T & { 0: Kind2<F, E, any> }
  ) => Kind2<F, E, { [K in keyof T]: [T[K]] extends [Kind2<F, E, infer A>] ? A : never }>
  
  function sequenceT<F extends URIS2, E>(
    F: Apply2C<F, E>
  ): <T extends Array<Kind2<F, E, any>>>(
    ...t: T & { 0: Kind2<F, E, any> }
  ) => Kind2<F, E, { [K in keyof T]: [T[K]] extends [Kind2<F, E, infer A>] ? A : never }>
  
  function sequenceT<F extends URIS>(
    F: Apply1<F>
  ): <T extends Array<Kind<F, any>>>(
    ...t: T & { 0: Kind<F, any> }
  ) => Kind<F, { [K in keyof T]: [T[K]] extends [Kind<F, infer A>] ? A : never }>
  
  function sequenceT<F>(
    F: Apply<F>
  ): <T extends Array<HKT<F, any>>>(
    ...t: T & { 0: HKT<F, any> }
  ) => HKT<F, { [K in keyof T]: [T[K]] extends [HKT<F, infer A>] ? A : never }>
  
  function sequenceT<F>(F: Apply<F>): any {
    return <A>(...args: Array<HKT<F, A>>) => {
      const len = args.length
      const f = getTupleConstructor(len)
      let fas = F.map(args[0], f)
      
      for (let i = 1; i < len; i++) {
        fas = F.ap(fas, args[i])
      }
      
      return fas
    }
  }
  
  // examples
  
  sequenceT(O.option)(some(1)) // ${JSON.stringify(A.sequenceT(O.option)(O.some(1)))}
  sequenceT(O.option)(some(1), some('2')) // ${JSON.stringify(A.sequenceT(O.option)(O.some(1), O.some(2)))}
  sequenceT(O.option)(some(1), some('2')) // ${JSON.stringify(A.sequenceT(O.option)(O.some(1), O.some(2), O.none))}
  `

  // sequenceS
  const sequenceST = `
  function sequenceS<F extends URIS4>(
    F: Apply4<F>
  ): <S, R, E, NER extends Record<string, Kind4<F, S, R, E, any>>>(
    r: EnforceNonEmptyRecord<NER> & Record<string, Kind4<F, S, R, E, any>>
  ) => Kind4<F, S, R, E, { [K in keyof NER]: [NER[K]] extends [Kind4<F, any, any, any, infer A>] ? A : never }>
  
  function sequenceS<F extends URIS3>(
    F: Apply3<F>
  ): <R, E, NER extends Record<string, Kind3<F, R, E, any>>>(
    r: EnforceNonEmptyRecord<NER> & Record<string, Kind3<F, R, E, any>>
  ) => Kind3<F, R, E, { [K in keyof NER]: [NER[K]] extends [Kind3<F, any, any, infer A>] ? A : never }>
  
  function sequenceS<F extends URIS3, E>(
    F: Apply3C<F, E>
  ): <R, NER extends Record<string, Kind3<F, R, E, any>>>(
    r: EnforceNonEmptyRecord<NER> & Record<string, Kind3<F, R, E, any>>
  ) => Kind3<F, R, E, { [K in keyof NER]: [NER[K]] extends [Kind3<F, any, any, infer A>] ? A : never }>
  
  function sequenceS<F extends URIS2>(
    F: Apply2<F>
  ): <E, NER extends Record<string, Kind2<F, E, any>>>(
    r: EnforceNonEmptyRecord<NER> & Record<string, Kind2<F, E, any>>
  ) => Kind2<F, E, { [K in keyof NER]: [NER[K]] extends [Kind2<F, any, infer A>] ? A : never }>
  
  function sequenceS<F extends URIS2, E>(
    F: Apply2C<F, E>
  ): <NER extends Record<string, Kind2<F, E, any>>>(
    r: EnforceNonEmptyRecord<NER>
  ) => Kind2<F, E, { [K in keyof NER]: [NER[K]] extends [Kind2<F, any, infer A>] ? A : never }>
  
  function sequenceS<F extends URIS>(
    F: Apply1<F>
  ): <NER extends Record<string, Kind<F, any>>>(
    r: EnforceNonEmptyRecord<NER>
  ) => Kind<F, { [K in keyof NER]: [NER[K]] extends [Kind<F, infer A>] ? A : never }>
  
  function sequenceS<F>(
    F: Apply<F>
  ): <NER extends Record<string, HKT<F, any>>>(
    r: EnforceNonEmptyRecord<NER>
  ) => HKT<F, { [K in keyof NER]: [NER[K]] extends [HKT<F, infer A>] ? A : never }>
  
  function sequenceS<F>(F: Apply<F>): (r: Record<string, HKT<F, any>>) => HKT<F, Record<string, any>> {
    return r => {
      const keys = Object.keys(r)
      const len = keys.length
      const f = getRecordConstructor(keys)
      let fr = F.map(r[keys[0]], f)
      
      for (let i = 1; i < len; i++) {
        fr = F.ap(fr, r[keys[i]])
      }
      
      return fr
    }
  }
  
  // examples
  
  sequenceS(either)({ a: right(1), b: right(true) }) // ${JSON.stringify(
    A.sequenceS(E.either)({ a: E.right(1), b: E.right(true) })
  )}
  
  sequenceS(either)({ a: right(1), b: left('error') }) // ${JSON.stringify(
    A.sequenceS(E.either)({ a: E.right(1), b: E.left('error') })
  )}
  `

  return (
    <ModuleContainer id='apply'>
      <Title>FP-TS (Apply)</Title>
      <CodeBlock label='common types' codeTx={commonTypesTx} />
      <CodeBlock label='common functions' codeTx={commonFunctionsTx} />
      <CodeBlock label='sequenceT' codeTx={sequenceTTx} />
      <CodeBlock label='sequenceS' codeTx={sequenceST} />
    </ModuleContainer>
  )
}

export { ApplyContainer }
