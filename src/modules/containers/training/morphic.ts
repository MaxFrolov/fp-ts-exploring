import { AsOpaque, summon, tagged } from '@morphic-ts/batteries/lib/summoner-no-union'
import { AType, EType } from '@morphic-ts/batteries/lib/usage/utils'
import { iotsConfig } from '@morphic-ts/io-ts-interpreters/lib'
import { withMessage } from 'io-ts-types/lib/withMessage'
import { Type } from 'io-ts'
import * as E from 'fp-ts/lib/Either'
import {} from '@morphic-ts/io-ts-interpreters/lib/model/primitives'

import * as N from 'newtype-ts'
import * as I from 'io-ts'

export interface UserId extends N.Newtype<{ readonly UserId: unique symbol }, string> {}
export interface UserName extends N.Newtype<{ readonly UserName: unique symbol }, string> {}
export interface UserAge extends N.Newtype<{ readonly UserAge: unique symbol }, number> {}

export const isoUserId = N.iso<UserId>()
export const isoUserName = N.iso<UserName>()
export const isoUserAge = N.iso<UserAge>()

function message(message: string) {
  return <O, I, E>(codec: Type<O, I, E>) => withMessage(codec, () => message)
}

export const UserId = summon(F => F.newtype<UserId>('UserId')(F.string(iotsConfig(message('Invalid AccountId')))))

export const UserName = summon(F => F.newtype<UserName>('UserName')(F.string(iotsConfig(message('Invalid UserName')))))

export const UserAge = summon(F => F.newtype<UserAge>('UserAge')(F.number(iotsConfig(message('Invalid UserAge')))))

export const CreateUserReqVariables = summon(F =>
  F.interface(
    {
      userName: UserName(F),
      userAge: UserAge(F),
      userId: UserId(F)
    },
    'CreateUserReqVariablesRequired'
  )
)

export interface CreateUserRequest extends AType<typeof CreateUserReqVariables> {}
export interface CreateUserReqR_ extends EType<typeof CreateUserReqVariables> {}
export const CreateUserRequest = AsOpaque<CreateUserReqR_, CreateUserRequest>(CreateUserReqVariables)

interface CreateUserReqInput {
  userName: string
  userAge: number
  userId: string
}

export function createUserRequest(input: CreateUserReqInput): E.Either<I.Errors, CreateUserRequest> {
  return CreateUserRequest.type.decode(input)
}

// use

const createUserData: CreateUserReqInput = {
  userName: Number('2') as any, // error
  userAge: 32323,
  userId: 'user-id'
}

false && console.log(createUserRequest(createUserData))

// build

const userInp = CreateUserReqVariables.build({
  userAge: UserAge.build(isoUserAge.wrap('d' as any)),
  userId: isoUserId.wrap('some-id'),
  userName: isoUserName.wrap('Max')
})

// jsonSchema

false && console.log(CreateUserReqVariables.jsonSchema)

// encode

false && console.log(CreateUserReqVariables.type.encode(userInp)) // error case { userAge: 'd', userId: 'some-id', userName: 'Max' }
false && console.log(CreateUserReqVariables.strictType.encode(userInp)) // // error case { userAge: 'd', userId: 'some-id', userName: 'Max' }

// show

false && console.log(CreateUserReqVariables.show.show(userInp)) // { userName: <UserName>("Max"), userAge: <UserAge>("d"), userId: <UserId>("some-id") }

// use lense
false && console.log(CreateUserReqVariables.lenseFromPath(['userName']).set(isoUserName.wrap('NAME')))

// encode | decode
false && console.log(I.type({
  hello: I.string
}).encode({ hello: Number('2') as any })) // { hello: 2 }

false && console.log(I.type({
  hello: I.string
}).decode({ hello: Number('2') as any })) // left: [ { value: 2, context: [Array], message: undefined } ]
