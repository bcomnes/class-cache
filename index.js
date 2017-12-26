const assert = require('assert')

class ClassCache {
  constructor (opts = {}) {
    const { gc = instance => false, args = [] } = opts // Top level defaults
    this._opts = { gc, args }
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

  _registerTypeObj (typeObj) {
    for (const typeKey in typeObj) {
      let typeOrClass = typeObj[typeKey]
      if (typeof typeOrClass === 'function') typeOrClass = { class: typeOrClass } // Class passed on key
      Object.setPrototypeOf(typeOrClass, this._opts)
      this._types[typeKey] = typeOrClass
    }
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
    return cacheBundle.instance.constructor === InstanceClass
  }

  _createInstance (typeKeyOrClass, opts) {
    let InstanceClass = typeKeyOrClass
    let cacheBundle = {...opts}
    if (typeof typeKeyOrClass === 'string') {
      const typeObj = this._types[typeKeyOrClass]
      assert(typeObj, `ClassCache: typeKey (${typeKeyOrClass}) must be registered before use`)
      InstanceClass = typeObj.class
      Object.setPrototypeOf(cacheBundle, typeObj)
    } else {
      // Get Class literal
      Object.setPrototypeOf(cacheBundle, this._opts)
    }
    assert(typeof InstanceClass === 'function', `ClassCache: Class or typeKey must not be undefined without a 'default' typeKey registered.`)
    assert(Array.isArray(cacheBundle.args), `ClassCache: args (${cacheBundle.args}) must be an array`)
    cacheBundle.instance = new InstanceClass(...cacheBundle.args)
    return cacheBundle
  }

  set (key, typeKeyOrClass = 'default', opts) {
    assert(key, 'ClassCache: instance key is required')
    if (typeof typeKeyOrClass === 'object') {
      opts = typeKeyOrClass
      typeKeyOrClass = 'default'
    }

    const newCacheBundle = this._createInstance(typeKeyOrClass, opts)
    this._cache[key] = newCacheBundle
    return newCacheBundle.instance
  }

  gc () {
    const willGC = []
    for (const key in this._cache) {
      const cacheBundle = this._cache[key]
      if (cacheBundle.gc(cacheBundle.instance)) willGC.push(key)
    }
    willGC.forEach(gcKey => delete this._cache[gcKey])
  }

  clear () {
    for (const key in this._cache) {
      const cacheBundle = this._cache[key]
      cacheBundle.gc(cacheBundle.instance, true) // notify instance its being GC'd
    }
    this._cache = {}
  }

  delete (key) {
    assert(key, 'ClassCache: instance key is required')
    if (!this.has(key)) return false
    const cacheBundle = this._cache[key]
    cacheBundle.gc(cacheBundle.instance, true)
    delete this._cache[key]
    return true
  }

  has (key) {
    assert(key, 'ClassCache: instance key is required')
    return !!this._cache[key]
  }
}

module.exports = ClassCache
