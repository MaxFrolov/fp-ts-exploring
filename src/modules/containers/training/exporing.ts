import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import * as Eq from 'fp-ts/lib/Eq'
import * as R from 'fp-ts/lib/Reader'
import * as Re from 'fp-ts/lib/Record'
import { pipe } from 'fp-ts/lib/pipeable'
import { getUserRepositories } from '@md-containers/training/github-api'
import { monoidString, monoidSum } from 'fp-ts/lib/Monoid'

// ============
// traverse
// ============
// array
const aTr1 = A.array.traverse(O.option)([2, 3], a => (a > 2 ? O.some(a - 1) : O.some(a + 2))) //  { _tag: 'Some', value: [ 4, 2 ] }
const aTr2 = A.array.traverse(O.option)([2, 3], a => (a > 2 ? O.none : O.some(a + 2))) // { _tag: 'None' }
const aTr3 = A.array.traverse(O.option)([O.none, O.some(3)], a => (O.isNone(a) ? O.none : a)) // { _tag: 'None' }
const aTr4 = A.array.traverse(O.option)([O.some(4), O.some(3)], a => (O.isNone(a) ? O.none : a)) // { _tag: 'Some', value: [ 4, 3 ] }
// record
const rTr1 = Re.record.traverse(O.option)({ he: 2, ki: 3 }, a => (a > 2 ? O.some(a - 1) : O.some(a + 2))) // { _tag: 'Some', value: { he: 4, ki: 2 } }
const rTr2 = Re.record.traverse(O.option)({ he: 2, ki: 3 }, a => (a > 2 ? O.none : O.some(a + 2))) // { _tag: 'None' }
const rTr3 = Re.record.traverse(O.option)({ he: O.some(2), ki: O.some(3) }, a =>
  O.isNone(a) ? O.none : O.some(2 + a.value)
) // { _tag: 'Some', value: { he: 4, ki: 5 } }
const rTr4 = Re.record.traverse(O.option)({ he: O.some(2), ki: O.none }, a =>
  O.isNone(a) ? O.none : O.some(2 + a.value)
) // { _tag: 'None' }
// option
const oTr1 = O.option.traverse(O.option)(O.some(2), a => O.some(2 + a)) // { _tag: 'Some', value: { _tag: 'Some', value: 4 } }
const oTr2 = O.option.traverse(O.option)(O.none, a => O.some(2 + a)) // { _tag: 'Some', value: { _tag: 'None' } }
const oTr3 = O.option.traverse(O.option)(O.some(O.some(2)), a => (O.isNone(a) ? O.none : O.some(2 + a.value))) // { _tag: 'Some', value: { _tag: 'Some', value: 4 } }
const oTr4 = O.option.traverse(E.either)(O.some(2), a => E.right(2 + a)) // { _tag: 'Right', right: { _tag: 'Some', value: 4 } }
// ============
// sequence
// ============
// array
const aSe1 = A.array.sequence(O.option)([O.some(3), O.some(4)]) // { _tag: 'Some', value: [ 3, 4 ] }
const aSe2 = A.array.sequence(O.option)([O.none, O.some(4)]) // { _tag: 'None' }
// record
const rSe1 = Re.record.sequence(O.option)({ he: O.some(3), ki: O.some(2) }) // { _tag: 'Some', value: { he: 3, ki: 2 } }
const rSe2 = Re.record.sequence(O.option)({ he: O.none, ki: O.some(2) }) // { _tag: 'None' }
// option
const oSe1 = O.option.sequence(E.either)(O.some(E.right(5))) // { _tag: 'Right', right: { _tag: 'Some', value: 5 } }
const oSe2 = O.option.sequence(E.either)(O.none) // { _tag: 'Right', right: { _tag: 'None' } }
const oSe3 = O.option.sequence(O.option)(O.some(O.some(3))) // { _tag: 'Some', value: { _tag: 'Some', value: 3 } }
// ============
// foldMap
// ============
// array
const aFM1 = A.array.foldMap(monoidSum)([1, 2, 3], a => a + 2) // 12
const aFM2 = A.array.foldMap(monoidString)(['hello', 'world'], a => a + 'O') // helloOworldO
// record
const rFM1 = Re.record.foldMap(monoidSum)({ fs: 1, fe: 2, nj: 3 }, a => a + 2) // 12
const rFM2 = Re.record.foldMap(monoidString)({ fs: 'hello', fe: 'world' }, a => a + 'O') // worldOhelloO
// ============
// bimap
// ============
const eBm1 = E.either.bimap(
  E.right(3),
  e => e,
  d => d + 2
) // { _tag: 'Right', right: 5 }
const eBm2 = E.either.bimap(
  E.left(3),
  e => e,
  d => d + 2
) // { _tag: 'Left', left: 3 }
// ============
// wilt
// ============
// array
const aWi1 = A.array.wilt(O.option)([O.none, O.none, O.some(3), O.some(2)], a =>
  O.isNone(a) ? O.some(E.left(5)) : O.some(E.right(a.value))
) // { _tag: 'Some', value: { left: [ 5, 5 ], right: [ 3, 2 ] } }

