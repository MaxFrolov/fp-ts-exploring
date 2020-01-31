import * as React from 'react'
// view components
import { CodeBlock } from '@md-components/code-block'
// views
import { ModuleContainer, Title } from '@md-views'
// libs
import * as Mo from 'fp-ts/lib/Monoid'
import * as S from 'fp-ts/lib/Semigroup'
import * as O from 'fp-ts/lib/Ord'

const SemigroupContainer = () => {
  // common info
  const commonTx = `
  // A \`Magma\` is a pair \`(A, concat)\` in which \`A\` is a non-empty set and \`concat\` is a binary operation on \`A\`
  
  interface Magma<A> {
    readonly concat: (x: A, y: A) => A
  }
  
  // A \`Semigroup\` is a \`Magma\` where \`concat\` is associative, that is:
  // Associativity \`concat(concat(x, y), z) = concat(x, concat(y, z))\`
  
  interface Semigroup<A> extends Magma<A> {}
  `

  // fold
  const foldTx = `
  import { monoidString, monoidSum } from 'fp-ts/lib/Monoid'
  
  function fold<A>(S: Semigroup<A>): (a: A, as: Array<A>) => A {
    return (a, as) => as.reduce(S.concat, a)
  }
  
  fold<string>(monoidString)('hello', [' my', ' world', monoidString.empty]) // ${JSON.stringify(
    S.fold<string>(Mo.monoidString)('hello', [' my', ' world', Mo.monoidString.empty])
  )}
  fold<number>(monoidSum)(1, [3, 5, monoidSum.empty]) // ${JSON.stringify(
    S.fold<number>(Mo.monoidSum)(1, [3, 5, Mo.monoidSum.empty])
  )}
  `

  // getFirstSemigroup
  const getFirstSemigroupTx = `
  function getFirstSemigroup<A = never>(): Semigroup<A> {
    return { concat: identity }
  }
  
  getFirstSemigroup<number>().concat(1, 2) // ${S.getFirstSemigroup<number>().concat(1, 2)}
  getFirstSemigroup<number>().concat(3, 5) // ${S.getFirstSemigroup<number>().concat(3, 5)}
  `

  // getLastSemigroup
  const getLastSemigroupTx = `
  function getLastSemigroup<A = never>(): Semigroup<A> {
    return { concat: (_, y) => y }
  }
  
  getLastSemigroup<number>().concat(1, 2) // ${S.getLastSemigroup<number>().concat(1, 2)}
  getLastSemigroup<number>().concat(3, 5) // ${S.getLastSemigroup<number>().concat(3, 5)}
  `

  // getTupleSemigroup
  const getTupleSemigroupTx = `
  function getTupleSemigroup<T extends Array<Semigroup<any>>>(
    ...semigroups: T
  ): Semigroup<{ [K in keyof T]: T[K] extends Semigroup<infer A> ? A : never }> {
    return {
      concat: (x, y) => semigroups.map((s, i) => s.concat(x[i], y[i])) as any
    }
  }
  
  const S1 = getTupleSemigroup(semigroupString, semigroupSum)
  const S2 = getTupleSemigroup(semigroupString, semigroupSum, semigroupAll)
  
  S1.concat(['a', 1], ['b', 2]) // ${JSON.stringify(
    S.getTupleSemigroup(S.semigroupString, S.semigroupSum).concat(['a', 1], ['b', 2])
  )}
  S2.concat(['a', 1, true], ['b', 2, false]) // ${JSON.stringify(
    S.getTupleSemigroup(S.semigroupString, S.semigroupSum, S.semigroupAll).concat(['a', 1, true], ['b', 2, false])
  )}
  `

  // getDualSemigroup
  const getDualSemigroupTx = `
  function getDualSemigroup<A>(S: Semigroup<A>): Semigroup<A> {
    return {
      concat: (x, y) => S.concat(y, x)
    }
  }
  
  getDualSemigroup<number>(semigroupSum).concat(3, 5) // ${S.getDualSemigroup<number>(S.semigroupSum).concat(3, 5)}
  getDualSemigroup<string>(semigroupString).concat(' world', 'hello') // ${S.getDualSemigroup<string>(
    S.semigroupString
  ).concat(' world', 'hello')}
  `

  // getFunctionSemigroup
  const getFunctionSemigroupTx = `
  function getFunctionSemigroup<S>(S: Semigroup<S>): <A = never>() => Semigroup<(a: A) => S> {
    return () => ({
      concat: (f, g) => a => S.concat(f(a), g(a))
    })
  }
  
  getFunctionSemigroup<string>(S.semigroupString)<string>().concat(
      a => a + ' James, ',
      b => b + ' Michael'
  )('hello') // ${JSON.stringify(
    S.getFunctionSemigroup<string>(S.semigroupString)<string>().concat(
      a => a + ' James, ',
      b => b + ' Michael'
    )('hello')
  )}
  getFunctionSemigroup<number>(S.semigroupString)<number>().concat(
      a => a + 2,
      b => b + 3
  )(1) // ${JSON.stringify(
    S.getFunctionSemigroup<number>(S.semigroupSum)<number>().concat(
      a => a + 2,
      b => b + 3
    )(1)
  )}
  `

  // getStructSemigroup
  const G1 = S.getStructSemigroup([S.semigroupSum, S.semigroupString])

  const getStructSemigroupTx = `
  function getStructSemigroup<O extends { [key: string]: any }>(
    semigroups: { [K in keyof O]: Semigroup<O[K]> }
  ): Semigroup<O> {
    return {
      concat: (x, y) => {
        const r: any = {}
        
        for (const key of Object.keys(semigroups)) {
          r[key] = semigroups[key].concat(x[key], y[key])
        }
        
        return r
      }
    }
  }
  
  const G1 = S.getStructSemigroup([S.semigroupSum, S.semigroupString])
  
  G1.concat([5, 'Hello '], [4, 'Michael']) // ${JSON.stringify(G1.concat([5, 'Hello '], [4, 'Michael']))}
  `

  // getMeetSemigroup
  const getMeetSemigroupTx = `
  function getMeetSemigroup<A>(O: Ord<A>): Semigroup<A> {
    return {
      concat: min(O)
    }
  }
  
  getMeetSemigroup(O.ordNumber).concat(2, 4) // ${JSON.stringify(S.getMeetSemigroup(O.ordNumber).concat(2, 4))}
  getMeetSemigroup(O.ordNumber).concat(6, 3) // ${JSON.stringify(S.getMeetSemigroup(O.ordNumber).concat(6, 3))}
  `

  // getJoinSemigroup
  const getJoinSemigroupTx = `
  function getJoinSemigroup<A>(O: Ord<A>): Semigroup<A> {
    return {
      concat: max(O)
    }
  }
  
  getJoinSemigroup(O.ordNumber).concat(2, 4) // ${JSON.stringify(S.getJoinSemigroup(O.ordNumber).concat(2, 4))}
  getJoinSemigroup(O.ordNumber).concat(6, 3) // ${JSON.stringify(S.getJoinSemigroup(O.ordNumber).concat(6, 3))}
  `

  // getObjectSemigroup
  type T = {
    foo?: number
    bar: string
  }

  const foo: T = {
    foo: 123,
    bar: '456'
  }

  const bar: T = {
    bar: '123'
  }

  const getObjectSemigroupTx = `
  // Returns a \`Semigroup\` instance for objects preserving their type
  
  function getObjectSemigroup<A extends object = never>(): Semigroup<A> {
    return {
      concat: (x, y) => Object.assign({}, x, y)
    }
  }
  
  type T = {
    foo?: number
    bar: string
  }
  
  const foo: T = {
    foo: 123,
    bar: '456'
  }
  
  const bar: T = {
    bar: '123'
  }

  getObjectSemigroup<T>().concat(foo, bar) // ${JSON.stringify(S.getObjectSemigroup<T>().concat(foo, bar))}
  `

  // semigroupAll
  const semigroupAllTx = `
  // Boolean semigroup under conjunction
  
  const semigroupAll: Semigroup<boolean> = {
    concat: (x, y) => x && y
  }
  
  semigroupAll.concat(!!1, !!0) // ${JSON.stringify(S.semigroupAll.concat(!!1, !!0))}
  semigroupAll.concat(!!0, !!1) // ${JSON.stringify(S.semigroupAll.concat(!!0, !!1))}
  semigroupAll.concat(!!1, !!1) // ${JSON.stringify(S.semigroupAll.concat(!!1, !!1))}
  `

  // semigroupAny
  const semigroupAnyTX = `
  // Boolean semigroup under disjunction
  
  const semigroupAny: Semigroup<boolean> = {
    concat: (x, y) => x || y
  }
  
  semigroupAny.concat(!!1, !!0) // ${JSON.stringify(S.semigroupAny.concat(!!1, !!0))}
  semigroupAny.concat(!!0, !!1) // ${JSON.stringify(S.semigroupAny.concat(!!0, !!1))}
  semigroupAny.concat(!!1, !!1) // ${JSON.stringify(S.semigroupAny.concat(!!1, !!1))}
  `

  // semigroupSum
  const semigroupSumTx = `
  // Number \`Semigroup\` under addition
  
  const semigroupSum: Semigroup<number> = {
    concat: (x, y) => x + y
  }
  
  semigroupSum.concat(2, 3) // ${JSON.stringify(S.semigroupSum.concat(2, 3))}
  semigroupSum.concat(0, 5) // ${JSON.stringify(S.semigroupSum.concat(0, 5))}
  `

  // semigroupProduct
  const semigroupProductTx = `
  // Number \`Semigroup\` under multiplication
  
  const semigroupProduct: Semigroup<number> = {
    concat: (x, y) => x * y
  }
  
  semigroupProduct.concat(2, 3) // ${JSON.stringify(S.semigroupProduct.concat(2, 3))}
  semigroupProduct.concat(0, 5) // ${JSON.stringify(S.semigroupProduct.concat(0, 5))}
  `

  // semigroupString
  const semigroupStringTx = `
  const semigroupString: Semigroup<string> = {
    concat: (x, y) => x + y
  }
  
  semigroupString.concat('hello', 'world') // ${JSON.stringify(S.semigroupString.concat('hello', 'world'))}
  semigroupString.concat('0', '5') // ${JSON.stringify(S.semigroupString.concat('0', '5'))}
  `

  const semigroupVoidTx = `
  const semigroupVoid: Semigroup<void> = {
    concat: () => undefined
  }
  
  semigroupVoid.concat() // ${JSON.stringify(S.semigroupVoid.concat())}
  `

  return (
    <ModuleContainer id='semigroup'>
      <Title>FP-TS (Semigroup)</Title>
      <CodeBlock label='common info' codeTx={commonTx} />
      <CodeBlock label='fold' codeTx={foldTx} />
      <CodeBlock label='getFirstSemigroup' codeTx={getFirstSemigroupTx} />
      <CodeBlock label='getLastSemigroup' codeTx={getLastSemigroupTx} />
      <CodeBlock label='getTupleSemigroup' codeTx={getTupleSemigroupTx} />
      <CodeBlock label='getDualSemigroup' codeTx={getDualSemigroupTx} />
      <CodeBlock label='getFunctionSemigroup' codeTx={getFunctionSemigroupTx} />
      <CodeBlock label='getStructSemigroup' codeTx={getStructSemigroupTx} />
      <CodeBlock label='getMeetSemigroup' codeTx={getMeetSemigroupTx} />
      <CodeBlock label='getJoinSemigroup' codeTx={getJoinSemigroupTx} />
      <CodeBlock label='getObjectSemigroup' codeTx={getObjectSemigroupTx} />
      <CodeBlock label='semigroupAll' codeTx={semigroupAllTx} />
      <CodeBlock label='semigroupAny' codeTx={semigroupAnyTX} />
      <CodeBlock label='semigroupSum' codeTx={semigroupSumTx} />
      <CodeBlock label='semigroupProduct' codeTx={semigroupProductTx} />
      <CodeBlock label='semigroupString' codeTx={semigroupStringTx} />
      <CodeBlock label='semigroupVoid' codeTx={semigroupVoidTx} />
    </ModuleContainer>
  )
}

export { SemigroupContainer }
