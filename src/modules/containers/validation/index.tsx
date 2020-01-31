import * as React from 'react'
// view components
import { CodeBlock } from '@md-components/code-block'
// views
import { ModuleContainer, Title } from '@md-views'
// libs
import * as E from 'fp-ts/lib/Either'
// import * as TE from 'fp-ts/lib/TaskEither'

import { monoidString } from 'fp-ts/lib/Monoid'

export const ValidationContainer = () => {
  // getEitherValidation
  const validation = E.getValidation(monoidString)
  const validationF = (s: string) => E.right(s.length)
  const validationDouble = (n: number) => n * 2

  const getEitherValidationTx = `
  // See [Getting started with fp-ts: Either vs Validation]
  // https://gcanti.github.io/fp-ts/getting-started/either-vs-validation.html

  function getValidation<E>(S: Semigroup<E>): Monad2C<URI, E> & Alt2C<URI, E> {
    return {
      URI,
      _E: undefined as any,
      map: either.map,
      of: either.of,
      ap: (mab, ma) =>
        isLeft(mab)
          ? isLeft(ma)
            ? left(S.concat(mab.left, ma.left))
            : mab
          : isLeft(ma)
          ? ma
          : right(mab.right(ma.right)),
      chain: either.chain,
      alt: (fx, f) => {
        if (isRight(fx)) {
          return fx
        }
        const fy = f()
        return isLeft(fy) ? left(S.concat(fx.left, fy.left)) : fy
      }
    }
  }
  
  /* examples */
  
  const validation = getValidation(monoidString)
  
  const f = (s: string) => right(s.length)
  const double = (n: number) => n * 2
  
  /* examples: .chain */

  validation.chain(right('abc'), f)
  // ${JSON.stringify(validation.chain(E.right('abc'), validationF))}
  
  validation.chain(left('a'), f)
  // ${JSON.stringify(validation.chain(E.left('a'), validationF))}
  
  validation.chain(left('a'), () => left('b'))
  // ${JSON.stringify(validation.chain(E.left('a'), () => E.left('b')))}
  
  /* examples: .of */

  validation.of(1)
  // ${JSON.stringify(validation.of(1))}
  
  /* examples: .ap */

  validation.ap(right(double), right(1))
  // ${JSON.stringify(validation.ap(E.right(validationDouble), E.right(1)))}
  
  validation.ap(right(double), left('foo'))
  // ${JSON.stringify(validation.ap(E.right(validationDouble), E.left('foo')))}
  
  validation.ap(left<string, (n: number) => number>('foo'), right(1))
  // ${JSON.stringify(validation.ap(E.left<string, (n: number) => number>('foo'), E.right(1)))}

  validation.ap(left('foo'), left('bar'))
  // ${JSON.stringify(validation.ap(E.left<string>('foo'), E.right('bar')))}
  
  /* examples: .alt */

  validation.alt(left('a'), () => right(1))
  // ${JSON.stringify(validation.alt(E.left('a'), () => E.right(1)))}
  
  validation.alt(right(1), () => left('a'))
  // ${JSON.stringify(validation.alt(E.right(1), () => E.left('a')))}
  
  validation.alt(left('a'), () => left('b'))
  // ${JSON.stringify(validation.alt(E.left('a'), () => E.left('b')))}
  `


  // getTaskEitherValidation
  // const TV = TE.getTaskValidation(semigroupString)
  // const double = (n: number): number => n * 2
  //
  // TV.alt(TE.left('a'), () => TE.left('b'))()
  //   .then(v => console.log('then: ', v))
  //   .catch(v => console.log('catch: ', v))

  const getTaskEitherValidationTx = `
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

  return (
    <ModuleContainer id='validation'>
      <Title>FP-TS (Validation)</Title>
      <CodeBlock label='getEitherValidation' codeTx={getEitherValidationTx} />
      <CodeBlock label='getTaskEitherValidation' codeTx={getTaskEitherValidationTx} />
    </ModuleContainer>
  )
}
