import test from "ava"
import loadGrammar from "../src/util/load_grammar.js"
import compileAndRun from "../src/compiler.js"

const trueExpressions = [
  "1",
  " 2 > 1",
  " 2 >= 2",
  " 1 < 22",
  "22 <= 22",
  "33 == 33",
  "33 != 22",
]

const falseExpressions = [
  "0",
  "10 - 2*5",
  " 2 < 1",
  " 1 > 22",
  "22 < 22",
  "33 != 33",
  "33 == 22",
]

const trueWithArithmeticExpressions = [
  " 1+1 < 10 - 3*2 ",
  " 1+2+3+4 == 100/10",
  "( 1 + 2)*3 >= 8",
]

const falseWithArithmeticExpressions = [
  " 1+1 < 10 - 3*3 ",
  " 1*2*3*4 == 100/10",
  "1 + 2*3 >= 8",
]

let grammar = loadGrammar()
let dummyPrint = () => { throw ("shouldn't call this") }

testBoolean(trueExpressions, 1)
testBoolean(falseExpressions, 0)
testBoolean(trueWithArithmeticExpressions, 1)
testBoolean(falseWithArithmeticExpressions, 0)

function testBoolean(values, expected) {
  values.forEach(v => {
    test(v, t => {
      let result = compileAndRun(grammar, v, dummyPrint)
      t.is(result, expected, "given: " + v)
    })
  })
}

test("True is 1", t => {
  let result = compileAndRun(grammar, "1 == 1", dummyPrint)
  t.is(typeof result, 'number')
  t.is(result, 1, "given: 1 == 1" )
})

test("false is 0", t => {
  let result = compileAndRun(grammar, "1 == 2", dummyPrint)
  t.is(typeof result, 'number')
  t.is(result, 0, "given: 1 == 2")
})