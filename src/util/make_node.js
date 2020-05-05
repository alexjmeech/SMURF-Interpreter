export function makeNode(nodeName, ...attributes) {
  const count = attributes.length;
  const constructor = function (...args) {
    for (let i = 0; i < count; i++) {
      this[attributes[i]] = args[i];
    }
  };

  Object.defineProperty(constructor, 'name', { value: nodeName });

  constructor.prototype.accept = function (visitor) {
    return visitor[this.constructor.name](this);
  };
  return constructor;
}