const aWi2 = A.array.wilt(E.either)([O.none, O.none, O.some(3), O.some(2)], a =>
  O.isNone(a) ? E.left(E.left(5)) : E.right(E.right(a.value))
) // { _tag: 'Left', left: { _tag: 'Left', left: 5 } }

const aWi3 = A.array.wilt(E.either)([O.none, O.none, O.some(3), O.some(2)], a =>
  O.isNone(a) ? E.right(E.left(5)) : E.right(E.right(a.value))
) // { _tag: 'Right', right: { left: [ 5, 5 ], right: [ 3, 2 ] } }

// record
const rWi1 = Re.record.wilt(O.option)({ ke: O.some(3), ld: O.some(2), lr: O.none, lk: O.none }, a =>
  O.isNone(a) ? O.some(E.left(5)) : O.some(E.right(a.value))
) // { _tag: 'Some', value: { left: { lr: 5, lk: 5 }, right: { ke: 3, ld: 2 } } }

const rWi2 = Re.record.wilt(E.either)({ ke: O.some(3), ld: O.some(2), lr: O.none, lk: O.none }, a =>
  O.isNone(a) ? E.left(E.left(5)) : E.right(E.right(a.value))
) // { _tag: 'Left', left: { _tag: 'Left', left: 5 } }

const rWi3 = Re.record.wilt(E.either)({ ke: O.some(3), ld: O.some(2), lr: O.none, lk: O.none }, a =>
  O.isNone(a) ? E.right(E.left(5)) : E.right(E.right(a.value))
) // { _tag: 'Right', right: { left: { lr: 5, lk: 5 }, right: { ke: 3, ld: 2 } } }

// ============
// wither
// ============
// array
const aWiz1 = A.array.wither(O.option)([O.none, O.none, O.some(3), O.some(2)], a =>
  O.isNone(a) ? O.some(O.some(5)) : O.some(a)
) // { _tag: 'Some', value: [ 5, 5, 3, 2 ] }
const aWiz2 = A.array.wither(O.option)([O.none, O.none, O.some(3), O.some(2)], a =>
  O.isNone(a) ? O.some(O.none) : O.some(O.some(a.value))
) // { _tag: 'Some', value: [ 3, 2 ] }
const aWiz3 = A.array.wither(O.option)([O.none, O.none, O.some(3), O.some(2)], a => (O.isNone(a) ? O.none : O.some(a))) // { _tag: 'None' }
const aWiz4 = A.array.wither(E.either)([O.none, O.none, O.some(3), O.some(2)], a =>
  O.isNone(a) ? E.left(5) : E.right(a)
) // { _tag: 'Left', left: 5 }
const aWiz5 = A.array.wither(E.either)([O.none, O.none, O.some(3), O.some(2)], a =>
  O.isNone(a) ? E.left(O.none) : E.right(a)
) // { _tag: 'Left', left: { _tag: 'None' } }
// record
const rWiz2 = Re.record.wither(O.option)({ ke: O.some(3), ld: O.some(2), lr: O.none, lk: O.none }, a =>
  O.isNone(a) ? O.some(O.none) : O.some(O.some(a.value))
) // { _tag: 'Some', value: { ke: 3, ld: 2, lr: 5, lk: 5 } }
const rWiz3 = Re.record.wither(O.option)({ ke: O.some(3), ld: O.some(2), lr: O.none, lk: O.none }, a =>
  O.isNone(a) ? O.none : O.some(a)
) // { _tag: 'Some', value: { ke: 3, ld: 2 } }
const rWiz4 = Re.record.wither(E.either)({ ke: O.some(3), ld: O.some(2), lr: O.none, lk: O.none }, a =>
  O.isNone(a) ? E.left(5) : E.right(a)
) // { _tag: 'Left', left: 5 }
const rWiz5 = Re.record.wither(E.either)({ ke: O.some(3), ld: O.some(2), lr: O.none, lk: O.none }, a =>
  O.isNone(a) ? E.left(O.none) : E.right(a)
) // { _tag: 'Left', left: { _tag: 'None' } }

