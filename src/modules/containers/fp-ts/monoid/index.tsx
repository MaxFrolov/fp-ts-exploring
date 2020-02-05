import * as React from 'react'
// view components
import { CodeBlock } from '@md-components/code-block'
// views
import { ModuleContainer, Title } from '@md-views'
// libs
import * as M from 'fp-ts/lib/Monoid'
import { boundedNumber } from 'fp-ts/lib/Bounded'

const MonoidContainer = () => {
  // common types
  const commonTypesTx = `
  interface Monoid<A> extends Semigroup<A> {
    readonly empty: A
  }
  `

  // monoidAll
  const monoidAllTx = `
  // Boolean monoid under conjunction
  
  const monoidAll: Monoid<boolean> = {
    concat: semigroupAll.concat,
    empty: true
  }
  
  monoidAll.concat(monoidAll.empty, !!0) // ${M.monoidAll.concat(M.monoidAll.empty, !!0)}
  monoidAll.concat(!!1, monoidAll.empty) // ${M.monoidAll.concat(!!1, M.monoidAll.empty)}
  monoidAll.concat(!!0, monoidAll.empty) // ${M.monoidAll.concat(!!0, M.monoidAll.empty)}
  `

  // monoidAny
  const monoidAnyTx = `
  // Boolean monoid under disjunction
  
  const monoidAny: Monoid<boolean> = {
    concat: semigroupAny.concat,
    empty: false
  }
  
  monoidAny.concat(monoidAny.empty, !!0) // ${M.monoidAll.concat(M.monoidAny.empty, !!0)}
  monoidAny.concat(!!1, monoidAny.empty) // ${M.monoidAll.concat(!!1, M.monoidAny.empty)}
  monoidAny.concat(!!0, monoidAny.empty) // ${M.monoidAll.concat(!!0, M.monoidAny.empty)}
  monoidAny.concat(!!1, !!1) // ${M.monoidAll.concat(!!1, !!1)}
  `

  // monoidSum
  const monoidSumTx = `
  // Number monoid under addition
  
  const monoidSum: Monoid<number> = {
    concat: semigroupSum.concat,
    empty: 0
  }
  
  monoidSum.concat(1, monoidSum.empty) // ${M.monoidSum.concat(1, M.monoidSum.empty)}
  monoidSum.concat(monoidSum.empty, 1) // ${M.monoidSum.concat(M.monoidSum.empty, 1)}
  monoidSum.concat(1, 1) // ${M.monoidSum.concat(1, 1)}
  `

  // monoidProduct
  const monoidProductTx = `
  // Number monoid under multiplication
  
  const monoidProduct: Monoid<number> = {
    concat: semigroupProduct.concat,
    empty: 1
  }
  
  monoidProduct.concat(monoidProduct.empty, 2) // ${M.monoidProduct.concat(M.monoidProduct.empty, 2)}
  monoidProduct.concat(3, 2) // ${M.monoidProduct.concat(3, 2)}
  monoidProduct.concat(0, 2) // ${M.monoidProduct.concat(0, 2)}
  `

  // monoidString
  const monoidStringTx = `
  const monoidString: Monoid<string> = {
    concat: semigroupString.concat,
    empty: ''
  }
  
  monoidString.concat(monoidString.empty, 'hello') // ${M.monoidString.concat(M.monoidString.empty, 'hello')}
  monoidString.concat('hello', 'world') // ${M.monoidString.concat('hello', 'world')}
  monoidString.concat('hello', monoidString.empty) // ${M.monoidString.concat('hello', M.monoidString.empty)}
  `

  // monoidVoid
  const monoidVoidTx = `
  const monoidVoid: Monoid<void> = {
    concat: semigroupVoid.concat,
    empty: undefined
  }
  
  monoidVoid.concat(undefined, null) // ${M.monoidVoid.concat(undefined, undefined)}
  `

  // fold
  const foldTx = `
  function fold<A>(M: Monoid<A>): (as: Array<A>) => A {
    const foldSemigroupM = foldSemigroup(M)
    return as => foldSemigroupM(M.empty, as)
  }
  
  fold(monoidString)(['hello', 'world', monoidString.empty]) // ${JSON.stringify(
    M.fold(M.monoidString)(['hello', 'world', M.monoidString.empty])
  )}
  
  fold(monoidSum)([1, 2, 3]) // ${M.fold(M.monoidSum)([1, 2, 3])}
  `

  // getTupleMonoid
  const M1 = M.getTupleMonoid(M.monoidString, M.monoidSum)
  const M2 = M.getTupleMonoid(M.monoidString, M.monoidSum, M.monoidAll)

  const getTupleMonoidTx = `
  function getTupleMonoid<T extends Array<Monoid<any>>>(
    ...monoids: T
  ): Monoid<{ [K in keyof T]: T[K] extends Semigroup<infer A> ? A : never }> {
    return {
      concat: getTupleSemigroup(...monoids).concat,
      empty: monoids.map(m => m.empty)
    } as any
  }
  
  const M1 = getTupleMonoid(monoidString, monoidSum)
  const M2 = getTupleMonoid(monoidString, monoidSum, monoidAll)
  
  M1.concat(['a', 1], ['b', 2]) // ${JSON.stringify(M1.concat(['a', 1], ['b', 2]))}
  M2.concat(['a', 1, true], ['b', 2, false]) // ${JSON.stringify(M2.concat(['a', 1, true], ['b', 2, false]))}
  `

  // getDualMonoid
  const getDualMonoidTx = `
  function getDualMonoid<A>(M: Monoid<A>): Monoid<A> {
    return {
      concat: getDualSemigroup(M).concat,
      empty: M.empty
    }
  }
  
  getDualMonoid(monoidString).concat('hello', 'world') // ${JSON.stringify(
    M.getDualMonoid(M.monoidString).concat('hello', 'world')
  )}
  getDualMonoid(monoidSum).concat(3, 5) // ${JSON.stringify(M.getDualMonoid(M.monoidSum).concat(3, 5))}
  getDualMonoid(monoidSum).concat(3, monoidSum.empty) // ${JSON.stringify(
    M.getDualMonoid(M.monoidSum).concat(3, M.monoidSum.empty)
  )}
  `

  // getFunctionMonoid
  const getFunctionMonoidTx = `
  function getFunctionMonoid<M>(M: Monoid<M>): <A = never>() => Monoid<(a: A) => M> {
    return () => ({
      concat: getFunctionSemigroup(M)<any>().concat,
      empty: () => M.empty
    })
  }
  
  getFunctionMonoid<string>(M.monoidString)<string>().concat(
      a => a + ' James, ',
      b => b + M.monoidString.empty
  )('hello') // ${M.getFunctionMonoid<string>(M.monoidString)<string>().concat(
    a => a + ' James, ',
    b => b + M.monoidString.empty
  )('hello')}
  getFunctionMonoid<number>(M.monoidSum)<number>().concat(
      a => a + 2,
      b => b + M.monoidSum.empty
  )(1) // ${M.getFunctionMonoid<number>(M.monoidSum)<number>().concat(
    a => a + 2,
    b => b + M.monoidSum.empty
  )(1)}
  `

  // getEndomorphismMonoid
  const double = (n: number) => n * 2
  const inc = (n: number) => n + 1
  const EM = M.getEndomorphismMonoid<number>()

  const getEndomorphismMonoidTx = `
  function getEndomorphismMonoid<A = never>(): Monoid<Endomorphism<A>> {
    return {
      concat: (x, y) => a => x(y(a)),
      empty: identity
    }
  }
  
  const double = (n: number) => n * 2
  const inc = (n: number) => n + 1
  const EM = getEndomorphismMonoid<number>()
  
  EM.concat(double, inc)(3) // ${M.getEndomorphismMonoid<number>().concat(double, inc)(3)}
  EM.concat(double, EM.empty)(3) // ${M.getEndomorphismMonoid<number>().concat(double, EM.empty)(3)}
  `

  // getStructMonoid
  const G1 = M.getStructMonoid<[number, string]>([M.monoidSum, M.monoidString])

  const getStructMonoidTx = `
  function getStructMonoid<O extends { [key: string]: any }>(
    monoids: { [K in keyof O]: Monoid<O[K]> }
  ): Monoid<O> {
    const empty: any = {}
    
    for (const key of Object.keys(monoids)) {
      empty[key] = monoids[key].empty
    }
    
    return {
      concat: getStructSemigroup<O>(monoids).concat,
      empty
    }
  }
  
  const G1 = M.getStructMonoid([M.monoidSum, M.monoidString])
  
  G1.concat([M.monoidSum.empty, M.monoidString.empty], [4, 'Michael']) // ${JSON.stringify(
    G1.concat([M.monoidSum.empty, M.monoidString.empty], [4, 'Michael'])
  )}
  `

  // getMeetMonoid
  const getMeetMonoidTx = `
  function getMeetMonoid<A>(B: Bounded<A>): Monoid<A> {
    return {
      concat: getMeetSemigroup(B).concat,
      empty: B.top
    }
  }
  
  fold(getMeetMonoid(boundedNumber))([]) // ${JSON.stringify(M.fold(M.getMeetMonoid(boundedNumber))([]))}
  fold(getMeetMonoid(boundedNumber))([1]) // ${JSON.stringify(M.fold(M.getMeetMonoid(boundedNumber))([1]))}
  fold(getMeetMonoid(boundedNumber))([2, 3]) // ${JSON.stringify(M.fold(M.getMeetMonoid(boundedNumber))([2, 3]))}
  fold(getMeetMonoid(boundedNumber))([1, -1]) // ${JSON.stringify(M.fold(M.getMeetMonoid(boundedNumber))([1, -1]))}
  `

  // getMeetMonoid
  const getJoinMonoidTx = `
  function function getJoinMonoid<A>(B: Bounded<A>): Monoid<A> {
    return {
      concat: getJoinSemigroup(B).concat,
      empty: B.bottom
    }
  }
  
  fold(getJoinMonoid(boundedNumber))([]) // ${JSON.stringify(M.fold(M.getJoinMonoid(boundedNumber))([]))}
  fold(getJoinMonoid(boundedNumber))([1]) // ${JSON.stringify(M.fold(M.getJoinMonoid(boundedNumber))([1]))}
  fold(getJoinMonoid(boundedNumber))([2, 3]) // ${JSON.stringify(M.fold(M.getJoinMonoid(boundedNumber))([2, 3]))}
  fold(getJoinMonoid(boundedNumber))([1, -1]) // ${JSON.stringify(M.fold(M.getJoinMonoid(boundedNumber))([1, -1]))}
  `

  return (
    <ModuleContainer id='monoid'>
      <Title>FP-TS (Monoid)</Title>
      <CodeBlock label='commonTypes' codeTx={commonTypesTx} />
      <CodeBlock label='monoidAll' codeTx={monoidAllTx} />
      <CodeBlock label='monoidAny' codeTx={monoidAnyTx} />
      <CodeBlock label='monoidSum' codeTx={monoidSumTx} />
      <CodeBlock label='monoidProduct' codeTx={monoidProductTx} />
      <CodeBlock label='monoidString' codeTx={monoidStringTx} />
      <CodeBlock label='monoidVoid' codeTx={monoidVoidTx} />
      <CodeBlock label='fold' codeTx={foldTx} />
      <CodeBlock label='getTupleMonoid' codeTx={getTupleMonoidTx} />
      <CodeBlock label='getDualMonoid' codeTx={getDualMonoidTx} />
      <CodeBlock label='getFunctionMonoid' codeTx={getFunctionMonoidTx} />
      <CodeBlock label='getEndomorphismMonoid' codeTx={getEndomorphismMonoidTx} />
      <CodeBlock label='getStructMonoid' codeTx={getStructMonoidTx} />
      <CodeBlock label='getMeetMonoid' codeTx={getMeetMonoidTx} />
      <CodeBlock label='getJoinMonoid' codeTx={getJoinMonoidTx} />
    </ModuleContainer>
  )
}

export { MonoidContainer }
