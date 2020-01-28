import * as React from 'react'
// components
import { ModuleContainer, Title } from '@md-views'
import { CodeBlock } from '@md-components/code-block'
// libs
import * as T from 'fp-ts/lib/Task'
import { pipe } from 'fp-ts/lib/pipeable'
import { monoidString } from 'fp-ts/lib/Monoid'
import { semigroupSum } from 'fp-ts/lib/Semigroup'
import { race } from 'q'

function resolvedPromise<T>(value: T, delay: number): () => Promise<T> {
  return () => new Promise<T>(resolve => setTimeout(() => resolve(value), delay))
}

function rejectedPromise<T>(value: any, delay: number): () => Promise<T> {
  return () => new Promise<T>((_, reject) => setTimeout(() => reject(value), delay))
}

export const TaskContainer: React.FC = () => {
  // common types
  const commonTypesTX = `
  interface Task<A> {
    (): Promise<A>
  }
  `

  // common constants
  const commonConstantsTx = `
  const never: Task<never> = () => new Promise(_ => undefined)
  
  function resolvedPromise<T>(value: T, delay: number): () => Promise<T> {
    return () => new Promise<T>(resolve => setTimeout(() => resolve(value), delay))
  }
  
  function rejectedPromise<T>(value: any, delay: number): () => Promise<T> {
    return () => new Promise<T>((_, reject) => setTimeout(() => reject(value), delay))
  }
  `

  // getSemigroup
  // const semigroup = T.getSemigroup<number>(semigroupSum)

  const getSemigroupTx = `
  function getSemigroup<A>(S: Semigroup<A>): Semigroup<Task<A>> {
    return {
      concat: (x, y) => () => x().then(rx => y().then(ry => S.concat(rx, ry)))
    }
  }
  
  /* examples */
  
  import { semigroupSum } from 'fp-ts/lib/Semigroup'

  const semigroup = getSemigroup<number>(semigroupSum)
  
  semigroup.concat(resolvedPromise(1, 10), resolvedPromise(1, 10)) // Promise resolve -> 2
  semigroup.concat(resolvedPromise(1, 10), rejectedPromise('Error', 10)) // Promise reject -> "Error"
  `

  // getMonoid
  // const monoid = T.getMonoid<string>(monoidString)

  // monoid
  //   .concat(resolvedPromise('a', 10), rejectedPromise('Error', 10))()
  //   .then(v => console.log('then: ', v))
  //   .catch(v => console.log('catch: ', v))

  const getMonoidTx = `
  function getMonoid<A>(M: Monoid<A>): Monoid<Task<A>> {
    return {
      concat: getSemigroup(M).concat,
      empty: task.of(M.empty)
    }
  }
  
  /* examples */
  
  import { monoidString } from 'fp-ts/lib/Monoid'

  const monoid = getMonoid<string>(monoidString)
  
  monoid.concat(resolvedPromise('a', 10), resolvedPromise('a', 10)) // Promise resolve -> 'aa'
  monoid.concat(monoid.empty, resolvedPromise('a', 10)) // Promise resolve -> 'a'
  monoid.concat(resolvedPromise('a', 10), monoid.empty) // Promise resolve -> 'a'
  monoid.concat(monoid.empty, monoid.empty) // Promise resolve -> ''
  monoid.concat(resolvedPromise('a', 10), rejectedPromise('Error', 10)) // Promise reject -> 'Error'
  `

  // getRaceMonoid
  // const raceMonoid = T.getRaceMonoid<number>()

  // raceMonoid
  //   .concat(resolvedPromise(1, 50), rejectedPromise('Error', 10))()
  //   .then(v => console.log('then: ', v))
  //   .catch(v => console.log('catch: ', v))

  const getRaceMonoidTx = `
  // Note: uses \`Promise.race\` internally
  
  function getRaceMonoid<A = never>(): Monoid<Task<A>> {
    return {
      concat: (x, y) => () => Promise.race([x(), y()]),
      empty: never
    }
  }
  
  /* examples */
  
  const monoid = getRaceMonoid()
  
  monoid.concat(resolvedPromise(1, 10), resolvedPromise(2, 10)) // Promise resolve -> 1
  monoid.concat(resolvedPromise(1, 50), resolvedPromise(2, 10)) // Promise resolve -> 2
  monoid.concat(resolvedPromise(1, 10), monoid.empty) // Promise resolve -> 1
  monoid.concat(monoid.empty, resolvedPromise(2, 10)) // Promise resolve -> 2
  monoid.concat(monoid.empty, monoid.empty) // the promise will never be resolved
  monoid.concat(resolvedPromise(1, 10), rejectedPromise('Error', 50)) // Promise resolve -> 1  
  monoid.concat(resolvedPromise(1, 50), rejectedPromise('Error', 10)) // Promise reject -> 'Error'  
  `

  // delay
  const delayTx = `
  function delay(millis: number): <A>(ma: Task<A>) => Task<A> {
    return ma => () =>
      new Promise(resolve => {
        setTimeout(() => {
          // tslint:disable-next-line: no-floating-promises
          ma().then(resolve)
        }, millis)
      })
  }
  
  /* examples */
  
  const async calculate () => { ... }
  
  delay(100)(calculate) // calculate function will be called after at least 100 milliseconds
  `

  // fromIO
  const fromIOTx = `
  function fromIO<A>(ma: IO<A>): Task<A> {
    return () => Promise.resolve(ma())
  }

  /* examples */
  
  fromIO(() => 1) // Promise resolve 1
  `

  // of
  const ofTx = `
  function of<A>(a: A): Task<A> {
    return () => Promise.resolve(a)
  }

  /* examples */
  
  of(1) // Promise resolve 1
  `

  // fromIOK
  const fromIOKTx = `
  function fromIOK<A extends Array<unknown>, B>(f: (...a: A) => IO<B>): (...a: A) => Task<B> {
    return (...a) => fromIO(f(...a))
  }
  `

  // chainIOK
  const chainIOKTx = `
  function chainIOK<A, B>(f: (a: A) => IO<B>): (ma: Task<A>) => Task<B> {
    return chain(fromIOK(f))
  }
  `

  return (
    <ModuleContainer id='task'>
      <Title>FP-TS (Task)</Title>
      <CodeBlock label='common types' codeTx={commonTypesTX} />
      <CodeBlock label='common constants' codeTx={commonConstantsTx} />
      <CodeBlock label='getSemigroup' codeTx={getSemigroupTx} />
      <CodeBlock label='getMonoid' codeTx={getMonoidTx} />
      <CodeBlock label='getRaceMonoid' codeTx={getRaceMonoidTx} />
      <CodeBlock label='delay' codeTx={delayTx} />
      <CodeBlock label='fromIO' codeTx={fromIOTx} />
      <CodeBlock label='ofIO' codeTx={ofTx} />
      <CodeBlock label='fromIOK' codeTx={fromIOKTx} />
      <CodeBlock label='chainIOK' codeTx={chainIOKTx} />
    </ModuleContainer>
  )
}
