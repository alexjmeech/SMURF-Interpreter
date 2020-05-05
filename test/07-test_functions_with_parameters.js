import test from "ava"
import loadGrammar from "../src/util/load_grammar.js"
import compileAndRun from "../src/compiler.js"

const tests = [
  [
    `let myfunc = fn (a) { a + 1 }
     myfunc(123)`,
     124
  ],
  [
    `let a = 123
     let myfunc = fn (a) { a = a + 1 }
     myfunc(a)`,
     124
  ],
  [
    `let a = 123
     let myfunc = fn (a) { a = a + 1 }
     myfunc(a)
     a`,
     123
  ],
  [
    `let myfunc = fn (a, b) { a - b }
     myfunc(10, 7)`,
     3
  ],
  [
    `let inc = fn(n) { n+1 }
     let apply = fn (func, value) { func(value) }
     apply(inc, 99)`,
     100
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