import test from "ava"
import loadGrammar from "../src/util/load_grammar.js"
import compileAndRun from "../src/compiler.js"

const tests = [
  [
    `let a = 123
     let b = fn () { a + 1 }
     b()`,
     124
  ],
  [
    `let a = 123
     let b = fn () { let a = 1 }
     b()
     a`,
     123
  ],
  [
    `let inc = fn() {
      let c = 0
      fn() {
        c = c+1
      }
    }
    let inc1 = inc()
    let inc2 = inc()
    print(inc1(),inc1(),inc2(),inc1(),inc2())
    `,
    ['1', '2', '1', '3', '2']
  ],
]

let grammar = loadGrammar()
let dummyPrint = (line) => {
}

tests.forEach(([code, expected]) => {
  test(code, t => {
    let result = compileAndRun(grammar, code, dummyPrint)
    t.deepEqual(result, expected, "given: " + code)
  })
})