// Array
const a = A.array.ap<number, number>([d => d * 2], [1, 2, 3, 4, 5])
const b = A.array.chain<number, number>([1, 2], n => [n + 1, n + 2])
const c = A.array.map<number, number>([1, 2], n => n + 1)
// Either
const f = E.ap<number, number>(E.right(3))(E.right(d => d + 2))
const m = E.chain<number, number, number>(a => E.right(a + 1))(E.right(2))
const n = E.map<number, number>(a => a + 1)(E.right(2))
// Option
// applies first argument of the first invocation to the as argument of the function inside container in the second invocation
const g = O.ap<number>(O.some(3))(O.some(d => d + 2))

// applies value(inside container) in the second invocation to the first function as argument without container and
// fn should return a value inside container
const h = O.chain<number, number>(a => O.some(a + 1))(O.some(2))

// applies value(inside container) in the second invocation to the first function as argument without container and
// fn should return a value without container
const o = O.map<number, number>(a => a + 1)(O.some(2))

// if the first none - returns none, if first is some - returns second
const l = O.apFirst<number>(O.none)<number>(O.some(3))

// apply argument of the second invocation as the argument of the function at first evocation, if result after
// first function invocation return none then result will be none, if some then argument form the last invocation will be returned
const p = O.chainFirst<number, number>(a => (a % 2 !== 0 ? O.some(a) : O.none))(O.some(2))
// same as flatten
const s = O.compact(O.some(O.some(O.some(1))))
const t = O.flatten(O.some(O.some(O.some(1))))
// compare elems at second invocation - result boolean
const u = O.elem(Eq.eqBoolean)(true, O.none)
// put container to the another container
const v = O.duplicate(O.some(1))

// ========================

type TStringField = string | null
type TNumField = number | null

interface IUser {
  fistName: TStringField
  lastName: TStringField
  email: TStringField
  phone: TNumField
  age: TNumField
  isAdmin: boolean
}

type TUsers = IUser[] | undefined

const USERS: TUsers = [
  {
    fistName: 'Max',
    lastName: 'Frolov',
    email: 'max.frolov@mail.com',
    phone: 434344,
    age: 28,
    isAdmin: false
  },
  {
    fistName: 'Vadym',
    lastName: 'Lubivyi',
    email: null,
    phone: 43434,
    age: 22,
    isAdmin: true
  }
]

const getUsers = (v: boolean): TUsers => {
  if (v) {
    return USERS
  }
}

const data: E.Either<string, IUser[]> = pipe(
  getUsers(true),
  E.fromNullable('Doesnt Exist'),
  E.map(us => A.filter<IUser>(i => Boolean(i.isAdmin))(us))
)

console.log('data', data)

// ==============

type TName = string | null | undefined

const names: TName[] = ['Esther Pierce', 'Charis Star', null, 'Tobias Big', undefined]

const getFirstNameWithDefault = (name: TName) =>
  pipe(
    O.fromNullable(name),
    O.chain(name => A.head(name.split(' '))),
    O.alt(() => O.some('No name'))
  )

const result = pipe(
  A.array.traverse(O.option)(names, getFirstNameWithDefault),
  O.getOrElse(() => ['hello', 'world'])
)

console.log('result', result)

