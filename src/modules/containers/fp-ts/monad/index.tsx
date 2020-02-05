import * as React from 'react'
// view components
import { CodeBlock } from '@md-components/code-block'
// views
import { ModuleContainer, Title } from '@md-views'
// libs

export const MonadContainer = () => {
  // common types
  const commonTypesTx = `
  interface Monad<F> extends Applicative<F>, Chain<F> {}
 
  interface Monad1<F extends URIS> extends Applicative1<F>, Chain1<F> {}
 
  interface Monad2<M extends URIS2> extends Applicative2<M>, Chain2<M> {}
  
  interface Monad2C<M extends URIS2, L> extends Applicative2C<M, L>, Chain2C<M, L> {}
  
  interface Monad3<M extends URIS3> extends Applicative3<M>, Chain3<M> {}
  
  interface Monad3C<M extends URIS3, E> extends Applicative3C<M, E>, Chain3C<M, E> {}
  
  interface Monad4<M extends URIS4> extends Applicative4<M>, Chain4<M> {}
  `

  return (
    <ModuleContainer id='monad'>
      <Title>FP-TS (Monad)</Title>
      <CodeBlock label='commonTypes' codeTx={commonTypesTx} />
    </ModuleContainer>
  )
}
