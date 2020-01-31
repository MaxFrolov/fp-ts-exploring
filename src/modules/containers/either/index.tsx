import * as React from 'react'
// components
import { ModuleContainer, Title } from '@md-views'
import { CodeBlock } from '@md-components/code-block'
// libs
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import * as I from 'fp-ts/lib/Identity'
import { pipe } from 'fp-ts/lib/pipeable'
import { showString } from 'fp-ts/lib/Show'
import { semigroupSum } from 'fp-ts/lib/Semigroup'
import { eqNumber, eqString } from 'fp-ts/lib/Eq'
import { monoidSum, monoidString } from 'fp-ts/lib/Monoid'

export const EitherContainer: React.FC = () => {
  // common types
  const commonTypesTX = `
  declare module './HKT' {
    interface URItoKind2<E, A> {
      Either: Either<E, A>
    }
  }
  
  export const URI = 'Either'
  export type URI = typeof URI
  
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
 
  /* examples */
  
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

  /* examples */
  
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
  
  /* examples */
  
  isLeft(left(1)) // ${JSON.stringify(E.isLeft(E.left(1)))}
  isLeft(right(1)) // ${JSON.stringify(E.isLeft(E.right(1)))}
  `

  // isRight
  const isRightTx = `
  // Returns \`true\` if the either is an instance of \`Right\`, \`false\` otherwise

  function isRight<E, A>(ma: Either<E, A>): ma is Right<A> {
    return isLeft(ma) ? false : true
  }
  
  /* examples */
  
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
  
  /* examples */
  
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
  
  /* examples */

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
  
  /* examples */
  
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

  function fold<E, A, B>(onLeft: (e: E) => B, onRight: (a: A) => B): (ma: Either<E, A>) => B {
    return ma => (isLeft(ma) ? onLeft(ma.left) : onRight(ma.right))
  }
  
  /* examples */
  
  import { pipe } from 'fp-ts/lib/pipeable'
  
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

  function getShow<E, A>(SE: Show<E>, SA: Show<A>): Show<Either<E, A>> {
    return {
      show: ma => (isLeft(ma) ? \`left(\${SE.show(ma.left)})\` : \`right(\${SA.show(ma.right)})\`)
    }
  }
  
  /* examples */
  
  import { showString } from 'fp-ts/lib/Show'
  
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
  
  /* examples */

  import { eqNumber, eqString } from 'fp-ts/lib/Eq'

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
  
  function getSemigroup<E, A>(S: Semigroup<A>): Semigroup<Either<E, A>> {
    return {
      concat: (x, y) => (isLeft(y) ? x : isLeft(x) ? y : right(S.concat(x.right, y.right)))
    }
  }
  
  /* examples */

  import { semigroupSum } from 'fp-ts/lib/Semigroup'

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
  
  function getApplySemigroup<E, A>(S: Semigroup<A>): Semigroup<Either<E, A>> {
    return {
      concat: (x, y) => (isLeft(x) ? x : isLeft(y) ? y : right(S.concat(x.right, y.right)))
    }
  }
  
  /* examples */
  
  import { semigroupSum } from 'fp-ts/lib/Semigroup'
  
  const applySemigroup = getApplySemigroup<string, number>(semigroupSum)
  
  applySemigroup.concat(left('a'), left('b')) // ${JSON.stringify(applySemigroup.concat(E.left('a'), E.left('b')))}
  applySemigroup.concat(left('a'), right(2)) // ${JSON.stringify(applySemigroup.concat(E.left('a'), E.right(2)))}
  applySemigroup.concat(right(1), left('b')) // ${JSON.stringify(applySemigroup.concat(E.right(1), E.left('b')))}
  applySemigroup.concat(right(1), right(2)) // ${JSON.stringify(applySemigroup.concat(E.right(1), E.right(2)))}
  `

  // getApplyMonoid
  const applyMonoid = E.getApplyMonoid(monoidSum)

  const getApplyMonoidTx = `
  function getApplyMonoid<E, A>(M: Monoid<A>): Monoid<Either<E, A>> {
    return {
      ...getApplySemigroup(M),
      empty: right(M.empty)
    }
  }
  
  /* examples */
  
  import { monoidSum } from 'fp-ts/lib/Monoid'
  
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

  function swap<E, A>(ma: Either<E, A>): Either<A, E> {
    return isLeft(ma) ? right(ma.left) : left(ma.right)
  }
  
  /* examples */
  
  import { monoidSum } from 'fp-ts/lib/Monoid'
  
  swap(right('a')) // ${JSON.stringify(E.swap(E.right('a')))}
  swap(left('b')) // ${JSON.stringify(E.swap(E.left('b')))}
  `

  // orElse
  const orElseTx = `
  function orElse<E, A, M>(onLeft: (e: E) => Either<M, A>): (ma: Either<E, A>) => Either<M, A> {
    return ma => (isLeft(ma) ? onLeft(ma.left) : ma)
  }
  
  /* examples */
  
  import { pipe } from 'fp-ts/lib/pipeable'
  
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

  // getOrElse
  const getOrElseTx = `

  function getOrElse<E, A>(onLeft: (e: E) => A): (ma: Either<E, A>) => A {
    return ma => (isLeft(ma) ? onLeft(ma.left) : ma.right)
  }
  
  /* examples */ 
  
  import { pipe } from 'fp-ts/lib/pipeable'

  pipe(
    right(12),
    getOrElse(() => 17)
  ) // ${pipe(
    E.right(12),
    E.getOrElse(() => 17),
    JSON.stringify
  )}
  
  pipe(
    left('a'),
    getOrElse(() => 17)
  ) // ${pipe(
    E.left('a'),
    E.getOrElse(() => 17),
    JSON.stringify
  )}
  
  pipe(
    left('a'),
    getOrElse((l: string) => l.length + 1)
  ) // ${pipe(
    E.left('a'),
    E.getOrElse((l: string) => l.length + 1),
    JSON.stringify
  )}
  `

  // elem
  const elemTx = `
  function elem<A>(E: Eq<A>): <E>(a: A, ma: Either<E, A>) => boolean {
    return (a, ma) => (isLeft(ma) ? false : E.equals(a, ma.right))
  }
  
  /* examples */ 
  
  import { eqNumber } from 'fp-ts/lib/Eq'
  
  elem(eqNumber)(2, left('a')) // ${E.elem(eqNumber)(2, E.left('a'))}
  elem(eqNumber)(2, right(2)) // ${E.elem(eqNumber)(2, E.right(2))}
  elem(eqNumber)(1, right(2)) // ${E.elem(eqNumber)(1, E.right(2))}
  `

  // exists
  const greaterThan2 = E.exists((n: number) => n > 2)

  const existsTx = `
  // Returns \`false\` if \`Left\` or returns the result of the
  // application of the given predicate to the \`Right\` value.

  function exists<A>(predicate: Predicate<A>): <E>(ma: Either<E, A>) => boolean {
    return ma => (isLeft(ma) ? false : predicate(ma.right))
  }
  
  /* examples */ 
  
  const greaterThan2 = exists((n: number) => n > 2)
 
  greaterThan2(left('a')) // ${greaterThan2(E.left('a'))}
  greaterThan2(right(1)) // ${greaterThan2(E.right(1))}
  greaterThan2(right(3)) // ${greaterThan2(E.right(3))}
  `

  // parseJSON
  const parseJSONTx = `
  // Converts a JavaScript Object Notation (JSON) string into an object.

  function parseJSON<E>(s: string, onError: (reason: unknown) => E): Either<E, unknown> {
    return tryCatch(() => JSON.parse(s), onError)
  }
  
  /* examples */
  
  parseJSON('{"a":1}', toError) // ${JSON.stringify(E.parseJSON('{"a":1}', E.toError))}
  parseJSON('{"a":}', toError) // ${JSON.stringify(E.parseJSON('{"a":}', E.toError))}
  `

  // stringifyJSON
  const circular: any = { ref: null }
  circular.ref = circular

  const stringifyJSONTx = `
  // Converts a JavaScript value to a JavaScript Object Notation (JSON) string.

  function stringifyJSON<E>(u: unknown, onError: (reason: unknown) => E): Either<E, string> {
    return tryCatch(() => JSON.stringify(u), onError)
  }
  
  /* examples */
  
  import { pipe } from 'fp-ts/lib/pipeable'
  
  const circular: any = { ref: null }
  circular.ref = circular
  
  parseJSON('{"a":1}', toError) // ${JSON.stringify(E.stringifyJSON({ a: 1 }, E.toError))} 
  
  pipe(
    stringifyJSON(circular, toError),
    mapLeft(e => e.message.includes('Converting circular structure to JSON'))
  ) // ${pipe(
    E.stringifyJSON(circular, E.toError),
    E.mapLeft(e => e.message.includes('Converting circular structure to JSON')),
    JSON.stringify
  )}
  `

  // getWitherable
  const witherable = E.getWitherable(monoidString)
  const wiltIdentity = witherable.wilt(I.identity)
  const witherIdentity = witherable.wither(I.identity)

  const witherableP = (n: number) => n > 2
  const witherableF = (n: number) => (witherableP(n) ? E.right(n + 1) : E.left(n - 1))
  const witherableFM = (n: number) => (witherableP(n) ? O.some(n + 1) : O.none)
  const witherableFI = (n: number) => I.identity.of(witherableP(n) ? O.some(n + 1) : O.none)
  const witherableFWI = (n: number) => I.identity.of(witherableP(n) ? E.right(n + 1) : E.left(n - 1))

  const getWitherableTx = `
  // Builds \`Witherable\` instance for \`Either\` given \`Monoid\` for the left side

  function getWitherable<E>(M: Monoid<E>): Witherable2C<URI, E> {
    const empty = left(M.empty)
  
    const compact = <A>(ma: Either<E, Option<A>>): Either<E, A> => {
      return isLeft(ma) ? ma : ma.right._tag === 'None' ? left(M.empty) : right(ma.right.value)
    }
  
    const separate = <A, B>(ma: Either<E, Either<A, B>>): Separated<Either<E, A>, Either<E, B>> => {
      return isLeft(ma)
        ? { left: ma, right: ma }
        : isLeft(ma.right)
        ? { left: right(ma.right.left), right: empty }
        : { left: empty, right: right(ma.right.right) }
    }
  
    const partitionMap = <A, B, C>(
      ma: Either<E, A>,
      f: (a: A) => Either<B, C>
    ): Separated<Either<E, B>, Either<E, C>> => {
      if (isLeft(ma)) {
        return { left: ma, right: ma }
      }
      const e = f(ma.right)
      return isLeft(e) ? { left: right(e.left), right: empty } : { left: empty, right: right(e.right) }
    }
  
    const partition = <A>(ma: Either<E, A>, p: Predicate<A>): Separated<Either<E, A>, Either<E, A>> => {
      return isLeft(ma)
        ? { left: ma, right: ma }
        : p(ma.right)
        ? { left: empty, right: right(ma.right) }
        : { left: right(ma.right), right: empty }
    }
  
    const filterMap = <A, B>(ma: Either<E, A>, f: (a: A) => Option<B>): Either<E, B> => {
      if (isLeft(ma)) {
        return ma
      }
      const ob = f(ma.right)
      return ob._tag === 'None' ? left(M.empty) : right(ob.value)
    }
  
    const filter = <A>(ma: Either<E, A>, predicate: Predicate<A>): Either<E, A> =>
      isLeft(ma) ? ma : predicate(ma.right) ? ma : left(M.empty)
  
    const wither = <F>(
      F: Applicative<F>
    ): (<A, B>(ma: Either<E, A>, f: (a: A) => HKT<F, Option<B>>) => HKT<F, Either<E, B>>) => {
      const traverseF = either.traverse(F)
      return (ma, f) => F.map(traverseF(ma, f), compact)
    }
  
    const wilt = <F>(
      F: Applicative<F>
    ): (<A, B, C>(
      ma: Either<E, A>,
      f: (a: A) => HKT<F, Either<B, C>>
    ) => HKT<F, Separated<Either<E, B>, Either<E, C>>>) => {
      const traverseF = either.traverse(F)
      return (ma, f) => F.map(traverseF(ma, f), separate)
    }
  
    return {
      URI,
      _E: undefined as any,
      map: either.map,
      compact,
      separate,
      filter,
      filterMap,
      partition,
      partitionMap,
      traverse: either.traverse,
      sequence: either.sequence,
      reduce: either.reduce,
      foldMap: either.foldMap,
      reduceRight: either.reduceRight,
      wither,
      wilt
    }
  }
  
  /* examples */
  
  import { monoidString } from 'fp-ts/lib/Monoid'
  
  const witherable = getWitherable(monoidString)

  /* example: .compact */
  
  witherable.compact(left('1'))
  // ${JSON.stringify(witherable.compact(E.left('1')))}
  
  witherable.compact(right(none))
  // ${JSON.stringify(witherable.compact(E.right(O.none)))}
  
  witherable.compact(right(some(123)))
  // ${JSON.stringify(witherable.compact(E.right(O.some(123))))}

  /* example: .separate */
  
  witherable.separate(left('123'))
  // ${JSON.stringify(witherable.separate(E.left('123')))}
  
  witherable.separate(right(left('123')))
  // ${JSON.stringify(witherable.separate(E.right(E.left('123'))))} 
  
  witherable.separate(right(right('123')))
  // ${JSON.stringify(witherable.separate(E.right(E.right('123'))))}
  
  /* example: .partition */
  
  const p = (n: number) => n > 2

  witherable.partition(left('123'), p)
  // ${JSON.stringify(witherable.partition(E.left('123'), witherableP))}
  
  witherable.partition(right(1), p)
  // ${JSON.stringify(witherable.partition(E.right(1), witherableP))}
  
  witherable.partition(right(3), p)
  // ${JSON.stringify(witherable.partition(E.right(3), witherableP))}

  /* example: .partitionMap */
  
  const p = (n: number) => n > 2
  const f = (n: number) => (p(n) ? right(n + 1) : left(n - 1))
  
  witherable.partitionMap(left('123'), f)
  // ${JSON.stringify(witherable.partitionMap(E.left('123'), witherableF))}
  
  witherable.partitionMap(right(1), f)
  // ${JSON.stringify(witherable.partitionMap(E.right(1), witherableF))}

  witherable.partitionMap(_.right(3), f)
  // ${JSON.stringify(witherable.partitionMap(E.right(3), witherableF))}
      
  /* example: .filter */
  const p = (n: number) => n > 2
  
  witherable.filter(left('123'), p)
  // ${JSON.stringify(witherable.filter(E.left('123'), witherableP))}
  
  witherable.filter(right(1), p)
  // ${JSON.stringify(witherable.filter(E.right(1), witherableP))}

  witherable.filter(right(3), p)
  // ${JSON.stringify(witherable.filter(E.right(3), witherableP))}

  /* example: .filterMap */
  
  const p = (n: number) => n > 2
  const f = (n: number) => (p(n) ? some(n + 1) : none)
  
  W.filterMap(left('123'), f)
  // ${JSON.stringify(witherable.filterMap(E.left('123'), witherableFM))}
  
  W.filterMap(right(1), f)
  // ${JSON.stringify(witherable.filterMap(E.right(1), witherableFM))}

  W.filterMap(right(3), f)
  // ${JSON.stringify(witherable.filterMap(E.right(3), witherableFM))}

  /* example: .wither */

  import * as I from 'fp-ts/lib/Identity'

  const p = (n: number) => n > 2
  const f = (n: number) => I.identity.of(p(n) ? some(n + 1) : none)

  const witherIdentity = W.wither(I.identity)
  
  witherIdentity(left('foo'), f)
  // ${JSON.stringify(witherIdentity(E.left('foo'), witherableFI))}
  
  witherIdentity(right(1), f)
  // ${JSON.stringify(witherIdentity(E.right(1), witherableFI))}
  
  witherIdentity(right(3), f)
  // ${JSON.stringify(witherIdentity(E.right(3), witherableFI))}

  /* example: .wilt */

  import * as I from 'fp-ts/lib/Identity'

  const p = (n: number) => n > 2
  const f = (n: number) => I.identity.of(p(n) ? _.right(n + 1) : _.left(n - 1))
  
  const wiltIdentity = W.wilt(I.identity)
  
  wiltIdentity(left('foo'), f)
  // ${JSON.stringify(wiltIdentity(E.left('foo'), witherableFWI))}
  
  wiltIdentity(right(1), f)
  // ${JSON.stringify(wiltIdentity(E.right(1), witherableFWI))}

  wiltIdentity(right(3), f)
  // ${JSON.stringify(wiltIdentity(E.right(3), witherableFWI))}
  `

  // getValidation
  const validation = E.getValidation(monoidString)
  const validationF = (s: string) => E.right(s.length)
  const validationDouble = (n: number) => n * 2

  const getValidationTx = `
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

  // getValidationSemigroup
  const validationSemigroup = E.getValidationMonoid(monoidString, monoidSum)

  const getValidationSemigroupTx = `
  function getValidationSemigroup<E, A>(SE: Semigroup<E>, SA: Semigroup<A>): Semigroup<Either<E, A>> {
    return {
      concat: (fx, fy) =>
        isLeft(fx)
          ? isLeft(fy)
            ? left(SE.concat(fx.left, fy.left))
            : fx
          : isLeft(fy)
          ? fy
          : right(SA.concat(fx.right, fy.right))
    }
  }
  
  /* examples */
  
  import { monoidSum, monoidString } from 'fp-ts/lib/Monoid'
  
  const validationSemigroup = getValidationSemigroup(monoidString, monoidSum)

  validationMonoid.concat(right(1), right(2))
  // ${JSON.stringify(validationSemigroup.concat(E.right(1), E.right(2)))}
  
  validationMonoid.concat(right(1), left('foo'))
  // ${JSON.stringify(validationSemigroup.concat(E.right(1), E.left('foo')))}

  validationMonoid.concat(left('foo'), right(1))
  // ${JSON.stringify(validationSemigroup.concat(E.left('foo'), E.right(2)))}

  validationMonoid.concat(left('foo'), left('bar'))
  // ${JSON.stringify(validationSemigroup.concat(E.left('foo'), E.left('bar')))}
  `

  // getValidationMonoid
  const validationMonoid = E.getValidationMonoid(monoidString, monoidSum)

  const getValidationMonoidTx = `
  function getValidationMonoid<E, A>(SE: Semigroup<E>, SA: Monoid<A>): Monoid<Either<E, A>> {
    return {
      concat: getValidationSemigroup(SE, SA).concat,
      empty: right(SA.empty)
    }
  }
  
  /* examples */
  
  import { monoidSum, monoidString } from 'fp-ts/lib/Monoid'
  
  const validationMonoid = getValidationMonoid(monoidString, monoidSum)
  
  validationMonoid.concat(right(1), right(2))
  // ${JSON.stringify(validationMonoid.concat(E.right(1), E.right(2)))}
  
  validationMonoid.concat(right(1), left('foo'))
  // ${JSON.stringify(validationMonoid.concat(E.right(1), E.left('foo')))}

  validationMonoid.concat(left('foo'), right(1))
  // ${JSON.stringify(validationMonoid.concat(E.left('foo'), E.right(2)))}

  validationMonoid.concat(left('foo'), left('bar'))
  // ${JSON.stringify(validationMonoid.concat(E.left('foo'), E.left('bar')))}

  validationMonoid.concat(right(1), validationMonoid.empty)
  // ${JSON.stringify(validationMonoid.concat(E.right(1), validationMonoid.empty))}

  validationMonoid.concat(validationMonoid.empty, right(1))
  // ${JSON.stringify(validationMonoid.concat(validationMonoid.empty, E.right(1)))}
  `

  return (
    <ModuleContainer id='either'>
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
      <CodeBlock label='getOrElse' codeTx={getOrElseTx} />
      <CodeBlock label='getOrElse' codeTx={getOrElseTx} />
      <CodeBlock label='elem' codeTx={elemTx} />
      <CodeBlock label='exists' codeTx={existsTx} />
      <CodeBlock label='parseJSON' codeTx={parseJSONTx} />
      <CodeBlock label='stringifyJSON' codeTx={stringifyJSONTx} />
      <CodeBlock label='getWitherable' codeTx={getWitherableTx} />
      <CodeBlock label='getValidation' codeTx={getValidationTx} />
      <CodeBlock label='getValidationSemigroup' codeTx={getValidationSemigroupTx} />
      <CodeBlock label='getValidationMonoid' codeTx={getValidationMonoidTx} />
    </ModuleContainer>
  )
}
