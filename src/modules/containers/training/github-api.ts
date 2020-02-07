import { pipe } from 'fp-ts/lib/pipeable'
import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import * as t from 'io-ts'

// get Repos

export const getUserRepositories = <R>(userName: string): TE.TaskEither<Error, R> =>
  pipe(
    TE.tryCatch(() => fetch(`https://api.github.com/users/${userName}/repos`), E.toError),
    TE.chain(v => TE.tryCatch(() => v.json(), E.toError))
  )

// create Users

const tCreateUser = t.type({
  firstName: t.string,
  lastName: t.string,
  email: t.string,
  age: t.number
})

const tCreateUsers = t.array(tCreateUser)

export const handleCreateUsers = (users: t.TypeOf<typeof tCreateUsers>) =>
  pipe(
    TE.fromEither(tCreateUsers.decode(users)),
    TE.mapLeft(() => E.toError(new Error('Invalid arguments'))),
    TE.chain(v =>
      TE.tryCatch(
        () =>
          fetch(`https://api.github.com/create-users`, {
            method: 'POST',
            body: JSON.stringify(v),
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            }
          }),
        E.toError
      )
    )
  )

// update Users

const tUpdateUsers = t.array(
  t.intersection([
    tCreateUser,
    t.type({
      id: t.number
    })
  ])
)

export const handleUpdateUsers = (users: t.TypeOf<typeof tUpdateUsers>) =>
  pipe(
    TE.fromEither(tUpdateUsers.decode(users)),
    TE.mapLeft(() => E.toError(new Error('Invalid arguments'))),
    TE.chain(v =>
      TE.tryCatch(
        () =>
          fetch(`https://api.github.com/update-users`, {
            method: 'PUT',
            body: JSON.stringify(v),
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            }
          }),
        E.toError
      )
    )
  )

// delete User

const tDeleteUsers = t.type({
  id: t.number
})

export const handleDeleteUser = (id: t.TypeOf<typeof tDeleteUsers>) =>
  pipe(
    TE.fromEither(tDeleteUsers.decode(id)),
    TE.mapLeft(() => E.toError(new Error('Invalid argument'))),
    TE.chain(v =>
      TE.tryCatch(
        () =>
          fetch(`https://api.github.com/delete-users/`, {
            method: 'PUT',
            body: JSON.stringify({ id }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            }
          }),
        E.toError
      )
    )
  )
