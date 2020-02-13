import { Kind, URIS } from 'fp-ts/lib/HKT'
import { Alt1 } from 'fp-ts/lib/Alt'
import * as t from 'io-ts'
import { pipe, pipeable } from 'fp-ts/lib/pipeable'
import * as R from 'fp-ts/lib/Record'
import * as O from 'fp-ts/lib/Option'

interface UserChecking<F extends URIS> {
  check: <A extends TVE>(us: A, conf: TConfig<A>) => Kind<F, A>
}

type UserCheckProgram<F extends URIS> = UserChecking<F> & Alt1<F>
type TV = 'number' | 'string' | 'boolean'
type TVE = { [key: string]: string | number | boolean }
type TConfig<A> = { [P in keyof A]: TV }

const createType: <A>(conf: { [P in keyof A]: TV }) => t.Props = conf =>
  pipe(
    conf,
    R.map<TV, t.StringC | t.NumberC | t.BooleanC>(v => t[v])
  )

const checkUser: UserCheckProgram<O.URI> = {
  ...O.option,
  check: (us, conf) => pipe(
    O.fromEither(
      pipe(
        t.type(createType(conf)),
        v => v.decode(v)
      )
    ),
    O.map(_ => us)
  )
}

const P = pipeable(checkUser)

const program: <A extends TVE>(u: A, conf: TConfig<A>, def: A) => O.Option<A> = (u, conf, def) =>
  pipe(
    checkUser.check(u, conf),
    P.alt(() => O.some(def))
  )

export { program as userCheck }
