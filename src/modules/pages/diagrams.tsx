import * as React from 'react'
// libs
import styled from 'styled-components'
// view components
import { MainLayout } from '@md-layouts/main'
// views
import { Title, ModuleContainer } from '@md-views'
// assets
import { ReactComponent as TypeClasses } from '@md-assets/svg/type-classes.svg'
import TypeClassesP from '@md-assets/png/fp-ts.png'

const DiagramContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  background-color: #fff;
  text-align: center;
  padding: 20px 10px;
  box-sizing: border-box;
`

const DiagramImg = styled.img`
  object-fit: contain;
  display: inline-block;
`

const DiagramsPage = () => {
  return (
    <MainLayout>
      <ModuleContainer>
        <Title>Type Classes</Title>
        <DiagramContainer>
          <TypeClasses />
        </DiagramContainer>
      </ModuleContainer>
      <ModuleContainer>
        <Title>Type Classes with Properties</Title>
        <DiagramContainer>
          <DiagramImg src={TypeClassesP} />
        </DiagramContainer>
      </ModuleContainer>
    </MainLayout>
  )
}

export { DiagramsPage }
