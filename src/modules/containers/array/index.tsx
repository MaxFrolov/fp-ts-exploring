import * as React from 'react'
// view components
import { Title } from '@md-views'
import { CodeBlock } from '@md-components/code-block'
// libs
import * as S from 'fp-ts/lib/Show'
import * as A from 'fp-ts/lib/Array'
import * as Eq from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Ord'

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
    (_, tail) => 1 + foldLeftLenEx(tail)
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
  
  `

  return (
    <>
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
      <CodeBlock label='last' codeTx={lastTx} />s
      <CodeBlock label='tail' codeTx={tailTx} />
      <CodeBlock label='init' codeTx={initTx} />
      <CodeBlock label='takeLeft' codeTx={takeLeftTx} />
      <CodeBlock label='takeRight' codeTx={takeRightTx} />
      <CodeBlock label='takeLeftWhile' codeTx={takeLeftWhileTx} />
    </>
  )
}

export { ArrayContainer }
