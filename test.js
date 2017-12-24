const test = require('tape')
const existy = require('existy')
const ClassCache = require('./')

class TestClass {
  constructor (name) {
    this.name = name || 'unnamed'
  }
}

class Class1 extends TestClass {}
class Class2 extends TestClass {}
class Class3 extends TestClass {}

test('class-cache interface', t => {
  t.equal(typeof ClassCache, 'function', 'ClassCache exports a function')
  const c = new ClassCache()
  t.ok(c, 'instantiates  correctly correctly')
  t.ok(existy(c.register), '.register is defined')
  t.ok(existy(c.unregister), '.unregister is defined')
  t.ok(existy(c.get), '.get is defined')
  t.ok(existy(c.set), '.set is defined')
  t.ok(existy(c.gc), '.gc is defined')
  t.ok(existy(c.clear), '.clear is defined')
  t.ok(existy(c.delete), '.delete is defined')
  t.ok(existy(c.has), '.has is defined')
  t.end()
})

test('class-cache simple object registration', t => {
  const c = new ClassCache()
  c.register({
    default: Class1,
    foo: Class2,
    bar: Class3
  })

  const a = c.get('a')
  t.ok(a instanceof Class1)
  t.equal(a, c.get('a'))
  const b = c.get('b', 'foo')
  const cc = c.get('cc', 'bar')

  t.ok(b instanceof Class2, 'b is instance of Class2')
  t.equal(b, c.get('b', 'foo'), 'b same instance as second lookup')
  t.ok(cc instanceof Class3, 'cc is instance of Class3')
  t.equal(cc, c.get('cc', 'bar'), 'cc is same instance on second lookup')
  t.end()
})
