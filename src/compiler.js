import * as AST from "./ast.js"
import Interpreter from "./visitors/interpreter.js"

export default function compileAndRun(parser, script, printFunction) {
  let ast = parser.parse(script, { AST: AST })

  let interpreter = new Interpreter(ast, printFunction)
  let result = interpreter.visit()

  return result
}