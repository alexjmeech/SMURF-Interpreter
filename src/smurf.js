 ////////////////////////////////////////////////////////
 //              DO NOT CHANGE THIS FILE               //
 ////////////////////////////////////////////////////////

import fs from "fs"
import loadGrammar from "./util/load_grammar.js"
import compileAndRun from "./compiler.js"

// this should be the function called when a SMURF `print(...)` statement
// executes

function printFunction(arg) {
  if (typeof arg == "object" && arg.constructor.name == "Array")
    arg = arg.join(", ")
  console.log("Print:", arg)
}



let grammar = loadGrammar()

let script = process.argv[2]
if (script.endsWith(".smu")) {
  script = fs.readFileSync(script, "utf-8")
}

compileAndRun(grammar, script, printFunction)

 ////////////////////////////////////////////////////////
 //              DO NOT CHANGE THIS FILE               //
 ////////////////////////////////////////////////////////
