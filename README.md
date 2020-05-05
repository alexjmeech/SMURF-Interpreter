# Programming Languages: Final Project

This note describes the final project for the Programming Languages class.

The project involves implementing a small yet relatively powerful programming
language. The language will support functions, closures,
recursion, bound variables, conditional logic, and integer arithmetic.

The language is called SMURF (because it is small, and if languages had colors,
it would be blue).

### What's in the Box

* `package.json` and `package-lock.json`
  Are set up to install `ava` and `pegjs`. Just run `npm install` in this
  directory.

* `samples/`
  A collection of example SMURF programs.

* `src/smurf.js`
  This is the main program of the interpreter. It:

  * looks at the parameter passed when run:

        $ node src/smurf.js  «param»

    If the parameter ends `.smu`, it assumes that it's a file name and passes
    the contents of the file to the interpreter; otherwise it assumes it's a
    SMURF program and passes it in.

  * it loads the grammar from `grammar.pegjs` and uses it to create a PEG.PS
    parser.

  * it implements a basic print function for the interpreter to use.

* `src/grammar.pegjs`

  The grammar structure and parsing system for SMURF.

* `src/ast.js`

  The abstract syntax tree for SMURF code to be parsed into.

* `src/binding.js`
  
  The binding system for closure variable storage.

* `src/visitors/interpreter.js`

  An interpreter that executes a SMURF AST to produce an output.

* `src/compiler.js`

  The `compileAndRun` function in this module is called by the main program.
  It is given the grammar (as a PEG.JS object, the source
  of the script (a string) and the print function.

  This function coordinates parsing the script and then interpreting it. It must
  return the value of the last statement that the interpreter executes.

* `test/test_values.js`

  Some basic tests of expressions.

# SMURF Reference Material

SMURF is an interpreted language. It has two data types: integers and functions.
The results of integer division are always an integer, rounded (so 7/2 equals 4).

Comments run from `#` to end of line

Every statement returns a value.

* The value of a `let` or an assignment is the value given to the variable.
* The value of a sequence of statements is the value of the last statement
  executed
* The value of an `if` statement is the value of either the `then` or `else`
  block
* the value of a function definition is a function value
* the value of a function call is the value of the last statement it executes

Variables must be declared before use (using `let` or as a function's formal
arguments).

Functions capture closures at the point of definition.

As well as functions that can be defined in a SMURF script, there is
a built-in function `print`. At runtime, `print` will call a JavaScript function
supplied to the compiler; normally this will print a value to the console.

### Some SMURF programs

##### Convert feet to inches

    let feetToInches = fn(feet) {
      feet * 12
    }

    print(feetToInches(10))   #=> 120

##### Capturing a Binding

    let addN = fn(n) {
      fn (x) { x + n }
    }

    let add2 = addN(2)
    let add3 = addN(3)

    print(add3(5))      #=> 8

##### Fibonacci

    let fib = fn(n) {
      if n < 2 {
        n
      }
      else {
        fib(n-1) + fib(n-2)
      }
    }

    print(fib(10))   #=> 55

### Notes:

#### Variables

* Variables must be declared (using `let`) before being used.

* Variables may also be initialized in a `let` statement. If not initialized,
  they should have the value 0.

* Variable initializers may be expressions, and those expressions may reference
  previous variables

  ~~~
  let a = 1
  let b = 2
  let c = a + b
  ~~~

* There are only two things a variable can hold: integers and functions.

#### Booleans and If Expressions

* The six relational operators compare two integers, returning the
  value `1` if the relation is true and `0` otherwise.

* The `if` expression executes its `then` clause if its condition is nonzero.
  Otherwise, if the condition is zero and an `else` clause is specified, that
  `else` clauses is executed.

* The value of the `if` expression is the value of either the `then` or `else`
  clause.

#### Blocks of code

* Multiple expressions (statements) can be grouped inside braces.

* The value returned by a block is the value of the last expression it
  evaluates.

  ~~~
  max = if a > b { a } else { b }
  ~~~

#### Functions

* Functions are created using the `fn` expression.

* The value of an `fn` is something that can be subsequently called.

  ~~~
  adder = fn (a,b) { a + b }
  print(adder(2,3))           #=> 5
  ~~~

* A function stored in a variable `v` is called using `v(p1, p2...)`.

* As a special case, the interpreter acts as if there is a predefined
  function stored in the variable `print`. This function can be called with
  one or more arguments, and will write those arguments to standard output,
  preceded by "Print: ". If multiple arguments are given, their values should be
  displayed separated by a pipe character (and no spaces).

  ~~~
  print(1)
  print(2*3, 4+5)
  ~~~

  will output

  ~~~
  Print: 1
  Print: 6|9
  ~~~


#### Scope and Binding

* Variables are declared with `let`, and are available from that point to
  the end of the scope that declares them.

* Variables are associated with a current value. The list of variables and their
  values in the current scope is called a binding.

* When a function is defined, SMURF remembers the scope.

* When the function is subsequently run, SMURF creates a new scope for it. That
  scope includes the binding for the scope where the function was declared,
  bindings for any function parameters and any variables declared inside the
  function.

  Here's an example from the test cases:

  ~~~
  let a = 99
  let f = fn(x) { x + a }
  print(f(1))     #=> 100
  a = 100
  print(f(1))     #=> 101
  ~~~

  Note that the function receives the _scope_ at its point of definition. If the
  variables in that scope change value, the function will see that new value.

  Here's another example illustrating the nested scope created in a function.

  ~~~
  let add_n = fn (n) {
    fn (x) {
      x + n
    }
  }
  let add_2 = add_n(2)
  let add_3 = add_n(3)
  print(add_2(2))       #=> 4
  print(add_3(10))      #=> 13
  ~~~

  Note that the nested function has a reference the the variable `n` from the
  enclosing function, and that the value of `n` is specific to that outer
  function's execution.