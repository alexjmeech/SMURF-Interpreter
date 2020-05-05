import test from "ava"
import loadGrammar from "../src/util/load_grammar.js"
import compileAndRun from "../src/compiler.js"

const RegularTests = [
  ["let a  a+5", 5],
  ["let a = 123  a*a", 123 * 123],
  [`let a = 345
     let b = 654
     let c = a+b
     c+1`, 1000]
]

const ExpectErrorTests = [
  "a = 1",
  "let a = a + 1",
  "let a = b",
  "3 > a",
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
