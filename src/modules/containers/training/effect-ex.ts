import * as t from 'io-ts'
import { pipe } from 'fp-ts/lib/pipeable'
import { Do } from 'fp-ts-contrib/lib/Do'
import * as E from 'fp-ts/lib/Either'
import { exit as Ex } from '@matechs/effect'
import * as M from '@matechs/effect/lib/managed'
import * as Ef from '@matechs/effect/lib/effect'
import * as F from '@matechs/effect/lib/freeEnv'
import * as A from 'fp-ts/lib/Apply'

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

const reqConfigURI = Symbol()

interface ReqConfig extends F.ModuleShape<ReqConfig> {
  [reqConfigURI]: {
    headers: Ef.UIO<{ [key: string]: string }>
    method: Ef.UIO<string>
  }
}

const ReqConfigSpec = F.define<ReqConfig>({
  [reqConfigURI]: {
    headers: F.cn<Ef.UIO<{ [key: string]: string }>>(),
    method: F.cn<Ef.UIO<string>>()
  }
})

const ReqConfigImpl = F.implement(ReqConfigSpec)({
  [reqConfigURI]: {
    headers: Ef.pure({
      'Content-type': 'application/json; charset=UTF-8'
    }),
    method: Ef.pure('POST')
  }
})

const configSpec = F.access(ReqConfigSpec)[reqConfigURI]

const createUserEF = <T extends IValues>(values: T) =>
  pipe(tValues, inputValues =>
    Do(Ef.effect)
      .bind(
        'validatedV',
        pipe(
          inputValues.decode(values),
          Ef.fromEither,
          Ef.mapError(() => 'Arguments are invalid')
        )
      )
      .bindL('validatedVS', ({ validatedV }) => Ef.fromEither(E.stringifyJSON(validatedV, E.toError)))
      .bindL('req', ({ validatedVS }) =>
        pipe(
          A.sequenceT(Ef.effect)(configSpec.headers, configSpec.method),
          Ef.chain(([headers, method]) =>
            pipe(
              () =>
                fetch(`https://api.github.com/create-users`, {
                  method: method,
                  body: validatedVS,
                  headers: headers
                }),
              Ef.fromPromiseMap(e => E.toError(e))
            )
          ),
          ReqConfigImpl
        )
      )
      .bindL('res', ({ req }) =>
        pipe<() => Promise<IResponse>, Ef.Effect<unknown, Error, IResponse>>(
          () => req.json(),
          Ef.fromPromiseMap(e => E.toError(e))
        )
      )
      .return(s => s.res)
  )

// const createUserMG = <T extends IValues>(values: T) =>
//   pipe(tValues, inputValues =>
//     Do(M.managed).bind(
//       'validatedV',
//       pipe(
//         inputValues.decode(values),
//         Ef.fromEither,
//         Ef.mapError(() => 'Arguments are invalid'),
//         M.encaseEffect
//       )
//     )
//   )
//     .bindL('validatedVS', ({ validatedV }) =>
//       pipe(Ef.fromEither(E.stringifyJSON(validatedV, E.toError)), M.encaseEffect)
//     )
//     .bindL('req', ({ validatedVS }) =>
//       pipe(
//         () =>
//           fetch(`https://api.github.com/create-users`, {
//             method: 'POST',
//             body: validatedVS,
//             headers: {
//               'Content-type': 'application/json; charset=UTF-8'
//             }
//           }),
//         Ef.fromPromiseMap(e => E.toError(e))
//       )
//     )
//     .bindL('res', ({ req }) =>
//       pipe<() => Promise<IResponse>, Ef.Effect<unknown, Error, IResponse>>(
//         () => req.json(),
//         Ef.fromPromiseMap(e => E.toError(e))
//       )
//     )
//     .return(s => s.res)

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

  Ef.run(
    vef,
    Ex.fold<Error | string, IResponse, any>(
      a => console.log(a),
      e => console.error('error:', e),
      e => console.error('abort', e),
      () => console.error('interrupt')
    )
  )
}

// fluent

