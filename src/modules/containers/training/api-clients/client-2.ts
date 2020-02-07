import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/pipeable'
import { Option } from 'fp-ts/lib/Option'
import { flow } from 'fp-ts/lib/function'

type TBaseRequestOptions = Partial<Omit<RequestInit, 'method'>>

interface Decoder<T> {
  (x: any): Option<T>
}

type TClient = {
  get: <TResponse>(
    dec: Decoder<TResponse>
  ) => (path: string, options?: TBaseRequestOptions) => TE.TaskEither<ClientError, TResponse>
  post: <TResponse>(
    dec: Decoder<TResponse>
  ) => (path: string, options?: TBaseRequestOptions) => TE.TaskEither<ClientError, TResponse>
}

type ClientError = 'Network Error' | 'Json decoding failed' | 'Response decoding failed'

const clientError = (error: ClientError) => () => error


const createApiClient = (clientConfiguration: { uri: string }): TClient => {
  const createRequestHandler = (baseOptions: TBaseRequestOptions & { method: string }) => {
    return <TResponse>(dec: Decoder<TResponse>) => (
      path: string,
      requestOptions: TBaseRequestOptions = {}
    ): TE.TaskEither<ClientError, TResponse> =>
      pipe(
        TE.tryCatch(
          () =>
            fetch(`${clientConfiguration.uri}${path}`, {
              ...baseOptions,
              ...requestOptions,
              method: baseOptions.method
            }),
          clientError('Network Error')
        ),
        TE.chain(res => TE.tryCatch(() => res.json(), clientError('Json decoding failed'))),
        TE.chain(flow(dec, TE.fromOption(clientError('Response decoding failed'))))
      )
  }

  return {
    get: createRequestHandler({ method: 'GET' }),
    post: createRequestHandler({ method: 'POST' })
  }
}
const apiClient = createApiClient({ uri: 'https://pokeapi.co/api/v2' })
