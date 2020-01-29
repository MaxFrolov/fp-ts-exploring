import * as React from 'react'
// components
import { ModuleContainer, Title } from '@md-views'
import { CodeBlock } from '@md-components/code-block'
// libs
import * as T from 'fp-ts/lib/Task'
import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import { getMonoid } from 'fp-ts/lib/Array'
import { ioEither } from 'fp-ts/lib/IOEither'
import { pipe, pipeable } from 'fp-ts/lib/pipeable'
import { monoidString } from 'fp-ts/lib/Monoid'
import { semigroupSum, semigroupString } from 'fp-ts/lib/Semigroup'
import { getFilterableComposition } from 'fp-ts/lib/Filterable'

export const TaskEitherContainer: React.FC = () => {
  // common types
  const commonTypesTX = `
  interface TaskEither<E, A> extends Task<Either<E, A>> {}
  `

  // common constants
  const commonConstantsTx = `
  import { getEitherM } from 'fp-ts/lib/EitherT'

  const T = getEitherM(task)

  const left: <E = never, A = never>(e: E) => TaskEither<E, A> = T.left
  const right: <E = never, A = never>(a: A) => TaskEither<E, A> = T.of
  
  const leftTask: <E = never, A = never>(me: Task<E>) => TaskEither<E, A> = T.leftM
  const rightTask: <E = never, A = never>(ma: Task<A>) => TaskEither<E, A> = T.rightM
  
  const fromIOEither: <E, A>(fa: IOEither<E, A>) => TaskEither<E, A> = task.fromIO
  
  export const swap: <E, A>(ma: TaskEither<E, A>) => TaskEither<A, E> = T.swap
  `

  // rightIO
  // TE.rightIO(() => 1)()
  //   .then(v => console.log('then: ', v))
  //   .catch(v => console.log('catch: ', v))

  const rightIOTx = `
  function rightIO<E = never, A = never>(ma: IO<A>): TaskEither<E, A> {
    return rightTask(task.fromIO(ma))
  }
  
  /* examples */
  
  TE.rightIO(() => 1)() // Promise resolve -> {_tag: "Right", right: 1}
  TE.rightIO(() => ({ key: 1 })))() // Promise resolve -> {_tag: "Right", right: { key: 1 }}}
  `

  // leftIO
  // TE.leftIO(() => 1)()
  //   .then(v => console.log('then: ', v))
  //   .catch(v => console.log('catch: ', v))

  const leftIOTx = `
  function leftIO<E = never, A = never>(me: IO<E>): TaskEither<E, A> {
    return leftTask(task.fromIO(me))
  }
  
  /* examples */
  
  TE.leftIO(() => 1)() // Promise resolve -> {_tag: "Left", right: 1}
  TE.leftIO(() => ({ key: 1 })))() // Promise resolve -> {_tag: "Left", right: { key: 1 }}}
  `

  // fold
  // TE.fold<string, string, string>(
  //   () => T.fromIO(() => 'Error'),
  //   () => T.fromIO(() => 'Success')
  // )(TE.leftIO(() => 'some-string'))()
  //   .then(v => console.log('then: ', v))
  //   .catch(v => console.log('catch: ', v))

  const foldTx = `
  function fold<E, A, B>(
    onLeft: (e: E) => Task<B>,
    onRight: (a: A) => Task<B>
  ): (ma: TaskEither<E, A>) => Task<B> {
    return ma => T.fold(ma, onLeft, onRight)
  }
  
  /* examples */
  
  import * as T from 'fp-ts/lib/Task'
  
  const M = fold(
    () => T.fromIO(() => 'Error'),
    () => T.fromIO(() => 'Success')
  )
  
  M(leftIO(() => 'some-string'))() // Promise resolve -> 'Error'
  M(rightIO(() => 'some-string'))() // Promise resolve -> 'Success'
  `

  // getOrElse
  // TE.getOrElse(() => T.fromIO(() => 'Error'))(TE.leftIO(() => 'some-value'))()
  //   .then(v => console.log('then: ', v))
  //   .catch(v => console.log('catch: ', v))

  const getOrElseTx = `
  function getOrElse<E, A>(onLeft: (e: E) => Task<A>): (ma: TaskEither<E, A>) => Task<A> {
    return ma => T.getOrElse(ma, onLeft)
  }
  
  /* examples */
  
  import * as T from 'fp-ts/lib/Task'

  const M = getOrElse(() => T.fromIO(() => 'Error'))
  
  M(leftIO(() => 'some-value'))() // Promise resolve -> 'Error'
  M(rightIO(() => 'some-value'))() // Promise resolve -> 'some-value'
  `

  // orElse
  // TE.orElse<string, string, string>(() => TE.rightIO(() => 'Success'))(TE.rightIO(() => 'some-value'))()
  //   .then(v => console.log('then: ', v))
  //   .catch(v => console.log('catch: ', v))

  const orElseTx = `
  function orElse<E, A, M>(onLeft: (e: E) => TaskEither<M, A>): (ma: TaskEither<E, A>) => TaskEither<M, A> {
    return ma => T.orElse(ma, onLeft)
  }
  
  /* examples */
  
  const MLeft = orElse(() => leftIO(() => 'Error'))
  
  MLeft(leftIO(() => 'some-error'))()
  // Promise resolve -> {_tag: "Left", left: "Error"}
  MLeft(rightIO(() => 'some-value'))()
  // Promise resolve -> {_tag: "Right", right: "some-value"}
  
  
  const MRight = orElse(() => TE.rightIO(() => 'Success'))
  
  MRight(leftIO(() => 'some-error'))()
  // Promise resolve -> {_tag: "Right", right: "Success"}
  MRight(rightIO(() => 'some-value'))()
  // Promise resolve -> {_tag: "Right", right: "some-value"}
  `

  // getSemigroup
  // const semigroup = TE.getSemigroup<string, number>(semigroupSum)
  //
  // semigroup
  //   .concat(TE.right(2), TE.right(1))()
  //   .then(v => console.log('then: ', v))
  //   .catch(v => console.log('catch: ', v))

  const getSemigroupTx = `
  function getSemigroup<E, A>(S: Semigroup<A>): Semigroup<TaskEither<E, A>> {
    return T.getTaskSemigroup(E.getSemigroup<E, A>(S))
  }
  
  /* examples */
  
  import { semigroupSum } from 'fp-ts/lib/Semigroup'

  const S = getSemigroup<string, number>(semigroupSum)

  S.concat(left('a'), left('b'))() // Promise resolve -> {_tag: "Left", left: "a"}
  S.concat(left('a'), right(2))() // Promise resolve -> {_tag: "Right", right: 2}
  S.concat(right(1), left('b'))() // Promise resolve -> {_tag: "Right", right: 1}
  S.concat(right(1), right(2))() // Promise resolve -> {_tag: "Right", right: 3}
  `

  // getApplySemigroup
  // const applySemigroup = TE.getApplySemigroup<string, number>(semigroupSum)
  //
  // applySemigroup
  //   .concat(TE.right(2), TE.right(1))()
  //   .then(v => console.log('then: ', v))
  //   .catch(v => console.log('catch: ', v))

  const getApplySemigroupTx = `
  function getApplySemigroup<E, A>(S: Semigroup<A>): Semigroup<TaskEither<E, A>> {
    return T.getTaskSemigroup(E.getApplySemigroup<E, A>(S))
  }
  
  /* examples */
  
  import { semigroupSum } from 'fp-ts/lib/Semigroup'

  const S = getApplySemigroup<string, number>(semigroupSum)

  S.concat(left('a'), left('b'))() // Promise resolve -> {_tag: "Left", left: "a"}
  S.concat(left('a'), right(2))() // Promise resolve -> {_tag: "Right", right: 2}
  S.concat(right(1), left('b'))() // Promise resolve -> {_tag: "Right", right: 1}
  S.concat(right(1), right(2))() // Promise resolve -> {_tag: "Right", right: 3}
  `

  // getApplyMonoid
  // const applyMonoid = TE.getApplyMonoid<string, string>(monoidString)
  //
  // applyMonoid
  //   .concat(TE.right('a'), TE.left('b'))()
  //   .then(v => console.log('then: ', v))
  //   .catch(v => console.log('catch: ', v))

  const getApplyMonoidTx = `
  function getApplyMonoid<E, A>(M: Monoid<A>): Monoid<TaskEither<E, A>> {
    return {
      concat: getApplySemigroup<E, A>(M).concat,
      empty: right(M.empty)
    }
  }
  
  /* examples */
  
  import { monoidString } from 'fp-ts/lib/Monoid'
  
  const M = getApplyMonoid(monoidString)

  M.concat(right('a'), right('b'))() // Promise resolve -> {_tag: "Right", right: "ab"}
  M.concat(right('a'), left('b'))() // Promise resolve -> {_tag: "Left", left: "b"}
  M.concat(right('a'), M.empty)() // Promise resolve -> {_tag: "Right", right: "a"}
  M.concat(M.empty, right('a'))() // Promise resolve -> {_tag: "Right", right: "a"}
  `

  // tryCatch
  // TE.tryCatch(
  //   () => Promise.reject(),
  //   () => 'Error'
  // )()
  //   .then(v => console.log('then: ', v))
  //   .catch(v => console.log('catch: ', v))

  const tryCatchTx = `
  // Transforms a \`Promise\` that may reject to a \`Promise\`
  // that never rejects and returns an \`Either\` instead.
  // Note: \`f\` should never \`throw\` errors, they are not caught.

  function tryCatch<E, A>(f: Lazy<Promise<A>>, onRejected: (reason: unknown) => E): TaskEither<E, A> {
    return () => f().then(E.right, reason => E.left(onRejected(reason)))
  }
  
  /* examples */
 
  tryCatch(
    () => Promise.resolve(1),
    () => 'Error'
  )() // Promise resolve -> {_tag: "Right", right: 1}
  
  tryCatch(
    () => Promise.reject(undefined),
    () => 'Error'
  )() // // Promise resolve -> {_tag: "Left", left: "Error"}
  `

  // bracket
  // const log: Array<string> = []
  //
  // const useFailure = () => TE.left('use failure')
  // const useSuccess = () => TE.right('use success')
  //
  // const acquireFailure = TE.left('acquire failure')
  // const acquireSuccess = TE.right({ res: 'acquire success' })
  //
  // const releaseFailure = () => TE.left('release failure')
  // const releaseSuccess = () =>
  //   TE.taskEither.fromIO(() => {
  //     log.push('release success')
  //   })
  //
  // TE.bracket(acquireSuccess, useSuccess, releaseFailure)()
  //   .then(v => console.log('then: ', v, log))
  //   .catch(v => console.log('catch: ', v, log))

  const bracketTx = `
  // Make sure that a resource is cleaned up in the event of an exception (*).
  // The release action is called regardless of
  // whether the body action throws (*) or returns.
  //
  // (*) i.e. returns a \`Left\`

  function bracket<E, A, B>(
    acquire: TaskEither<E, A>,
    use: (a: A) => TaskEither<E, B>,
    release: (a: A, e: Either<E, B>) => TaskEither<E, void>
  ): TaskEither<E, B> {
    return T.chain(acquire, a =>
      T.chain(task.map(use(a), E.right), e =>
        T.chain(release(a, e), () => (E.isLeft(e) ? T.left(e.left) : T.of(e.right)))
      )
    )
  }
  
  /* examples */
 
  const log: Array<string> = []

  const useFailure = () => left('use failure')
  const useSuccess = () => right('use success')

  const acquireFailure = left('acquire failure')
  const acquireSuccess = right({ res: 'acquire success' })

  const releaseSuccess = () => taskEither.fromIO(() => { log.push('release success') })
  const releaseFailure = () => left('release failure')


  bracket(acquireFailure, useSuccess, releaseSuccess)()
  // Promise resolve -> {_tag: "Left", left: "acquire failure"}
  // log -> []

  bracket(acquireSuccess, useFailure, releaseSuccess)()
  // Promise resolve -> {_tag: "Left", left: "use failure"}
  // log -> ["release success"]

  bracket(acquireSuccess, useFailure, releaseFailure)()
  // Promise resolve -> {_tag: "Left", left: "release failure"}
  // log -> []
  
  bracket(acquireSuccess, useSuccess, releaseSuccess)()
  // Promise resolve -> {_tag: "Right", right: "use success"}
  // log -> ["release success"]
  
  bracket(acquireSuccess, useFailure, releaseSuccess)()
  // Promise resolve -> {_tag: "Left", left: "use failure"}
  // log -> ["release success"]
  
  bracket(acquireSuccess, useSuccess, releaseFailure)()
  // Promise resolve -> {_tag: "Left", left: "release failure"}
  // log -> []
  `

  // taskify
  // type TCallApi = (_path: string, callback: (err: Error | null | undefined, result?: string) => void) => void
  //
  // const api1: TCallApi = (_path, callback) => callback(null, 'ok')
  // const api2: TCallApi = (_path, callback) => callback(undefined, 'ok')
  // const api3: TCallApi = (_path, callback) => callback(new Error('ko'))
  //
  // TE.taskify(api3)('foo')()
  //   .then(v => console.log('then: ', v))
  //   .catch(v => console.log('catch: ', v))

  const taskifyTx = `
  // Convert a node style callback function to one returning a \`TaskEither\`
  //
  // **Note**. If the function \`f\` admits multiple overloadings,
  // \`taskify\` will pick last one. If you want a different
  // behaviour, add an explicit type annotation

  function taskify<L, R>(f: (cb: (e: L | null | undefined, r?: R) => void) => void): () => TaskEither<L, R>
  function taskify<A, L, R>(
    f: (a: A, cb: (e: L | null | undefined, r?: R) => void) => void
  ): (a: A) => TaskEither<L, R>
  function taskify<A, B, L, R>(
    f: (a: A, b: B, cb: (e: L | null | undefined, r?: R) => void) => void
  ): (a: A, b: B) => TaskEither<L, R>
  function taskify<A, B, C, L, R>(
    f: (a: A, b: B, c: C, cb: (e: L | null | undefined, r?: R) => void) => void
  ): (a: A, b: B, c: C) => TaskEither<L, R>
  function taskify<A, B, C, D, L, R>(
    f: (a: A, b: B, c: C, d: D, cb: (e: L | null | undefined, r?: R) => void) => void
  ): (a: A, b: B, c: C, d: D) => TaskEither<L, R>
  function taskify<A, B, C, D, E, L, R>(
    f: (a: A, b: B, c: C, d: D, e: E, cb: (e: L | null | undefined, r?: R) => void) => void
  ): (a: A, b: B, c: C, d: D, e: E) => TaskEither<L, R>
  function taskify<L, R>(f: Function): () => TaskEither<L, R> {
    return function() {
      const args = Array.prototype.slice.call(arguments)
      return () =>
        new Promise(resolve => {
          const cbResolver = (e: L, r: R) => (e != null ? resolve(E.left(e)) : resolve(E.right(r)))
          f.apply(null, args.concat(cbResolver))
        })
    }
  }
  
  /* examples */
  
  type TCallApi = (_path: string, callback: (err: Error | null | undefined, result?: string) => void) => void

  const api1: TCallApi = (_path, callback) => callback(null, 'ok')
  const api2: TCallApi = (_path, callback) => callback(undefined, 'ok')
  const api3: TCallApi = (_path, callback) => callback(new Error('ko'))
 
  taskify(api1)('foo')() // Promise resolve -> {_tag: "Right", right: "ok"}
  taskify(api2)('foo')() // Promise resolve -> {_tag: "Right", right: "ok"}
  taskify(api3)('foo')() // Promise resolve -> {_tag: "Left", left: new Error('ko') }
  `

  // getTaskValidation
  // const TV = TE.getTaskValidation(semigroupString)
  // const double = (n: number): number => n * 2
  //
  // TV.alt(TE.left('a'), () => TE.left('b'))()
  //   .then(v => console.log('then: ', v))
  //   .catch(v => console.log('catch: ', v))

  const getTaskValidationTx = `
  function getTaskValidation<E>(
    S: Semigroup<E>
  ): Monad2C<URI, E> & Bifunctor2C<URI, E> & Alt2C<URI, E> & MonadTask2C<URI, E> & MonadThrow2C<URI, E> {
    const T = getValidationM(S, task)
    return {
      URI,
      _E: undefined as any,
      throwError: taskEither.throwError,
      bimap: taskEither.bimap,
      mapLeft: taskEither.mapLeft,
      fromIO: taskEither.fromIO,
      fromTask: taskEither.fromTask,
      ...T
    }
  }
  
  /* examples */

  import { semigroupString } from 'fp-ts/lib/Semigroup'

  const TV = getTaskValidation(semigroupString)
  
  
  /* examples: of */

  TV.of(1)() // Promise resolve -> {_tag: "Right", right: 1}
  
  /* examples: map */

  const double = (n: number): number => n * 2
  
  TV.map(TV.of(1), double)() // Promise resolve -> {_tag: "Right", right: 2} 
  TV.map(left('a'), double)() // Promise resolve -> {_tag: "Left", left: "a"}

  /* examples: ap */

  TV.ap(left('a'), left('b'))() // Promise resolve -> {_tag: "Left", left: "ab"}
  TV.ap(left('a'), right('b'))() // Promise resolve -> {_tag: "Left", left: "a"}
  
  /* examples: chain */

  TV.chain(
    right(3),
    a => (a > 2 ? right(a) : left('b'))
  )() // Promise resolve -> {_tag: "Right", right: 3}
  
  TV.chain(
    right(1),
    a => (a > 2 ? right(a) : left('b'))
  )() // Promise resolve -> {_tag: "Left", left: "b"}
  
  TV.chain(
    left('a'),
    a => (a > 2 ? right(a) : left('b'))
  )() // Promise resolve -> {_tag: "Left", left: "a"}

  /* examples: alt */

  TV.alt(
    right(1),
    () => right(2)
  )() // Promise resolve -> {_tag: "Right", right: 1}
  
  TV.alt(
    left('a'),
    () => right(2)
  )() // Promise resolve -> {_tag: "Right", right: 2}
  
  TV.alt(
    right(1),
    () => left('b')
  )() // Promise resolve -> {_tag: "Right", right: 1}
  
  TV.alt(
    left('a'),
    () => left('b')
  )() // Promise resolve -> {_tag: "Left", left: "ab"}
  `

  // getFilterable
  // const F_ = {
  //   ...TE.taskEither,
  //   ...TE.getFilterable(getMonoid<string>())
  // }
  //
  // const { filter } = pipeable(F_)
  //
  // pipe(
  //   TE.left(['a']),
  //   filter(n => n > 0)
  // )()
  //   .then(v => console.log('then: ', v))
  //   .catch(v => console.log('catch: ', v))

  const getFilterableTx = `
  import { getFilterableComposition } from 'fp-ts/lib/Filterable'
  
  function getFilterable<E>(M: Monoid<E>): Filterable2C<URI, E> {
    const F = E.getWitherable(M)
  
    return {
      URI,
      _E: undefined as any,
      ...getFilterableComposition(task, F)
    }
  }
  
  /* examples */
  
  import { getMonoid } from 'fp-ts/lib/Array'
  import { pipe, pipeable } from 'fp-ts/lib/pipeable'

  const F_ = {
    ...taskEither,
    ...getFilterable(getMonoid<string>())
  }
  
  const { filter } = pipeable(F_)

  pipe(
    right(1),
    filter(n => n > 0)
  )() // Promise resolve -> {_tag: "Right", right: 1} 
  
  pipe(
    right(-1),
    filter(n => n > 0)
  )() // Promise resolve -> {_tag: "Left", left: []}

  pipe(
    left(['a']]),
    filter(n => n > 0)
  )() // Promise resolve -> {_tag: "Left", left: ["a"]}
  `

  // fromEitherK
  const fromEitherKTx = `
  function fromEitherK<E, A extends Array<unknown>, B>(
    f: (...a: A) => Either<E, B>
  ): (...a: A) => TaskEither<E, B> {
    return (...a) => fromEither(f(...a))
  }
  `

  // chainEitherK
  // pipe(
  //   TE.right('abc'),
  //   TE.chainEitherK((s: string) => E.right(s.length))
  // )()
  //   .then(v => console.log('then: ', v))
  //   .catch(v => console.log('catch: ', v))

  const chainEitherKTx = `
  function chainEitherK<E, A, B>(f: (a: A) => Either<E, B>): (ma: TaskEither<E, A>) => TaskEither<E, B> {
    return chain(fromEitherK(f))
  }
 
  /* examples */
 
  pipe(
    right('abc'),
    chainEitherK((s: string) => E.right(s.length))
  )() // Promise resolve -> {_tag: "Right", right:3}
  `

  // fromIOEitherK
  // TE.fromIOEitherK(() => () => E.right(1))()()
  //   .then(v => console.log('then: ', v))
  //   .catch(v => console.log('catch: ', v))

  const fromIOEitherKTx = `
  function fromIOEitherK<E, A extends Array<unknown>, B>(
    f: (...a: A) => IOEither<E, B>
  ): (...a: A) => TaskEither<E, B> {
    return (...a) => fromIOEither(f(...a))
  }
 
  /* examples */
 
  TE.fromIOEitherK(() => () => E.right(1))()() // Promise resolve -> {_tag: "Right", right:1}
  `

  // chainIOEitherK
  // pipe(
  //   TE.right('a'),
  //   TE.chainIOEitherK((s: string) => ioEither.of(s.length))
  // )()
  //   .then(v => console.log('then: ', v))
  //   .catch(v => console.log('catch: ', v))

  const chainIOEitherKTx = `
  function chainIOEitherK<E, A, B>(f: (a: A) => IOEither<E, B>): (ma: TaskEither<E, A>) => TaskEither<E, B> {
    return chain(fromIOEitherK(f))
  }

  /* examples */
  
  import { ioEither } from 'fp-ts/lib/IOEither'
 
  pipe(
    right('a'),
    chainIOEitherK((s: string) => ioEither.of(s.length))
  )() // Promise resolve -> {_tag: "Right", right:1}
  `

  return (
    <ModuleContainer id='taskEither'>
      <Title>FP-TS (TaskEither)</Title>
      <CodeBlock label='common types' codeTx={commonTypesTX} />
      <CodeBlock label='common constants' codeTx={commonConstantsTx} />
      <CodeBlock label='rightIO' codeTx={rightIOTx} />
      <CodeBlock label='leftIO' codeTx={leftIOTx} />
      <CodeBlock label='fold' codeTx={foldTx} />
      <CodeBlock label='getOrElse' codeTx={getOrElseTx} />
      <CodeBlock label='orElse' codeTx={orElseTx} />
      <CodeBlock label='getSemigroup' codeTx={getSemigroupTx} />
      <CodeBlock label='getApplySemigroup' codeTx={getApplySemigroupTx} />
      <CodeBlock label='getApplyMonoid' codeTx={getApplyMonoidTx} />
      <CodeBlock label='tryCatch' codeTx={tryCatchTx} />
      <CodeBlock label='bracket' codeTx={bracketTx} />
      <CodeBlock label='taskify' codeTx={taskifyTx} />
      <CodeBlock label='getTaskValidation' codeTx={getTaskValidationTx} />
      <CodeBlock label='getFilterable' codeTx={getFilterableTx} />
      <CodeBlock label='fromEitherK' codeTx={fromEitherKTx} />
      <CodeBlock label='chainEitherK' codeTx={chainEitherKTx} />
      <CodeBlock label='fromIOEitherK' codeTx={fromIOEitherKTx} />
      <CodeBlock label='chainIOEitherK' codeTx={chainIOEitherKTx} />
    </ModuleContainer>
  )
}
