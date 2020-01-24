import * as React from 'react'
// view components
import { CodeBlock } from '@md-components/code-block'
// views
import { Title } from '@md-views'
// libs
import * as FN from 'fp-ts/lib/function'

const FunctionContainer = () => {
  // identity
  const identityTx = `
  function identity<A>(a: A): A {
    return a
  }
  
  identity<number>(5) // 5 -> <number>
  `

  // unsafeCoerce
  const unsafeCoerceTx = `
  const unsafeCoerce: <A, B>(a: A) => B = identity as any
  
  unsafeCoerce<number, string>(5) // 5 -> <string>
  `

  // not
  const notTestNum = FN.not<number>(Boolean)
  const notTestStr = FN.not<string>(Boolean)

  const notTx = `
  interface Predicate<A> {
    (a: A): boolean
  }
  
  function not<A>(predicate: Predicate<A>): Predicate<A> {
    return a => !predicate(a)
  }
  
  not<number>(Boolean)(3) // ${notTestNum(3)} -> <boolean>
  not<number>(Boolean)(0) // ${notTestNum(0)} -> <boolean>
  not<string>(Boolean)('') // ${notTestStr('')} -> <boolean>
  not<string>(Boolean)('text') // ${notTestStr('text')} -> <boolean>
  `

  // constant
  const constTestStr = FN.constant<string>('text')
  const constTestNum = FN.constant<number>(3)

  const constantTx = `
  function constant<A>(a: A): Lazy<A> {
    return () => a
  }
  
  constant<string>('text')() // ${constTestStr()} -> <string>
  constant<number>(3)() // ${constTestNum()} -> <number>
  `

  // constTrue
  const constTrueTx = `
  const constTrue = (): boolean => {
    return true
  }
  
  constTrue() // ${FN.constTrue()} -> <boolean>
  `

  // constFalse
  const constFalseTx = `
  const constFalse = (): boolean => {
    return false
  }
  
  constFalse() // ${FN.constFalse()} -> <boolean>
  `

  // constNull
  const constNullTx = `
  const constNull = (): null => {
    return null
  }
  
  constNull() // ${FN.constNull()} -> <null>
  `

  // constUndefined
  const constUndefinedTx = `
  const constUndefined = (): undefined => {
    return
  }
  
  constUndefined() // ${FN.constUndefined()} -> <undefined>
  `

  // constVoid
  const constVoidTx = `
  const constVoid = (): void => {
    return
  }
  
  constVoid() // ${FN.constVoid()} -> <undefined>
  `

  // flip
  const flipTest = FN.flip<number, number, number>((a, b) => a - b)
  const flipTx = `
  const function flip<A, B, C>(f: (a: A, b: B) => C): (b: B, a: A) => C {
    return (b, a) => f(a, b)
  }
  
  flip<number, number, number>((a, b) => a - b)(3, 1) // ${flipTest(3, 1)} -> <number>
  flip<number, number, number>((a, b) => a - b)(1, 3) // ${flipTest(1, 3)} -> <number>
  `

  // flow
  const flowTest = FN.flow<[number, number], number, number>((a, b): number => a + b, (c) => c * 2)
  const flowTx = `
  function flow<A extends Array<unknown>, B>(ab: (...a: A) => B): (...a: A) => B
  function flow<A extends Array<unknown>, B, C>(ab: (...a: A) => B, bc: (b: B) => C): (...a: A) => C
  ... // 9 arguments max
  
  flow<[number, number], number, number>((a, b): number => a + b, (c) => c * 2)(2, 3) // ${flowTest(2, 3)} -> <number>
  `

  // tuple
  const tupleTx = `
  function tuple<T extends Array<any>>(...t: T): T {
    return t
  }
  
  tuple<number[]>(1, 2) // [${FN.tuple<number[]>(1, 2)}] -> <array>
  `

  // increment
  const incrementTx = `
  function increment(n: number): number {
    return n + 1
  }
  
  increment(2) // ${FN.increment(2)} -> <number>
  `

  // decrement
  const decrementTx = `
  function decrement(n: number): number {
    return n - 1
  }
  
  decrement(2) // ${FN.decrement(2)} -> <number>
  `

  // tupled
  const tupleTest = FN.tupled((x: number, y: number): number => x + y)
  const tupledTx = `
  function tupled<A extends Array<unknown>, B>(f: (...a: A) => B): (a: A) => B {
    return a => f(...a)
  }
  
  tupled((x: number, y: number): number => x + y)([1, 2]) // ${tupleTest([1, 2])} -> <number>
  `

  // untupled
  const untupledTest = FN.untupled((x: number[]) => x.join(', '))

  const untupledTx = `
  function untupled<A extends Array<unknown>, B>(f: (a: A) => B): (...a: A) => B {
    return (...a) => f(a)
  }
  
  untupled((x: number[]) => x.join(', '))(1, 2]) // ${untupledTest(1, 2)} -> <number>
  `

  return (
    <>
      <Title>FP-TS (function)</Title>
      <CodeBlock label='identity' codeTx={identityTx} />
      <CodeBlock label='unsafeCoerce' codeTx={unsafeCoerceTx} />
      <CodeBlock label='no' codeTx={notTx} />
      <CodeBlock label='constant' codeTx={constantTx} />
      <CodeBlock label='constTrue' codeTx={constTrueTx} />
      <CodeBlock label='constFalse' codeTx={constFalseTx} />
      <CodeBlock label='constNull' codeTx={constNullTx} />
      <CodeBlock label='constUndefined' codeTx={constUndefinedTx} />
      <CodeBlock label='constVoid' codeTx={constVoidTx} />
      <CodeBlock label='flip' codeTx={flipTx} />
      <CodeBlock label='flow' codeTx={flowTx} />
      <CodeBlock label='tuple' codeTx={tupleTx} />
      <CodeBlock label='increment' codeTx={incrementTx} />
      <CodeBlock label='decrement' codeTx={decrementTx} />
      <CodeBlock label='tupled' codeTx={tupledTx} />
      <CodeBlock label='untupled' codeTx={untupledTx} />
    </>
  )
}

export { FunctionContainer }
