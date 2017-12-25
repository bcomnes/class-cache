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

  let a = c.get('a')
  t.ok(a instanceof Class1)
  t.equal(a, c.get('a'))

  let b = c.get('b', 'foo')
  t.ok(b instanceof Class2, 'b is instance of Class2')
  t.equal(b, c.get('b', 'foo'), 'b same instance as second lookup')
  t.ok(c.get('b') instanceof Class1, 'changing the type or class during get re-instantiates')

  let d = c.get('cc', 'bar')

  t.ok(d instanceof Class3, 'cc is instance of Class3')
  t.equal(d, c.get('cc', 'bar'), 'cc is same instance on second lookup')

  t.end()
})

test('class-cache argument registration', t => {
  const c = new ClassCache()

  c.register(Class1)
  c.register('foo', Class2)

  t.ok(c.get('instance1') instanceof Class1, 'default argument registration works')
  t.ok(c.get('instance2', 'foo') instanceof Class2, 'named argument registration works')
  const instance3 = c.get('instance3', Class3, 'unregisterd class get works')
  t.ok(instance3 instanceof Class3, 'unregistered get returns the unregistered class isntance')
  t.equal(instance3, c.get('instance3', Class3), 'subsequent lookup caches')
  t.notEqual(instance3, c.get('instance3', Class2), 're-instantiate unregisted get if class changes')
  t.end()
})
