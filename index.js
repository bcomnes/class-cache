class ClassCache {
  constructor (opts = {}) {
    const { gc } = opts
    this.gc = gc
  }

  use () {}
  get () {}
  gc () {}
  clear () {}
  delete () {}
  has () {}
}

module.exports = ClassCache
