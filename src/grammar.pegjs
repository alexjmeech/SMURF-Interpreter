{
  const AST = options.AST

  function rollupBinOp(head, rest) {
    return rest.reduce(
      (result, [op, right]) => new AST.BinOp(result, op, right),
      head
    )
  }

  function rollupFunctionParameters(head, rest) {
    let group = []
    group.push(head)
    return rest.reduce(
      (result, [_, __, right]) => {
        group.push(right)
        return group
      }, group
    )
  }

  function rollupFunctionArguments(head, rest) {
    let group = []
    group.push(head)
    return rest.reduce(
      (result, [_, __, ___, right]) => {
        group.push(right)
        return group
      }, group
    )
  }
}

start
  = code

///////////////////////// blocks (lists of staements) /////////////////////////

code
  = stmts:statementWithOptionalLeadingSpaces* _
    { return new AST.StatementList(stmts) }

statementWithOptionalLeadingSpaces
  = _ s:statement { return s }

statement
  = "let" __ decl:variable_declaration
    { return decl }
  / assignment
  / expr

//////////////////////////////// variables & variable declaration /////////////////////////////

variable_declaration
  = name:variable_name _ "=" _ expr:expr
    { return new AST.VariableDeclaration(name, expr) }
  / name:variable_name
    { return new AST.VariableDeclaration(name, null) }

variable_value                // as rvalue
  =  id:identifier
     { return new AST.VariableValue(id) }

variable_name                 // as lvalue
  =  id:identifier
     { return new AST.VariableName(id) }


//////////////////////////////// if/then/else /////////////////////////////

if_expression
  = expr:expr _ thenCode:brace_block _ "else" _ elseCode:brace_block
    {
      return new AST.IfStatement(expr, thenCode, elseCode)
    }
  /  expr:expr _ thenCode:brace_block
    {
      return new AST.IfStatement(expr,
                                 thenCode,
                                 new AST.IntegerValue(0))
    }


//////////////////////////////// assignment /////////////////////////////

assignment
  = l:variable_name _ "=" _ r:expr
    { return new AST.Assignment(l, r) }


//////////////////////////////// expression /////////////////////////////

expr
  = "fn" _ fndef:function_definition
    { return fndef }
  / "if" _ ifExpr:if_expression
    { return ifExpr }
  / boolean_expression
  / arithmetic_expression


//////////////////////////////// boolean expression /////////////////////////////

boolean_expression
  = l:arithmetic_expression _ op:relop _ r:arithmetic_expression
    { return new AST.BinOp(l, op, r) }

//////////////////////////////// arithmetic expression /////////////////////////////

//////////////////////////////// arithmetic expression /////////////////////////////

arithmetic_expression
  = head:mult_term rest:(addop mult_term)*
    { return rollupBinOp(head, rest) }

mult_term
  = head:primary rest:(mulop primary)*
    { return rollupBinOp(head, rest) }

primary
  = integer
  / function_call
  / _ v:variable_value _
    { return v }
  / _ "(" _ expr:arithmetic_expression _ ")" _
    { return expr }


integer
  = _ number: digits _
    { return new AST.IntegerValue(number) }

addop
  = _ op:[-+] _
    { return op }

mulop
  = _ op:[*/] _
    { return op }

relop
  = '==' / '!=' / '>=' / '>' / '<=' / '<'


//////////////////////////////// function call /////////////////////////////

function_call
  = 'print' _ '(' _ args:call_arguments _ ')'
    { return new AST.InternalPrint(args) }

  / name:variable_value "(" _ args:call_arguments _ ")"
    { return new AST.FunctionCall(name, args) }

call_arguments
  = head:expr _ rest:(_ "," _ expr)*
    { return rollupFunctionArguments(head, rest) }
  / ''
    { return [] }

//////////////////////////////// function definition /////////////////////////////

function_definition
  = params:param_list _ code:brace_block
    { return new AST.FunctionDefinition(params, code) }

param_list
   = "(" _ head:variable_name _ rest:("," _ variable_name _)* ")"
    { return rollupFunctionParameters(head, rest) }
   / "(" _ ")" { return [] }

brace_block
  = "{" _ code:code _ "}" { return code }


/////////////////////// utility NTs //////////////////////////////

eol "end-of-line" = [\n\r\u2028\u2029]
ws "whitespace"   = [ \t] / eol
comment           = "#" (!eol .)*
_                 = ( ws / comment )*
__                = ( ws / comment )+

identifier        = id:([a-z][a-zA-Z_0-9]*)
                    { return text() }

digits            = [-+]? [0-9]+
                    { return parseInt(text(), 10) }
