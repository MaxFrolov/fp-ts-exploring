import { Kind2, URIS2 } from 'fp-ts/lib/HKT'
import { MonadThrow2 } from 'fp-ts/lib/MonadThrow'
import { pipe, pipeable } from 'fp-ts/lib/pipeable'
import { URI as uriEither, either, left, right } from 'fp-ts/lib/Either'

const ProgramExample = () => {
  interface Calc<F extends URIS2> {
    sum: (a: number, b: number) => Kind2<F, Error, number>
    div: (a: number, b: number) => Kind2<F, Error, number>
  }

  type Program<F extends URIS2> = MonadThrow2<F> & Calc<F>

  const program = <F extends URIS2>(F: Program<F>, P = pipeable(F)) =>
    pipe(
      F.sum(10, 10),
      P.chain(tw => F.div(tw, 0))
    )

  const calcEither: Program<uriEither> = {
    ...either,
    div: (a, b) => (b === 0 ? left(new Error('div by zero')) : right(a / b)),
    sum: (a, b) => right(a + b)
  }

  const main = program(calcEither)

  return {}
}

export { ProgramExample }
