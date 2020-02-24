import { Iso, Lens } from 'monocle-ts/lib'
import * as O from 'fp-ts/lib/Option'
import { effect as T } from '@matechs/effect'
import * as E from 'fp-ts/lib/Either'

interface Brother {
  name: string
  phone: string
  age: number
  job?: null | string
}

interface Data {
  name: string
  phone: string
  age: number
  brother: Brother
}

const data = {
  name: 'Max',
  phone: '0993233424',
  age: 28,
  brother: {
    name: 'Yura',
    phone: '0993232',
    age: 24,
    job: null
  }
}

// modify

const age = Lens
  .fromProp<Data>()('brother')
  .compose(Lens.fromProp<Brother>()('age'))
  .modify(s => s + 1)

const ageFromPath = Lens.fromPath<Data>()(['brother', 'age']).modify(s => s + 1)

// get with fromNullable

const jobN = Lens
  .fromProp<Data>()('brother')
  .compose(Lens.fromNullableProp<Brother>()('job', 'BMW'))
  .get

// set

const jobS = Lens
  .fromProp<Data>()('brother')
  .compose(Lens.fromProp<Brother>()('job'))
  .set('BMW')

// find

const jobF = Lens
  .fromProp<Data>()('brother')
  .compose(Lens.fromProp<Brother>()('job'))
  .asFold()
  .find(i => Boolean(i))(data)

// exist

const jobE = Lens
  .fromProp<Data>()('brother')
  .compose(Lens.fromProp<Brother>()('job'))
  .asFold()
  .exist(i => Boolean(i)) // false or true

// asOptional
const jobO = Lens
  .fromProp<Data>()('brother')
  .compose(Lens.fromProp<Brother>()('job'))
  .asOptional()
  .getOption // { _tag: 'Some', value: null }

// asTraversal

const jobM = Lens
  .fromProp<Data>()('brother')
  .compose(Lens.fromProp<Brother>()('job'))
  .asTraversal()
  .asSetter()
  .set('BMW')
