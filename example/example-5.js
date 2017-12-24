const CC = require('class-cache')
const Class = require('some-class')

function gc (instance, key, Class) {
  return instance.element
}

const c = new CC({
  gc // DEFAULT GC function... most of the time you do this
     // Return bool to keep or toss
})

const args = [ 'biz', 'baz' ] // applied as args when args is an array
const args = { foo: bar } || 'foo' || () => {} // arg[0]
const args = [ [123] ] //arg[0] array

c.use(Class)
c.use(Class, args)
c.use(Class, args, gc)
// Same as
c.use({
  default: Class
})
c.use({
  default: [Class]
})
c.use({
  default: [Class, args]
})
c.use({
  default: [Class, args, gc]
})
// Define types using object syntax
c.use({
  default: Class,
  baz: [Class],
  foo: [FooClass, args]
  bar: [BarClass, args, gc]
})

c.get('my-instance') // Create or return default class instance at key. Throws if a default class isn't set
c.get('my-instance', args) // Override default args for default class function
c.get('my-instance', args, gc) // Override default gc and class gc function for instance key
c.get('my-instance', 'baz') // create or return existing instance of type 'baz'.  Throws if 'baz' is not defined
c.get('my-instance', 'baz', args)
c.get('my-instance', 'baz', args, gc)
c.get('my-instance', Class)
c.get('my-instance', Class, args)
c.get('my-instance', Class, args, gc) // Changing args or Class will re-instance key


c.gc() // run gc functions pruning unused instances
c.clear() // clear all instances
c.delete('foo') // clear specific key
c.has('foo') // check if instantiated by key
