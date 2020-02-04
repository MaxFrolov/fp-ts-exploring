import * as React from 'react'
// views
import { ModuleContainer, Title } from '@md-views'
// components
import { CodeBlock } from '@md-components/code-block'

const usageTx = `
import * as IOE from './ioe'
import { pipe } from 'fp-ts/lib/pipeable'
import { Either } from 'fp-ts/lib/Either'

type Program<A> = IOE.IOE<string, A>

const division = (a: number, b: number): Program<number> =>
  b === 0 ? IOE.raise('cannot divide by 0') : IOE.pure(a / b)

const sum = (a: number, b: number): Program<number> => IOE.asyncTotal(() => Promise.resolve(a + b))

const program = (a: number, b: number) =>
  pipe(
    sum(a, b),
    IOE.chain(s => division(s, b)),
    IOE.chain(s => sum(s, a))
  )

const result: () => Promise<Either<string, number>> = IOE.run(program(10, 20))

`

const UsageContainer = () => (
  <ModuleContainer>
    <Title>Usage examples</Title>
    <CodeBlock label='program' codeTx={usageTx} />
  </ModuleContainer>
)

export { UsageContainer }
