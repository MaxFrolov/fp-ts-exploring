import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import * as Eq from 'fp-ts/lib/Eq'
import { pipe } from 'fp-ts/lib/pipeable'
import { getUserRepositories } from '@md-containers/training/github-api'

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
