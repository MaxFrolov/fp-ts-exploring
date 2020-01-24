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
  not<number>(Boolean)(3) // ${notTestNum(0)} -> <boolean>
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
    </>
  )
}

export { FunctionContainer }
