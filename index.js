const assert = require('assert')

class ClassCache {
  constructor (opts = {}) {
    const { gc } = opts
    if (gc) this.gc = gc
    this._types = {}
    this._cache = {}
  }

  register (typeKey, Class, opts) {
    if (arguments.length === 1) {
      if (typeKey === 'object') {
        return this._registerTypeObj(typeKey)
      }
      Class = typeKey
      typeKey = 'default'
    }
    if (arguments.length === 2) {
      if (typeof typeKey === 'function') {
        opts = Class
        Class = typeKey
        typeKey = 'default'
      }
    }
    assert(typeof typeKey === 'string', 'ClassCache: typeKey must be a string or omitted')
    assert(typeof Class === 'function', 'ClassCache: Class must be a class constructor')
    return this._registerArgs(typeKey, Class, opts)
  }

  _registerTypeObj (TypeObj) {
    Object.assign(this._types, TypeObj)
  }

  _registerArgs (typeKey, Class, opts) {
    let classBundle = Object.assign({ class: Class }, opts)
    this._registerTypeObj({
      [typeKey]: classBundle
    })
  }

  unregister (/* ...types */) {
    arguments.forEach(typeKey => delete this._types[typeKey])
  }

  get (key, typeKeyOrClass, args, gc) {
    if (this._cache[key]) {
      return this._cache[key].instance
    } else {
      this._cache[key] = this._createInstance(key)
    }
  }

  _createInstance (type, opts) {

  }

  set () {}
  gc (instance) { return false }
  clear () {}
  delete () {}
  has () {}
}

module.exports = ClassCache
