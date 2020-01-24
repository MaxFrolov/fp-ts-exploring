import * as React from 'react'
// libs
import styled from 'styled-components'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
// components
import SyntaxHighlighter from 'react-syntax-highlighter'

const Subtitle = styled.h4`
  color: #8896b9;
`
const ContentBlock = styled.div`
  padding: 0;
  border: 1px solid #525869;
`

interface IIncomingProps {
  codeTx: string
  label: string
}

const CodeBlock: React.FC<IIncomingProps> = ({ codeTx, label }) => (
  <>
    <Subtitle>{label}</Subtitle>
    <ContentBlock>
      <SyntaxHighlighter language='typescript' style={dracula}>
        {codeTx}
      </SyntaxHighlighter>
    </ContentBlock>
  </>
)

export { CodeBlock }
