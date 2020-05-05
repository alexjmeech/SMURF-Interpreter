export default class Binding {
  constructor(parent) {
    this.parent = parent
    this.binding = new Map()
  }

  getVariableValue(name) {
    if (this.parent) {
      if (this.binding.has(name)) {
        return this.binding.get(name)
      }
      return this.parent.getVariableValue(name)
    }
    this.checkVariableExists(name)
    return this.binding.get(name)
  }


  setVariable(name, value) {
    if (this.binding.has(name)) {
      throw new Error(`Duplicate declaration for variable ${name}`)
    }
    this.binding.set(name, value)
  }

  updateVariable(name, value) {
    if (this.parent) {
      if (this.binding.has(name)) {
        this.binding.set(name, value)
      } else {
        this.parent.updateVariable(name, value)
      }
    } else {
      this.checkVariableExists(name)
      this.binding.set(name, value)
    }
  }

  checkVariableExists(name) {
    if (!this.binding.has(name)) {
      throw new Error(`Reference to unknown variable ${name}`)
    }
  }
}