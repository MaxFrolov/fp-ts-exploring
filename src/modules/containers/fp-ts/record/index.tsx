import * as React from 'react'
// views
import { ModuleContainer, Title } from '@md-views'
// view components
import { CodeBlock } from '@md-components/code-block'
// libs
import * as S from 'fp-ts/lib/Show'
import * as R from 'fp-ts/lib/Record'
import * as A from 'fp-ts/lib/Array'
import * as Eq from 'fp-ts/lib/Eq'
import * as Se from 'fp-ts/lib/Semigroup'
import * as M from 'fp-ts/lib/Monoid'
import * as O from 'fp-ts/lib/Option'
import * as E from 'fp-ts/lib/Either'

interface User {
  id: string
  name: string
}

const RecordContainer = () => {
  // commonTypes
  const commonTypesTx = `
  declare module './HKT' {
    interface URItoKind<A> {
      Record: Record<string, A>
    }
  }

  const URI = 'Record'
  type URI = typeof URI
  `

  // constants
  const mainConstantsTx = `
  // main constants
  const empty: Record<string, never> = {}
  `

  // getShow
  const getShowTx = `
  function getShow<A>(S: Show<A>): Show<Record<string, A>> {
    return {
      show: r => {
        const elements = collect((k, a: A) => \`\${showString.show(k)}: \${S.show(a)}\`)(r).join(', ')
        return elements === '' ? '{}' : \`{ \${elements} }\`
      }
    }
  }
  
  // examples
  import * as S from 'fp-ts/lib/Show'
  
  getShow(S.showString).show({ hello: 'world' }) // ${JSON.stringify(R.getShow(S.showString).show({ hello: 'world' }))}
  getShow(S.showString).show({}) // ${JSON.stringify(R.getShow(S.showString).show({}))}
  `

  // size
  const sizeTx = `
  // Calculate the number of key/value pairs in a record
  
  function size(r: Record<string, unknown>): number {
    return Object.keys(r).length
  }
  
  // examples
  size({ a: 1, b: 2 }) // ${R.size({ a: 1, b: 2 })}
  size({}) // ${R.size({})}
  `

  // isEmpty
  const isEmptyTx = `
  // Test whether a record is empty
  
  function isEmpty(r: Record<string, unknown>): boolean {
    return Object.keys(r).length === 0
  }
  
  // examples
  isEmpty({ a: 1, b: 2 }) // ${R.isEmpty({ a: 1, b: 2 })}
  isEmpty({}) // ${R.isEmpty({})}
  `

  // collect
  const collectTx = `
  // Map a record into an array
  
  function collect<K extends string, A, B>(f: (k: K, a: A) => B): (r: Record<K, A>) => Array<B> {
    return r => {
      const out: Array<B> = []
      
      for (const key of keys(r)) {
        out.push(f(key, r[key]))
      }
      
      return out
    }
  }
  
  // examples
  collect((key, val) => ({ key: key, value: val }))({ a: 'hello', b: false }) // ${JSON.stringify(
    R.collect((key, val) => ({ key: key, value: val }))({ a: 'hello', b: false })
  )}
  collect((key, val) => ({ key: key, value: val }))({}) // ${JSON.stringify(
    R.collect((key, val) => ({ key: key, value: val }))({})
  )}
  `

  // toArray
  const toArrayTx = `
  const toArray: <K extends string, A>(r: Record<K, A>) => Array<[K, A]> = collect((k, a) => [k, a])
  
  // examples
  toArray({ a: 'hello', b: false }) // ${JSON.stringify(R.toArray({ a: 'hello', b: false }))}
  toArray({}) // ${JSON.stringify(R.toArray({}))}
  `

  // toUnfoldable
  const toUnfoldableTx = `
  // Unfolds a record into a list of key/value pairs
  
  function toUnfoldable<F extends URIS>(
    unfoldable: Unfoldable1<F>
  ): <K extends string, A>(r: Record<K, A>) => Kind<F, [K, A]>
  export function toUnfoldable<F>(unfoldable: Unfoldable<F>): <K extends string, A>(r: Record<K, A>) => HKT<F, [K, A]>
  export function toUnfoldable<F>(unfoldable: Unfoldable<F>): <A>(r: Record<string, A>) => HKT<F, [string, A]> {
    return r => {
      const arr = toArray(r)
      const len = arr.length
      return unfoldable.unfold(0, b => (b < len ? optionSome([arr[b], b + 1]) : none))
    }
  }
  
  // examples
  R.toUnfoldable(array)({ a: 'hello', b: false }) // ${JSON.stringify(
    R.toUnfoldable(A.array)({ a: 'hello', b: false })
  )}
  R.toUnfoldable(array)({}) // ${JSON.stringify(R.toUnfoldable(A.array)({}))}
  `

  // insertAt
  const insertAtTx = `
  // Insert or replace a key/value pair in a record
  
  export function insertAt<K extends string, A>(k: K, a: A): <KS extends string>(r: Record<KS, A>) => Record<KS | K, A>
  export function insertAt<A>(k: string, a: A): (r: Record<string, A>) => Record<string, A> {
    return r => {
      if (r[k] === a) {
        return r
      }
      const out = Object.assign({}, r)
      out[k] = a
      return out
    }
  }

  // examples
  R.insertAt('c', 'world')({ a: 'hello', b: 'false' }) // ${JSON.stringify(
    R.insertAt('c', 'world')({ a: 'hello', b: 'false' })
  )}
  R.insertAt('b', 'world')({ a: 'hello', b: 'false' }) // ${JSON.stringify(
    R.insertAt('b', 'world')({ a: 'hello', b: 'false' })
  )}
  `

  // deleteAt
  const x = { a: 1 }

  const deleteAtTx = `
  // Delete a key and value from a map
  
  function deleteAt<K extends string>(
    k: K
  ): <KS extends string, A>(r: Record<KS, A>) => Record<string extends K ? string : Exclude<KS, K>, A>
  export function deleteAt(k: string): <A>(r: Record<string, A>) => Record<string, A> {
    return r => {
      if (!_hasOwnProperty.call(r, k)) {
        return r
      }
      const out = Object.assign({}, r)
      delete out[k]
      return out
    }
  }
  
  // examples
  const x = { a: 1 }

  R.deleteAt('a')({ a: 1, b: 2 }) // ${JSON.stringify(R.deleteAt('a')({ a: 1, b: 2 }))}
  R.deleteAt('b')(x) // ${JSON.stringify(R.deleteAt('b')(x))}
  `

  // updateAt
  const y: Record<string, number> = { a: 1 }

  const updateAtTx = `
  function updateAt<A>(k: string, a: A): <K extends string>(r: Record<K, A>) => Option<Record<K, A>> {
    return r => {
      if (!hasOwnProperty(k, r)) {
        return none
      }
      if (r[k] === a) {
        return optionSome(r)
      }
      const out = Object.assign({}, r)
      out[k] = a
      return optionSome(out)
    }
  }
  
  // examples
  const x: Record<string, number> = { a: 1 }
  
  R.updateAt('b', 2)(x) // ${JSON.stringify(R.updateAt('b', 2)(y))}
  R.updateAt('a', 2)(x) // ${JSON.stringify(R.updateAt('a', 2)(y))}
  `

  // modifyAt
  const modifyAtTx = `
  function modifyAt<A>(k: string, f: (a: A) => A): <K extends string>(r: Record<K, A>) => Option<Record<K, A>> {
    return r => {
      if (!hasOwnProperty(k, r)) {
        return none
      }
      const out = Object.assign({}, r)
      out[k] = f(r[k])
      return optionSome(out)
    }
  }
  
  // examples
  const x: Record<string, number> = { a: 1 }
  
  R.modifyAt('b', (n: number) => n * 2)(x) // ${JSON.stringify(R.modifyAt('b', (n: number) => n * 2)(y))}
  R.modifyAt('a', (n: number) => n * 2)(x) // ${JSON.stringify(R.modifyAt('a', (n: number) => n * 2)(y))}
  `

  // pop
  const popTx = `
  // Delete a key and value from a map, returning the value as well as the subsequent map
  
  export function pop<K extends string>(
    k: K
  ): <KS extends string, A>(r: Record<KS, A>) => Option<[A, Record<string extends K ? string : Exclude<KS, K>, A>]>
  export function pop(k: string): <A>(r: Record<string, A>) => Option<[A, Record<string, A>]> {
    const deleteAtk = deleteAt(k)
    return r => {
      const oa = lookup(k, r)
      return isNone(oa) ? none : optionSome([oa.value, deleteAtk(r)])
    }
  }
  
  // examples
  R.pop('a')({ a: 1, b: 2 }) // ${JSON.stringify(R.pop('a')({ a: 1, b: 2 }))}
  R.pop('c')({ a: 1, b: 2 }) // ${JSON.stringify(R.pop('c')({ a: 1, b: 2 }))}
  `

  // isSubrecord
  const isSubrecordTx = `
  // Test whether one record contains all of the keys and values contained in another record
  
  function isSubrecord<A>(E: Eq<A>): (x: Record<string, A>, y: Record<string, A>) => boolean {
    return (x, y) => {
      for (const k in x) {
        if (!_hasOwnProperty.call(y, k) || !E.equals(x[k], y[k])) {
          return false
        }
      }
      return true
    }
  }
  
  // examples
  R.isSubrecord(Eq.eqString)({ a: '1', b: '2' }, { a: '1', b: '2' }) // ${JSON.stringify(
    R.isSubrecord(Eq.eqString)({ a: '1', b: '2' }, { a: '1', b: '2' })
  )}
  R.isSubrecord(Eq.eqString)({ a: '1', b: '3' }, { a: '1', b: '2' }) // ${JSON.stringify(
    R.isSubrecord(Eq.eqString)({ a: '1', b: '3' }, { a: '1', b: '2' })
  )}
  `

  // getEq
  const getEqTx = `
  export function getEq<K extends string, A>(E: Eq<A>): Eq<Record<K, A>>
  export function getEq<A>(E: Eq<A>): Eq<Record<string, A>> {
    const isSubrecordE = isSubrecord(E)
    return fromEquals((x, y) => isSubrecordE(x, y) && isSubrecordE(y, x))
  }
  
  // examples
  R.getEq(Eq.eqString).equals({ a: '1', b: '3' }, { a: '1', b: '3' }) // ${JSON.stringify(
    R.getEq(Eq.eqString).equals({ a: '1', b: '3' }, { a: '1', b: '3' })
  )}
  R.getEq(Eq.eqString).equals({ a: '1', b: '2' }, { a: '1', b: '3' }) // ${JSON.stringify(
    R.getEq(Eq.eqString).equals({ a: '1', b: '2' }, { a: '1', b: '3' })
  )}
  `

  // getMonoid
  const getMonoidTx = `
  // Returns a \`Semigroup\` instance for records given a \`Semigroup\` instance for their values
  
  export function getMonoid<K extends string, A>(S: Semigroup<A>): Monoid<Record<K, A>>
  export function getMonoid<A>(S: Semigroup<A>): Monoid<Record<string, A>> {
    return {
      concat: (x, y) => {
        if (x === empty) {
          return y
        }
        if (y === empty) {
          return x
        }
        const keys = Object.keys(y)
        const len = keys.length
        if (len === 0) {
          return x
        }
        const r: Record<string, A> = { ...x }
        for (let i = 0; i < len; i++) {
          const k = keys[i]
          r[k] = _hasOwnProperty.call(x, k) ? S.concat(x[k], y[k]) : y[k]
        }
        return r
      },
      empty
    }
  }
  
  // examples
  const M = getMonoid(semigroupSum)
  
  M.concat({ foo: 123 }, { foo: 456 }) // ${JSON.stringify(
    R.getMonoid(Se.semigroupSum).concat({ foo: 123 }, { foo: 456 })
  )}
  M.concat({ foo: '123' }, { foo: '456' }) // ${JSON.stringify(
    R.getMonoid(Se.semigroupString).concat({ foo: '123' }, { foo: '456' })
  )}
  `

  // lookup
  const lookupTx = `
  function lookup<A>(k: string, r: Record<string, A>): Option<A> {
    return _hasOwnProperty.call(r, k) ? optionSome(r[k]) : none
  }
  
  // examples
  lookup('b', { a: 1, b: 2 }) // ${JSON.stringify(R.lookup('b', { a: 1, b: 2 }))}
  lookup('с', { a: 1, b: 2 }) // ${JSON.stringify(R.lookup('с', { a: 1, b: 2 }))}
  `

  // mapWithIndex
  const mapWithIndexTx = `
  // Map a record passing the keys to the iterating function
  
  export function mapWithIndex<K extends string, A, B>(f: (k: K, a: A) => B): (fa: Record<K, A>) => Record<K, B>
  export function mapWithIndex<A, B>(f: (k: string, a: A) => B): (fa: Record<string, A>) => Record<string, B> {
    return fa => record.mapWithIndex(fa, f)
  }
  
  // examples
  R.mapWithIndex<'a' | 'b', number, string>((k, o) => \`\${k} \${o}\`)({ a: 2, b: 3 }) // ${JSON.stringify(
    R.mapWithIndex<'a' | 'b', number, string>((k, o) => `${k} ${o}`)({ a: 2, b: 3 })
  )}
  `

  // map
  const mapTx = `
  // Map a record passing the values to the iterating function
  
  export function map<A, B>(f: (a: A) => B): <K extends string>(fa: Record<K, A>) => Record<K, B>
  export function map<A, B>(f: (a: A) => B): (fa: Record<string, A>) => Record<string, B> {
    return mapWithIndex((_, a) => f(a))
  }
  
  // examples
  R.map<number, number>((v) => v + 1)({ a: 2, b: 3 }) // ${JSON.stringify(
    R.map<number, number>(v => v + 1)({ a: 2, b: 3 })
  )}
  `

  // reduceWithIndex
  const reduceWithIndexTx = `
  export function reduceWithIndex<K extends string, A, B>(b: B, f: (k: K, b: B, a: A) => B): (fa: Record<K, A>) => B
  export function reduceWithIndex<A, B>(b: B, f: (k: string, b: B, a: A) => B): (fa: Record<string, A>) => B {
    return fa => record.reduceWithIndex(fa, b, f)
  }
  
  // examples
  R.reduceWithIndex<string, number, number>(1, (k, b, a) => b + a)({ a: 2, b: 3 }) // ${JSON.stringify(
    R.reduceWithIndex<string, number, number>(1, (k, b, a) => b + a)({ a: 2, b: 3 })
  )}
  R.reduceWithIndex<string, string, string>('', (k, b, a) => b + a + k)({ a: 'hello', b: 'world' }) // ${JSON.stringify(
    R.reduceWithIndex<string, string, string>('', (k, b, a) => b + a + k)({ a: 'hello', b: 'world' })
  )}
  `

  // foldMapWithIndex
  const foldMapWithIndexTx = `
  function foldMapWithIndex<M>(
    M: Monoid<M>
  ): <K extends string, A>(f: (k: K, a: A) => M) => (fa: Record<K, A>) => M
  export function foldMapWithIndex<M>(M: Monoid<M>): <A>(f: (k: string, a: A) => M) => (fa: Record<string, A>) => M {
    const foldMapWithIndexM = record.foldMapWithIndex(M)
    return f => fa => foldMapWithIndexM(fa, f)
  }
  
  // examples
  R.foldMapWithIndex(M.monoidSum)<string, number>((k, a) => a)({ a: 2, b: 3 }) // ${JSON.stringify(
    R.foldMapWithIndex(M.monoidSum)<string, number>((k, a) => a)({ a: 2, b: 3 })
  )}
  R.foldMapWithIndex(M.monoidString)<string, string>((k, a) => \`\${k} \${a}\`)({ a: 'hello', b: 'world' }) // ${JSON.stringify(
    R.foldMapWithIndex(M.monoidString)<string, string>((k, a) => `${k} ${a}`)({ a: 'hello', b: 'world' })
  )}
  `

  // reduceRightWithIndex
  const reduceRightWithIndexTx = `
  export function reduceRightWithIndex<K extends string, A, B>(b: B, f: (k: K, a: A, b: B) => B): (fa: Record<K, A>) => B
  export function reduceRightWithIndex<A, B>(b: B, f: (k: string, a: A, b: B) => B): (fa: Record<string, A>) => B {
    return fa => record.reduceRightWithIndex(fa, b, f)
  }
  
  // example
  R.reduceRightWithIndex('', (k, a, b) => b + k + a)({ a: 'hello', b: 'world' }) // ${JSON.stringify(
    R.reduceRightWithIndex('', (k, a, b) => b + k + a)({ a: 'hello', b: 'world' })
  )}
  `

  // singleton
  const singletonTx = `
  // Create a record with one key/value pair
  
  function singleton<K extends string, A>(k: K, a: A): Record<K, A> {
    return { [k]: a } as any
  }
  
  // example
  singleton('one', 1) // ${JSON.stringify(R.singleton('one', 1))}
  `

  // traverseWithIndex
  const traverseWithIndexTx = `
  function traverseWithIndex<F extends URIS3>(
    F: Applicative3<F>
  ): <K extends string, R, E, A, B>(
    f: (k: K, a: A) => Kind3<F, R, E, B>
  ) => (ta: Record<K, A>) => Kind3<F, R, E, Record<K, B>>
  export function traverseWithIndex<F extends URIS3, E>(
    F: Applicative3C<F, E>
  ): <K extends string, R, A, B>(
    f: (k: K, a: A) => Kind3<F, R, E, B>
  ) => (ta: Record<K, A>) => Kind3<F, R, E, Record<K, B>>
  export function traverseWithIndex<F extends URIS2>(
    F: Applicative2<F>
  ): <K extends string, E, A, B>(f: (k: K, a: A) => Kind2<F, E, B>) => (ta: Record<K, A>) => Kind2<F, E, Record<K, B>>
  export function traverseWithIndex<F extends URIS2, E>(
    F: Applicative2C<F, E>
  ): <K extends string, A, B>(f: (k: K, a: A) => Kind2<F, E, B>) => (ta: Record<K, A>) => Kind2<F, E, Record<K, B>>
  export function traverseWithIndex<F extends URIS>(
    F: Applicative1<F>
  ): <K extends string, A, B>(f: (k: K, a: A) => Kind<F, B>) => (ta: Record<K, A>) => Kind<F, Record<K, B>>
  export function traverseWithIndex<F>(
    F: Applicative<F>
  ): <K extends string, A, B>(f: (k: K, a: A) => HKT<F, B>) => (ta: Record<K, A>) => HKT<F, Record<K, B>>
  export function traverseWithIndex<F>(
    F: Applicative<F>
  ): <A, B>(f: (k: string, a: A) => HKT<F, B>) => (ta: Record<string, A>) => HKT<F, Record<string, B>> {
    const traverseWithIndexF = record.traverseWithIndex(F)
    return f => ta => traverseWithIndexF(ta, f)
  }
  
  // example
  R.traverseWithIndex<O.URI>(O.option)((k, a) => (k !== 'a' ? O.some(a) : O.none))({ a: 2, b: 3 }) // ${JSON.stringify(
    R.traverseWithIndex<O.URI>(O.option)((k, a) => (k !== 'a' ? O.some(a) : O.none))({ a: 2, b: 3 })
  )}
  R.traverseWithIndex<O.URI>(O.option)((k, a) => (k !== 'a' ? O.some(a) : O.none))({ c: 2, b: 3 }) // ${JSON.stringify(
    R.traverseWithIndex<O.URI>(O.option)((k, a) => (k !== 'a' ? O.some(a) : O.none))({ c: 2, b: 3 })
  )}
  R.traverseWithIndex<E.URI>(E.either)((k, a) => (k === 'a' ? E.right(a) : E.left(null)))({ a: 2, b: 3 }) // ${JSON.stringify(
    R.traverseWithIndex<E.URI>(E.either)((k, a) => (k === 'a' ? E.right(a) : E.left(null)))({ a: 2, b: 3 })
  )}
  R.traverseWithIndex<E.URI>(E.either)((k, a) => (k === 'a' ? E.right(a) : E.left(null)))({ a: 2 }) // ${JSON.stringify(
    R.traverseWithIndex<E.URI>(E.either)((k, a) => (k === 'a' ? E.right(a) : E.left(null)))({ a: 2 })
  )}
  `

  // traverse
  const traverseTx = `
  export function traverse<F extends URIS3>(
    F: Applicative3<F>
  ): <R, E, A, B>(f: (a: A) => Kind3<F, R, E, B>) => <K extends string>(ta: Record<K, A>) => Kind3<F, R, E, Record<K, B>>
  export function traverse<F extends URIS3, E>(
    F: Applicative3C<F, E>
  ): <R, A, B>(f: (a: A) => Kind3<F, R, E, B>) => <K extends string>(ta: Record<K, A>) => Kind3<F, R, E, Record<K, B>>
  export function traverse<F extends URIS2>(
    F: Applicative2<F>
  ): <E, A, B>(f: (a: A) => Kind2<F, E, B>) => <K extends string>(ta: Record<K, A>) => Kind2<F, E, Record<K, B>>
  export function traverse<F extends URIS2, E>(
    F: Applicative2C<F, E>
  ): <A, B>(f: (a: A) => Kind2<F, E, B>) => <K extends string>(ta: Record<K, A>) => Kind2<F, E, Record<K, B>>
  export function traverse<F extends URIS>(
    F: Applicative1<F>
  ): <A, B>(f: (a: A) => Kind<F, B>) => <K extends string>(ta: Record<K, A>) => Kind<F, Record<K, B>>
  export function traverse<F>(
    F: Applicative<F>
  ): <A, B>(f: (a: A) => HKT<F, B>) => <K extends string>(ta: Record<K, A>) => HKT<F, Record<K, B>>
  export function traverse<F>(
    F: Applicative<F>
  ): <A, B>(f: (a: A) => HKT<F, B>) => (ta: Record<string, A>) => HKT<F, Record<string, B>> {
    const traverseWithIndexF = traverseWithIndex(F)
    return f => traverseWithIndexF((_, a) => f(a))
  }
  
  // examples
  R.traverse<O.URI>(O.option)<number, number>((a) => (a > 2 ? O.some(a) : O.none))({ a: 2, b: 3 }) // ${JSON.stringify(
    R.traverse<O.URI>(O.option)<number, number>(a => (a > 2 ? O.some(a) : O.none))({ a: 2, b: 3 })
  )}
  R.traverse<O.URI>(O.option)<number, number>((a) => (a >= 2 ? O.some(a) : O.none))({ a: 2, b: 3 }) // ${JSON.stringify(
    R.traverse<O.URI>(O.option)<number, number>(a => (a >= 2 ? O.some(a) : O.none))({ a: 2, b: 3 })
  )}
  R.traverse<E.URI>(E.either)<null, number, number>(a => (a > 2 ? E.right(a) : E.left(null)))({ a: 2, b: 3 }) // ${JSON.stringify(
    R.traverse<E.URI>(E.either)<null, number, number>(a => (a > 2 ? E.right(a) : E.left(null)))({ a: 2, b: 3 })
  )}
  R.traverse<E.URI>(E.either)<null, number, number>(a => (a >= 2 ? E.right(a) : E.left(null)))({ a: 2, b: 3 }) // ${JSON.stringify(
    R.traverse<E.URI>(E.either)<null, number, number>(a => (a >= 2 ? E.right(a) : E.left(null)))({ a: 2, b: 3 })
  )}
  `

  // sequence
  const sequenceTx = `
  export function sequence<F extends URIS3>(
    F: Applicative3<F>
  ): <K extends string, R, E, A>(ta: Record<K, Kind3<F, R, E, A>>) => Kind3<F, R, E, Record<K, A>>
  export function sequence<F extends URIS3, E>(
    F: Applicative3C<F, E>
  ): <K extends string, R, A>(ta: Record<K, Kind3<F, R, E, A>>) => Kind3<F, R, E, Record<K, A>>
  export function sequence<F extends URIS2>(
    F: Applicative2<F>
  ): <K extends string, E, A>(ta: Record<K, Kind2<F, E, A>>) => Kind2<F, E, Record<K, A>>
  export function sequence<F extends URIS2, E>(
    F: Applicative2C<F, E>
  ): <K extends string, A>(ta: Record<K, Kind2<F, E, A>>) => Kind2<F, E, Record<K, A>>
  export function sequence<F extends URIS>(
    F: Applicative1<F>
  ): <K extends string, A>(ta: Record<K, Kind<F, A>>) => Kind<F, Record<K, A>>
  export function sequence<F>(F: Applicative<F>): <K extends string, A>(ta: Record<K, HKT<F, A>>) => HKT<F, Record<K, A>>
  export function sequence<F>(F: Applicative<F>): <A>(ta: Record<string, HKT<F, A>>) => HKT<F, Record<string, A>> {
    return traverseWithIndex(F)((_, a) => a)
  }
  
  // examples
  R.sequence(O.option)({ a: O.some(1), b: O.none }) // ${JSON.stringify(
    R.sequence(O.option)({ a: O.some(1), b: O.none })
  )}
  R.sequence(O.option)({ a: O.some(1), b: O.some(3) }) // ${JSON.stringify(
    R.sequence(O.option)({ a: O.some(1), b: O.some(3) })
  )}
  R.sequence(E.either)({ a: E.right(1), b: E.left(null) }) // ${JSON.stringify(
    R.sequence(E.either)({ a: E.right(1), b: E.left(null) })
  )}
  R.sequence(E.either)({ a: E.right(1), b: E.right(3) }) // ${JSON.stringify(
    R.sequence(E.either)({ a: E.right(1), b: E.right(3) })
  )}
  `

  // partitionMapWithIndex
  const partitionMapWithIndexTx = `
  export function partitionMapWithIndex<K extends string, A, B, C>(
    f: (key: K, a: A) => Either<B, C>
  ): (fa: Record<K, A>) => Separated<Record<string, B>, Record<string, C>>
  export function partitionMapWithIndex<A, B, C>(
    f: (key: string, a: A) => Either<B, C>
  ): (fa: Record<string, A>) => Separated<Record<string, B>, Record<string, C>> {
    return fa => record.partitionMapWithIndex(fa, f)
  }
  
  // examples
  R.partitionMapWithIndex((k, a) => k === 'a' ? E.right(a) : E.left(null))({ a: 2, b: 3 }) // ${JSON.stringify(
    R.partitionMapWithIndex((k, a) => (k === 'a' ? E.right(a) : E.left(null)))({ a: 2, b: 3 })
  )}
  R.partitionMapWithIndex((k, a) => k !== 'a' ? E.right(a) : E.left(null))({ c: 2, b: 3 }) // ${JSON.stringify(
    R.partitionMapWithIndex((k, a) => (k !== 'a' ? E.right(a) : E.left(null)))({ c: 2, b: 3 })
  )}
  `

  // partitionWithIndex
  const partitionWithIndexTx = `
  export function partitionWithIndex<K extends string, A, B extends A>(
    refinementWithIndex: RefinementWithIndex<K, A, B>
  ): (fa: Record<K, A>) => Separated<Record<string, A>, Record<string, B>>
  export function partitionWithIndex<K extends string, A>(
    predicateWithIndex: PredicateWithIndex<K, A>
  ): (fa: Record<K, A>) => Separated<Record<string, A>, Record<string, A>>
  export function partitionWithIndex<A>(
    predicateWithIndex: PredicateWithIndex<string, A>
  ): (fa: Record<string, A>) => Separated<Record<string, A>, Record<string, A>> {
    return fa => record.partitionWithIndex(fa, predicateWithIndex)
  }
  
  // example
  R.partitionWithIndex((_, a: number) => a > 1)({ a: 1, b: 2 }) // ${JSON.stringify(
    R.partitionWithIndex((_, a: number) => a > 1)({ a: 1, b: 2 })
  )}
  `

  // filterMapWithIndex
  const filterMapWithIndex = `
  export function filterMapWithIndex<K extends string, A, B>(
    f: (key: K, a: A) => Option<B>
  ): (fa: Record<K, A>) => Record<string, B>
  export function filterMapWithIndex<A, B>(
    f: (key: string, a: A) => Option<B>
  ): (fa: Record<string, A>) => Record<string, B> {
    return fa => record.filterMapWithIndex(fa, f)
  }
  
  // examples
  R.filterMapWithIndex((k, a) => (k === 'a' ? O.some(a) : O.none))({ a: 1, b: 2 }) // ${JSON.stringify(
    R.filterMapWithIndex((k, a) => (k === 'a' ? O.some(a) : O.none))({ a: 1, b: 2 })
  )}
  `

  // filterWithIndex
  const filterWithIndexTx = `
  export function filterWithIndex<K extends string, A, B extends A>(
    refinementWithIndex: RefinementWithIndex<K, A, B>
  ): (fa: Record<K, A>) => Record<string, B>
  export function filterWithIndex<K extends string, A>(
    predicateWithIndex: PredicateWithIndex<K, A>
  ): (fa: Record<K, A>) => Record<string, A>
  export function filterWithIndex<A>(
    predicateWithIndex: PredicateWithIndex<string, A>
  ): (fa: Record<string, A>) => Record<string, A> {
    return fa => record.filterWithIndex(fa, predicateWithIndex)
  }
  
  // example
  // ${R.filterWithIndex((_, a: number) => a > 1)({ a: 1, b: 2 })}
  `

  // fromFoldable
  const F = Se.getFirstSemigroup<number>()

  const fromFoldableTx = `
  function fromFoldable<F extends URIS3, A>(
    M: Magma<A>,
    F: Foldable3<F>
  ): <K extends string, R, E>(fka: Kind3<F, R, E, [K, A]>) => Record<K, A>
  
  // examples
  const F = getFirstSemigroup<number>()
  
  R.fromFoldable(F, A.array)([['a', 1]]) // ${JSON.stringify(R.fromFoldable(F, A.array)([['a', 1]]))}
  R.fromFoldable(F, A.array)([['a', 1], ['a', 2]]) // ${JSON.stringify(
    R.fromFoldable(
      F,
      A.array
    )([
      ['a', 1],
      ['a', 2]
    ])
  )}
  `

  // fromFoldableMap
  const users: Array<User> = [
    { id: 'id1', name: 'name1' },
    { id: 'id2', name: 'name2' },
    { id: 'id1', name: 'name3' }
  ]

  const fromFoldableMapTx = `
  // Create a record from a foldable collection using the specified functions to
  // - map to key/value pairs
  // - combine values for duplicate keys.
  
  export function fromFoldableMap<F extends URIS3, B>(
    M: Magma<B>,
    F: Foldable3<F>
  ): <R, E, A, K extends string>(fa: Kind3<F, R, E, A>, f: (a: A) => [K, B]) => Record<K, B>
  export function fromFoldableMap<F extends URIS2, B>(
    M: Magma<B>,
    F: Foldable2<F>
  ): <E, A, K extends string>(fa: Kind2<F, E, A>, f: (a: A) => [K, B]) => Record<K, B>
  export function fromFoldableMap<F extends URIS, B>(
    M: Magma<B>,
    F: Foldable1<F>
  ): <A, K extends string>(fa: Kind<F, A>, f: (a: A) => [K, B]) => Record<K, B>
  export function fromFoldableMap<F, B>(
    M: Magma<B>,
    F: Foldable<F>
  ): <A, K extends string>(fa: HKT<F, A>, f: (a: A) => [K, B]) => Record<K, B>
  export function fromFoldableMap<F, B>(
    M: Magma<B>,
    F: Foldable<F>
  ): <A>(fa: HKT<F, A>, f: (a: A) => [string, B]) => Record<string, B> {
    return <A>(ta: HKT<F, A>, f: (a: A) => [string, B]) => {
      return F.reduce<A, Record<string, B>>(ta, {}, (r, a) => {
        const [k, b] = f(a)
        r[k] = _hasOwnProperty.call(r, k) ? M.concat(r[k], b) : b
        return r
      })
    }
  }
  
  // examples
  
  // build a record from a field
  interface User {
    id: string
    name: string
  }
  
  const users: Array<User> = [
    { id: 'id1', name: 'name1' },
    { id: 'id2', name: 'name2' },
    { id: 'id1', name: 'name3' }
  ]
  
  R.fromFoldableMap(Se.getLastSemigroup<User>(), A.array)(users, user => [user.id, user]) // ${JSON.stringify(
    R.fromFoldableMap(Se.getLastSemigroup<User>(), A.array)(users, user => [user.id, user])
  )}
  `

  // every
  const everyTx = `
  function every<A>(predicate: Predicate<A>): (r: Record<string, A>) => boolean {
    return r => {
      for (const k in r) {
        if (!predicate(r[k])) {
          return false
        }
      }
      
      return true
    }
  }
  
  // examples
  R.every((v) => v > 3)({ h: 2, j: 5 }) // ${JSON.stringify(R.every<number>(v => v > 3)({ h: 2, j: 5 }))}
  R.every((v) => v > 5)({ h: 2, j: 5 }) // ${JSON.stringify(R.every<number>(v => v > 5)({ h: 2, j: 5 }))}
  `

  // some
  const someTx = `
  function some<A>(predicate: (a: A) => boolean): (r: Record<string, A>) => boolean {
    return r => {
      for (const k in r) {
        if (predicate(r[k])) {
          return true
        }
      }
      return false
    }
  }
  
  // examples
  R.some((v) => v > 3)({ h: 2, j: 5 }) // ${JSON.stringify(R.some<number>(v => v > 3)({ h: 2, j: 5 }))}
  R.some((v) => v > 5)({ h: 2, j: 5 }) // ${JSON.stringify(R.some<number>(v => v > 5)({ h: 2, j: 5 }))}
  `

  const elemTx = `
  function elem<A>(E: Eq<A>): (a: A, fa: Record<string, A>) => boolean {
    return (a, fa) => {
      for (const k in fa) {
        if (E.equals(fa[k], a)) {
          return true
        }
      }
      return false
    }
  }
  
  // examples
  R.elem(Eq) // ${JSON.stringify(R.elem(Eq.eqNumber)(2, { h: 2, j: 5 }))}
  R.elem(Eq) // ${JSON.stringify(R.elem(Eq.eqNumber)(3, { h: 2, j: 5 }))}
  `

  // record
  const recordTx = `
  export const record: FunctorWithIndex1<URI, string> &
    Foldable1<URI> &
    TraversableWithIndex1<URI, string> &
    Compactable1<URI> &
    FilterableWithIndex1<URI, string> &
    Witherable1<URI> &
    FoldableWithIndex1<URI, string> = {
    URI,
    map: (fa, f) => record.mapWithIndex(fa, (_, a) => f(a)),
    reduce: (fa, b, f) => record.reduceWithIndex(fa, b, (_, b, a) => f(b, a)),
    foldMap: M => {
      const foldMapWithIndexM = record.foldMapWithIndex(M)
      return (fa, f) => foldMapWithIndexM(fa, (_, a) => f(a))
    },
    reduceRight: (fa, b, f) => record.reduceRightWithIndex(fa, b, (_, a, b) => f(a, b)),
    traverse: <F>(
      F: Applicative<F>
    ): (<A, B>(ta: Record<string, A>, f: (a: A) => HKT<F, B>) => HKT<F, Record<string, B>>) => {
      const traverseWithIndexF = record.traverseWithIndex(F)
      return (ta, f) => traverseWithIndexF(ta, (_, a) => f(a))
    },
    sequence,
    compact: <A>(fa: Record<string, Option<A>>): Record<string, A> => {
      const r: Record<string, A> = {}
      const keys = Object.keys(fa)
      for (const key of keys) {
        const optionA = fa[key]
        if (isSome(optionA)) {
          r[key] = optionA.value
        }
      }
      return r
    },
    separate: <A, B>(fa: Record<string, Either<A, B>>): Separated<Record<string, A>, Record<string, B>> => {
      const left: Record<string, A> = {}
      const right: Record<string, B> = {}
      const keys = Object.keys(fa)
      for (const key of keys) {
        const e = fa[key]
        switch (e._tag) {
          case 'Left':
            left[key] = e.left
            break
          case 'Right':
            right[key] = e.right
            break
        }
      }
      return {
        left,
        right
      }
    },
    filter: <A>(fa: Record<string, A>, predicate: Predicate<A>): Record<string, A> => {
      return record.filterWithIndex(fa, (_, a) => predicate(a))
    },
    filterMap: (fa, f) => record.filterMapWithIndex(fa, (_, a) => f(a)),
    partition: <A>(fa: Record<string, A>, predicate: Predicate<A>): Separated<Record<string, A>, Record<string, A>> => {
      return record.partitionWithIndex(fa, (_, a) => predicate(a))
    },
    partitionMap: (fa, f) => record.partitionMapWithIndex(fa, (_, a) => f(a)),
    wither: <F>(
      F: Applicative<F>
    ): (<A, B>(wa: Record<string, A>, f: (a: A) => HKT<F, Option<B>>) => HKT<F, Record<string, B>>) => {
      const traverseF = record.traverse(F)
      return (wa, f) => F.map(traverseF(wa, f), record.compact)
    },
    wilt: <F>(
      F: Applicative<F>
    ): (<A, B, C>(
      wa: Record<string, A>,
      f: (a: A) => HKT<F, Either<B, C>>
    ) => HKT<F, Separated<Record<string, B>, Record<string, C>>>) => {
      const traverseF = record.traverse(F)
      return (wa, f) => F.map(traverseF(wa, f), record.separate)
    },
    mapWithIndex: <A, B>(fa: Record<string, A>, f: (k: string, a: A) => B) => {
      const out: Record<string, B> = {}
      const keys = Object.keys(fa)
      for (const key of keys) {
        out[key] = f(key, fa[key])
      }
      return out
    },
    reduceWithIndex: (fa, b, f) => {
      let out = b
      const keys = Object.keys(fa).sort()
      const len = keys.length
      for (let i = 0; i < len; i++) {
        const k = keys[i]
        out = f(k, out, fa[k])
      }
      return out
    },
    foldMapWithIndex: M => (fa, f) => {
      let out = M.empty
      const keys = Object.keys(fa).sort()
      const len = keys.length
      for (let i = 0; i < len; i++) {
        const k = keys[i]
        out = M.concat(out, f(k, fa[k]))
      }
      return out
    },
    reduceRightWithIndex: (fa, b, f) => {
      let out = b
      const keys = Object.keys(fa).sort()
      const len = keys.length
      for (let i = len - 1; i >= 0; i--) {
        const k = keys[i]
        out = f(k, fa[k], out)
      }
      return out
    },
    traverseWithIndex: <F>(F: Applicative<F>) => <A, B>(ta: Record<string, A>, f: (k: string, a: A) => HKT<F, B>) => {
      const keys = Object.keys(ta)
      if (keys.length === 0) {
        return F.of(empty)
      }
      let fr: HKT<F, Record<string, B>> = F.of({})
      for (const key of keys) {
        fr = F.ap(
          F.map(fr, r => (b: B) => {
            r[key] = b
            return r
          }),
          f(key, ta[key])
        )
      }
      return fr
    },
    partitionMapWithIndex: <A, B, C>(fa: Record<string, A>, f: (key: string, a: A) => Either<B, C>) => {
      const left: Record<string, B> = {}
      const right: Record<string, C> = {}
      const keys = Object.keys(fa)
      for (const key of keys) {
        const e = f(key, fa[key])
        switch (e._tag) {
          case 'Left':
            left[key] = e.left
            break
          case 'Right':
            right[key] = e.right
            break
        }
      }
      return {
        left,
        right
      }
    },
    partitionWithIndex: <A>(fa: Record<string, A>, predicateWithIndex: PredicateWithIndex<string, A>) => {
      const left: Record<string, A> = {}
      const right: Record<string, A> = {}
      const keys = Object.keys(fa)
      for (const key of keys) {
        const a = fa[key]
        if (predicateWithIndex(key, a)) {
          right[key] = a
        } else {
          left[key] = a
        }
      }
      return {
        left,
        right
      }
    },
    filterMapWithIndex: <A, B>(fa: Record<string, A>, f: (key: string, a: A) => Option<B>) => {
      const r: Record<string, B> = {}
      const keys = Object.keys(fa)
      for (const key of keys) {
        const optionB = f(key, fa[key])
        if (isSome(optionB)) {
          r[key] = optionB.value
        }
      }
      return r
    },
    filterWithIndex: <A>(fa: Record<string, A>, predicateWithIndex: PredicateWithIndex<string, A>) => {
      const out: Record<string, A> = {}
      let changed = false
      for (const key in fa) {
        if (_hasOwnProperty.call(fa, key)) {
          const a = fa[key]
          if (predicateWithIndex(key, a)) {
            out[key] = a
          } else {
            changed = true
          }
        }
      }
      return changed ? out : fa
    }
  }
  `

  return (
    <ModuleContainer id='record'>
      <Title>FP-TS (Reader)</Title>
      <CodeBlock label='common types' codeTx={commonTypesTx} />
      <CodeBlock label='main constants' codeTx={mainConstantsTx} />
      <CodeBlock label='getShow' codeTx={getShowTx} />
      <CodeBlock label='size' codeTx={sizeTx} />
      <CodeBlock label='isEmpty' codeTx={isEmptyTx} />
      <CodeBlock label='collect' codeTx={collectTx} />
      <CodeBlock label='toArray' codeTx={toArrayTx} />
      <CodeBlock label='toUnfoldable' codeTx={toUnfoldableTx} />
      <CodeBlock label='insertAt' codeTx={insertAtTx} />
      <CodeBlock label='deleteAt' codeTx={deleteAtTx} />
      <CodeBlock label='updateAt' codeTx={updateAtTx} />
      <CodeBlock label='modifyAt' codeTx={modifyAtTx} />
      <CodeBlock label='pop' codeTx={popTx} />
      <CodeBlock label='isSubrecord' codeTx={isSubrecordTx} />
      <CodeBlock label='getEq' codeTx={getEqTx} />
      <CodeBlock label='getMonoid' codeTx={getMonoidTx} />
      <CodeBlock label='lookup' codeTx={lookupTx} />
      <CodeBlock label='mapWithIndex' codeTx={mapWithIndexTx} />
      <CodeBlock label='map' codeTx={mapTx} />
      <CodeBlock label='reduceWithIndex' codeTx={reduceWithIndexTx} />
      <CodeBlock label='foldMapWithIndex' codeTx={foldMapWithIndexTx} />
      <CodeBlock label='reduceRightWithIndex' codeTx={reduceRightWithIndexTx} />
      <CodeBlock label='singleton' codeTx={singletonTx} />
      <CodeBlock label='traverseWithIndex' codeTx={traverseWithIndexTx} />
      <CodeBlock label='traverse' codeTx={traverseTx} />
      <CodeBlock label='sequence' codeTx={sequenceTx} />
      <CodeBlock label='partitionMapWithIndex' codeTx={partitionMapWithIndexTx} />
      <CodeBlock label='partitionWithIndex' codeTx={partitionWithIndexTx} />
      <CodeBlock label='filterMapWithIndex' codeTx={filterMapWithIndex} />
      <CodeBlock label='filterWithIndex' codeTx={filterWithIndexTx} />
      <CodeBlock label='fromFoldable' codeTx={fromFoldableTx} />
      <CodeBlock label='fromFoldableMap' codeTx={fromFoldableMapTx} />
      <CodeBlock label='everyTx' codeTx={everyTx} />
      <CodeBlock label='someTx' codeTx={someTx} />
      <CodeBlock label='elemTx' codeTx={elemTx} />
      <CodeBlock label='recordTx' codeTx={recordTx} />
    </ModuleContainer>
  )
}

export { RecordContainer }
