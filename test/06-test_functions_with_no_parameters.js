import test from "ava"
import loadGrammar from "../src/util/load_grammar.js"
import compileAndRun from "../src/compiler.js"

const tests = [
  [
    `let a = fn () { 99 }
     a()`,
    99
  ],
  [
    `let a=fn (){99}
     a()`,
     99
  ],
  [
    `let a = fn () { 99 }
     let b = fn () { a() + 1 }
     a() + b()`,
     199
  ],
  [
    `let a = fn () { 99 }
     let b = fn(){a()+1}
     a() + b()`,
     199
  ],
  [
    `let a = fn () { fn () { 123 } }
     let b = a()
     b()`,
     123
  ],
  [
    `let a = fn(){fn(){123}}
    let b = a()
    b()`,
    123
  ],
]


let grammar = loadGrammar()
let dummyPrint = () => { throw ("shouldn't call this") }

tests.forEach(([code, expected]) => {
  test(code, t => {
    let result = compileAndRun(grammar, code, dummyPrint)
    t.is(result, expected, "given: " + code)
  })
})
