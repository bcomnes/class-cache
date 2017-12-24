const assert = require('assert')

class ClassCache {
  constructor (opts = {}) {
    const { gc } = opts
    if (gc) this.gc = gc
    this._types = {}
    this._cache = {}
  }

  register (Class, args, gc) {
    assert(Class, 'ClassCache: Must pass a class or typeObject as arguments[0]')
    if (typeof Class === 'object') {
      // Class is a typeObj
      return this._registerTypeObj(Class)
    } else {
      return this._registerArgs(Class, args, gc)
    }
  }

  _registerTypeObj (TypeObj) {
    Object.assign(this._types, TypeObj)
  }

  _registerArgs (Class, args, gc) {
    let classBundle = [Class]
    if (args) classBundle.push(args)
    if (gc) classBundle.push(gc)
    this._registerTypeObj({
      default: classBundle
    })
  }

  unregister (/* ...types */) {
    arguments.forEach(type => delete this._types[type])
  }

  get (key, type, args, gc) {
    if (this._cache[key]) {
      // TODO Check if type or args or gc has changed
      return this._cache[key].instance
    }
  }

  set () {}
  gc (instance) { return false }
  clear () {}
  delete () {}
  has () {}
}

module.exports = ClassCache
