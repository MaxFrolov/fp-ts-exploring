import * as React from 'react'
// components
import { Title } from '@md-views'
import { CodeBlock } from '@md-components/code-block'
// libs
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import { monoidSum } from 'fp-ts/lib/Monoid'
import { showString } from 'fp-ts/lib/Show'
import { semigroupSum } from 'fp-ts/lib/Semigroup'
import { eqNumber, eqString } from 'fp-ts/lib/Eq'

export const EitherContainer: React.FC = () => {
  // common types
  const commonTypesTX = `
  interface Left<E> {
    readonly _tag: 'Left'
    readonly left: E
  }

  interface Right<A> {
    readonly _tag: 'Right'
    readonly right: A
  }

  type Either<E, A> = Left<E> | Right<A>
  `

  // left
  const leftTx = `
  // Constructs a new \`Either\` holding a \`Left\` value.
  // This usually represents a failure, due to the right-bias of this structure

  function left<E = never, A = never>(e: E): Either<E, A> {
    return { _tag: 'Left', left: e }
  }
  
  left(5) // ${JSON.stringify(E.left(5))}
  left('string_value') // ${JSON.stringify(E.left('string_value'))}
  left({ key: 5 }) // ${JSON.stringify(E.left({ key: 5 }))}
  `

  // right
  const rightTx = `
  // Constructs a new \`Either\` holding a \`Right\` value.
  // This usually represents a successful value due to the right bias
  // of this structure

  function right<E = never, A = never>(a: A): Either<E, A> {
    return { _tag: 'Right', right: a }
  }
  
  right(5) // ${JSON.stringify(E.right(5))}
  right('string_value') // ${JSON.stringify(E.right('string_value'))}
  right({ key: 5 }) // ${JSON.stringify(E.right({ key: 5 }))}
  `

  // isLeft
  const isLeftTx = `
  // Returns \`true\` if the either is an instance of \`Left\`, \`false\` otherwise

  function isLeft<E, A>(ma: Either<E, A>): ma is Left<E> {
    switch (ma._tag) {
      case 'Left':
        return true
      case 'Right':
        return false
    }
  }
  
  isLeft(left(1)) // ${JSON.stringify(E.isLeft(E.left(1)))}
  isLeft(right(1)) // ${JSON.stringify(E.isLeft(E.right(1)))}
  `

  // isRight
  const isRightTx = `
  // Returns \`true\` if the either is an instance of \`Right\`, \`false\` otherwise

  function isRight<E, A>(ma: Either<E, A>): ma is Right<A> {
    return isLeft(ma) ? false : true
  }
  
  isRight(left(1)) // ${JSON.stringify(E.isRight(E.left(1)))}
  isRight(right(1)) // ${JSON.stringify(E.isRight(E.right(1)))}
  `

  // fromNullable
  const fromNullableTx = `
  // Takes a default and a nullable value,
  // if the value is not nully, turn it into a \`Right\`,
  // if the value is nully use the provided default as a \`Left\`

  function fromNullable<E>(e: E): <A>(a: A) => Either<E, NonNullable<A>> {
    return <A>(a: A) => (a == null ? left(e) : right(a as NonNullable<A>))
  }
  
  const parse = fromNullable('nully')

  fromNullable('nully')(1) // ${JSON.stringify(E.fromNullable('nully')(1))}
  fromNullable('nully')(null)// ${JSON.stringify(E.fromNullable('nully')(null))}
  `

  // toError
  const toErrorTx = `
  // Constructs a new \`Either\` from a function that might throw

  function toError(e: unknown): Error {
    return e instanceof Error ? e : new Error(String(e))
  }
  

  toError(1) // ${E.toError(1)}
  toError('string') // ${E.toError('string')}
  toError([1, 'string']) // ${E.toError([1, 'string'])}
  toError(new Error('Message')) // ${E.toError(new Error('Message'))}
  `

  // tryCatch
  const tryCatchTx = `
  // Default value for the 'onError' argument of 'tryCatch'

  function tryCatch<E, A>(f: Lazy<A>, onError: (e: unknown) => E): Either<E, A> {
    try {
      return right(f())
    } catch (e) {
      return left(onError(e))
    }
  }
  

  tryCatch(() => 1, () => 'error')) // ${JSON.stringify(
    E.tryCatch(
      () => 1,
      () => 'error'
    )
  )}
  tryCatch(() => { throw new Error() }, () => 'error')) // ${JSON.stringify(
    E.tryCatch(
      () => {
        throw new Error()
      },
      () => 'error'
    )
  )}
  `

  // fold
  const foldOnLeft = (errors: Array<string>): string => `Errors: ${errors.join(', ')}`
  const foldOnRight = (value: number): string => `Ok: ${value}`

  const foldTx = `
  // Takes two functions and an \`Either\` value,
  // if the value is a \`Left\` the inner value is applied to the first function,
  // if the value is a \`Right\` the inner value is applied to the second function.

  import { pipe } from 'fp-ts/lib/pipeable'

  function fold<E, A, B>(onLeft: (e: E) => B, onRight: (a: A) => B): (ma: Either<E, A>) => B {
    return ma => (isLeft(ma) ? onLeft(ma.left) : onRight(ma.right))
  }
  
  const onLeft = (errors: Array<string>): string => \`Errors: \${errors.join(', ')}\`
  const onRight = (errors: Array<string>): string => \`Ok: \${value}\`

  pipe(
    right(1),
    fold(onLeft, onRight)
  ) // ${pipe(E.right(1), E.fold(foldOnLeft, foldOnRight), JSON.stringify)}
  
  pipe(
    left(['error 1', 'error 2']),
    fold(onLeft, onRight)
  ) // ${pipe(E.left(['error 1', 'error 2']), E.fold(foldOnLeft, foldOnRight), JSON.stringify)}
  `

  // getShow
  const getShowTx = `
  import { showString } from 'fp-ts/lib/Show'

  function getShow<E, A>(SE: Show<E>, SA: Show<A>): Show<Either<E, A>> {
    return {
      show: ma => (isLeft(ma) ? \`left(\${SE.show(ma.left)})\` : \`right(\${SA.show(ma.right)})\`)
    }
  }
  
  const S = getShow(showString, showString)
  
  getShow(showString, showString).show(left('a')) // ${E.getShow(showString, showString).show(E.left('a'))}
  getShow(showString, showString).show(right('a')) // ${E.getShow(showString, showString).show(E.right('a'))}
  `

  // getEq
  const equals = E.getEq(eqString, eqNumber).equals

  const getEqTx = `
  import { eqNumber, eqString } from 'fp-ts/lib/Eq'

  function getEq<E, A>(EL: Eq<E>, EA: Eq<A>): Eq<Either<E, A>> {
    return {
      equals: (x, y) =>
        x === y || (isLeft(x) ? isLeft(y) && EL.equals(x.left, y.left) : isRight(y) && EA.equals(x.right, y.right))
    }
  }
  
  const equals = getEq(eqString, eqNumber).equals
  
  equals(right(1), right(1)) // ${equals(E.right(1), E.right(1))}
  equals(right(1), right(2)) // ${equals(E.right(1), E.right(2))}
  equals(right(1), left('foo')) // ${equals(E.right(1), E.left('foo'))}
  equals(left('foo'), left('foo')) // ${equals(E.left('foo'), E.left('foo'))}
  equals(left('foo'), left('bar')) // ${equals(E.left('foo'), E.left('bar'))}
  equals(left('foo'), right(1)) // ${equals(E.left('foo'), E.right(1))}
  `

  // getSemigroup
  const semigroup = E.getSemigroup<string, number>(semigroupSum)

  const getSemigroupTx = `
  // Semigroup returning the left-most non-\`Left\` value.
  // If both operands are \`Right\`s then the inner values are
  // appended using the provided \`Semigroup\`
  
  import { semigroupSum } from 'fp-ts/lib/Semigroup'

  function getSemigroup<E, A>(S: Semigroup<A>): Semigroup<Either<E, A>> {
    return {
      concat: (x, y) => (isLeft(y) ? x : isLeft(x) ? y : right(S.concat(x.right, y.right)))
    }
  }
  
  const semigroup = getSemigroup<string, number>(semigroupSum)
  
  semigroup.concat(left('a'), left('b')) // ${JSON.stringify(semigroup.concat(E.left('a'), E.left('b')))}
  semigroup.concat(left('a'), right(2)) // ${JSON.stringify(semigroup.concat(E.left('a'), E.right(2)))}
  semigroup.concat(right(1), left('b')) // ${JSON.stringify(semigroup.concat(E.right(1), E.left('b')))}
  semigroup.concat(right(1), right(2)) // ${JSON.stringify(semigroup.concat(E.right(1), E.right(2)))}
  `

  // getApplySemigroup
  const applySemigroup = E.getApplySemigroup<string, number>(semigroupSum)

  const getApplySemigroupTx = `
  // \`Apply\` semigroup
  
  import { semigroupSum } from 'fp-ts/lib/Semigroup'

  function getApplySemigroup<E, A>(S: Semigroup<A>): Semigroup<Either<E, A>> {
    return {
      concat: (x, y) => (isLeft(x) ? x : isLeft(y) ? y : right(S.concat(x.right, y.right)))
    }
  }
  
  const applySemigroup = getApplySemigroup<string, number>(semigroupSum)
  
  applySemigroup.concat(left('a'), left('b')) // ${JSON.stringify(applySemigroup.concat(E.left('a'), E.left('b')))}
  applySemigroup.concat(left('a'), right(2)) // ${JSON.stringify(applySemigroup.concat(E.left('a'), E.right(2)))}
  applySemigroup.concat(right(1), left('b')) // ${JSON.stringify(applySemigroup.concat(E.right(1), E.left('b')))}
  applySemigroup.concat(right(1), right(2)) // ${JSON.stringify(applySemigroup.concat(E.right(1), E.right(2)))}
  `

  // getApplyMonoid
  const applyMonoid = E.getApplyMonoid(monoidSum)

  const getApplyMonoidTx = `
  import { monoidSum } from 'fp-ts/lib/Monoid'

  function getApplyMonoid<E, A>(M: Monoid<A>): Monoid<Either<E, A>> {
    return {
      ...getApplySemigroup(M),
      empty: right(M.empty)
    }
  }
  
  const applyMonoid = getApplyMonoid(monoidSum)
  
  applyMonoid.concat(left('a'), applyMonoid.empty) // ${JSON.stringify(
    applyMonoid.concat(E.left('a'), applyMonoid.empty)
  )}
  applyMonoid.concat(applyMonoid.empty, left('b')) // ${JSON.stringify(
    applyMonoid.concat(applyMonoid.empty, E.left('b'))
  )}
  applyMonoid.concat(right(1), applyMonoid.empty) // ${JSON.stringify(
    applyMonoid.concat(E.right(1), applyMonoid.empty)
  )}
  applyMonoid.concat(applyMonoid.empty, right(2)) // ${JSON.stringify(
    applyMonoid.concat(applyMonoid.empty, E.right(2))
  )}
  applyMonoid.concat(right(1), right(2)) // ${JSON.stringify(applyMonoid.concat(E.right(1), E.right(2)))}  
  `

  // swap
  const swapTx = `
  import { monoidSum } from 'fp-ts/lib/Monoid'

  function swap<E, A>(ma: Either<E, A>): Either<A, E> {
    return isLeft(ma) ? right(ma.left) : left(ma.right)
  }
  
  swap(_.right('a')) // ${JSON.stringify(E.swap(E.right('a')))}
  swap(_.left('b')) // ${JSON.stringify(E.swap(E.left('b')))}
  `

  // orElse
  const orElseTx = `
  import { pipe } from 'fp-ts/lib/pipeable'

  function orElse<E, A, M>(onLeft: (e: E) => Either<M, A>): (ma: Either<E, A>) => Either<M, A> {
    return ma => (isLeft(ma) ? onLeft(ma.left) : ma)
  }
  
  pipe(
    right(1),
    orElse(() => right(2))
  ) // ${pipe(
    E.right(1),
    E.orElse(() => E.right(2)),
    JSON.stringify
  )}
  
  pipe(
    right(1),
    orElse(() => left('foo'))
  ) // ${pipe(
    E.right(1),
    E.orElse(() => E.left('foo')),
    JSON.stringify
  )}

  pipe(
    left('a'),
    orElse(() => right(1))
  ) // ${pipe(
    E.left('a'),
    E.orElse(() => E.right(1)),
    JSON.stringify
  )}
  
  pipe(
    left('a'),
    orElse(() => left('b'))
  ) // ${pipe(
    E.left('a'),
    E.orElse(() => E.left('b')),
    JSON.stringify
  )}
  `

  return (
    <>
      <Title>FP-TS (Either)</Title>
      <CodeBlock label='common types' codeTx={commonTypesTX} />
      <CodeBlock label='left' codeTx={leftTx} />
      <CodeBlock label='right' codeTx={rightTx} />
      <CodeBlock label='isLeft' codeTx={isLeftTx} />
      <CodeBlock label='isRight' codeTx={isRightTx} />
      <CodeBlock label='fromNullable' codeTx={fromNullableTx} />
      <CodeBlock label='toError' codeTx={toErrorTx} />
      <CodeBlock label='tryCatch' codeTx={tryCatchTx} />
      <CodeBlock label='fold' codeTx={foldTx} />
      <CodeBlock label='getShow' codeTx={getShowTx} />
      <CodeBlock label='getEq' codeTx={getEqTx} />
      <CodeBlock label='getSemigroup' codeTx={getSemigroupTx} />
      <CodeBlock label='getApplySemigroup' codeTx={getApplySemigroupTx} />
      <CodeBlock label='getApplyMonoid' codeTx={getApplyMonoidTx} />
      <CodeBlock label='swap' codeTx={swapTx} />
      <CodeBlock label='orElse' codeTx={orElseTx} />
    </>
  )
}
