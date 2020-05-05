function bool(value) {
  return value ? 1 : 0
}

const operations = {
  "+": (l, r) => l + r,
  "-": (l, r) => l - r,
  "*": (l, r) => l * r,
  "/": (l, r) => Math.round(l / r),

  "<":  (l,r) => bool(l < r),
  "<=": (l,r) => bool(l <= r),
  "==": (l,r) => bool(l == r),
  ">=": (l,r) => bool(l >= r),
  ">":  (l,r) => bool(l > r),
  "!=": (l,r) => bool(l != r),

}

import Binding from "../binding.js"
import * as AST from "../ast.js"

export default class Interpreter {

  constructor(target, printFunction) {
    this.target = target
    this.printFunction = printFunction
    this.binding = new Binding()
  }

  visit() {
    return this.target.accept(this)
  }

  Assignment(node) {
    let variable = node.variable.accept(this)
    let expr     = node.expr.accept(this)
    this.binding.updateVariable(variable, expr)
    return expr
  }

  BinOp(node) {
    let l = node.l.accept(this)
    let r = node.r.accept(this)
    return operations[node.op](l, r)
  }

  FunctionCall(node) {
    let thunk = node.name.accept(this)
    if (node.args.length > thunk.formals.length) {
      throw new Error("Passed in more function arguments than defined parameters")
    }
    for (var i = node.args.length; i < thunk.formals.length; i++) { // Allows calling functions with less arguments than parameters, defaulting unused parameters to 0
      node.args.push(new AST.IntegerValue(0))
    }
    let outside = this.binding
    let inside = new Binding(thunk.binding)
    node.args.forEach((val, index) => inside.setVariable(thunk.formals[index].accept(this), val.accept(this)))
    this.binding = inside
    let result = thunk.code.accept(this)
    this.binding = outside
    return result
  }

  FunctionDefinition(node) {
    return new AST.Thunk(node.formals, node.code, this.binding)
  }

  IfStatement(node) {
    let predicate = bool(node.predicate.accept(this))

    if (predicate == 1)
      return node.thenCode.accept(this)

    return node.elseCode.accept(this)
  }

  IntegerValue(node) {
    return node.value
  }

  InternalPrint(node) {
    let args = node.args.map(a => a.accept(this).toString() )
    this.printFunction(args)
    return args
  }

  StatementList(node) {
    let result = 0
    node.statements.forEach(statement =>
      result = statement.accept(this)
    )
    return result
  }

  VariableDeclaration(node) {
    let variable = node.variable.accept(this)
    let initialValue = 0
    if (node.initialValue) {
      initialValue = node.initialValue.accept(this)
    }
    this.binding.setVariable(variable, initialValue)
    return initialValue
  }

  VariableName(node) {
    return node.name
  }

  VariableValue(node) {
    return this.binding.getVariableValue(node.name)
  }
}