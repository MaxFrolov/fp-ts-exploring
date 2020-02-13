import * as t from 'io-ts'
import { pipe } from 'fp-ts/lib/pipeable'
import { Do } from 'fp-ts-contrib/lib/Do'
import * as E from 'fp-ts/lib/Either'
import { effect as Ef, exit as Ex } from '@matechs/effect'

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

const createUserEF = <T extends IValues>(values: T) =>
  pipe(tValues, inputValues =>
    Do(Ef.effect).bind(
      'validatedV',
      pipe(
        inputValues.decode(values),
        Ef.fromEither,
        Ef.mapError(() => 'Arguments are invalid')
      )
    )
  )
    .bindL('validatedVS', ({ validatedV }) => Ef.fromEither(E.stringifyJSON(validatedV, E.toError)))
    .bindL('req', ({ validatedVS }) =>
      pipe(
        () =>
          fetch(`https://api.github.com/create-users`, {
            method: 'POST',
            body: validatedVS,
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            }
          }),
        Ef.fromPromiseMap(e => E.toError(e))
      )
    )
    .bindL('res', ({ req }) =>
      pipe<() => Promise<IResponse>, Ef.Effect<unknown, Error, IResponse>>(
        () => req.json(),
        Ef.fromPromiseMap(e => E.toError(e))
      )
    )
    .return(s => s.res)

// run create user

const handleCreateUser = async () => {
  const vef = createUserEF<IValues>({
    firstName: 'Max',
    lastName: 'Frolov',
    phone: 43434,
    job: 'dev'
  })

  const result = await Ef.runToPromiseExit(vef)

  Ex.fold<Error | string, IResponse, any>(
    a => console.log(a),
    e => console.error('error:', e),
    e => console.error('abort', e),
    () => console.error('interrupt')
  )(result)

  Ef.run(vef, Ex.fold<Error | string, IResponse, any>(
    a => console.log(a),
    e => console.error('error:', e),
    e => console.error('abort', e),
    () => console.error('interrupt')
  ))
}
