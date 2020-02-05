import * as React from 'react'
// views
import { ModuleContainer, Title } from '@md-views'
// view components
import { CodeBlock } from '@md-components/code-block'
// libs
import styled from 'styled-components'
// import { Do } from 'fp-ts-contrib/lib/Do'
// import * as O from 'fp-ts/lib/Option'
import { initAPIClient } from '@md-containers/program-example'

// type TStringField = string | null
// type TNumField = number | null
//
// interface IUsers {
//   fistName: TStringField
//   lastName: TStringField
//   email: TStringField
//   phone: TNumField
//   age: TNumField
// }
//
// interface IUsersS {
//   fistName: string
//   lastName: string
//   email: string
//   phone: string
//   age: string
// }
//
// type TUsers = IUsers[] | undefined
//
// const USERS: TUsers = [
//   {
//     fistName: 'Max',
//     lastName: 'Frolov',
//     email: 'max.frolov@mail.com',
//     phone: 434344,
//     age: 28
//   },
//   {
//     fistName: 'Vadym',
//     lastName: 'Lubivyi',
//     email: null,
//     phone: 43434,
//     age: 22
//   }
// ]

interface IGetPlanetsResp {
  name: string
  rotation_period: string
}

interface ICreatePostResp {
  id: number,
  title: string,
  body: string,
  userId: number
}

const Button = styled.button`
  padding: 10px 20px;
  font-size: 18px;
  color: #ced7ef;
  font-weight: 500;
  background-color: #2f3454;
  margin: 20px;
  border-color: #8896b9;
  border-radius: 5px;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  
  &:hover {
    background-color: #3b426b;
  }
`

const DoContainer = () => {
  const commonTypesTx = ``

  const client = initAPIClient()

  const handleGetPlanets = async () => {
    try {
      const r = await client.getPlanets<IGetPlanetsResp>(1)
      console.log('Resp:', r)
    } catch (e) {
      console.log(e.message)
    }
  }

  const handleCreatePost = async () => {
    try {
      const r = await client.createPost<ICreatePostResp>({
        title: 'foo',
        body: 'bar',
        userId: 1
      })

      console.log('Resp:', r)
    } catch (e) {
      console.log(e.message)
    }
  }

  return (
    <ModuleContainer id='do'>
      <Title>FP-TS-Contrib (Do)</Title>
      <CodeBlock label='common types' codeTx={commonTypesTx} />
      <Button onClick={handleGetPlanets}>Handle Get Planets</Button>
      <Button onClick={handleCreatePost}>Handle Create Post</Button>
    </ModuleContainer>
  )
}

export { DoContainer }
