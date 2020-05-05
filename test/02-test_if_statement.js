import test from "ava"
import loadGrammar from "../src/util/load_grammar.js"
import compileAndRun from "../src/compiler.js"

const trueBlock = [
  "if 1 { 99 }",
  "if 1 { 99 } else { -99 }",
  "if 2==2   { 99 } else { -99 }",
]

const falseBlock = [
  "if 0 { 99 } else { -99 }",
  "if 2 > 2   { 99 } else { -99 }",
]

const conditionNesting = [
  "if if 1 == 2 { 0 } else {1} { -99 } else { 99 }"
]

const blockNesting = [
  "if 0 { 99 } else { if 0 {99} else {-99}}"
]

const noElse = [
  "if 0 {99}"
]


let grammar = loadGrammar()
let dummyPrint = () => { throw ("shouldn't call this") }

testIf(trueBlock, 99)
testIf(falseBlock, -99)
testIf(conditionNesting, -99)
testIf(blockNesting, -99)
testIf(noElse, 0)

function testIf(values, expected) {
  values.forEach(v => {
    test(v, t => {
      let result = compileAndRun(grammar, v, dummyPrint)
      t.is(result, expected, "given: " + v)
    })
  })
}