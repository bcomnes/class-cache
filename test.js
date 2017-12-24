const test = require('tape')
const ClassCache = require('./')

test('class-cache interface', t => {
  t.equal(typeof ClassCache, 'function', 'ClassCache exports a function')
  const c = new ClassCache()
  t.ok(c, 'instantiates  correctly correctly')
  t.end()
})
