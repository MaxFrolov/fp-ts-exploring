import { pipe } from 'fp-ts/lib/pipeable'
import * as t from 'io-ts'
import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import * as O from 'fp-ts/lib/Option'
import * as A from 'fp-ts/lib/Array'
import * as R from 'fp-ts/lib/Record'
import { Do } from 'fp-ts-contrib/lib/Do'

const tValues = t.type({
  firstName: t.string,
  lastName: t.string,
  phone: t.number,
  job: t.string
})

type IValues = t.TypeOf<typeof tValues>

const tResponse = t.type({
  ok: t.boolean,
  data: t.type({
    id: t.number
  })
})

type IResponse = t.TypeOf<typeof tResponse>

const createUser = <T extends IValues>(values: T) =>
  pipe(tValues, inputValues =>
    Do(TE.taskEither)
      .bind(
        'validatedV',
        pipe(
          inputValues.decode(values),
          TE.fromEither,
          TE.mapLeft(() => E.toError('Arguments are invalid'))
        )
      )
      .bindL('validatedVS', ({ validatedV }) => TE.fromEither(E.stringifyJSON(validatedV, E.toError)))
      .bindL('req', ({ validatedVS }) =>
        TE.tryCatch(
          () =>
            fetch(`https://api.github.com/create-users`, {
              method: 'POST',
              body: validatedVS,
              headers: {
                'Content-type': 'application/json; charset=UTF-8'
              }
            }),
          E.toError
        )
      )
      .bindL('res', ({ req }) => TE.tryCatch<Error, IResponse>(() => req.json(), E.toError))
      .return(s => s.res)
  )

const tUpdateValues = t.intersection([
  t.type({
    firstName: t.string,
    lastName: t.string,
    paymentTypes: t.string,
    name: t.string,
    email: t.string,
    beneficiaryAddress: t.string,
    beneficiaryCountry: t.string,
    beneficiaryEntityType: t.string,
    beneficiaryFirstName: t.string,
    beneficiaryLastName: t.string,
    beneficiaryCity: t.string,
    beneficiaryPostcode: t.string,
    beneficiaryIdentificationType: t.string,
    beneficiaryIdentificationValue: t.string,
    bankCountry: t.string,
    bankAccountType: t.string,
    currency: t.string
  }),
  t.partial({
    'routingCodeValue1/sortCode': t.string,
    'routingCodeValue2/sortCode': t.string
  })
])

type TUpdateValues = t.TypeOf<typeof tUpdateValues>

const MOCK_BENEFICIARY_DATA: TUpdateValues = {
  firstName: 'Max',
  lastName: 'Frolov',
  paymentTypes: 'regular',
  name: 'Max Frolov',
  email: 'maxFrolov@gmail.com',
  beneficiaryAddress: 'Meent 81, 3011 JG, Rotterdam',
  beneficiaryCountry: 'Netherlands',
  beneficiaryEntityType: 'individual',
  beneficiaryFirstName: 'Max',
  beneficiaryLastName: 'Frolov',
  beneficiaryCity: 'Rotterdam',
  beneficiaryPostcode: '3011 JG',
  beneficiaryIdentificationType: 'passport',
  beneficiaryIdentificationValue: 'MB 4344 3322',
  'routingCodeValue1/sortCode': '434343434',
  bankCountry: 'UK',
  bankAccountType: 'savings',
  currency: 'EUR'
}

type TRCKeys = 'routingCodeValue2/sortCode' | 'routingCodeValue1/sortCode'

type TAKeys = 'bankAddress' | 'beneficiaryAddress'

const getRCValue = (rcKey: TRCKeys, valueV: TUpdateValues): string | null =>
  pipe(R.lookup<string>(rcKey, valueV), O.toNullable)

const gerRCType = (rcKey: TRCKeys, valueV: TUpdateValues): string | null =>
  pipe(
    R.lookup<string>(rcKey, valueV),
    O.chain(_ => A.last(rcKey.split('/'))),
    O.toNullable
  )

const getAValue = (aKey: TAKeys, valueV: TUpdateValues): string[] =>
  pipe(
    R.lookup<string>(aKey, valueV),
    O.fold(() => [], A.of)
  )

const updateBeneficiary = (values: TUpdateValues) =>
  pipe(tUpdateValues, inputValues =>
    Do(TE.taskEither)
      .bind(
        'valueV',
        pipe(
          inputValues.decode(values),
          TE.fromEither,
          TE.mapLeft(() => E.toError('Arguments are invalid'))
        )
      )
      .bindL('normalizedR', ({ valueV }) =>
        TE.right({
          routingCodeType_2: gerRCType('routingCodeValue2/sortCode', valueV),
          routingCodeValue_2: getRCValue('routingCodeValue2/sortCode', valueV),
          routingCodeType_1: gerRCType('routingCodeValue1/sortCode', valueV),
          routingCodeValue_1: getRCValue('routingCodeValue1/sortCode', valueV)
        })
      )
      .bindL('normalizedV', ({ normalizedR, valueV }) =>
        TE.right({
          ...normalizedR,
          beneficiaryAddress: getAValue('beneficiaryAddress', valueV),
          bankAddress: getAValue('bankAddress', valueV),
          paymentTypes: A.of(valueV.paymentTypes),
          name: valueV.name,
          beneficiaryCity: valueV.beneficiaryCity,
          beneficiaryFirstName: valueV.name,
          beneficiaryLastName: valueV.beneficiaryLastName,
          beneficiaryPostcode: valueV.beneficiaryPostcode,
          beneficiaryIdentificationType: valueV.beneficiaryIdentificationType,
          beneficiaryIdentificationValue: valueV.beneficiaryIdentificationValue
        })
      )
      .bindL('normalizedVS', ({ normalizedV }) => TE.fromEither(E.stringifyJSON(normalizedV, E.toError)))
      .bindL('req', ({ normalizedVS }) =>
        TE.tryCatch(
          () =>
            fetch(`https://api.github.com/create-users`, {
              method: 'POST',
              body: normalizedVS,
              headers: {
                'Content-type': 'application/json; charset=UTF-8'
              }
            }),
          E.toError
        )
      )
      .bindL('res', ({ req }) => TE.tryCatch(() => req.json(), E.toError))
      .return(s => s.res)
  )
