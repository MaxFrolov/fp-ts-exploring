import { effect as T, freeEnv as F } from '@matechs/effect'
import { pipe } from 'fp-ts/lib/pipeable'
import { sequenceS } from 'fp-ts/lib/Apply'

// simple
export function CalcSimple() {
  interface Calculator {
    add: (a: number, b: number) => T.UIO<number>
    div: (a: number, b: number) => T.IO<string, number>
  }

  const program = T.accessM((r: Calculator) => r.add(2, 3))

  const main = pipe(
    program,
    T.provideS<Calculator>({
      add: (a, b) => T.pure(a + b),
      div: (a, b) => (b === 0 ? T.raiseError('Can not divide on 0') : T.pure(a / b))
    })
  )

  return T.runSync(main)
}

// with uri
export function CalcWithUri() {
  const calcAURI = Symbol()
  const calcBURI = Symbol()

  interface CalculatorA {
    [calcAURI]: {
      add: (a: number, b: number) => T.UIO<number>
      div: (a: number, b: number) => T.IO<string, number>
    }
  }

  interface CalculatorB {
    [calcBURI]: {
      add: (a: number, b: number) => T.UIO<number>
      div: (a: number, b: number) => T.IO<string, number>
    }
  }

  const program = T.accessM((r: CalculatorA & CalculatorB) => r[calcBURI].add(2, 3))

  const main = pipe(
    program,
    T.provideS<CalculatorA & CalculatorB>({
      [calcAURI]: {
        add: (a, b) => T.pure(a + b),
        div: (a, b) => (b === 0 ? T.raiseError('Can not divide on 0') : T.pure(a / b))
      },
      [calcBURI]: {
        add: (a, b) => T.pure(a + b),
        div: (a, b) => (b === 0 ? T.raiseError('Can not divide on 0') : T.pure(a / b))
      }
    })
  )

  return T.runSync(main)
}

// define
function CalcDefine() {
  const calcAURI = Symbol()
  const calcConfUI = Symbol()

  // interfaces

  interface CalculatorA extends F.ModuleShape<CalculatorA> {
    [calcAURI]: {
      add: (a: number, b: number) => T.UIO<number>
      div: (a: number, b: number) => T.IO<string, number>
    }
  }

  interface CalculatorAConf extends F.ModuleShape<CalculatorAConf> {
    [calcConfUI]: {
      errorMsg: T.UIO<string>
    }
  }

  // specs

  const calculatorASpec = F.define<CalculatorA>({
    [calcAURI]: {
      add: F.fn(),
      div: F.fn()
    }
  })

  const CalculatorAConfSpec = F.define<CalculatorAConf>({
    [calcConfUI]: {
      errorMsg: F.cn<T.UIO<string>>()
    }
  })

  // implementations

  const calcImpl = F.implement(calculatorASpec)({
    [calcAURI]: {
      add: (a, b) => T.pure(a + b),
      div: (a, b) =>
        b === 0
          ? pipe(
              errorMsg,
              T.chain(a => T.raiseError(a))
            )
          : T.pure(a / b)
    }
  })

  const calcConfImpl = F.implement(CalculatorAConfSpec)({
    [calcConfUI]: {
      errorMsg: T.pure('Can not divide on 0')
    }
  })

  // access

  const { div } = F.access(calculatorASpec)[calcAURI]
  const { errorMsg } = F.access(CalculatorAConfSpec)[calcConfUI]

  // runs

  const addV = (a: number, b: number) => T.accessM((r: CalculatorA) => r[calcAURI].add(a, b))
  const sum10 = (n: number) => addV(10, n)

  const provideCalcA = T.provideSW<CalculatorA>()(T.access((r: CalculatorAConf) => r[calcConfUI].errorMsg))(
    errorMessage => ({
      [calcAURI]: {
        add: (a, b) => T.pure(a + b),
        div: (a, b) =>
          b === 0
            ? pipe(
                errorMessage,
                T.chain(s => T.raiseError(s))
              )
            : T.pure(a / b)
      }
    })
  )

  // v1
  const prRun = T.runSync(
    pipe(
      sum10(5),
      T.provide<CalculatorA>({
        [calcAURI]: {
          add: (a, b) => T.pure(a + b),
          div: (a, b) => (b === 0 ? T.raiseError('Can not divide on 0') : T.pure(a / b))
        }
      })
    )
  )

  // v2 run with provider

  const runWithProv = T.runSync(pipe(div(4, 0), provideCalcA, calcConfImpl))

  // v3 run with implement
  const runWithImpl = T.runSync(
    pipe(
      sum10(4),
      F.implement(calculatorASpec)({
        [calcAURI]: {
          add: (a, b) => T.pure(a + b),
          div: (a, b) => (b === 0 ? T.raiseError('Can not divide on 0') : T.pure(a / b))
        }
      })
    )
  )

  // v4 run full implementation
  const runImpl = T.runSync(pipe(div(4, 0), provideCalcA, calcConfImpl))

  // v5 run full implementation raw
  const runImplRaw = T.runSync(
    pipe(
      T.accessM((r: CalculatorA) => r[calcAURI].div(2, 0)),
      F.implement(calculatorASpec)({
        [calcAURI]: {
          add: (a, b) => T.pure(a + b),
          div: (a, b) =>
            b === 0
              ? pipe(
                  errorMsg,
                  T.chain(a => T.raiseError(a))
                )
              : T.pure(a / b)
        }
      }),
      F.implement(CalculatorAConfSpec)({
        [calcConfUI]: {
          errorMsg: T.pure('Can not divide on 0')
        }
      })
    )
  )

  return runImpl
}

const withReqConf = async () => {
  const reqConfigURI = Symbol()

  interface ReqConfig extends F.ModuleShape<ReqConfig> {
    [reqConfigURI]: {
      headers: T.UIO<{ [key: string]: string }>
      method: T.UIO<string>
    }
  }

  const ReqConfigSpec = F.define<ReqConfig>({
    [reqConfigURI]: {
      headers: F.cn<T.UIO<{ [key: string]: string }>>(),
      method: F.cn<T.UIO<string>>()
    }
  })

  const ReqConfigImpl = F.implement(ReqConfigSpec)({
    [reqConfigURI]: {
      headers: T.pure({
        'Content-type': 'application/json; charset=UTF-8'
      }),
      method: T.pure('POST')
    }
  })

  const configSpec = F.access(ReqConfigSpec)[reqConfigURI]

  const getHeaders = await T.runToPromise(
    pipe(
      configSpec.headers,
      T.map(h => ({
        headers: h
      })),
      ReqConfigImpl
    )
  )

  const getMethod = await T.runToPromise(
    pipe(
      configSpec.method,
      T.map(m => ({
        method: m
      })),
      ReqConfigImpl
    )
  )

  const runWithConf = await T.runToPromise(
    pipe(
      sequenceS(T.effect)({
        headers: configSpec.headers,
        method: configSpec.method
      }),
      T.map(e => ({
        method: e.method,
        headers: e.headers
      })),
      ReqConfigImpl
    )
  )

  return runWithConf
}
