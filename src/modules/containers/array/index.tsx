import * as React from 'react'
// view components
import { ModuleContainer, Title } from '@md-views'
import { CodeBlock } from '@md-components/code-block'
// libs
import * as S from 'fp-ts/lib/Show'
import * as A from 'fp-ts/lib/Array'
import * as Eq from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Ord'
import * as Op from 'fp-ts/lib/Option'
import * as Ei from 'fp-ts/lib/Either'
import * as F from 'fp-ts/lib/function'
import * as I from 'fp-ts/lib/Identity'
import * as M from 'fp-ts/lib/Monoid'

const ArrayContainer = () => {
  // common types
  const commonTypesTX = `
  type URI = typeof URI
  const URI: "Array" = ...
  
  interface Show<A> {
   show: (a: A) => string
  }
  `

  // getShow
  const G = A.getShow<string>(S.showString)

  const getShowTx = `
  import { showString } from 'fp-ts/lib/Show'
  
  function getShow<A>(S: Show<A>): Show<Array<A>> {
  return {
    show: as => \`[\${as.map(S.show).join(', ')}]\`
   }
  }
  
  getShow<string>(showString)(['hello', 'world']) // '${G.show(['hello', 'world'])}' -> <string>
  getShow<string>(showString)(['1', '2']) // '${G.show(['1', '2'])}' -> <string>
  getShow<string>(showString)([]) // '${G.show([])}' -> <string>
  `

  // getMonoid
  const getMonoidEx = A.getMonoid<number>()

  const getMonoidTx = `
  const concat = <A>(x: Array<A>, y: Array<A>): Array<A> => {
    const lenx = x.length
    
    if (lenx === 0) {
      return y
    }
    
    const leny = y.length
    
    if (leny === 0) {
      return x
    }
    
    const r = Array(lenx + leny)
    
    for (let i = 0; i < lenx; i++) {
      r[i] = x[i]
    }
    
    for (let i = 0; i < leny; i++) {
      r[i + lenx] = y[i]
    }
    
    return r
  }
  
  const empty: Array<never> = []

  function getMonoid<A = never>(): Monoid<Array<A>> {
    return {
      concat,
      empty
    }
  }
  
  const M = getMonoid<number>()
  
  M.concat([1, 2], [3, 4]) // [${getMonoidEx.concat([1, 2], [3, 4])}] -> <array>
  M.concat([1, 2], M.empty) // [${getMonoidEx.concat([1, 2], getMonoidEx.empty)}] -> <array>
  `

  // getEq
  const getEqEx = A.getEq(Eq.eqString)
  const getEqOEx = A.getEq(O.ordString)
  const getEqTx = `
  // Derives an \`Eq\` over the \`Array\` of a given element type from the \`Eq\` of that type. The derived \`Eq\` defines two
  // arrays as equal if all elements of both arrays are compared equal pairwise with the given \`E\`. In case of arrays of
  // different lengths, the result is non equality.
  
  import { eqString } from 'fp-ts/lib/Eq'
  import { ordString } from 'fp-ts/lib/Ord'
  
  function getEq<A>(E: Eq<A>): Eq<Array<A>> {
    return {
      equals: (xs, ys) => xs === ys || (xs.length === ys.length && xs.every((x, i) => E.equals(x, ys[i])))
    }
  }
  
  const E = getEq(eqString)
  const O = getEq(ordString)
  
  E.equals(['a', 'b'], ['a', 'b']) // ${getEqEx.equals(['a', 'b'], ['a', 'b'])} -> boolean
  E.equals(['a'], []) // ${getEqOEx.equals(['a'], [])} -> boolean
  O.equals(['a'], ['a']) // ${getEqOEx.equals(['a'], ['a'])} -> boolean
  O.equals(['a', 'b'], ['b', 'a']) // ${getEqOEx.equals(['a', 'b'], ['b', 'a'])} -> boolean
  `

  // getOrd
  const getOrdEx = A.getOrd(O.ordString)

  const getOrdTx = `
  import { ordString } from 'fp-ts/lib/Ord'

  function getOrd<A>(O: Ord<A>): Ord<Array<A>> {
    return fromCompare((a, b) => {
      const aLen = a.length
      const bLen = b.length
      const len = Math.min(aLen, bLen)
      for (let i = 0; i < len; i++) {
        const ordering = O.compare(a[i], b[i])
        if (ordering !== 0) {
          return ordering
        }
      }
      return ordNumber.compare(aLen, bLen)
    })
  }
  
  const O = getOrd(ordString)
  
  O.compare([], []) // ${getOrdEx.compare([], [])} -> number
  O.compare(['a'], ['a']) // ${getOrdEx.compare(['a'], ['a'])} -> number
  O.compare(['b'], ['a']) // ${getOrdEx.compare(['b'], ['a'])} -> number
  O.compare(['a'], ['b']) // ${getOrdEx.compare(['a'], ['b'])} -> number
  `

  // makeBy
  const makeByTx = `
  // Return a list of length \`n\` with element \`i\` initialized with \`f(i)\`
  
  function makeBy<A>(n: number, f: (i: number) => A): Array<A> {
    const r: Array<A> = []
    for (let i = 0; i < n; i++) {
      r.push(f(i))
    }
    return r
  }
  
  const double = (n: number): number => n * 2
  
  makeBy(5, double) // ${A.makeBy(5, (n: number): number => n * 2)} -> <array>
  `

  // range
  const rangeTx = `
  // Create an array containing a range of integers, including both endpoints
    
  function range(start: number, end: number): Array<number> {
    return makeBy(end - start + 1, i => start + i)
  }
  
  range(1, 5) // ${JSON.stringify(A.range(1, 5))} -> <array>
  `

  // replicate
  const replicateTx = `
  // Create an array containing a value repeated the specified number of times
  
  replicate<A>(n: number, a: A): Array<A> {
    return makeBy(n, () => a)
  }
  
  replicate(3, 'a') // ${JSON.stringify(A.replicate(3, 'a'))} -> <string>
  `

  // flatten
  const flattenTx = `
  // Removes one level of nesting
  
  function flatten<A>(mma: Array<Array<A>>): Array<A> {
    let rLen = 0
    const len = mma.length
    
    for (let i = 0; i < len; i++) {
      rLen += mma[i].length
    }
    
    const r = Array(rLen)
    let start = 0
    
    for (let i = 0; i < len; i++) {
      const arr = mma[i]
      const l = arr.length
      
      for (let j = 0; j < l; j++) {
        r[j + start] = arr[j]
      }
      
      start += l
    }
    
    return r
  }
  
  flatten([[1], [2], [3]]) // ${JSON.stringify(A.flatten([[1], [2], [3]]))} -> <array>
  `

  // foldLeft
  const foldLeftLenEx = A.foldLeft<number, number>(
    () => 0,
    (_, tail) => 1 + foldLeftLenEx(tail)
  )

  const foldLeftReduceEx = A.foldLeft<number, number>(
    () => 0,
    (_, tail) =>
      tail.reduce((i, c) => {
        return i + c
      }, 0)
  )

  const foldLeftTx = `
  // Break an array into its first element and remaining elements
  
  foldLeft<A, B>(onNil: () => B, onCons: (head: A, tail: Array<A>) => B): (as: Array<A>) => B {
    return as => (isEmpty(as) ? onNil() : onCons(as[0], as.slice(1)))
  }
  
  const len = foldLeft<number, number>(
    () => 0,
    (_, tail) => 1 + len(tail)
  )
  
  const reduce = foldLeft<number, number>(
    () => 0,
    (_, tail) =>
      tail.reduce((i, c) => {
        return i + c
      }, 0)
  )
  
  reduce([1, 2, 3]) // ${foldLeftReduceEx([1, 2, 3])} (2 + 3) -> <number>
  reduce([]) // ${foldLeftReduceEx([])} -> <number>
  len([1, 2, 3]) // ${foldLeftLenEx([1, 2, 3])} -> <number>
  `

  // foldRight
  const foldRightLenEx = A.foldRight<number, number>(
    () => 0,
    nums => 1 + foldRightLenEx(nums)
  )

  const foldRightReduceEx = A.foldRight<number, number>(
    () => 0,
    nums =>
      nums.reduce((i, c) => {
        return i + c
      }, 0)
  )

  const foldRightTx = `
  // Break an array into its initial elements and the last element
  
  function foldRight<A, B>(onNil: () => B, onCons: (init: Array<A>, last: A) => B): (as: Array<A>) => B {
    return as => (isEmpty(as) ? onNil() : onCons(as.slice(0, as.length - 1), as[as.length - 1]))
  }
  
  const len = A.foldRight<number, number>(
    () => 0,
    nums => 1 + foldRightLenEx(nums)
  )

  const reduce = A.foldRight<number, number>(
    () => 0,
    nums =>
      nums.reduce((i, c) => {
        return i + c
      }, 0)
  )
  
  reduce([1, 2, 3]) // ${foldRightReduceEx([1, 2, 3])} (1 + 2) -> <number>
  reduce([]) // ${foldRightReduceEx([])} -> <number>
  len([1, 2, 3]) // ${foldRightLenEx([1, 2, 3])} -> <number>
  `

  // scanLeft
  const scanLeftTx = `
  // Same as \`reduce\` but it carries over the intermediate steps
  
  function scanLeft<A, B>(b: B, f: (b: B, a: A) => B): (as: Array<A>) => Array<B> {
    return as => {
      const l = as.length
      const r: Array<B> = new Array(l + 1)
      r[0] = b
      for (let i = 0; i < l; i++) {
        r[i + 1] = f(r[i], as[i])
      }
      return r
    }
  }
  
  scanLeft<number, number>(10, (b, a: number) => b - a)([1, 2, 3]) // ${JSON.stringify(
    A.scanLeft<number, number>(10, (b, a: number) => b - a)([1, 2, 3])
  )} -> ([10, 10 - 1, 10 - 1 - 2, 10 - 1 - 2 - 3])
  `

  // scanRight
  const scanRightTx = `
   // Fold an array from the right, keeping all intermediate results instead of only the final result
   
  function scanRight<A, B>(b: B, f: (a: A, b: B) => B): (as: Array<A>) => Array<B> {
    return as => {
      const l = as.length
      const r: Array<B> = new Array(l + 1)
      r[l] = b
      for (let i = l - 1; i >= 0; i--) {
        r[i] = f(as[i], r[i + 1])
      }
      return r
    }
  }
  
  scanLeft<number, number>(10, (b, a: number) => b - a)([1, 2, 3]) // ${JSON.stringify(
    A.scanRight<number, number>(10, (b, a) => b - a)([1, 2, 3])
  )} -> ([1 - 9, 2 - (-7), 3 - 10, 10])
  `

  // isEmpty
  const isEmptyTx = `
  // Test whether an array is empty
  
  function isEmpty<A>(as: Array<A>): boolean {
    return as.length === 0
  }
  
  isEmpty([]) // ${A.isEmpty([])} -> <boolean>
  isEmpty([1, 2]) // ${A.isEmpty([1, 2])} -> <boolean>
  `

  // isNonEmpty
  const isNotEmptyTx = `
  // Test whether an array is non empty narrowing down the type to \`NonEmptyArray<A>\`
  
  function isNonEmpty<A>(as: Array<A>): as is NonEmptyArray<A> {
    return as.length > 0
  }

  isNonEmpty([]) // ${A.isNonEmpty([])} -> <boolean>
  isNonEmpty([1, 2]) // ${A.isNonEmpty([1, 2])} -> <boolean>
  `

  // isOutOfBound
  const isOutOfBoundTx = `
  // Test whether an array contains a particular index
  
  function isOutOfBound<A>(i: number, as: Array<A>): boolean {
    return i < 0 || i >= as.length
  }
  
  isOutOfBound(1, [1, 2, 3]) // ${A.isOutOfBound(1, [1, 2, 3])} -> <boolean>
  isOutOfBound(4, [1, 2, 3]) // ${A.isOutOfBound(4, [1, 2, 3])} -> <boolean>
  `

  // lookup
  const lookupTx = `
  // This function provides a safe way to read a value at a particular index from an array
  
  function lookup<A>(i: number, as: Array<A>): Option<A> {
    return isOutOfBound(i, as) ? none : some(as[i])
  }
  
  lookup(1, [1, 2, 3]) // ${JSON.stringify(A.lookup(1, [1, 2, 3]))}
  lookup(3, [1, 2, 3]) // ${JSON.stringify(A.lookup(3, [1, 2, 3]))}
  `

  // cons
  const consTx = `
  // Attaches an element to the front of an array, creating a new non empty array
  
  function cons<A>(head: A, tail: Array<A>): NonEmptyArray<A> {
    const len = tail.length
    const r = Array(len + 1)
    for (let i = 0; i < len; i++) {
      r[i + 1] = tail[i]
    }
    r[0] = head
    return r as NonEmptyArray<A>
  }
  
  cons(3, [1, 2, 3]) // ${JSON.stringify(A.cons(3, [1, 2, 3]))} -> <array>
  `

  // snoc
  const snocTx = `
  // Append an element to the end of an array, creating a new non empty array
  
  function snoc<A>(init: Array<A>, end: A): NonEmptyArray<A> {
    const len = init.length
    const r = Array(len + 1)
    for (let i = 0; i < len; i++) {
      r[i] = init[i]
    }
    r[len] = end
    return r as NonEmptyArray<A>
  }
  
  snoc([1, 2, 3], 4) // ${JSON.stringify(A.snoc([1, 2, 3], 4))} -> <array>
  `

  // head
  const headTx = `
  // Get the first element in an array, or \`None\` if the array is empty
  
  function head<A>(as: Array<A>): Option<A> {
    return isEmpty(as) ? none : some(as[0])
  }
  
  head([1, 2, 3]) // ${JSON.stringify(A.head([1, 2, 3]))}
  head([]) // ${JSON.stringify(A.head([]))}
  `

  // last
  const lastTx = `
  // Get the last element in an array, or \`None\` if the array is empty
  
  function last<A>(as: Array<A>): Option<A> {
    return lookup(as.length - 1, as)
  }
  
  last([1, 2, 3]) // ${JSON.stringify(A.last([1, 2, 3]))}
  last([]) // ${JSON.stringify(A.last([]))}
  `

  // tail
  const tailTx = `
  // Get all but the first element of an array, creating a new array, or \`None\` if the array is empty
  
  tail<A>(as: Array<A>): Option<Array<A>> {
    return isEmpty(as) ? none : some(as.slice(1))
  }
  
  tail([1, 2, 3]) // ${JSON.stringify(A.tail([1, 2, 3]))}
  tail([]) // ${JSON.stringify(A.tail([]))}
  `

  const initTx = `
  // Get all but the last element of an array, creating a new array, or \`None\` if the array is empty
  
  function init<A>(as: Array<A>): Option<Array<A>> {
    const len = as.length
    return len === 0 ? none : some(as.slice(0, len - 1))
  }
  
  init([1, 2, 3]) // ${JSON.stringify(A.init([1, 2, 3]))}
  init([]) // ${JSON.stringify(A.init([]))}
  `

  // takeLeft
  const takeLeftTx = `
  // Keep only a number of elements from the start of an array, creating a new array.
  
  function takeLeft(n: number): <A>(as: Array<A>) => Array<A> {
    return as => as.slice(0, n)
  }
  
  takeLeft(2)([1, 2, 3]) // ${JSON.stringify(A.takeLeft(2)([1, 2, 3]))}
  takeLeft(3)([1, 2, 3]) // ${JSON.stringify(A.takeLeft(3)([1, 2, 3]))}
  `

  // takeRight
  const takeRightTx = `
  // Keep only a number of elements from the end of an array, creating a new array.
  
  takeRight(n: number): <A>(as: Array<A>) => Array<A> {
    return as => (n === 0 ? empty : as.slice(-n))
  }
  
  takeRight(2)([1, 2, 3, 4, 5]) // ${JSON.stringify(A.takeRight(2)([1, 2, 3, 4, 5]))}
  takeRight(4)([1, 2, 3, 4, 5]) // ${JSON.stringify(A.takeRight(4)([1, 2, 3, 4, 5]))}
  `

  // takeLeftWhile
  const takeLeftWhileTx = `
  // Calculate the longest initial subarray for which all element satisfy the specified predicate, creating a new array
  
  function takeLeftWhile<A, B extends A>(refinement: Refinement<A, B>): (as: Array<A>) => Array<B>
  function takeLeftWhile<A>(predicate: Predicate<A>): (as: Array<A>) => Array<A>
  function takeLeftWhile<A>(predicate: Predicate<A>): (as: Array<A>) => Array<A> {
    return as => {
      const i = spanIndexUncurry(as, predicate)
      const init = Array(i)
      for (let j = 0; j < i; j++) {
        init[j] = as[j]
      }
      return init
    }
  }
  
  takeLeftWhile((n: number) => n % 2 === 0)([2, 4, 3, 6]) // ${JSON.stringify(
    A.takeLeftWhile((n: number) => n % 2 === 0)([2, 4, 3, 6])
  )}
  `

  // spanLeft
  const spanLeftTx = `
  // Split an array into two parts:
  // 1. the longest initial subarray for which all elements satisfy the specified predicate
  // 2. the remaining elements
 
  function spanLeft<A, B extends A>(
    refinement: Refinement<A, B>
  ): (as: Array<A>) => { init: Array<B>; rest: Array<A> }
  function spanLeft<A>(predicate: Predicate<A>): (as: Array<A>) => { init: Array<A>; rest: Array<A> }
  function spanLeft<A>(predicate: Predicate<A>): (as: Array<A>) => { init: Array<A>; rest: Array<A> } {
    return as => {
      const i = spanIndexUncurry(as, predicate)
      const init = Array(i)
      for (let j = 0; j < i; j++) {
        init[j] = as[j]
      }
      const l = as.length
      const rest = Array(l - i)
      for (let j = i; j < l; j++) {
        rest[j - i] = as[j]
      }
      return { init, rest }
    }
  }
  
  spanLeft((n: number) => n % 2 === 1)([1, 3, 2, 4, 5]) // ${JSON.stringify(
    A.spanLeft((n: number) => n % 2 === 1)([1, 3, 2, 4, 5])
  )}
  `

  // dropLeft
  const dropLeftTx = `
  // Drop a number of elements from the start of an array, creating a new array
  
  dropLeft(n: number): <A>(as: Array<A>) => Array<A> {
    return as => as.slice(n, as.length)
  }
  
  dropLeft(2)([1, 2, 3]) // ${JSON.stringify(A.dropLeft(2)([1, 2, 3]))}
  dropLeft(1)([1, 2, 3]) // ${JSON.stringify(A.dropLeft(1)([1, 2, 3]))}
  `

  // dropRight
  const dropRightTx = `
  // Drop a number of elements from the end of an array, creating a new array
  
  function dropRight(n: number): <A>(as: Array<A>) => Array<A> {
    return as => as.slice(0, as.length - n)
  }
  
  dropRight(2)([1, 2, 3, 4, 5]) // ${JSON.stringify(A.dropRight(2)([1, 2, 3]))}
  dropRight(1)([1, 2, 3, 4, 5]) // ${JSON.stringify(A.dropRight(1)([1, 2, 3]))}
  `

  // dropLeftWhile
  const dropLeftWhileTx = `
  // Remove the longest initial subarray for which all element satisfy the specified predicate, creating a new array
  
  function dropLeftWhile<A>(predicate: Predicate<A>): (as: Array<A>) => Array<A> {
    return as => {
      const i = spanIndexUncurry(as, predicate)
      const l = as.length
      const rest = Array(l - i)
      for (let j = i; j < l; j++) {
        rest[j - i] = as[j]
      }
      return rest
    }
  }
  
  dropLeftWhile((n: number) => n % 2 === 1)([1, 3, 2, 4, 5]) // ${JSON.stringify(
    A.dropLeftWhile((n: number) => n % 2 === 1)([1, 3, 2, 4, 5])
  )}
  `

  // findIndex
  const findIndexTx = `
  // Find the first index for which a predicate holds
  function findIndex<A>(predicate: Predicate<A>): (as: Array<A>) => Option<number> {
    return as => {
      const len = as.length
      for (let i = 0; i < len; i++) {
        if (predicate(as[i])) {
          return some(i)
        }
      }
      return none
    }
  }
  
  findIndex((n: number) => n === 2)([1, 2, 3]) // ${JSON.stringify(A.findIndex((n: number) => n === 2)([1, 2, 3]))}
  findIndex((n: number) => n === 2)([]) // ${JSON.stringify(A.findIndex((n: number) => n === 2)([]))}
  `

  // findFirst
  const findFirstTX = `
  // Find the first element which satisfies a predicate (or a refinement) function
  
  function findFirst<A, B extends A>(refinement: Refinement<A, B>): (as: Array<A>) => Option<B>
  function findFirst<A>(predicate: Predicate<A>): (as: Array<A>) => Option<A>
  function findFirst<A>(predicate: Predicate<A>): 0(as: Array<A>) => Option<A> {
    return as => {
      const len = as.length
      for (let i = 0; i < len; i++) {
        if (predicate(as[i])) {
          return some(as[i])
        }
      }
      return none
    }
  }

  findFirst((x: { a: number, b: number }) => x.a === 1)([{ a: 1, b: 1 }, { a: 1, b: 2 }]) // ${JSON.stringify(
    A.findFirst((x: { a: number; b: number }) => x.a === 1)([
      { a: 1, b: 1 },
      { a: 1, b: 2 }
    ])
  )}
  `

  // findFirstMap
  const findFirstMapTx = `
  findFirstMap<A, B>(f: (a: A) => Option<B>): (as: Array<A>) => Option<B> {
    return as => {
      const len = as.length
      for (let i = 0; i < len; i++) {
        const v = f(as[i])
        if (isSome(v)) {
          return v
        }
      }
      return none
    }
  }
  
  interface Person {
    name: string
    age?: number
  }
  
  const persons: Array<Person> = [{ name: 'John' }, { name: 'Mary', age: 45 }, { name: 'Joey', age: 28 }]
  
  findFirstMap((p: Person) => (p.age === undefined ? none : some(p.name)))(persons) // ${Op.some('Mary')}
  `

  // findLast
  const findLastTx = `
  // Find the last element which satisfies a predicate function
  
  function findLast<A, B extends A>(refinement: Refinement<A, B>): (as: Array<A>) => Option<B>
  function findLast<A>(predicate: Predicate<A>): (as: Array<A>) => Option<A>
  function findLast<A>(predicate: Predicate<A>): (as: Array<A>) => Option<A> {
    return as => {
      const len = as.length
      for (let i = len - 1; i >= 0; i--) {
        if (predicate(as[i])) {
          return some(as[i])
        }
      }
      return none
    }
  }
  
  findLast((x: { a: number, b: number }) => x.a === 1)([{ a: 1, b: 1 }, { a: 1, b: 2 }]) // ${JSON.stringify(
    A.findLast((x: { a: number; b: number }) => x.a === 1)([
      { a: 1, b: 1 },
      { a: 1, b: 2 }
    ])
  )}
  `

  // findLastMap
  const findLastMapTx = `
  // Find the last element returned by an option based selector function
  
  function findLastMap<A, B>(f: (a: A) => Option<B>): (as: Array<A>) => Option<B> {
    return as => {
      const len = as.length
      for (let i = len - 1; i >= 0; i--) {
        const v = f(as[i])
        if (isSome(v)) {
          return v
        }
      }
      return none
    }
  }
  
  interface Person {
    name: string
    age?: number
  }
  
  const persons: Array<Person> = [{ name: 'John' }, { name: 'Mary', age: 45 }, { name: 'Joey', age: 28 }]
  
  findLastMap((p: Person) => (p.age === undefined ? none : some(p.name)))(persons) // ${JSON.stringify(Op.some('Joey'))}
  `

  // findLastIndex
  const findLastIndexTx = `
  // Returns the index of the last element of the list which matches the predicate
  
  function findLastIndex<A>(predicate: Predicate<A>): (as: Array<A>) => Option<number> {
    return as => {
      const len = as.length
      for (let i = len - 1; i >= 0; i--) {
        if (predicate(as[i])) {
          return some(i)
        }
      }
      return none
    }
  }
  
  interface X {
    a: number
    b: number
  }
  
  const xs: Array<X> = [{ a: 1, b: 0 }, { a: 1, b: 1 }]
  
  findLastIndex((x: { a: number }) => x.a === 1)(xs) // ${JSON.stringify(Op.some(1))}
  findLastIndex((x: { a: number }) => x.a === 4)(xs) // ${JSON.stringify(Op.none)}
  `

  // copy
  const copyTx = `
  // Returns a copy of the array
  
  function copy<A>(as: Array<A>): Array<A> {
    const l = as.length
    const r = Array(l)
    
    for (let i = 0; i < l; i++) {
      r[i] = as[i]
    }
    
    return r
  }
  
  copy<number>([1, 2, 3]) // ${JSON.stringify(
    A.copy<number>([1, 2, 3])
  )}
  `

  // unsafeInsertAt
  const unsafeInsertAtTx = `
  // Insert an element at the specified index, creating a copy
  
  function unsafeInsertAt<A>(i: number, a: A, as: Array<A>): Array<A> {
    const xs = copy(as)
    
    xs.splice(i, 0, a)
    
    return xs
  }
  
  unsafeInsertAt<number>(1, 5, [1, 2, 3]) // ${JSON.stringify(A.unsafeInsertAt(1, 5, [1, 2, 3]))}
  `

  // insertAt
  const insertAtTx = `
  // Insert an element at the specified index, creating a new array, or returning \`None\` if the index is out of bounds
  
  insertAt<A>(i: number, a: A): (as: Array<A>) => Option<Array<A>> {
    return as => (i < 0 || i > as.length ? none : some(unsafeInsertAt(i, a, as)))
  }
  
  insertAt<number>(2, 5)([1, 2, 3, 4]) // ${JSON.stringify(A.insertAt<number>(2, 5)([1, 2, 3, 4]))}
  `

  // unsafeUpdateAt
  const unsafeUpdateAtTx = `
  // Change the element at the specified index, creating a copy
  
  function unsafeUpdateAt<A>(i: number, a: A, as: Array<A>): Array<A> {
    if (as[i] === a) {
      return as
    } else {
      const xs = copy(as)
      xs[i] = a
      return xs
    }
  }
  
  unsafeUpdateAt<number>(1, 3, [1, 2, 3]) // ${JSON.stringify(
    A.unsafeUpdateAt<number>(1, 3, [1, 2, 3])
  )}
  `

  // updateAt
  const updateAtTx = `
  // Change the element at the specified index, creating a new array, or returning \`None\` if the index is out of bounds
  
  function updateAt<A>(i: number, a: A): (as: Array<A>) => Option<Array<A>> {
    return as => (isOutOfBound(i, as) ? none : some(unsafeUpdateAt(i, a, as)))
  }
  
  updateAt(1, 1)([1, 2, 3]) // ${JSON.stringify(A.updateAt(1, 1)([1, 2, 3]))}
  updateAt(1, 1)([]) // ${JSON.stringify(A.updateAt(1, 1)([]))}
  `

  // unsafeDeleteAt
  const unsafeDeleteAtTx = `
  // Delete the element at the specified index, creating a copy
  
  function unsafeDeleteAt<A>(i: number, as: Array<A>): Array<A> {
    const xs = copy(as)
    
    xs.splice(i, 1)
    
    return xs
  }
  
  unsafeDeleteAt(1, [1, 2, 3]) // ${JSON.stringify(A.unsafeDeleteAt(1, [1, 2, 3]))}
  `

  // deleteAt
  const deleteAtTx = `
  // Delete the element at the specified index, creating a new array, or returning \`None\` if the index is out of bounds
  
  function deleteAt(i: number): <A>(as: Array<A>) => Option<Array<A>> {
    return as => (isOutOfBound(i, as) ? none : some(unsafeDeleteAt(i, as)))
  }
  
  deleteAt(0)([1, 2, 3]) // ${JSON.stringify(A.deleteAt(0)([1, 2, 3]))}
  deleteAt(0)([]) // ${JSON.stringify(A.deleteAt(0)([]))}
  `

  // modifyAt
  const modifyAtTx = `
  // Apply a function to the element at the specified index, creating a new array, or returning \`None\` if the index is out
  // of bounds
  
  function modifyAt<A>(i: number, f: (a: A) => A): (as: Array<A>) => Option<Array<A>> {
    return as => (isOutOfBound(i, as) ? none : some(unsafeUpdateAt(i, f(as[i]), as)))
  }
  
  const double = (x: number): number => x * 2
  
  modifyAt(1, double)([1, 2, 3]) // ${JSON.stringify(A.modifyAt(1, (x: number): number => x * 2)([1, 2, 3]))}
  modifyAt(1, double)([]) // ${JSON.stringify(A.modifyAt(1, (x: number): number => x * 2)([]))}
  `

  // reverse
  const reverseTx = `
  // Reverse an array, creating a new array
  
  function reverse<A>(as: Array<A>): Array<A> {
    return copy(as).reverse()
  }
  
  reverse([1, 2, 3]) // ${JSON.stringify(A.reverse([1, 2, 3]))}
  `

  // rights
  const rightsTx = `
  // Extracts from an array of \`Either\` all the \`Right\` elements. All the \`Right\` elements are extracted in order
  
  function rights<E, A>(as: Array<Either<E, A>>): Array<A> {
    const r: Array<A> = []
    const len = as.length
    
    for (let i = 0; i < len; i++) {
      const a = as[i]
      if (a._tag === 'Right') {
        r.push(a.right)
      }
    }
    
    return r
  }
  
  rights([right(1), left('foo'), right(2)]) // ${JSON.stringify(A.rights([Ei.right(1), Ei.left('foo'), Ei.right(2)]))}
  `

  // lefts
  const leftsTx = `
  // Extracts from an array of \`Either\` all the \`Left\` elements. All the \`Left\` elements are extracted in order
  
  function lefts<E, A>(as: Array<Either<E, A>>): Array<E> {
    const r: Array<E> = []
    const len = as.length
    
    for (let i = 0; i < len; i++) {
      const a = as[i]
      if (a._tag === 'Left') {
        r.push(a.left)
      }
    }
    
    return r
  }
  
  lefts([right(1), left('foo'), right(2)]) // ${JSON.stringify(A.lefts([Ei.right(1), Ei.left('foo'), Ei.right(2)]))}
  `

  // sort
  const sortTx = `
  // Sort the elements of an array in increasing order, creating a new array
  
  function sort<A>(O: Ord<A>): (as: Array<A>) => Array<A> {
    return as => copy(as).sort(O.compare)
  }
  
  sort(ordNumber)([3, 2, 1]) // ${JSON.stringify(A.sort(O.ordNumber)([3, 2, 1]))}
  `

  // zipWith
  const zipWithTx = `
  // Apply a function to pairs of elements at the same index in two arrays, collecting the results in a new array. If one
  // input array is short, excess elements of the longer array are discarded.
  
  function zipWith<A, B, C>(fa: Array<A>, fb: Array<B>, f: (a: A, b: B) => C): Array<C> {
    const fc = []
    const len = Math.min(fa.length, fb.length)
    
    for (let i = 0; i < len; i++) {
      fc[i] = f(fa[i], fb[i])
    }
    
    return fc
  }
  
  zipWith([1, 2, 3], ['a', 'b', 'c', 'd'], (n, s) => s + n) // ${JSON.stringify(
    A.zipWith([1, 2, 3], ['a', 'b', 'c', 'd'], (n, s) => s + n)
  )}
  `

  // zip
  const zipTx = `
  // Takes two arrays and returns an array of corresponding pairs. If one input array is short, excess elements of the
  // longer array are discarded
  
  function zip<A, B>(fa: Array<A>, fb: Array<B>): Array<[A, B]> {
    return zipWith(fa, fb, (a, b) => [a, b])
  }
  
  zip([1, 2, 3], ['a', 'b', 'c', 'd']) // ${JSON.stringify(A.zip([1, 2, 3], ['a', 'b', 'c', 'd']))}
  `

  // unzip
  const unzipTx = `
  // The function is reverse of \`zip\`. Takes an array of pairs and return two corresponding arrays

  function unzip<A, B>(as: Array<[A, B]>): [Array<A>, Array<B>] {
    const fa = []
    const fb = []
  
    for (let i = 0; i < as.length; i++) {
      fa[i] = as[i][0]
      fb[i] = as[i][1]
    }
  
    return [fa, fb]
  }
  
  unzip([[1, 'a'], [2, 'b'], [3, 'c']]) // ${JSON.stringify(
    A.unzip([
      [1, 'a'],
      [2, 'b'],
      [3, 'c']
    ])
  )}
  `

  // rotate
  const rotateTx = `
  // Rotate an array to the right by \`n\` steps
  
  function rotate(n: number): <A>(as: Array<A>) => Array<A> {
    return as => {
      const len = as.length
      
      if (n === 0 || len <= 1 || len === Math.abs(n)) {
        return as
      } else if (n < 0) {
        return rotate(len + n)(as)
      } else {
        return as.slice(-n).concat(as.slice(0, len - n))
      }
    }
  }
  
  rotate(2)([1, 2, 3, 4, 5]) // ${JSON.stringify(A.rotate(2)([1, 2, 3, 4, 5]))}
  `

  // elem
  const elemTx = `
  // Test if a value is a member of an array. Takes a \`Eq<A>\` as a single
  // argument which returns the function to use to search for a value of type \`A\` in
  // an array of type \`Array<A>\`
  
  function elem<A>(E: Eq<A>): (a: A, as: Array<A>) => boolean {
    return (a, as) => {
      const predicate = (element: A) => E.equals(element, a)
      let i = 0
      const len = as.length
      
      for (; i < len; i++) {
        if (predicate(as[i])) {
          return true
        }
      }
      
      return false
    }
  }
  
  elem(eqNumber)(1, [1, 2, 3]) // ${JSON.stringify(A.elem(Eq.eqNumber)(1, [1, 2, 3]))}
  elem(eqNumber)(4, [1, 2, 3]) // ${JSON.stringify(A.elem(Eq.eqNumber)(4, [1, 2, 3]))}
  `

  // uniq
  const uniqTx = `
  // Remove duplicates from an array, keeping the first occurrence of an element.
  
  function uniq<A>(E: Eq<A>): (as: Array<A>) => Array<A> {
    const elemS = elem(E)
    
    return as => {
      const r: Array<A> = []
      const len = as.length
      let i = 0
      
      for (; i < len; i++) {
        const a = as[i]
        
        if (!elemS(a, r)) {
          r.push(a)
        }
      }
      
      return len === r.length ? as : r
    }
  }
  
  uniq(eqNumber)([1, 2, 1]) // ${JSON.stringify(A.uniq(Eq.eqNumber)([1, 2, 1]))}
  `

  // sortBy
  interface Person {
    name: string
    age: number
  }

  const byName = O.ord.contramap(O.ordString, (p: Person) => p.name)
  const byAge = O.ord.contramap(O.ordNumber, (p: Person) => p.age)

  const sortByNameByAge = A.sortBy([byName, byAge])
  const sortByAgeByName = A.sortBy([byAge, byName])

  const persons = [
    { name: 'a', age: 1 },
    { name: 'b', age: 3 },
    { name: 'c', age: 2 },
    { name: 'b', age: 2 }
  ]

  const sortByTx = `
  // Sort the elements of an array in increasing order, where elements are compared using first \`ords[0]\`, then \`ords[1]\`,
  // etc...
  
  function sortBy<A>(ords: Array<Ord<A>>): (as: Array<A>) => Array<A> {
    const M = getOrdMonoid<A>()
    
    return sort(ords.reduce(M.concat, M.empty))
  }
  
  interface Person {
    name: string
    age: number
  }
  
  const byName = ord.contramap(ordString, (p: Person) => p.name)
  const byAge = ord.contramap(ordNumber, (p: Person) => p.age)
  
  const sortByNameByAge = sortBy([byName, byAge])
  const sortByAgeByName = A.sortBy([byAge, byName])
  
  const persons = [{ name: 'a', age: 1 }, { name: 'b', age: 3 }, { name: 'c', age: 2 }, { name: 'b', age: 2 }]
  
  sortByNameByAge(persons) // ${JSON.stringify(sortByNameByAge(persons))}
  sortByAgeByName(persons) // ${JSON.stringify(sortByAgeByName(persons))}
  `

  // chop
  const group = S => {
    return A.chop(as => {
      const { init, rest } = A.spanLeft(a => S.equals(a, as[0]))(as)
      return [init, rest]
    })
  }

  const chopTx = `
  // A useful recursion pattern for processing an array to produce a new array, often used for "chopping" up the input
  // array. Typically chop is called with some function that will consume an initial prefix of the array and produce a
  // value and the rest of the array.
  
  import { eqNumber } from 'fp-ts/lib/Eq'
  
  function chop<A, B>(f: (as: NonEmptyArray<A>) => [B, Array<A>]): (as: Array<A>) => Array<B> {
    return as => {
      const result: Array<B> = []
      let cs: Array<A> = as
      while (isNonEmpty(cs)) {
        const [b, c] = f(cs)
        result.push(b)
        cs = c
      }
      return result
    }
  }
  
  const group = <A>(S: Eq<A>): ((as: Array<A>) => Array<Array<A>>) => {
    return chop(as => {
      const { init, rest } = spanLeft((a: A) => S.equals(a, as[0]))(as)
      return [init, rest]
    })
  }
  
  group(eqNumber)([1, 1, 2, 3, 3, 4]) // ${JSON.stringify(group(Eq.eqNumber)([1, 1, 2, 3, 3, 4]))}
  `

  // splitAt
  const splitAtTx = `
  // Splits an array into two pieces, the first piece has \`n\` elements.
  
  function splitAt(n: number): <A>(as: Array<A>) => [Array<A>, Array<A>] {
    return as => [as.slice(0, n), as.slice(n)]
  }
  
  splitAt(2)([1, 2, 3, 4, 5]) // ${JSON.stringify(A.splitAt(2)([1, 2, 3, 4, 5]))}
  splitAt(2)([1]) // ${JSON.stringify(A.splitAt(2)([1]))}
  splitAt(2)([1, 2]) // ${JSON.stringify(A.splitAt(2)([1, 2]))}
  splitAt(-1)([1, 2]) // ${JSON.stringify(A.splitAt(-1)([1, 2]))}
  splitAt(0)([1, 2])) // ${JSON.stringify(A.splitAt(0)([1, 2]))}
  splitAt(3)([1, 2])) // ${JSON.stringify(A.splitAt(3)([1, 2]))}
  `

  // chunksOf
  const chunksOfTx = `
  // Splits an array into length-\`n\` pieces. The last piece will be shorter if \`n\` does not evenly divide the length of
  // the array. Note that \`chunksOf(n)([])\` is \`[]\`, not \`[[]]\`. This is intentional, and is consistent with a recursive
  // definition of \`chunksOf\`; it satisfies the property that
  
  function chunksOf(n: number): <A>(as: Array<A>) => Array<Array<A>> {
    return as => (as.length === 0 ? empty : isOutOfBound(n - 1, as) ? [as] : chop(splitAt(n))(as))
  }
  
  chunksOf(2)([1, 2, 3, 4, 5]) // ${A.chunksOf(2)([1, 2, 3, 4, 5])}
  chunksOf(2)([1, 2, 3, 4, 5, 6]) // ${A.chunksOf(2)([1, 2, 3, 4, 5, 6])}
  chunksOf(5)([1, 2, 3, 4, 5]) // ${A.chunksOf(5)([1, 2, 3, 4, 5])}
  chunksOf(6)([1, 2, 3, 4, 5)]) // ${A.chunksOf(6)([1, 2, 3, 4, 5])}
  chunksOf(1)([1, 2, 3, 4, 5)]) // ${A.chunksOf(1)([1, 2, 3, 4, 5])}
  chunksOf(0)([1, 2, 3, 4, 5)]) // ${A.chunksOf(0)([1, 2, 3, 4, 5])}
  chunksOf(-1)([1, 2, 3, 4, 5)]) // ${A.chunksOf(-1)([1, 2, 3, 4, 5])}
  `

  // comprehension
  const comprehensionTx = `
  import { tuple } from 'fp-ts/lib/function'

  function comprehension<A, B, C, D, R>(
    input: [Array<A>, Array<B>, Array<C>, Array<D>],
    f: (a: A, b: B, c: C, d: D) => R,
    g?: (a: A, b: B, c: C, d: D) => boolean
  ): Array<R>
  function comprehension<A, B, C, R>(
    input: [Array<A>, Array<B>, Array<C>],
    f: (a: A, b: B, c: C) => R,
    g?: (a: A, b: B, c: C) => boolean
  ): Array<R>
  function comprehension<A, R>(input: [Array<A>], f: (a: A) => R, g?: (a: A) => boolean): Array<R>
  function comprehension<A, B, R>(
    input: [Array<A>, Array<B>],
    f: (a: A, b: B) => R,
    g?: (a: A, b: B) => boolean
  ): Array<R>
  function comprehension<A, R>(input: [Array<A>], f: (a: A) => boolean, g?: (a: A) => R): Array<R>
  function comprehension<R>(
    input: Array<Array<any>>,
    f: (...xs: Array<any>) => R,
    g: (...xs: Array<any>) => boolean = () => true
  ): Array<R> {
    const go = (scope: Array<any>, input: Array<Array<any>>): Array<R> => {
      if (input.length === 0) {
        return g(...scope) ? [f(...scope)] : empty
      } else {
        return array.chain(input[0], x => go(snoc(scope, x), input.slice(1)))
      }
    }
    return go(empty, input)
  }
  
  comprehension([[1, 2, 3]], a => a * 2) // ${JSON.stringify(A.comprehension([[1, 2, 3]], a => a * 2))}
  comprehension([[1, 2, 3], ['a', 'b']], tuple, (a, b) => (a + b.length) % 2 === 0) // ${JSON.stringify(
    A.comprehension(
      [
        [1, 2, 3],
        ['a', 'b']
      ],
      F.tuple,
      (a, b) => (a + b.length) % 2 === 0
    )
  )}
  comprehension([[1, 2, 3], ['a', 'b']], tuple) // ${JSON.stringify(
    A.comprehension(
      [
        [1, 2, 3],
        ['a', 'b']
      ],
      F.tuple
    )
  )}
  `

  // union
  const unionTx = `
  // Creates an array of unique values, in order, from all given arrays using a \`Eq\` for equality comparisons
  
  function union<A>(E: Eq<A>): (xs: Array<A>, ys: Array<A>) => Array<A> {
    const elemE = elem(E)
    return (xs, ys) =>
      concat(
        xs,
        ys.filter(a => !elemE(a, xs))
      )
  }
  
  union(eqNumber)([1, 2], [2, 3]) // ${A.union(Eq.eqNumber)([1, 2], [2, 3])}
  union(eqNumber)([1, 2], [3, 4]) // ${A.union(Eq.eqNumber)([1, 2], [3, 4])}
  union(eqNumber)([1, 2], [1, 2]) // ${A.union(Eq.eqNumber)([1, 2], [1, 2])}
  `

  // intersection
  const intersectionTx = `
  // Creates an array of unique values that are included in all given arrays using a \`Eq\` for equality
  // comparisons. The order and references of result values are determined by the first array.
  
  function intersection<A>(E: Eq<A>): (xs: Array<A>, ys: Array<A>) => Array<A> {
    const elemE = elem(E)
    return (xs, ys) => xs.filter(a => elemE(a, ys))
  }
  
  intersection(eqNumber)([1, 2], [2, 3]) // ${JSON.stringify(A.intersection(Eq.eqNumber)([1, 2], [2, 3]))}
  intersection(eqNumber)([1, 2], [3, 4]) // ${JSON.stringify(A.intersection(Eq.eqNumber)([1, 2], [3, 4]))}
  intersection(eqNumber)([1, 2], [1, 2]) // ${JSON.stringify(A.intersection(Eq.eqNumber)([1, 2], [1, 2]))}
  `

  // difference
  const differenceTx = `
  // Creates an array of array values not included in the other given array using a \`Eq\` for equality
  // comparisons. The order and references of result values are determined by the first array.
  
  function difference<A>(E: Eq<A>): (xs: Array<A>, ys: Array<A>) => Array<A> {
    const elemE = elem(E)
    return (xs, ys) => xs.filter(a => !elemE(a, ys))
  }
  
  difference(eqNumber)([1, 2], [2, 3]) // ${JSON.stringify(A.difference(Eq.eqNumber)([1, 2], [2, 3]))}
  difference(eqNumber)([1, 2], [3, 4]) // ${JSON.stringify(A.difference(Eq.eqNumber)([1, 2], [3, 4]))}
  difference(eqNumber)([1, 2], [1, 2]) // ${JSON.stringify(A.difference(Eq.eqNumber)([1, 2], [1, 2]))}
  `

  // of
  const ofTx = `
  const of = <A>(a: A): Array<A> => [a]
  
  of<number>(5) // ${JSON.stringify(A.of<number>(5))}
  of<string>(5) // ${JSON.stringify(A.of<string>('hello'))}
  `

  // array
  const arrayTx = `
  // Array monad
  
  const array: Monad1<URI> &
    Foldable1<URI> &
    Unfoldable1<URI> &
    TraversableWithIndex1<URI, number> &
    Alternative1<URI> &
    Extend1<URI> &
    Compactable1<URI> &
    FilterableWithIndex1<URI, number> &
    Witherable1<URI> &
    FunctorWithIndex1<URI, number> &
    FoldableWithIndex1<URI, number> = {
    URI,
    map: (fa, f) => fa.map(a => f(a)),
    mapWithIndex: (fa, f) => fa.map((a, i) => f(i, a)),
    compact: as => array.filterMap(as, identity),
    separate: <B, C>(fa: Array<Either<B, C>>): Separated<Array<B>, Array<C>> => {
      const left: Array<B> = []
      const right: Array<C> = []
      for (const e of fa) {
        if (e._tag === 'Left') {
          left.push(e.left)
        } else {
          right.push(e.right)
        }
      }
      return {
        left,
        right
      }
    },
    filter: <A>(as: Array<A>, predicate: Predicate<A>): Array<A> => {
      return as.filter(predicate)
    },
    filterMap: (as, f) => array.filterMapWithIndex(as, (_, a) => f(a)),
    partition: <A>(fa: Array<A>, predicate: Predicate<A>): Separated<Array<A>, Array<A>> => {
      return array.partitionWithIndex(fa, (_, a) => predicate(a))
    },
    partitionMap: (fa, f) => array.partitionMapWithIndex(fa, (_, a) => f(a)),
    of,
    ap: (fab, fa) => flatten(array.map(fab, f => array.map(fa, f))),
    chain: (fa, f) => {
      let resLen = 0
      const l = fa.length
      const temp = new Array(l)
      for (let i = 0; i < l; i++) {
        const e = fa[i]
        const arr = f(e)
        resLen += arr.length
        temp[i] = arr
      }
      const r = Array(resLen)
      let start = 0
      for (let i = 0; i < l; i++) {
        const arr = temp[i]
        const l = arr.length
        for (let j = 0; j < l; j++) {
          r[j + start] = arr[j]
        }
        start += l
      }
      return r
    },
    reduce: (fa, b, f) => array.reduceWithIndex(fa, b, (_, b, a) => f(b, a)),
    foldMap: M => {
      const foldMapWithIndexM = array.foldMapWithIndex(M)
      return (fa, f) => foldMapWithIndexM(fa, (_, a) => f(a))
    },
    reduceRight: (fa, b, f) => array.reduceRightWithIndex(fa, b, (_, a, b) => f(a, b)),
    unfold: <A, B>(b: B, f: (b: B) => Option<[A, B]>): Array<A> => {
      const ret: Array<A> = []
      let bb = b
      while (true) {
        const mt = f(bb)
        if (isSome(mt)) {
          const [a, b] = mt.value
          ret.push(a)
          bb = b
        } else {
          break
        }
      }
      return ret
    },
    traverse: <F>(F: Applicative<F>): (<A, B>(ta: Array<A>, f: (a: A) => HKT<F, B>) => HKT<F, Array<B>>) => {
      const traverseWithIndexF = array.traverseWithIndex(F)
      return (ta, f) => traverseWithIndexF(ta, (_, a) => f(a))
    },
    sequence: <F>(F: Applicative<F>) => <A>(ta: Array<HKT<F, A>>): HKT<F, Array<A>> => {
      return array.reduce(ta, F.of(array.zero()), (fas, fa) =>
        F.ap(
          F.map(fas, as => (a: A) => snoc(as, a)),
          fa
        )
      )
    },
    zero: () => empty,
    alt: (fx, f) => concat(fx, f()),
    extend: (fa, f) => fa.map((_, i, as) => f(as.slice(i))),
    wither: <F>(F: Applicative<F>): (<A, B>(ta: Array<A>, f: (a: A) => HKT<F, Option<B>>) => HKT<F, Array<B>>) => {
      const traverseF = array.traverse(F)
      return (wa, f) => F.map(traverseF(wa, f), array.compact)
    },
    wilt: <F>(
      F: Applicative<F>
    ): (<A, B, C>(wa: Array<A>, f: (a: A) => HKT<F, Either<B, C>>) => HKT<F, Separated<Array<B>, Array<C>>>) => {
      const traverseF = array.traverse(F)
      return (wa, f) => F.map(traverseF(wa, f), array.separate)
    },
    reduceWithIndex: (fa, b, f) => {
      const l = fa.length
      let r = b
      for (let i = 0; i < l; i++) {
        r = f(i, r, fa[i])
      }
      return r
    },
    foldMapWithIndex: M => (fa, f) => fa.reduce((b, a, i) => M.concat(b, f(i, a)), M.empty),
    reduceRightWithIndex: (fa, b, f) => fa.reduceRight((b, a, i) => f(i, a, b), b),
    traverseWithIndex: <F>(F: Applicative<F>) => <A, B>(
      ta: Array<A>,
      f: (i: number, a: A) => HKT<F, B>
    ): HKT<F, Array<B>> => {
      return array.reduceWithIndex(ta, F.of<Array<B>>(array.zero()), (i, fbs, a) =>
        F.ap(
          F.map(fbs, bs => (b: B) => snoc(bs, b)),
          f(i, a)
        )
      )
    },
    partitionMapWithIndex: <A, B, C>(
      fa: Array<A>,
      f: (i: number, a: A) => Either<B, C>
    ): Separated<Array<B>, Array<C>> => {
      const left: Array<B> = []
      const right: Array<C> = []
      for (let i = 0; i < fa.length; i++) {
        const e = f(i, fa[i])
        if (e._tag === 'Left') {
          left.push(e.left)
        } else {
          right.push(e.right)
        }
      }
      return {
        left,
        right
      }
    },
    partitionWithIndex: <A>(
      fa: Array<A>,
      predicateWithIndex: (i: number, a: A) => boolean
    ): Separated<Array<A>, Array<A>> => {
      const left: Array<A> = []
      const right: Array<A> = []
      for (let i = 0; i < fa.length; i++) {
        const a = fa[i]
        if (predicateWithIndex(i, a)) {
          right.push(a)
        } else {
          left.push(a)
        }
      }
      return {
        left,
        right
      }
    },
    filterMapWithIndex: <A, B>(fa: Array<A>, f: (i: number, a: A) => Option<B>): Array<B> => {
      const result: Array<B> = []
      for (let i = 0; i < fa.length; i++) {
        const optionB = f(i, fa[i])
        if (isSome(optionB)) {
          result.push(optionB.value)
        }
      }
      return result
    },
    filterWithIndex: <A>(fa: Array<A>, predicateWithIndex: (i: number, a: A) => boolean): Array<A> => {
      return fa.filter((a, i) => predicateWithIndex(i, a))
    }
  }
  
  // compact
  array.compact([O.some(1), O.some(2), O.some(3)]) // ${JSON.stringify(A.array.compact([Op.some(1), Op.some(2), Op.some(3)]))}
  array.compact([O.some(1), O.none, O.some(3)]) // ${JSON.stringify(A.array.compact([Op.some(1), Op.none, Op.some(3)]))}
  // separate
  array.separate([]) // ${JSON.stringify(A.array.separate([]))}
  array.separate([left(123), right('123')]) // ${JSON.stringify(A.array.separate([Ei.left(123), Ei.right('123')]))}
  // filter
  array.filter([1, 2, 3], (n: number) => n % 2 === 1) // ${JSON.stringify(A.array.filter([1, 2, 3], (n: number) => n % 2 === 1))}
  array.filter([O.some(3), O.some(2), O.some(1)], O.isSome) // ${JSON.stringify(A.array.filter([Op.some(3), Op.some(2), Op.some(1)], Op.isSome))}
  array.filter([O.some(3), O.none, O.some(1)], O.isSome) // ${JSON.stringify(A.array.filter([Op.some(3), Op.none, Op.some(1)], Op.isSome))}
  // filterWithIndex
  array.filterWithIndex(['a', 'b', 'c'], (n: number) => n % 2 === 0) // ${JSON.stringify(A.array.filterWithIndex(['a', 'b', 'c'], (n: number) => n % 2 === 0))}
  // filterMap
  array.filterMap([1, 2, 3], (n: number) => (n % 2 === 0 ? O.none : O.some(n))) // ${JSON.stringify(A.array.filterMap([1, 2, 3], (n: number) => (n % 2 === 0 ? Op.none : Op.some(n))))}
  // partitionMap
  array.partitionMap([], identity) // ${JSON.stringify(A.array.partitionMap([], F.identity))}
  array.partitionMap([right(1), left('foo'), right(2)], identity) // ${JSON.stringify(A.array.partitionMap([Ei.right(1), Ei.left('foo'), Ei.right(2)], F.identity))}
  // partition
  array.partition([], (n: number) => n > 2) // ${JSON.stringify(A.array.partition([], (n: number) => n > 2))}
  array.partition([1, 3], (n: number) => n > 2) // ${JSON.stringify(A.array.partition([1, 3], (n: number) => n > 2))}
  array.partition(['a', 'b', 1], x => typeof x === 'number') // ${JSON.stringify(A.array.partition(['a', 'b', 1], x => typeof x === 'number'))}
  // wither
  array.wither(I.identity)([], (n: number) => I.identity.of(n > 2 ? O.some(n + 1) : O.none)) // ${JSON.stringify(A.array.wither(I.identity)([], (n: number) => I.identity.of(n > 2 ? Op.some(n + 1) : Op.none)))}
  array.wither(I.identity)([1, 3], (n: number) => I.identity.of(n > 2 ? O.some(n + 1) : O.none)) // ${JSON.stringify(A.array.wither(I.identity)([1, 3], (n: number) => I.identity.of(n > 2 ? Op.some(n + 1) : Op.none)))}
  // wilt
  array.wilt(I.identity)([], (n: number) => I.identity.of(n > 2 ? right(n + 1) : left(n - 1))) // ${JSON.stringify(A.array.wilt(I.identity)([], (n: number) => I.identity.of(n > 2 ? Ei.right(n + 1) : Ei.left(n - 1))))}
  array.wilt(I.identity)([1, 3], (n: number) => I.identity.of(n > 2 ? right(n + 1) : left(n - 1))) // ${JSON.stringify(A.array.wilt(I.identity)([1, 3], (n: number) => I.identity.of(n > 2 ? Ei.right(n + 1) : Ei.left(n - 1))))}
  // ap
  array.ap([(n: number) => n * 2, (n: number) => n + 1], [1, 2, 3]) // ${JSON.stringify(A.array.ap([(n: number) => n * 2, (n: number) => n + 1], [1, 2, 3]))}
  // chain
  array.chain([1, 2, 3], n => [n, n + 1]) // ${JSON.stringify(A.array.chain([1, 2, 3], n => [n, n + 1]))}
  // reduce
  array.reduce(['a', 'b', 'c'], '', (acc, a) => acc + a) // ${JSON.stringify(A.array.reduce(['a', 'b', 'c'], '', (acc, a) => acc + a))}
  // foldMap
  array.foldMap(M.monoidString)(['a', 'b', 'c'], F.identity) // ${JSON.stringify(A.array.foldMap(M.monoidString)(['a', 'b', 'c'], F.identity))}
  array.foldMap(M.monoidString)([], F.identity) // ${JSON.stringify(A.array.foldMap(M.monoidString)([], F.identity))}
  // reduceRight
  array.reduceRight(['a', 'b', 'c'], '', (a: string, acc: string) => acc + a) // ${JSON.stringify(A.array.reduceRight(['a', 'b', 'c'], '', (a: string, acc: string) => acc + a))}
  array.reduceRight([], '', (a: string, acc: string) => acc + a) // ${JSON.stringify(A.array.reduceRight([], '', (a: string, acc: string) => acc + a))}
  // unfold
  array.unfold(5, n => (n > 0 ? O.some([n, n - 1]) : O.none)) // ${JSON.stringify(A.array.unfold(5, n => (n > 0 ? Op.some([n, n - 1]) : Op.none)))}
  // traverse
  array.traverse(O.option)([1, 2], (n: number): O.Option<number> => (n % 2 === 0 ? O.none : O.some(n))) // ${JSON.stringify(A.array.traverse(Op.option)([1, 2], (n: number): Op.Option<number> => (n % 2 === 0 ? Op.none : Op.some(n))))}
  array.traverse(O.option)([1, 3], (n: number): O.Option<number> => (n % 2 === 0 ? O.none : O.some(n))) // ${JSON.stringify(A.array.traverse(Op.option)([1, 3], (n: number): Op.Option<number> => (n % 2 === 0 ? Op.none : Op.some(n))))}
  // sequence
  array.sequence(O.option)([O.some(1), O.some(3)]) // ${JSON.stringify(A.array.sequence(Op.option)([Op.some(1), Op.some(3)]))}
  array.sequence(O.option)([O.some(1), O.none]) // ${JSON.stringify(A.array.sequence(Op.option)([Op.some(1), Op.none]))}
  // alt
  array.alt([1, 2], () => [3, 4]) // ${JSON.stringify(A.array.alt([1, 2], () => [3, 4]))}
  // extend
  array.extend([1, 2, 3, 4], (as: Array<number>) => M.fold(M.monoidSum)(as)) // ${JSON.stringify(A.array.extend([1, 2, 3, 4], (as: Array<number>) => M.fold(M.monoidSum)(as)))}
  array.extend([1, 2, 3, 4], F.identity) // ${JSON.stringify(A.array.extend([1, 2, 3, 4], F.identity))}
  `

  return (
    <ModuleContainer id='array'>
      <Title>FP-TS (Array)</Title>
      <CodeBlock label='common types' codeTx={commonTypesTX} />
      <CodeBlock label='getShow' codeTx={getShowTx} />
      <CodeBlock label='getMonoid' codeTx={getMonoidTx} />
      <CodeBlock label='getEq' codeTx={getEqTx} />
      <CodeBlock label='getOrd' codeTx={getOrdTx} />
      <CodeBlock label='makeBy' codeTx={makeByTx} />
      <CodeBlock label='range' codeTx={rangeTx} />
      <CodeBlock label='replicate' codeTx={replicateTx} />
      <CodeBlock label='flatten' codeTx={flattenTx} />
      <CodeBlock label='foldLeft' codeTx={foldLeftTx} />
      <CodeBlock label='foldRight' codeTx={foldRightTx} />
      <CodeBlock label='scanLeft' codeTx={scanLeftTx} />
      <CodeBlock label='scanRight' codeTx={scanRightTx} />
      <CodeBlock label='isEmpty' codeTx={isEmptyTx} />
      <CodeBlock label='isNonEmpty' codeTx={isNotEmptyTx} />
      <CodeBlock label='isOutOfBound' codeTx={isOutOfBoundTx} />
      <CodeBlock label='lookup' codeTx={lookupTx} />
      <CodeBlock label='cons' codeTx={consTx} />
      <CodeBlock label='snoc' codeTx={snocTx} />
      <CodeBlock label='head' codeTx={headTx} />
      <CodeBlock label='last' codeTx={lastTx} />
      <CodeBlock label='tail' codeTx={tailTx} />
      <CodeBlock label='init' codeTx={initTx} />
      <CodeBlock label='takeLeft' codeTx={takeLeftTx} />
      <CodeBlock label='takeRight' codeTx={takeRightTx} />
      <CodeBlock label='takeLeftWhile' codeTx={takeLeftWhileTx} />
      <CodeBlock label='spanLeft' codeTx={spanLeftTx} />
      <CodeBlock label='dropLeft' codeTx={dropLeftTx} />
      <CodeBlock label='dropRight' codeTx={dropRightTx} />
      <CodeBlock label='dropLeftWhile' codeTx={dropLeftWhileTx} />
      <CodeBlock label='findIndex' codeTx={findIndexTx} />
      <CodeBlock label='findFirst' codeTx={findFirstTX} />
      <CodeBlock label='findFirstMap' codeTx={findFirstMapTx} />
      <CodeBlock label='findLast' codeTx={findLastTx} />
      <CodeBlock label='findLastMap' codeTx={findLastMapTx} />
      <CodeBlock label='findLastIndex' codeTx={findLastIndexTx} />
      <CodeBlock label='copy' codeTx={copyTx} />
      <CodeBlock label='unsafeInsertAt' codeTx={unsafeInsertAtTx} />
      <CodeBlock label='insertAt' codeTx={insertAtTx} />
      <CodeBlock label='unsafeUpdateAt' codeTx={unsafeUpdateAtTx} />
      <CodeBlock label='updateAt' codeTx={updateAtTx} />
      <CodeBlock label='unsafeDeleteAt' codeTx={unsafeDeleteAtTx} />
      <CodeBlock label='deleteAt' codeTx={deleteAtTx} />
      <CodeBlock label='modifyAt' codeTx={modifyAtTx} />
      <CodeBlock label='reverse' codeTx={reverseTx} />
      <CodeBlock label='rights' codeTx={rightsTx} />
      <CodeBlock label='lefts' codeTx={leftsTx} />
      <CodeBlock label='sort' codeTx={sortTx} />
      <CodeBlock label='zipWith' codeTx={zipWithTx} />
      <CodeBlock label='zip' codeTx={zipTx} />
      <CodeBlock label='unzip' codeTx={unzipTx} />
      <CodeBlock label='rotate' codeTx={rotateTx} />
      <CodeBlock label='elem' codeTx={elemTx} />
      <CodeBlock label='uniq' codeTx={uniqTx} />
      <CodeBlock label='sortBy' codeTx={sortByTx} />
      <CodeBlock label='chop' codeTx={chopTx} />
      <CodeBlock label='splitAt' codeTx={splitAtTx} />
      <CodeBlock label='chunksOf' codeTx={chunksOfTx} />
      <CodeBlock label='comprehension' codeTx={comprehensionTx} />
      <CodeBlock label='union' codeTx={unionTx} />
      <CodeBlock label='intersection' codeTx={intersectionTx} />
      <CodeBlock label='difference' codeTx={differenceTx} />
      <CodeBlock label='off' codeTx={ofTx} />
      <CodeBlock label='array' codeTx={arrayTx} />
    </ModuleContainer>
  )
}

export { ArrayContainer }
