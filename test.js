const test = require('tape')
const existy = require('existy')
const ClassCache = require('./')

class TestClass {
  constructor (name) {
    this.name = name || 'unnamed'
  }
}

class Class1 extends TestClass { }
class Class2 extends TestClass { }
class Class3 extends TestClass { }
class Class4 {
  constructor (opts = {}) {
    this.opts = opts
  }
}

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

test('class-cache default key', t => {
  const c = new ClassCache()
  c.register('default', Class1)

  let a = c.get('a')
  t.ok(a instanceof Class1, 'default register key registers a default class')
  t.equal(a, c.get('a'), 'instances are returned')

  t.end()
})

test('class-cache argument registration', t => {
  const c = new ClassCache()

  c.register(Class1)
  c.register('foo', Class2)

  t.ok(c.get('instance1') instanceof Class1, 'default argument registration works')
  t.ok(c.get('instance2', 'foo') instanceof Class2, 'named argument registration works')
  const instance3 = c.get('instance3', Class3, 'unregistered class get works')
  t.ok(instance3 instanceof Class3, 'unregistered get returns the unregistered class instance')
  t.equal(instance3, c.get('instance3', Class3), 'subsequent lookup caches')
  t.notEqual(instance3, c.get('instance3', Class2), 're-instantiate unregistered get if class changes')
  t.end()
})

test('class-cache argument cascade', t => {
  const c = new ClassCache({ args: ['root name'] })

  c.register(Class1, { args: ['default name'] })

  const instance1 = c.get('foo')
  t.equal(instance1.name, 'default name', 'args are applied at the type level')
  c.register('other-class', Class2)
  const instance2 = c.get('bar', 'other-class')
  t.equal(instance2.name, 'root name', 'create another class without args')
  const instance3 = c.get('baz', Class3, { args: ['third name'] })
  t.equal(instance3.name, 'third name', 'create class with specific args')
  const instance4 = c.get('biz', { args: ['fourth name'] })
  t.equal(instance4.name, 'fourth name', 'default instance with specific opts')
  t.equal(c.get('biz', { args: ['fifth name'] }).name, 'fourth name', 'args are ignored if already created')
  t.equal(c.set('biz', { args: ['fifth name'] }).name, 'fifth name', 'Setting re-instantiates')
  t.end()
})

test('gc cascade', t => {
  const c = new ClassCache({
    gc: instance => true // default GG
  })

  c.register(Class1, { args: ['default name'] })
  c.register('dont-gc', Class2, { gc: instance => false })
  c.register('instance-based-gc', Class4, { gc: instance => instance.opts.gc })

  c.get(1) // will gc
  c.get(2, 'dont-gc') // wont gc
  c.get(3, 'dont-gc', { gc: instance => true }) // will gc
  c.get(4, 'instance-based-gc', { args: [{ gc: true }] })
  c.get(5, 'instance-based-gc', { args: [{ gc: false }] })
  c.get(6, { gc: instance => false }) // wont gc

  c.gc()
  t.ok(c.has(2), 'default gc function honored')
  t.ok(c.has(5), 'instance based gc honored')
  t.ok(c.has(6), 'instance gc honored')

  c.delete(6)

  t.ok(!c.has(6), 'instance key deleted')

  c.clear()
  t.ok(!c.has(2) && !c.has(5), 'remaining keys deleted')
  t.end()
})

test('lru', t => {
  const c = new ClassCache({
    gc: instance => true, // default GG
    lru: 5
  })
  let gcCalled = false

  c.register(Class1)

  c.get(1, { gc: (instance, key, force) => {
    gcCalled = force
    return true
  } }) // will gc
  c.get(2) // wont gc
  c.get(3) // will gc
  c.get(4)
  c.get(5)
  t.equal(Object.keys(c.cache).length, 5, 'can fill the LRU')
  c.get(6)
  t.equal(Object.keys(c.cache).length, 5, 'lru ejects when full')
  t.true(gcCalled, 'gc was called on ejection')
  t.false(c.has(1), 'the first key is ejected')
  c.get(2)
  c.get(2)
  c.get(2)
  c.get(1)
  t.false(c.has(3), 'the third key is ejected after getting 2 and 3 again')

  t.end()
})
