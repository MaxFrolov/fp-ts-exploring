import * as React from 'react'
// libs
import styled from 'styled-components'
// view components
import { MainLayout } from '@md-layouts/main'
// views
import { Title } from '@md-views'
// assets
import { ReactComponent as TypeClasses } from '@md-assets/svg/type-classes.svg'
import TypeClassesP1 from '@md-assets/png/fp-ts-1.png'
import TypeClassesP2 from '@md-assets/png/fp-ts-2.png'

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

const ModuleContainer = styled.div`
  padding-top: 20px;
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
        <Title>Type Classes with Properties 1</Title>
        <DiagramContainer>
          <DiagramImg src={TypeClassesP1} />
        </DiagramContainer>
      </ModuleContainer>
      <ModuleContainer>
        <Title>Type Classes with Properties 2</Title>
        <DiagramContainer>
          <DiagramImg src={TypeClassesP2} />
        </DiagramContainer>
      </ModuleContainer>
    </MainLayout>
  )
}

export { DiagramsPage }
