import test from "ava"
import loadGrammar from "../src/util/load_grammar.js"
import compileAndRun from "../src/compiler.js"

const BasicExpressions = [
  "1",
  "-2",
  "2+3",
  "2-3",
  "2*3",
  "7/2",
  "2+3+4",
  "2+3*4",
  "2*3+4",
  "2+-3",
]

const ExpressionsWithParentheses = [
  "(1)",
  "(-2)",
  "(1+2*3)",
  "(1+2)*3",
  "2*(3+4)",
  "(1+2)*(3+4)",
  "2*(3+5*(7+4))-1"
]

const ExpressionsWithWhitespace = [
  "   1",
  "-2   ",
  "   2+3  ",
  "2 -3",
  "2 *   3",
  "   7 /2",
  "2 + 3+4",
  "2+ 3* 4  ",
  "2+ -3",
  " ( 1 ) ",
  "(-2 )",
  "( 1+ 2*3)",
  "(1+2) *3",
  "2*(3 + 5*( 7 + 4 ))-1",
]

const Associativity = [
  "1 - 2 + 3",
  "12 / 4 * 3",
]

const FunkyExpressions = [
  " ( ( 123 ) ) ",
  "1 + -2",
  "1 - -2",
  "-4 * -5",
  "+4 - +5",
  "2*3+ 4 * 5",
  "20 / 2 / 5",
]

let grammar = loadGrammar()
let dummyPrint = () => { throw ("shouldn't call this") }

testValues(BasicExpressions)
testValues(ExpressionsWithParentheses)
testValues(ExpressionsWithWhitespace)
testValues(Associativity)
testValues(FunkyExpressions)

function testValues(values) {
  values.forEach(v => {
    test(v, t => {
      let result = compileAndRun(grammar, v, dummyPrint)
      t.is(result, Math.round(eval(v)), "given: " + v)
    })
  })
}

test("rounding applied correctly", t => {
  let v = "(18 / 7) * 7"
  let result = compileAndRun(grammar, v, dummyPrint)
  t.is(result, 21, "given: " + v)
})