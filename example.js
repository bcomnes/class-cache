const CC = require('class-cache')
const Class = require('some-class')
const BazClass = require('baz-class')

function gc (instance, key, Class) {
  return instance.element
}

const c = new CC({
  gc // DEFAULT GC function... most of the time you do this
     // Return bool to keep or toss
})

const args = [ 'biz', 'baz' ] // applied as args when args is an array
// const args = { foo: bar } || 'foo' || () => {} // arg[0]  NOT IMPLEMENTED YET
// const args = [ [123] ] //arg[0] array

const opts = { args, gc }

c.register(Class)
// Same as
c.register({
  default: { class: Class }
})
c.register(Class, {opts})
// same as
c.register({
  default: { class: Class, ...opts }
})

c.register('type-key', Class)
// Same as
c.register({
  'type-key': Class
})

c.register('type-key', Class, {opts})
// same as
c.register({
  'type-key': { class: Class, ...opts }
})

// Define types using object syntax
c.register({
  default: Class,
  baz: {class: BazClass, ...opts}
})

c.get('my-instance') // Create or return default class instance at key. Throws if a default class isn't set
c.get('my-instance', {opts})
c.get('my-instance', null, {opts})
c.get('my-instance', 'baz') // create or return existing instance of type 'baz'.  Throws if 'baz' is not defined
c.get('my-instance', 'baz', {opts})
c.get('my-instance', Class)
c.get('my-instance', Class, {opts})

c.gc() // run gc functions pruning unregistered instances
c.clear() // clear all instances
c.delete('foo') // clear specific key
c.has('foo') // check if instantiated by key