const filterByForked = (repos: Repos[], isForked: boolean) =>
  pipe(
    repos,
    A.filterMap(a => (isForked === a.fork ? O.some(a) : O.none))
  )

const handleGetRepositories = async () => {
  const reposOrError = await getUserRepositories<Repos[]>('venumteam')()

  if (E.isLeft(reposOrError)) {
    console.log(`Error: ${reposOrError.left.message}`)

    return
  }

  console.log(reposOrError.right)
  console.log(filterByForked(reposOrError.right, true))
}

// === reader

interface AddValues {
  values: {
    pos: string
    neg: string
  }
  compValue: number
}

const values: AddValues = {
  values: {
    pos: 'positive',
    neg: 'negative'
  },
  compValue: 2
}

const comp = (b: boolean): R.Reader<AddValues, string> => deps => (b ? deps.values.pos : deps.values.neg)

const read = (n: number): R.Reader<AddValues, string> =>
  pipe(
    R.ask<AddValues>(),
    R.chain(deps => comp(n > deps.compValue))
  )

const len = (s: number): R.Reader<AddValues, string> => read(s + 1)

console.log(len(3)(values)) // 'positive'
console.log(len(5)({ ...values, compValue: 6 })) // 'negative'

// F.of(x).map(f) === F.of(f).ap(F.of(x)) law

const respectLaw =
  pipe(
    A.of(5),
    A.map(v => v + 3)
  ) ===
  pipe(
    A.of((v: number) => v + 3),
    A.ap(A.of(5))
  )

const tryOAp = O.option.ap(
  O.some((n: number) => n + 1),
  O.some(4)
) // { _tag: 'Some', value: 5 }
const tryOMap = O.option.map(O.some(4), (n: number) => n + 1) // { _tag: 'Some', value: 5 }
const tryOChain = O.option.chain(O.some(4), (n: number) => O.some(n + 1)) // { _tag: 'Some', value: 5 }
const tryOTraverse = pipe(
  O.option.traverse(E.either)(O.some(4), (n: number) => E.right(n + 1)), // { _tag: 'Right', right: { _tag: 'Some', value: 5 } }
  O.fromEither,
  O.compact
) // { _tag: 'Some', value: 5 }
export const tryOSe = O.option.sequence(E.either)(O.some(E.right(5))) // { _tag: 'Right', right: { _tag: 'Some', value: 5 } }
export const tryESe = E.either.sequence(O.option)(E.right(O.some(5))) // { _tag: 'Some', value: { _tag: 'Right', right: 5 } }

// === types

export interface Owner {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
}

export interface License {
  key: string
  name: string
  spdx_id: string
  url: string
  node_id: string
}

export interface Repos {
  id: number
  node_id: string
  name: string
  full_name: string
  private: boolean
  owner: Owner
  html_url: string
  description: string
  fork: boolean
  url: string
  forks_url: string
  keys_url: string
  collaborators_url: string
  teams_url: string
  hooks_url: string
  issue_events_url: string
  events_url: string
  assignees_url: string
  branches_url: string
  tags_url: string
  blobs_url: string
  git_tags_url: string
  git_refs_url: string
  trees_url: string
  statuses_url: string
  languages_url: string
  stargazers_url: string
  contributors_url: string
  subscribers_url: string
  subscription_url: string
  commits_url: string
  git_commits_url: string
  comments_url: string
  issue_comment_url: string
  contents_url: string
  compare_url: string
  merges_url: string
  archive_url: string
  downloads_url: string
  issues_url: string
  pulls_url: string
  milestones_url: string
  notifications_url: string
  labels_url: string
  releases_url: string
  deployments_url: string
  created_at: Date
  updated_at: Date
  pushed_at: Date
  git_url: string
  ssh_url: string
  clone_url: string
  svn_url: string
  homepage: string
  size: number
  stargazers_count: number
  watchers_count: number
  language: string
  has_issues: boolean
  has_projects: boolean
  has_downloads: boolean
  has_wiki: boolean
  has_pages: boolean
  forks_count: number
  mirror_url?: any
  archived: boolean
  disabled: boolean
  open_issues_count: number
  license: License
  forks: number
  open_issues: number
  watchers: number
  default_branch: string
}
