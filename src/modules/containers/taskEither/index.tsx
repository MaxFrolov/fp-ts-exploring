import * as React from 'react'
// components
import { ModuleContainer, Title } from '@md-views'
import { CodeBlock } from '@md-components/code-block'
// libs
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'

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
    </ModuleContainer>
  )
}
