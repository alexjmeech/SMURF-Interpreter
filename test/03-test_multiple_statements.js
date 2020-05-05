import test from "ava"
import loadGrammar from "../src/util/load_grammar.js"
import compileAndRun from "../src/compiler.js"

const tests = [
  ["1 2 3", 3],
  ["1+2 3*4", 12],
  [`123
     if (1) {
      678
     }`,
    678
  ],
  [`123
  if (1) {
   6
   7 8
  }`,
    8
  ],
  [`123
  if (1) {
   6
   7 8
  }
  456`,
    456
  ],
  [`123
   if (0) {
    6
    7
   }
   else {
    8 9
   }
  `,
    9
  ]
]


let grammar = loadGrammar()
let dummyPrint = () => { throw ("shouldn't call this") }

tests.forEach(([code, expected]) => {
  test(code, t => {
    let result = compileAndRun(grammar, code, dummyPrint)
    t.is(result, expected, "given: " + code)
  })
})
