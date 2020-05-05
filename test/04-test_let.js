import test from "ava"
import loadGrammar from "../src/util/load_grammar.js"
import compileAndRun from "../src/compiler.js"

const RegularTests = [
  ["let a", 0],
  ["let a = 123", 123],
  [`let
       a
       =
       1 + 2*3`, 7],
  [
    `
    let a = fn () {
      let b = 99
    }
    a()
    `,
    99
  ],
]

const ExpectErrorTests = [
  `
    let a
    let a
  `,
  `
    let a = 1
    let a
   `,
   `
    let a = fn () {
      let b = 1
      let b
     }
    a()
    `
]



let grammar = loadGrammar()
let dummyPrint = () => { throw ("shouldn't call this") }

RegularTests.forEach(([code, expected]) => {
  test(code, t => {
    let result = compileAndRun(grammar, code, dummyPrint)
    t.is(result, expected, "given: " + code)
  })
})

ExpectErrorTests.forEach((code) => {
  test(code, t => {
    t.throws(() => compileAndRun(grammar, code, dummyPrint))
  })
})