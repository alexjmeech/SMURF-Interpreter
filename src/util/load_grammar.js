////////////////////////////////////////////////////////
//              DO NOT CHANGE THIS FILE               //
////////////////////////////////////////////////////////

import fs from "fs"
import path from "path"
import pegjs from "pegjs"


export default function loadGrammar() {
  let grammarFileName = path.join("./src/", "grammar.pegjs")
  let grammarSrc = fs.readFileSync(grammarFileName, "utf-8")

  try {
    return pegjs.generate(grammarSrc, { trace: false })
  }
  catch (e) {
    console.log(e.message)
    process.exit(1)
  }

}
