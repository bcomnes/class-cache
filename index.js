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
      if (typeof typeKey === 'object') {
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

  get (key, typeKeyOrClass = 'default', opts) {
    assert(key, 'ClassCache: instance key is required')
    if (typeof typeKeyOrClass === 'object') {
      opts = typeKeyOrClass
      typeKeyOrClass = 'default'
    }
    const cacheBundle = this._cache[key]
    if (cacheBundle && this._isSameType(cacheBundle, typeKeyOrClass)) {
      return cacheBundle.instance
    } else {
      const newCacheBundle = this._createInstance(typeKeyOrClass, opts)
      this._cache[key] = newCacheBundle
      return newCacheBundle.instance
    }
  }

  _isSameType (cacheBundle, typeKeyOrClass) {
    let InstanceClass = typeKeyOrClass
    if (typeof typeKeyOrClass === 'string') {
      const typeObj = this._types[typeKeyOrClass]
      assert(typeObj, `ClassCache: typeKey (${typeKeyOrClass}) must be registered before use`)
      InstanceClass = typeObj.class || typeObj
    }
    return cacheBundle.class === InstanceClass
  }

  _createInstance (typeKeyOrClass, opts) {
    let InstanceClass = typeKeyOrClass
    let typeOpts
    if (typeof typeKeyOrClass === 'string') {
      const typeObj = this._types[typeKeyOrClass]
      assert(typeObj, `ClassCache: typeKey (${typeKeyOrClass}) must be registered before use`)
      InstanceClass = typeObj.class || typeObj
      typeOpts = typeObj.opts || {}
    }
    assert(typeof InstanceClass === 'function', `ClassCache: Class or typeKey must not be undefined without a 'default' typeKey registered.`)
    const { args = [] } = Object.assign({}, typeOpts, opts)
    const cacheBundle = {
      class: InstanceClass,
      instance: new InstanceClass(...args),
      ...opts
    }
    return cacheBundle
  }

  set () {}
  gc (instance) { return false }
  clear () {}
  delete () {}
  has () {}
}

module.exports = ClassCache
