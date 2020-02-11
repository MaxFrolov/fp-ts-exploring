// form 1
import * as t from 'io-ts'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import { getSemigroup, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { sequenceT } from 'fp-ts/lib/Apply'

const tMainProfileDetails = t.type({
  mobilePhone: t.string,
  jobTitle: t.string,
  country: t.string,
  isOwner: t.boolean,
})

const tFormProfileDetails = t.intersection([
  tMainProfileDetails,
  t.type({
    age: t.string,
    firstName: t.string,
    lastName: t.string
  })
])

const tReqProfileDetails = t.intersection([
  tMainProfileDetails,
  t.type({
    name: t.string,
    age: t.number
  })
])

type df = t.TypeOf<typeof tReqProfileDetails>

function lift<E, A>(check: (a: A) => E.Either<E, A>): (a: A) => E.Either<NonEmptyArray<E>, A> {
  return a =>
    pipe(
      check(a),
      E.mapLeft(a => [a])
    )
}

const formValidation = () => {
  const required = (s: string): E.Either<string, string> =>
    !s ? E.left('required') : E.right(s)

  const minLength = (s: string): E.Either<string, string> =>
    s.length >= 6 ? E.right(s) : E.left('at least 6 characters')

  const onlyLetters = (s: string): E.Either<string, string> =>
    /[a-zA-Z]+/g.test(s) ? E.right(s) : E.left('only letters allowed')

  const oneCapital = (s: string): E.Either<string, string> =>
    /[A-Z]/g.test(s) ? E.right(s) : E.left('at least one capital letter')

  const oneNumber = (s: string): E.Either<string, string> =>
    /[0-9]/g.test(s) ? E.right(s) : E.left('at least one number')

  const adult = (s: string): E.Either<string, string> =>
    +s >= 18 ? E.right(s) : E.left('you should be at least 18 y.o.')

  const vPhoneNumber = (s: string): E.Either<string, string> =>
    /^[+]?[\s./0-9]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/g.test ? E.right(s) : E.left('invalid phone number')

  const lRequired = lift(required)
  const lMinLength = lift(minLength)
  const lOnlyLetters = lift(onlyLetters)
  const lOneCapital = lift(oneCapital)
  const lOneNumber = lift(oneNumber)
  const lAdult = lift(adult)
  const lVPhoneNumber = lift(vPhoneNumber)

  return {
    required,
    minLength,
    oneCapital,
    oneNumber,
    adult,
    vPhoneNumber,
    lRequired,
    lMinLength,
    lOnlyLetters,
    lOneCapital,
    lOneNumber,
    lAdult,
    lVPhoneNumber
  }
}

const validate = formValidation()
const applicativeValidation = E.getValidation(getSemigroup<string>())

const validateName = (v: string) => pipe(
  sequenceT(applicativeValidation)(
    validate.lMinLength(v),
    validate.lOneCapital(v)
  ),
  E.map(() => v)
)

const validateAge = (v: string) => pipe(
  sequenceT(applicativeValidation)(
    validate.lOneNumber(v),
    validate.lAdult(v)
  ),
  E.map(() => v)
)

const validatePhone = (v: string) => pipe(
  sequenceT(applicativeValidation)(
    validate.lOneNumber(v),
    validate.lVPhoneNumber(v)
  ),
  E.map(() => v)
)

type TFormProfileDetails = t.TypeOf<typeof tFormProfileDetails>
type TReqProfileDetails = t.TypeOf<typeof tReqProfileDetails>

const handleProfileDetails = (formValues: TFormProfileDetails) => {
  const decodedV = tFormProfileDetails.decode(tFormProfileDetails)
  // tReqProfileDetails

  if (E.isLeft(decodedV)) {
    console.log('Form values incorrect', decodedV.left)

    return
  }

  const valuesNormalized: TReqProfileDetails = {
    isOwner: decodedV.right.isOwner,
    country: decodedV.right.country,
    jobTitle: decodedV.right.jobTitle,
    mobilePhone: decodedV.right.mobilePhone,
    age: Number(decodedV.right.age),
    name: `${decodedV.right.firstName} ${decodedV.right.lastName}`,
  }

  const decodedNV = tReqProfileDetails.decode(valuesNormalized)

  if (E.isLeft(decodedNV)) {
    console.log('Form values incorrect', decodedNV.left)

    return
  }

  // move valuesNormalized to the next step
}


