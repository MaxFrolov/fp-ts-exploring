import * as React from 'react'
// view components
import { CodeBlock } from '@md-components/code-block'
// views
import { ModuleContainer, Title } from '@md-views'
// libs
import * as Eq from 'fp-ts/lib/Eq'

const EqContainer = () => {
  // common types
  const commonTypesTX = `
  interface Eq<A> {
    readonly equals: (x: A, y: A) => boolean
  }
  `

  // fromEquals
  const fromEqualsTx = `
  function fromEquals<A>(equals: (x: A, y: A) => boolean): Eq<A> {
    return {
      equals: (x, y) => x === y || equals(x, y)
    }
  }
  
  fromEquals<number>((x, y) => x === y).equals(1, 1) // ${JSON.stringify(Eq.fromEquals<number>((x, y) => x === y).equals(1, 1))}
  fromEquals<number>((x, y) => x === y).equals(1, 2) // ${JSON.stringify(Eq.fromEquals<number>((x, y) => x === y).equals(1, 2))}
  `

  // strictEqual
  const strictEqualTx = `
  function strictEqual<A>(a: A, b: A): boolean {
    return a === b
  }
  
  strictEqual<number>(1, 1) // ${JSON.stringify(Eq.strictEqual<number>(1, 1))}
  strictEqual<number>(1, 2) // ${JSON.stringify(Eq.strictEqual<number>(1, 2))}
  `

  // getStructEq
  const getStructEqTx = `
  function getStructEq<O extends { [key: string]: any }>(eqs: { [K in keyof O]: Eq<O[K]> }): Eq<O> {
    return fromEquals((x, y) => {
      for (const k in eqs) {
        if (!eqs[k].equals(x[k], y[k])) {
          return false
        }
      }
      
      return true
    })
  }
  
  const eqStrict = { equals: strictEqual }
  
  const eqString: Eq<string> = eqStrict
  const eqNumber: Eq<number> = eqStrict
  
  interface Person {
    name: string
    age: number
  }
  
  const S = getStructEq<Person>({
    name: eqString,
    age: eqNumber
  })
  
  S.equals({ name: 'a', age: 1 }, { name: 'a', age: 1 }) // true
  S.equals({ name: 'a', age: 1 }, { name: 'a', age: 2 }) // false
  S.equals({ name: 'a', age: 1 }, { name: 'b', age: 1 }) // false
  `

  // getTupleEq
  const getTupleEqTx = `
  function getTupleEq<T extends Array<Eq<any>>>(
    ...eqs: T
  ): Eq<{ [K in keyof T]: T[K] extends Eq<infer A> ? A : never }> {
    return fromEquals((x, y) => eqs.every((E, i) => E.equals(x[i], y[i])))
  }
  
  const eqStrict = { equals: strictEqual }
  
  const eqString: Eq<string> = eqStrict
  const eqNumber: Eq<number> = eqStrict
  const eqBoolean: Eq<boolean> = eqStrict
  
  const E = getTupleEq(eqString, eqNumber, eqBoolean)
  
  E.equals(['a', 1, true], ['a', 1, true]) // true
  E.equals(['a', 1, true], ['b', 1, true]) // false
  E.equals(['a', 1, true], ['a', 2, true]) // false
  E.equals(['a', 1, true], ['a', 1, false]) // false
  `

  // eq
  const eqTx = `
  const eq: Contravariant1<URI> = {
    URI,
    contramap: (fa, f) => fromEquals((x, y) => fa.equals(f(x), f(y)))
  }
  
  const S = eq.contramap(eqString, (p: Person) => p.name)
  
  S.equals({ name: 'a', age: 1 }, { name: 'a', age: 2 }) // true
  S.equals({ name: 'a', age: 1 }, { name: 'a', age: 1 }) // true
  S.equals({ name: 'a', age: 1 }, { name: 'b', age: 1 }) // false
  S.equals({ name: 'a', age: 1 }, { name: 'b', age: 2 }) // false
  `

  // eqDate
  const eqDateTx = `
  const eqDate: Eq<Date> = eq.contramap(eqNumber, date => date.valueOf())
  
  eqDate.equals(new Date(0), new Date(0)) // true
  eqDate.equals(new Date(0), new Date(1)) // false
  eqDate.equals(new Date(1), new Date(0)) // false
  `

  return (
    <ModuleContainer id='eq'>
      <Title>FP-TS (Eq)</Title>
      <CodeBlock label='common types' codeTx={commonTypesTX} />
      <CodeBlock label='fromEquals' codeTx={fromEqualsTx} />
      <CodeBlock label='strictEqual' codeTx={strictEqualTx} />
      <CodeBlock label='getStructEq' codeTx={getStructEqTx} />
      <CodeBlock label='getTupleEq' codeTx={getTupleEqTx} />
      <CodeBlock label='eq' codeTx={eqTx} />
      <CodeBlock label='eqDate' codeTx={eqDateTx} />
    </ModuleContainer>
  )
}

export { EqContainer }
