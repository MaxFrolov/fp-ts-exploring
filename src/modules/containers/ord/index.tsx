import * as React from 'react'
// view components
import { CodeBlock } from '@md-components/code-block'
// views
import { ModuleContainer, Title } from '@md-views'
// libs
import * as Ord from 'fp-ts/lib/Ord'
import * as Mo from 'fp-ts/lib/Monoid'
import * as Arr from 'fp-ts/lib/Array'
import { monoidOrdering } from 'fp-ts/lib/Ordering'

const OrdContainer = () => {
  // common types
  const commonTx = `
  declare module './HKT' {
    interface URItoKind<A> {
      Ord: Ord<A>
    }
  }
  
  const URI = 'Ord'
  type URI = typeof URI
  
  interface Ord<A> extends Eq<A> {
    readonly compare: (x: A, y: A) => Ordering
  }
  
  // default compare for primitive types
  
  const compare = (x: any, y: any): Ordering => {
    return x < y ? -1 : x > y ? 1 : 0
  }
  
  function strictEqual<A>(a: A, b: A): boolean {
    return a === b
  }
  `

  // ordString
  const ordStringTx = `
  const ordString: Ord<string> = {
    equals: strictEqual,
    compare
  }
  
  ordString.equals('a', 'b') // ${Ord.ordString.equals('a', 'b')}
  ordString.equals('a', 'a') // ${Ord.ordString.equals('a', 'a')}
  ordString.compare('a', 'b') // ${Ord.ordString.compare('a', 'b')}
  ordString.compare('a', 'a') // ${Ord.ordString.compare('a', 'a')}
  `

  // ordString
  const ordNumberTx = `
  const ordNumber: Ord<number> = {
    equals: strictEqual,
    compare
  }
  
  ordNumber.equals(1, 2) // ${Ord.ordNumber.equals(1, 2)}
  ordNumber.equals(1, 1) // ${Ord.ordNumber.equals(1, 1)}
  ordNumber.compare(1, 1) // ${Ord.ordNumber.compare(1, 1)}
  ordNumber.compare(1, 2) // ${Ord.ordNumber.compare(1, 2)}
  `

  // ordString
  const ordBooleanTx = `
  const ordBoolean: Ord<boolean> = {
    equals: strictEqual,
    compare
  }
  
  ordBoolean.equals(!'a', !'b') // ${Ord.ordBoolean.equals(!'a', !'b')}
  ordBoolean.equals(!'a', !!'a') // ${Ord.ordBoolean.equals(!'a', !!'a')}
  ordBoolean.compare(!'a', !!'b') // ${Ord.ordBoolean.compare(!'a', !!'b')}
  ordBoolean.compare(!'a', !'a') // ${Ord.ordBoolean.compare(!'a', !'a')}
  `

  // lt
  const ltTx = `
  // Test whether one value is _strictly less than_ another
  
  function lt<A>(O: Ord<A>): (x: A, y: A) => boolean {
    return (x, y) => O.compare(x, y) === -1
  }
  
  lt<number>(ordNumber)(1, 2) // ${Ord.lt<number>(Ord.ordNumber)(1, 2)}
  lt<number>(ordNumber)(1, 1) // ${Ord.lt<number>(Ord.ordNumber)(1, 1)}
  lt<number>(ordNumber)(3, 1) // ${Ord.lt<number>(Ord.ordNumber)(3, 1)}
  lt<string>(ordString)('a', 'b') // ${Ord.lt<string>(Ord.ordString)('a', 'b')}
  lt<string>(ordString)('a', 'a') // ${Ord.lt<string>(Ord.ordString)('a', 'a')}
  lt<string>(ordString)('c', 'a') // ${Ord.lt<string>(Ord.ordString)('c', 'a')}
  `

  // gt
  const gtTx = `
  // Test whether one value is _strictly greater than_ another
  
  function gt<A>(O: Ord<A>): (x: A, y: A) => boolean {
    return (x, y) => O.compare(x, y) === 1
  }
  
  gt<number>(ordNumber)(1, 2) // ${Ord.gt<number>(Ord.ordNumber)(1, 2)}
  gt<number>(ordNumber)(3, 1) // ${Ord.gt<number>(Ord.ordNumber)(3, 1)}
  gt<number>(ordNumber)(1, 1) // ${Ord.gt<number>(Ord.ordNumber)(1, 1)}
  gt<string>(ordString)('a', 'b') // ${Ord.gt<string>(Ord.ordString)('a', 'b')}
  gt<string>(ordString)('c', 'a') // ${Ord.gt<string>(Ord.ordString)('c', 'a')}
  gt<string>(ordString)('a', 'a') // ${Ord.gt<string>(Ord.ordString)('a', 'a')}
  `

  // leq
  const leqTx = `
  // Test whether one value is _non-strictly less than_ another
  
  function leq<A>(O: Ord<A>): (x: A, y: A) => boolean {
    return (x, y) => O.compare(x, y) !== 1
  }
  
  leq<number>(ordNumber)(1, 2) // ${Ord.leq<number>(Ord.ordNumber)(1, 2)}
  leq<number>(ordNumber)(3, 1) // ${Ord.leq<number>(Ord.ordNumber)(3, 1)}
  leq<number>(ordNumber)(1, 1) // ${Ord.leq<number>(Ord.ordNumber)(1, 1)}
  leq<string>(ordString)('a', 'b') // ${Ord.leq<string>(Ord.ordString)('a', 'b')}
  leq<string>(ordString)('c', 'a') // ${Ord.leq<string>(Ord.ordString)('c', 'a')}
  leq<string>(ordString)('a', 'a') // ${Ord.leq<string>(Ord.ordString)('a', 'a')}
  `

  // geq
  const geqTx = `
  // Test whether one value is _non-strictly greater than_ another
  
  function leq<A>(O: Ord<A>): (x: A, y: A) => boolean {
    return (x, y) => O.compare(x, y) !== 1
  }
  
  geq<number>(ordNumber)(1, 2) // ${Ord.geq<number>(Ord.ordNumber)(1, 2)}
  geq<number>(ordNumber)(3, 1) // ${Ord.geq<number>(Ord.ordNumber)(3, 1)}
  geq<number>(ordNumber)(1, 1) // ${Ord.geq<number>(Ord.ordNumber)(1, 1)}
  geq<string>(ordString)('a', 'b') // ${Ord.geq<string>(Ord.ordString)('a', 'b')}
  geq<string>(ordString)('c', 'a') // ${Ord.geq<string>(Ord.ordString)('c', 'a')}
  geq<string>(ordString)('a', 'a') // ${Ord.geq<string>(Ord.ordString)('a', 'a')}
  `

  // min
  const minTx = `
  // Take the minimum of two values. If they are considered equal, the first argument is chosen
  
  function min<A>(O: Ord<A>): (x: A, y: A) => A {
    return (x, y) => (O.compare(x, y) === 1 ? y : x)
  }
  
  min<number>(ordNumber)(1, 2) // ${Ord.min<number>(Ord.ordNumber)(1, 2)}
  min<number>(ordNumber)(3, 1) // ${Ord.min<number>(Ord.ordNumber)(3, 1)}
  min<number>(ordNumber)(1, 1) // ${Ord.min<number>(Ord.ordNumber)(1, 1)}
  min<string>(ordString)('a', 'b') // ${Ord.min<string>(Ord.ordString)('a', 'b')}
  min<string>(ordString)('c', 'a') // ${Ord.min<string>(Ord.ordString)('c', 'a')}
  min<string>(ordString)('a', 'a') // ${Ord.min<string>(Ord.ordString)('a', 'a')}
  `

  // max
  const maxTx = `
  // Take the maximum of two values. If they are considered equal, the first argument is chosen
  
  function max<A>(O: Ord<A>): (x: A, y: A) => A {
    return (x, y) => (O.compare(x, y) === -1 ? y : x)
  }
  
  max<number>(ordNumber)(1, 2) // ${Ord.max<number>(Ord.ordNumber)(1, 2)}
  max<number>(ordNumber)(3, 1) // ${Ord.max<number>(Ord.ordNumber)(3, 1)}
  max<number>(ordNumber)(1, 1) // ${Ord.max<number>(Ord.ordNumber)(1, 1)}
  max<string>(ordString)('a', 'b') // ${Ord.max<string>(Ord.ordString)('a', 'b')}
  max<string>(ordString)('c', 'a') // ${Ord.max<string>(Ord.ordString)('c', 'a')}
  max<string>(ordString)('a', 'a') // ${Ord.max<string>(Ord.ordString)('a', 'a')}
  `

  // clamp
  const clampTx = `
  // Clamp a value between a minimum and a maximum
  
  function clamp<A>(O: Ord<A>): (low: A, hi: A) => (x: A) => A {
    const minO = min(O)
    const maxO = max(O)
    
    return (low, hi) => x => maxO(minO(x, hi), low)
  }
  
  clamp<number>(ordNumber)(1, 5)(-1) // ${Ord.clamp<number>(Ord.ordNumber)(1, 5)(-1)}
  clamp<number>(ordNumber)(1, 5)(3) // ${Ord.clamp<number>(Ord.ordNumber)(1, 5)(3)}
  clamp<number>(ordNumber)(1, 5)(7) // ${Ord.clamp<number>(Ord.ordNumber)(1, 5)(7)}
  clamp<string>(ordString)('a', 'd')('a') // ${Ord.clamp<string>(Ord.ordString)('a', 'd')('a')}
  clamp<string>(ordString)('a', 'd')('b') // ${Ord.clamp<string>(Ord.ordString)('a', 'd')('b')}
  clamp<string>(ordString)('a', 'd')('e') // ${Ord.clamp<string>(Ord.ordString)('a', 'd')('e')}
  `

  // between
  const betweenTx = `
  // Test whether a value is between a minimum and a maximum (inclusive)
  
  function between<A>(O: Ord<A>): (low: A, hi: A) => (x: A) => boolean {
    const lessThanO = lt(O)
    const greaterThanO = gt(O)
    
    return (low, hi) => x => (lessThanO(x, low) || greaterThanO(x, hi) ? false : true)
  }
  
  between<number>(ordNumber)(1, 5)(-1) // ${Ord.between<number>(Ord.ordNumber)(1, 5)(-1)}
  between<number>(ordNumber)(1, 5)(3) // ${Ord.between<number>(Ord.ordNumber)(1, 5)(3)}
  between<number>(ordNumber)(1, 5)(7) // ${Ord.between<number>(Ord.ordNumber)(1, 5)(7)}
  between<string>(ordString)('a', 'd')('a') // ${Ord.between<string>(Ord.ordString)('a', 'd')('a')}
  between<string>(ordString)('a', 'd')('b') // ${Ord.between<string>(Ord.ordString)('a', 'd')('b')}
  between<string>(ordString)('a', 'd')('e') // ${Ord.between<string>(Ord.ordString)('a', 'd')('e')}
  `

  // fromCompare
  const fromCompareTx = `
  function fromCompare<A>(compare: (x: A, y: A) => Ordering): Ord<A> {
    const optimizedCompare = (x: A, y: A): Ordering => (x === y ? 0 : compare(x, y))
    
    return {
      equals: (x, y) => optimizedCompare(x, y) === 0,
      compare: optimizedCompare
    }
  }
  
  fromCompare(ordNumber.compare).equals(0, 1) // ${Ord.fromCompare(Ord.ordNumber.compare).equals(0, 1)}
  fromCompare(ordNumber.compare).equals(1, 1) // ${Ord.fromCompare(Ord.ordNumber.compare).equals(1, 1)}
  fromCompare(ordNumber.compare).compare(1, 1) // ${Ord.fromCompare(Ord.ordNumber.compare).compare(1, 1)}
  fromCompare(ordNumber.compare).compare(0, 1) // ${Ord.fromCompare(Ord.ordNumber.compare).compare(0, 1)}
  `

  // getTupleOrd
  const getTupleOrdTx = `
  function getTupleOrd<T extends Array<Ord<any>>>(
    ...ords: T
  ): Ord<{ [K in keyof T]: T[K] extends Ord<infer A> ? A : never }> {
    const len = ords.length
    return fromCompare((x, y) => {
      let i = 0
      for (; i < len - 1; i++) {
        const r = ords[i].compare(x[i], y[i])
        if (r !== 0) {
          return r
        }
      }
      return ords[i].compare(x[i], y[i])
    })
  }
  
  const O = getTupleOrd(ordString, ordNumber, ordBoolean)
  
  O.compare(['a', 1, true], ['b', 2, true]) // ${Ord.getTupleOrd(Ord.ordString, Ord.ordNumber, Ord.ordBoolean).compare(['a', 1, true], ['b', 2, true])}
  O.compare(['a', 1, true], ['a', 2, true]) // ${Ord.getTupleOrd(Ord.ordString, Ord.ordNumber, Ord.ordBoolean).compare(['a', 1, true], ['a', 2, true])}
  O.compare(['a', 1, true], ['a', 1, false]) // ${Ord.getTupleOrd(Ord.ordString, Ord.ordNumber, Ord.ordBoolean).compare(['a', 1, true], ['a', 1, false])}
  `

  // getDualOrd
  const getDualOrdTx = `
  function getDualOrd<A>(O: Ord<A>): Ord<A> {
    return fromCompare((x, y) => O.compare(y, x))
  }
  
  getDualOrd(ordNumber)(1, 2) // ${Ord.getDualOrd(Ord.ordNumber).compare(1, 2)}
  getDualOrd(ordNumber)(2, 1) // ${Ord.getDualOrd(Ord.ordNumber).compare(2, 1)}
  getDualOrd(ordNumber)(2, 2) // ${Ord.getDualOrd(Ord.ordNumber).compare(2, 2)}
  `

  // getMonoid
  type T = [number, string]

  const tuples: Array<T> = [
    [2, 'c'],
    [1, 'b'],
    [2, 'a'],
    [1, 'c']
  ]

  const M = Ord.getMonoid<T>()

  const sortByFst = Ord.ord.contramap(Ord.ordNumber, (x: T) => x[0])
  const sortBySnd = Ord.ord.contramap(Ord.ordString, (x: T) => x[1])

  const O1 = Mo.fold(M)([M.empty, sortByFst, sortBySnd])
  const O2 = Mo.fold(M)([sortBySnd, sortByFst, M.empty])

  const getMonoidTx = `
  import { fromCompare } from 'fp-ts/lib/Ord'
  import { fold } from 'fp-ts/lib/Monoid'
  import { monoidOrdering } from 'fp-ts/lib/Ordering'
  
  const S: Semigroup<Ord<any>> = {
    concat: (x, y) => fromCompare((a, b) => monoidOrdering.concat(x.compare(a, b), y.compare(a, b)))
  }
  
  function getSemigroup<A = never>(): Semigroup<Ord<A>> {
    return S
  }
  
  const M = {
    concat: getSemigroup<any>().concat,
    empty: fromCompare(() => 0)
  }

  function getMonoid<A = never>(): Monoid<Ord<A>> {
    return M
  }
  
  // examples

  type T = [number, string]
  
  const tuples: Array<T> = [
    [2, 'c'],
    [1, 'b'],
    [2, 'a'],
    [1, 'c']
  ]
  
  const M = getMonoid<T>()
  
  const sortByFst = ord.contramap(ordNumber, (x: T) => x[0])
  const sortBySnd = ord.contramap(ordString, (x: T) => x[1])
  
  const O1 = fold(M)([M.empty, sortByFst, sortBySnd])
  const O2 = fold(M)([sortBySnd, sortByFst, M.empty])
  
  sort(O1)(tuples) // ${JSON.stringify(Arr.sort(O1)(tuples))}
  sort(O2)(tuples) // ${JSON.stringify(Arr.sort(O2)(tuples))}
  `

  return (
    <ModuleContainer id='ord'>
      <Title>FP-TS (Ord)</Title>
      <CodeBlock label='common types' codeTx={commonTx} />
      <CodeBlock label='ordString' codeTx={ordStringTx} />
      <CodeBlock label='ordNumber' codeTx={ordNumberTx} />
      <CodeBlock label='ordBoolean' codeTx={ordBooleanTx} />
      <CodeBlock label='lt' codeTx={ltTx} />
      <CodeBlock label='gt' codeTx={gtTx} />
      <CodeBlock label='leq' codeTx={leqTx} />
      <CodeBlock label='geq' codeTx={geqTx} />
      <CodeBlock label='min' codeTx={minTx} />
      <CodeBlock label='max' codeTx={maxTx} />
      <CodeBlock label='clamp' codeTx={clampTx} />
      <CodeBlock label='between' codeTx={betweenTx} />
      <CodeBlock label='fromCompare' codeTx={fromCompareTx} />
      <CodeBlock label='getTupleOrd' codeTx={getTupleOrdTx} />
      <CodeBlock label='getDualOrd' codeTx={getDualOrdTx} />
      <CodeBlock label='getMonoid' codeTx={getMonoidTx} />
    </ModuleContainer>
  )
}

export { OrdContainer }
