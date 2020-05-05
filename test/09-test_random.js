import test from "ava"
import loadGrammar from "../src/util/load_grammar.js"
import compileAndRun from "../src/compiler.js"

let grammar = loadGrammar()
let dummyPrint = () => { throw ("shouldn't call this") }

test("fn can be part of a variable name", t => {
  let result = compileAndRun(grammar, "let myfn = 1 let fn1 = 2 myfn+fn1", dummyPrint)
  t.is(3, result)
})

test("let can be part of a variable name", t => {
  let result = compileAndRun(grammar, "let toLet = 1 let letter = 2 toLet+letter", dummyPrint)
  t.is(3, result)
})

test("can pass expressions to functions", t => {
  const code = `
  let f = fn(a) { a*3}
  f(5*6+7)
  `
  let result = compileAndRun(grammar, code, dummyPrint)
  t.is(3 * (5 * 6 + 7), result)
})

test("all statements in a block are executed", t => {
  const code = `
    let a = 2
    let b = 3
    if (1) {
      a = a + 5
      b = b + 7
    }
    a*b

    `
  let result = compileAndRun(grammar, code, dummyPrint)
  t.is(70, result)

})

test("if only evaluates the correct block 1", t => {
  const code = `
  let a = 2
  let b = 3
  if (1) { a = 5 } else { b = 7 }
  a*b`

  let result = compileAndRun(grammar, code, dummyPrint)
  t.is(15, result)
})

test("if only evaluates the correct block 2", t => {
  const code = `
  let a = 2
  let b = 3
  if (0) { a = 5 } else { b = 7 }
  a*b`

  let result = compileAndRun(grammar, code, dummyPrint)
  t.is(14, result)
})

test("Error raised if function decl has two formals with same name", t => {
  const code = `
    let f = fn(a, b, a) { 99 }
    f(1,2,3)
    `

  t.throws(() => compileAndRun(grammar, code, dummyPrint))
})

const Scary = `
let a = 1
let fn2
let fn1 = fn(b) {
  let a = 2+b
  fn2 = fn (c) {
    a = a + c
  }
  fn () {
    a
  }
}

let f = fn1(3)
`

test("closure scope 1", t => {
  const code = Scary + "f()"
  let result = compileAndRun(grammar, code, dummyPrint)
  t.is(5, result)
})

test("closure scope 2", t => {
  const code = Scary + "fn2(7)"
  let result = compileAndRun(grammar, code, dummyPrint)
  t.is(12, result)
})

test("closure scope 3", t => {
  const code = Scary + "fn2(7) a"
  let result = compileAndRun(grammar, code, dummyPrint)
  t.is(1, result)
})