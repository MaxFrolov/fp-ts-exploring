// libs
import { Do } from 'fp-ts-contrib/lib/Do'
import { pipe } from 'fp-ts/lib/pipeable'
import * as TE from 'fp-ts/lib/TaskEither'
import * as Ei from 'fp-ts/lib/Either'

interface ICreatePostVariables {
  title: string
  body: string
  userId: number
}

interface IApiClient {
  createPost<T>(variables: ICreatePostVariables): Promise<T>
  getPlanets<T>(page?: number): Promise<T>
}

export const initAPIClient = (): IApiClient => {
  // helpers
  const TCReq: <T>(p: Promise<T>, er?: unknown) => TE.TaskEither<Error, T> = (t, er = 'Network error') =>
    TE.tryCatch(
      () => t,
      () => Ei.toError(er)
    )

  async function makeTask<E, T>(task: TE.TaskEither<E, T>) {
    const result = await task()

    if (Ei.isLeft(result)) {
      throw new Error(JSON.stringify(result.left))
    }

    return result.right
  }

  function makeRequest<T>(request: Promise<Response>): TE.TaskEither<Error, T> {
    return Do(TE.taskEither)
      .bindL('reqJSON', () => TCReq(request))
      .bindL('reqData', ({ reqJSON }) => TCReq<T>(reqJSON.json()))
      .return(({ reqData }) => reqData)
  }

  function resolveRequest<T>(request: Promise<Response>) {
    return pipe(request, v => makeRequest<T>(v), makeTask)
  }

  // req
  const getPlanetsReq = async (page: number = 1): Promise<Response> => fetch(`https://swapi.co/api/planets/${page}/`)
  const createPostReq = async (data: ICreatePostVariables): Promise<Response> =>
    fetch(`https://jsonplaceholder.typicode.com/posts`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })

  // req handlers impl

  function getPlanets<T>(page?: number) {
    return resolveRequest<T>(getPlanetsReq(page))
  }

  function createPost<T>(variables: ICreatePostVariables) {
    return resolveRequest<T>(createPostReq(variables))
  }

  return {
    getPlanets,
    createPost
  }
}
