import * as React from 'react'
// components
import { Title } from '@md-views'
import { CodeBlock } from '@md-components/code-block'
// libs
import * as O from 'fp-ts/lib/Option'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import { eqNumber } from 'fp-ts/lib/Eq'
import { ordNumber } from 'fp-ts/lib/Ord'
import { monoidSum } from 'fp-ts/lib/Monoid'
import { semigroupSum } from 'fp-ts/lib/Semigroup'
import { showString, showNumber, showBoolean } from 'fp-ts/lib/Show'

export const OptionContainer: React.FC = () => {
  // common types
  const commonTypesTX = `
  interface None {
    readonly _tag: 'None'
  }

  interface Some<A> {
    readonly _tag: 'Some'
    readonly value: A
  }

  type Option<A> = None | Some<A>
  `

  // some
  const someTx = `
  function some<A>(a: A): Option<A> {
    return { _tag: 'Some', value: a }
  }
  
  some(5) // ${JSON.stringify(O.some<number>(5))}
  some('string_value') // ${JSON.stringify(O.some<string>('string_value'))}
  some({ key: 5 }}) // ${JSON.stringify(
    O.some<{ key: number }>({ key: 5 })
  )}
  `

  // isSome
  const isSomeTx = `
  // Returns \`true\` if the option is an instance of \`Some\`,
  // \`false\` otherwise

  function isSome<A>(fa: Option<A>): fa is Some<A> {
    return fa._tag === 'Some'
  }
  
  isSome(some(5)) // ${O.isSome(O.some<number>(5))}
  isSome(none) // ${O.isSome(O.none)}
  `

  // isNone
  const isNoneTx = `
  // Returns \`true\` if the option is \`None\`,
  // \`false\` otherwise

  function isNone<A>(fa: Option<A>): fa is None {
    return fa._tag === 'None'
  }
  
  isNone(some(5)) // ${O.isNone(O.some<number>(5))}
  isNone(none) // ${O.isNone(O.none)}
  `

  // fold
  const onNone = () => 'none'
  const onSome = (s: string) => `some${s.length}`

  const foldTx = `
  // Takes a default value, a function, and an \`Option\` value,
  // if the \`Option\` value is \`None\` the default value is returned,
  // otherwise the function is applied to the value inside the \`Some\`
  // and the result is returned.

  function fold<A, B>(onNone: () => B, onSome: (a: A) => B): (ma: Option<A>) => B {
    return ma => (isNone(ma) ? onNone() : onSome(ma.value))
  }
  
  const onNone = () => 'none'
  const onSome = (s: string) => \`some\${s.length}\`
  
  const fold = O.fold(onNone, onSome)
  
  fold(O.none) // ${O.fold(onNone, onSome)(O.none)}
  fold(O.some('abc'))) // ${O.fold(onNone, onSome)(O.some('abc'))}
  `

  // fromNullable
  const fromNullableTx = `
  // Constructs a new \`Option\` from a nullable type.
  // If the value is \`null\` or \`undefined\`, returns \`None\`,
  // otherwise returns the value wrapped in a \`Some\`

  function fromNullable<A>(a: A): Option<NonNullable<A>> {
    return a == null ? none : some(a as NonNullable<A>)
  }
  
  fromNullable(1) // ${JSON.stringify(O.fromNullable(O.some(1)))}
  fromNullable(null) // ${JSON.stringify(O.fromNullable(null))}
  fromNullable(undefined) // ${JSON.stringify(O.fromNullable(undefined))}
  `

  // toNullable
  const toNullableTx = `
  // Extracts the value out of the structure, if it exists.
  // Otherwise returns \`null\`.

  function toNullable<A>(ma: Option<A>): A | null {
    return isNone(ma) ? null : ma.value
  }
  
  toNullable(some(1)) // ${O.toNullable(O.some(1))}  
  toNullable(none) // ${O.toNullable(O.none)}
  `

  // toUndefined
  const toUndefinedTx = `
  // Extracts the value out of the structure,
  // if it exists. Otherwise returns \`undefined\`

  function toUndefined<A>(ma: Option<A>): A | undefined {
    return isNone(ma) ? undefined : ma.value
  }
  
  toUndefined(some(1)) // ${O.toUndefined(O.some(1))}  
  toUndefined(none) // ${O.toUndefined(O.none)}
  `

  // getOrElse
  const getOrElseTx = `
  // Extracts the value out of the structure, if it exists.
  // Otherwise returns the given default value

  function function getOrElse<A>(onNone: () => A): (ma: Option<A>) => A {
    return ma => (isNone(ma) ? onNone() : ma.value)
  }
  
  getOrElse(() => 0)(some(100)) // ${O.getOrElse(() => 0)(O.some(100))}
  getOrElse(() => 0)(none) // ${O.getOrElse(() => 0)(O.none)}
  `

  // elem
  const elemTx = `
  // Returns \`true\` if \`ma\` contains \`a\`
  
  import { eqNumber } from 'fp-ts/lib/Eq'

  function function elem<A>(E: Eq<A>): (a: A, ma: Option<A>) => boolean {
    return (a, ma) => (isNone(ma) ? false : E.equals(a, ma.value))
  }
  
  elem(eqNumber)(1, some(1)) // ${O.elem(eqNumber)(1, O.some(1))}
  elem(eqNumber)(2, some(1)) // ${O.elem(eqNumber)(2, O.some(1))}
  elem(eqNumber)(1, none) // ${O.elem(eqNumber)(1, O.none)}
  `

  // exists
  const existsTx = `
  // Returns \`true\` if the predicate is satisfied by the wrapped value
  
  function function exists<A>(predicate: Predicate<A>): (ma: Option<A>) => boolean {
    return ma => (isNone(ma) ? false : predicate(ma.value))
  }
  
  exists(n => n > 0)(some(1)) // ${O.exists(n => n > 0)(O.some(1))}
  exists(n => n > 1)(some(1)) // ${O.exists(n => n > 1)(O.some(1))}
  exists(n => n > 0)(none) // ${O.exists(n => n > 0)(O.none)}
  `

  // fromPredicate
  const predicate = (n: number) => n >= 0

  const fromPredicateTx = `
  // Returns a smart constructor based on the given predicate
  
  function fromPredicate<A, B extends A>(refinement: Refinement<A, B>): (a: A) => Option<B>
  function fromPredicate<A>(predicate: Predicate<A>): (a: A) => Option<A>
  function fromPredicate<A>(predicate: Predicate<A>): (a: A) => Option<A> {
    return a => (predicate(a) ? some(a) : none)
  }
  
  const predicate = (n: number) => n >= 0
  
  fromPredicate(predicate)(1) // ${JSON.stringify(O.fromPredicate(predicate)(1))}
  fromPredicate(predicate)(-1) // ${JSON.stringify(O.fromPredicate(predicate)(-1))}
  `

  // tryCatch
  const tryCatchTx = `
  // Transforms an exception into an \`Option\`.
  // If \`f\` throws, returns \`None\`,
  // otherwise returns the output wrapped in \`Some\`
  
  function tryCatch<A>(f: Lazy<A>): Option<A> {
    try {
      return some(f())
    } catch (e) {
      return none
    }
  }
  
  tryCatch(() => 1) // ${JSON.stringify(O.tryCatch(() => 1))}
  tryCatch(() => { throw new Error() }) // ${JSON.stringify(
    O.tryCatch(() => {
      throw new Error()
    })
  )}
  `

  // getLeft
  const getLeftTx = `
  // Returns an \`E\` value if possible
  
  function getLeft<E, A>(ma: Either<E, A>): Option<E> {
    return ma._tag === 'Right' ? none : some(ma.left)
  }
  
  O.getLeft( E.right(1) ) // ${JSON.stringify(O.getLeft(E.right(1)))} 
  O.getLeft( E.left('error') ) // ${JSON.stringify(O.getLeft(E.left('error')))}
  `

  // getRight
  const getRightTx = `
  // Returns an \`A\` value if possible
  
  function getRight<E, A>(ma: Either<E, A>): Option<A> {
    return ma._tag === 'Left' ? none : some(ma.right)
  }
  
  O.getRight( E.right(1) ) // ${JSON.stringify(O.getRight(E.right(1)))} 
  O.getRight( E.left('error') ) // ${JSON.stringify(O.getRight(E.left('error')))}
  `

  // getRefinement
  const isStringOption = (s: any): O.Option<string> => (typeof s === 'string' ? O.some(s) : O.none)
  const isAOption = (c: { type: string }) => (c.type === 'A' ? O.some(c) : O.none)

  const getRefinementTx = `
  // Returns a \`Refinement\` (i.e. a custom type guard) from a \`Option\` returning function.
  // This function ensures that a custom type guard definition is type-safe.
  
  getRefinement<A, B extends A>(getOption: (a: A) => Option<B>): Refinement<A, B> {
    return (a: A): a is B => isSome(getOption(a))
  }
  
  // example 1
  const isStringOption = (s: any): O.Option<string> => (typeof s === 'string' ? O.some(s) : O.none)
  
  getRefinement(isStringOption)(1) // ${O.getRefinement(isStringOption)(1)}
  getRefinement(isStringOption)('s') // ${O.getRefinement(isStringOption)('s')}
  
  
  // example 2
  type A = { type: 'A' }
  type B = { type: 'B' }
  type C = A | B
  
  const isAOption = O.getRefinement<C, A>(c => (c.type === 'A' ? O.some(c) : O.none))
  
  getRefinement(isAOption)({ type: 'A' }) // ${O.getRefinement(isAOption)({ type: 'A' })}
  getRefinement(isAOption)({ type: 'B' }) // ${O.getRefinement(isAOption)({ type: 'B' })}
  `

  // mapNullable
  interface Employee {
    company?: {
      address?: {
        street?: {
          name?: string
        }
      }
    }
  }

  const employee1: Employee = { company: { address: { street: { name: 'high street' } } } }
  const employee2: Employee = { company: { address: { street: {} } } }

  const mapNullableTx = `
  // This is \`chain\` + \`fromNullable\`, useful when working with optional values
  
  import { pipe } from 'fp-ts/lib/pipeable'
  
  function mapNullable<A, B>(f: (a: A) => B | null | undefined): (ma: Option<A>) => Option<B> {
    return ma => (isNone(ma) ? none : fromNullable(f(ma.value)))
  }
  
  interface Employee {
    company?: {
      address?: {
        street?: {
          name?: string
        }
      }
    }
  }
  
  const employee1: Employee = { company: { address: { street: { name: 'high street' } } } }
  const employee2: Employee = { company: { address: { street: {} } } }

  pipe(
    fromNullable(employee1.company),
    mapNullable(company => company.address),
    mapNullable(address => address.street),
    mapNullable(street => street.name)
  ) // ${pipe(
    O.fromNullable(employee1.company),
    O.mapNullable(company => company.address),
    O.mapNullable(address => address.street),
    O.mapNullable(street => street.name),
    JSON.stringify
  )}
  
  
  pipe(
    fromNullable(employee2.company),
    mapNullable(company => company.address),
    mapNullable(address => address.street),
    mapNullable(street => street.name)
  ) // ${pipe(
    O.fromNullable(employee2.company),
    O.mapNullable(company => company.address),
    O.mapNullable(address => address.street),
    O.mapNullable(street => street.name),
    JSON.stringify
  )}
  `

  // getShow
  const getShowTx = `
  import { showString, showNumber, showBoolean } from 'fp-ts/lib/Show'

  function getShow<A>(S: Show<A>): Show<Option<A>> {
    return {
      show: ma => (isNone(ma) ? 'none' : \`some(\${S.show(ma.value)})\`)
    }
  }
  
  O.getShow(showString).show(O.some('a')) // ${O.getShow(showString).show(O.some('a'))}
  O.getShow(showString).show(O.none) // ${O.getShow(showString).show(O.none)}
  
  O.getShow(showNumber).show(O.some(1)) // ${O.getShow(showNumber).show(O.some(1))}
  O.getShow(showNumber).show(O.none) // ${O.getShow(showNumber).show(O.none)}
  
  O.getShow(showBoolean).show(O.some(1)) // ${O.getShow(showBoolean).show(O.some(false))}
  O.getShow(showBoolean).show(O.none) // ${O.getShow(showBoolean).show(O.none)}
  `

  // getEq
  const getEqTx = `
  import { eqNumber } from 'fp-ts/lib/Eq'

  function getEq<A>(E: Eq<A>): Eq<Option<A>> {
    return {
      equals: (x, y) => x === y || (isNone(x) ? isNone(y) : isNone(y) ? false : E.equals(x.value, y.value))
    }
  }
  
  getEq(eqNumber).equals(none, none) // ${O.getEq(eqNumber).equals(O.none, O.none)}
  getEq(eqNumber).equals(none, some(1)) // ${O.getEq(eqNumber).equals(O.none, O.some(1))}
  getEq(eqNumber).equals(some(1), none) // ${O.getEq(eqNumber).equals(O.some(1), O.none)}
  getEq(eqNumber).equals(some(1), some(2)) // ${O.getEq(eqNumber).equals(O.some(1), O.some(2))}
  getEq(eqNumber).equals(some(1), some(1)) // ${O.getEq(eqNumber).equals(O.some(1), O.some(1))}
  `

  // getOrd
  const getOrdTx = `
  // The \`Ord\` instance allows \`Option\` values to be compared with
  // \`compare\`, whenever there is an \`Ord\` instance for
  // the type the \`Option\` contains.
  
  // \`None\` is considered to be less than any \`Some\` value.

  import { ordNumber } from 'fp-ts/lib/Ord'

  function getOrd<A>(O: Ord<A>): Ord<Option<A>> {
    return {
      equals: getEq(O).equals,
      compare: (x, y) => (x === y ? 0 : isSome(x) ? (isSome(y) ? O.compare(x.value, y.value) : 1) : -1)
    }
  }
  
  getOrd(ordNumber).compare(none, none) // ${O.getOrd(ordNumber).compare(O.none, O.none)}
  getOrd(ordNumber).compare(none, some(1)) // ${O.getOrd(ordNumber).compare(O.none, O.some(1))}
  getOrd(ordNumber).compare(some(1), none) // ${O.getOrd(ordNumber).compare(O.some(1), O.none)}
  getOrd(ordNumber).compare(some(1), some(2)) // ${O.getOrd(ordNumber).compare(O.some(1), O.some(2))}
  getOrd(ordNumber).compare(some(1), some(1)) // ${O.getOrd(ordNumber).compare(O.some(1), O.some(1))}
  `

  // getApplySemigroup
  const getApplySemigroupTx = `
  \`Apply\` semigroup
 
  | x       | y       | concat(x, y)       |
  | ------- | ------- | ------------------ |
  | none    | none    | none               |
  | some(a) | none    | none               |
  | none    | some(a) | none               |
  | some(a) | some(b) | some(concat(a, b)) |

  import { semigroupSum } from 'fp-ts/lib/Semigroup'

  function getApplySemigroup<A>(S: Semigroup<A>): Semigroup<Option<A>> {
    return {
      concat: (x, y) => (isSome(x) && isSome(y) ? some(S.concat(x.value, y.value)) : none)
    }
  }
  
  getApplySemigroup(semigroupSum).concat(none, none) // ${JSON.stringify(
    O.getApplySemigroup(semigroupSum).concat(O.none, O.none)
  )} 
  getApplySemigroup(semigroupSum).concat(some(1), none) // ${JSON.stringify(
    O.getApplySemigroup(semigroupSum).concat(O.some(1), O.none)
  )}
  getApplySemigroup(semigroupSum).concat(none, some(1)) // ${JSON.stringify(
    O.getApplySemigroup(semigroupSum).concat(O.none, O.some(1))
  )}
  getApplySemigroup(semigroupSum).concat(some(1), some(2)) // ${JSON.stringify(
    O.getApplySemigroup(semigroupSum).concat(O.some(1), O.some(2))
  )}
  getApplySemigroup(semigroupSum).concat(some(1), some(1)) // ${JSON.stringify(
    O.getApplySemigroup(semigroupSum).concat(O.some(1), O.some(1))
  )}
  `

  // getApplyMonoid
  const applyMonoid = O.getApplyMonoid(monoidSum)

  const getApplyMonoidTx = `
  import { monoidSum } from 'fp-ts/lib/Monoid'

  function getApplyMonoid<A>(M: Monoid<A>): Monoid<Option<A>> {
    return {
      ...getApplySemigroup(M),
      empty: some(M.empty)
    }
  }
  
  const applyMonoid = O.getApplyMonoid(monoidSum)
  
  applyMonoid.concat(applyMonoid.empty, O.none) // ${JSON.stringify(applyMonoid.concat(applyMonoid.empty, O.none))}
  applyMonoid.concat(O.none, applyMonoid.empty) // ${JSON.stringify(applyMonoid.concat(O.none, applyMonoid.empty))}
  applyMonoid.concat(applyMonoid.empty, O.some(1)) // ${JSON.stringify(
    applyMonoid.concat(applyMonoid.empty, O.some(1))
  )}
  applyMonoid.concat(O.some(1), applyMonoid.empty) // ${JSON.stringify(
    applyMonoid.concat(O.some(1), applyMonoid.empty)
  )}
  applyMonoid.concat(O.some(1), some(1)) // ${JSON.stringify(applyMonoid.concat(O.some(1), O.some(1)))}
  `

  // getFirstMonoid
  const firstMonoid = O.getFirstMonoid<number>()

  const getFirstMonoidTx = `
  // Monoid returning the left-most non-\`None\` value
  // 
  // | x       | y       | concat(x, y) |
  // | ------- | ------- | ------------ |
  // | none    | none    | none         |
  // | some(a) | none    | some(a)      |
  // | none    | some(a) | some(a)      |
  // | some(a) | some(b) | some(a)      |

  function getFirstMonoid<A = never>(): Monoid<Option<A>> {
    return {
      concat: (x, y) => (isNone(x) ? y : x),
      empty: none
    }
  }
  
  const M = getFirstMonoid<number>()
  
  M.concat(none, none) // ${JSON.stringify(firstMonoid.concat(O.none, O.none))}
  M.concat(some(1), none) // ${JSON.stringify(firstMonoid.concat(O.some(1), O.none))}
  M.concat(none, some(1)) // ${JSON.stringify(firstMonoid.concat(O.none, O.some(1)))}
  M.concat(some(1), some(2)) // ${JSON.stringify(firstMonoid.concat(O.some(1), O.some(2)))}
  M.concat(some(2), some(1)) // ${JSON.stringify(firstMonoid.concat(O.some(2), O.some(1)))}
  `

  // getLastMonoid
  const lastMonoid = O.getLastMonoid<number>()

  const getLastMonoidTx = `
  // Monoid returning the right-most non-\`None\` value
  // 
  // | x       | y       | concat(x, y) |
  // | ------- | ------- | ------------ |
  // | none    | none    | none         |
  // | some(a) | none    | some(a)      |
  // | none    | some(a) | some(a)      |
  // | some(a) | some(b) | some(b)      |

  function getLastMonoid<A = never>(): Monoid<Option<A>> {
    return {
      concat: (x, y) => (isNone(y) ? x : y),
      empty: none
    }
  }
  
  const M = getLastMonoid<number>()
  
  M.concat(none, none) // ${JSON.stringify(lastMonoid.concat(O.none, O.none))}
  M.concat(some(1), none) // ${JSON.stringify(lastMonoid.concat(O.some(1), O.none))}
  M.concat(none, some(1)) // ${JSON.stringify(lastMonoid.concat(O.none, O.some(1)))}
  M.concat(some(1), some(2)) // ${JSON.stringify(lastMonoid.concat(O.some(1), O.some(2)))}
  M.concat(some(2), some(1)) // ${JSON.stringify(lastMonoid.concat(O.some(2), O.some(1)))}
  `

  // getMonoid
  const monoid = O.getMonoid(semigroupSum)

  const getMonoidTx = `
  // Monoid returning the left-most non-\`None\` value.
  // If both operands are \`Some\`s then the inner values are
  // appended using the provided \`Semigroup\`
  
  // | x       | y       | concat(x, y)       |
  // | ------- | ------- | ------------------ |
  // | none    | none    | none               |
  // | some(a) | none    | some(a)            |
  // | none    | some(a) | some(a)            |
  // | some(a) | some(b) | some(concat(a, b)) |

  import { semigroupSum } from 'fp-ts/lib/Semigroup'

  function getMonoid<A>(S: Semigroup<A>): Monoid<Option<A>> {
    return {
      concat: (x, y) => (isNone(x) ? y : isNone(y) ? x : some(S.concat(x.value, y.value))),
      empty: none
    }
  }
  
  const M = getMonoid(semigroupSum)
  
  M.concat(none, none) // ${JSON.stringify(monoid.concat(O.none, O.none))}
  M.concat(some(1), none) // ${JSON.stringify(monoid.concat(O.some(1), O.none))}
  M.concat(none, some(1)) // ${JSON.stringify(monoid.concat(O.none, O.some(1)))}
  M.concat(some(1), some(2)) // ${JSON.stringify(monoid.concat(O.some(1), O.some(2)))}
  M.concat(some(1), some(2)) // ${JSON.stringify(monoid.concat(O.some(2), O.some(1)))}
  `

  return (
    <>
      <Title>FP-TS (Option)</Title>
      <CodeBlock label='common types' codeTx={commonTypesTX} />
      <CodeBlock label='some' codeTx={someTx} />
      <CodeBlock label='isSome' codeTx={isSomeTx} />
      <CodeBlock label='isNone' codeTx={isNoneTx} />
      <CodeBlock label='fold' codeTx={foldTx} />
      <CodeBlock label='fromNullable' codeTx={fromNullableTx} />
      <CodeBlock label='toNullable' codeTx={toNullableTx} />
      <CodeBlock label='toUndefined' codeTx={toUndefinedTx} />
      <CodeBlock label='getOrElse' codeTx={getOrElseTx} />
      <CodeBlock label='elem' codeTx={elemTx} />
      <CodeBlock label='exists' codeTx={existsTx} />
      <CodeBlock label='fromPredicate' codeTx={fromPredicateTx} />
      <CodeBlock label='tryCatch' codeTx={tryCatchTx} />
      <CodeBlock label='getLeft' codeTx={getLeftTx} />
      <CodeBlock label='getRight' codeTx={getRightTx} />
      <CodeBlock label='getRefinement' codeTx={getRefinementTx} />
      <CodeBlock label='mapNullable' codeTx={mapNullableTx} />
      <CodeBlock label='getShow' codeTx={getShowTx} />
      <CodeBlock label='getEq' codeTx={getEqTx} />
      <CodeBlock label='getOrd' codeTx={getOrdTx} />
      <CodeBlock label='getApplySemigroup' codeTx={getApplySemigroupTx} />
      <CodeBlock label='getApplyMonoid' codeTx={getApplyMonoidTx} />
      <CodeBlock label='getFirstMonoid' codeTx={getFirstMonoidTx} />
      <CodeBlock label='getLastMonoid' codeTx={getLastMonoidTx} />
      <CodeBlock label='getMonoid' codeTx={getMonoidTx} />
    </>
  )
}
