import { makeNode } from "./util/make_node.js"

export const          Assignment=makeNode("Assignment", "variable", "expr")
export const               BinOp=makeNode("BinOp", "l", "op", "r")
export const        FunctionCall=makeNode("FunctionCall", "name", "args")
export const  FunctionDefinition=makeNode("FunctionDefinition", "formals", "code")
export const         IfStatement=makeNode("IfStatement", "predicate", "thenCode", "elseCode")
export const        IntegerValue=makeNode("IntegerValue", "value")
export const       InternalPrint=makeNode("InternalPrint", "args")
export const       StatementList=makeNode("StatementList", "statements")
export const               Thunk=makeNode("Thunk", "formals", "code", "binding")
export const VariableDeclaration=makeNode("VariableDeclaration", "variable", "initialValue")
export const        VariableName=makeNode("VariableName", "name")
export const   VariableValue=makeNode("VariableValue", "name")