// libs
import { Do } from 'fp-ts-contrib/lib/Do'
import * as TE from 'fp-ts/lib/TaskEither'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as Ei from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'
import { pipe } from 'fp-ts/lib/pipeable'

interface ICreatePostVariables {
  title: string
  body: string
  userId: number
}

type Decoder<T> = (u: unknown) => Ei.Either<Error, T>

type ClientContext = {
  headers: Record<string, string>
}

const getPlanetsReq = (page: number = 1): RTE.ReaderTaskEither<ClientContext, Error, Response> =>
  pipe(
    TE.tryCatch(() => fetch(`https://swapi.co/api/planets/${page}/`), Ei.toError),
    RTE.fromTaskEither
  )

const createPostReq = (data: ICreatePostVariables) =>
  pipe(
    RTE.asks((r: ClientContext) => r.headers),
    RTE.chain(headers =>
      RTE.fromTaskEither(
        TE.tryCatch(
          () =>
            fetch(`https://jsonplaceholder.typicode.com/posts`, {
              method: 'POST',
              body: JSON.stringify(data),
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
                ...headers
              }
            }),
          Ei.toError
        )
      )
    )
  )

function deserialize<T>(decoder: Decoder<T>) {
  return (request: RTE.ReaderTaskEither<ClientContext, Error, Response>) =>
    Do(RTE.readerTaskEither)
      .bind('res', request)
      .bindL('json', ({ res }) => RTE.fromTaskEither(TE.tryCatch(() => res.json(), Ei.toError)))
      .bindL('asT', ({ json }) => RTE.fromTaskEither(TE.fromEither(decoder(json))))
      .return(({ asT }) => asT)
}

function client<T>(decoder: Decoder<T>) {
  const deserializer = deserialize(decoder)

  return {
    getPlanets: flow(getPlanetsReq, deserializer),
    createPost: flow(createPostReq, deserializer)
  }
}

const trainingClient = client((u: unknown) => Ei.right((u as any) as { foo: string }))

const resultRTE = trainingClient.createPost({ body: '', userId: 1, title: '' })

resultRTE({ headers: {} })().then(
  Ei.fold(
    error => {
      console.log(error)
    },
    body => {
      console.log(body)
    }
  )
)