export const fl = async () => {
  const resource = M.encaseEffect(Ef.pure(1))

  const result = M.use(resource, n => Ef.pure(n + 1))

  Ef.run(result, ex => {
    if (Ex.isDone(ex)) {
      console.log(ex.value)
    }
  })

  // accessM

  const config = {
    test: 1
  }

  const resourceE = M.encaseEffect(Ef.accessM(({ test }: typeof config) => Ef.pure(test)))

  const resultEA = Ef.provideAll(config)(
    M.use(resourceE, n => Ef.accessM(({ test }: typeof config) => Ef.pure(n + test)))
  )

  Ef.run(resultEA, ex => {
    if (Ex.isDone(ex)) {
      console.log(ex.value)
    }
  })

  // bracket

  const resourceBr = M.bracket(Ef.pure(1), () =>
    Ef.sync(() => {
      // call back on release !!!
    })
  )

  const resultBr = M.use(resourceBr, n => Ef.pure(n + 1))

  Ef.run(resultBr, ex => {
    if (Ex.isDone(ex)) {
      console.log(ex.value)
    }
  })

  // suspend

  const resourceSu = M.suspend(Ef.suspended(() => Ef.pure(resourceBr)))

  const resultSu = await Ef.runToPromise(M.use(resourceSu, n => Ef.pure(n + 1))) // 2

  // chain

  const resourceCh = M.pure(1)
  const chain = M.chain((n: number) => M.pure(n + 1))

  const resultCh = await Ef.runToPromise(M.use(chain(resourceCh), n => Ef.pure(n + 1)))

  // map

  const resourceMa = M.pure(1)
  const mapped = M.managed.map(resourceMa, n => n + 1)
  const mappedD = M.map<number, number>(n => n + 1)(resourceMa)

  const resultMa = await Ef.runToPromise(M.use(mapped, n => Ef.pure(n + 1)))

  // zip

  const ma = M.pure(1)
  const mb = M.pure(1)
  const zip = M.zip(ma, mb)

  const resultZi = await Ef.runToPromise(M.use(zip, ([n, m]) => Ef.pure(n + m)))

  // ap

  const apma = M.pure(1)
  const mfab = M.pure((n: number) => n + 1)
  const ap = M.ap(apma, mfab)

  const resultAp = await Ef.runToPromise(M.use(ap, n => Ef.pure(n + 1)))

  // as

  const maas = M.pure(1)
  const resultAs = await Ef.runToPromise(M.use(M.as(maas, 2), n => Ef.pure(n + 1))) // 3

  // to
  // applies to(value) without value from the next call (effect)
  const mato = M.pure(1)
  const resultTp = await Ef.runToPromise(M.use(M.to(2)(mato), n => Ef.pure(n + 1))) // 3

  // chainTap performing initialization in the sec function | chainTapWith curried
  const maT = M.pure(1)
  const mm = M.encaseEffect(Ef.sync(() => ({} as unknown)))
  const mbT = M.chainTap(maT, _ => mm)

  const resultT = await Ef.runToPromise(M.use(mbT, n => Ef.pure(n + 1))) // 2

  // allocate
  const program = Do(Ef.effect)
    .bindL('resource', () =>
      M.allocate(
        M.bracket(Ef.pure(1), () =>
          Ef.sync(() => {
            // release cb
          })
        )
      )
    )
    .bindL('result', ({ resource }) => Ef.pure(resource.a + 1))
    .doL(({ resource }) => resource.release)
    .return(({ result }) => result)

  const resultAl = await Ef.runToPromise(program) // 2

  // consume
  const resourceC = M.pure(1)
  const mappedC = M.consume((n: number) => Ef.pure(n + 1))

  const resultC = await Ef.runToPromise(Ef.effect.chain(mappedC(resourceC), n => Ef.pure(n + 1))) // 3

  // provideTo

  const resultE = Ef.provideAll(config)(
    M.use(M.encaseEffect(Ef.accessM(({ test }: typeof config) => Ef.pure(test))), n =>
      Ef.accessM(({ test }: typeof config) => Ef.pure(n + test))
    )
  )

  const resultPrT = await Ef.runToPromise(
    M.provideTo(
      M.pure({ n: 1 }),
      Ef.access(({ n }: { n: number }) => n + 1)
    )
  )
}

// suspend, allocate
