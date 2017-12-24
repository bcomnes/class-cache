# ClassCache [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5]
[![downloads][8]][9] [![js-standard-style][10]][11]

Cache a class instance by key.  Creates a new instance if the key doesn't exist, otherwise returns the cached instance.

## Usage

```js
const ClassCache = require('class-cache')
const DefaultClass = require('default-class')
const SomeClass = require('some-class')
const AnotherClass = require('another-class')
const AThirdClass = require('a-third-class')

const c = new ClassCache()

c.use(DefaultClass, ['some', {default: 'constructor-args'}])

const a = c.get('my-instance') // Creates and returns an instance of DefaultClass
const b = c.get('my-instance')
console.log(a === b) // true

c.use({
  'some-class': SomeClass,
  'another-class': [AnotherClass, {class: 'specific', constructor: 'args'}]
})

c.get('some-instance', 'some-class') // return new SomeClass instance
c.get('some-instance', 'some-class') // return same instance as above
c.get('some-instance', 'another-class') // Create AnotherClass instance and replace the SomeClass instance stored at 'some-instance'
```

## Installation
```sh
$ npm install class-cache
```
## API
### `ClassCache = require('class-cache`)
Import `ClassCache` class.

### `c = new ClassCache([opts])`
Create a new component.

`opts` include:

```js
{
  gc: (instance) => true // a default garbage collection function
}
```

### `c.register(Class, [args], [gc])`

Define a the `default` `Class` type for the cache.  Optionally set default `args` to instantiate with, as well as a default `gc` function.

This is a shortcut for defining a `default` class using a typeObject definition:

```js
c.register({
  default: [Class, [args], [gc]]
})
```

### `c.register({ typeObject })`

Define class 'type's using a `typeObject` definition.  A typeObject is an object who's keys define the type name which are associated with a `Class` and optionally `args` and a type specific `gc` function.

```js
c.register({
  default: Class, // Class with no args or gc.  Uses instance gc function.
  baz: [Class], // Same as above.
  foo: [FooClass, args], // Provide default type instantiation args
  bar: [BarClass, args, gc] // Provide type args and gc
})
```

Types are `Object.assign`ed over previously registered types.

### `c.unregister(type...)`

Pass type keys to un-register them.  Instances are untouched. 

### `c.get(key, [Class || type], [args], [gc])`

Return instance of `Class` or defined `type` class at `key`.  If an instance does not yet exist at `key`, it will be instantiated with `args` along with a `key` specific `gc` function.  If `type` is not defined, this method will throw.

Omitting optional method arguments delegates to the next most specific option. 

```js
c.get('some-key') // Return or create the 'default' Class
c.get('some-key', null, ['arg0', 'arg2']) // Return the default registerd class with specific args
c.get('some-key', 'some-type', ['arg0', 'arg2']) // Return the `some-type` class at `some-key`.

c.get('some-key', SomeOtherClass)
```

If `key` is already instantiated, `args` is ignored.  Pass changing properties as subsequent calls to the returned instance.  If `type` or `Class` changes, the `key` instance is re-instantiated.

### `c.set(key, [Class || type], [args], [gc])`

Force instantiate the class instance at `key`.  Follows the same override behavior as `get`.  If you must change `args` on a key, this is the safest way to do that.

Returns the newly created instance.s

### `c.gc()`

Run the various `gc` functions defined.  For each key, only the most specific `gc` function set is run.  Return `true` from the `gc` functions to garbage collect that instance, and `false` to preserve.

This is used to clean out instances you no longer need.

### `c.clear()`

Clear all `key` instances.  

### `c.delete(key)`

Delete specific `key` instance.

### `c.has(key)`

Return true if `key` exists. 

See examples for more details.

## License
[MIT](https://tldrlegal.com/license/mit-license)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/nanomap.svg?style=flat-square
[3]: https://npmjs.org/package/nanomap
[4]: https://img.shields.io/travis/bcomnes/nanomap/master.svg?style=flat-square
[5]: https://travis-ci.org/bcomnes/nanomap
[8]: http://img.shields.io/npm/dm/nanomap.svg?style=flat-square
[9]: https://npmjs.org/package/nanomap
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
[bel]: https://github.com/shama/bel
[yoyoify]: https://github.com/shama/yo-yoify
[md]: https://github.com/patrick-steele-idem/morphdom
[210]: https://github.com/patrick-steele-idem/morphdom/pull/81
[nm]: https://github.com/yoshuawuyts/nanomorph
[ce]: https://github.com/yoshuawuyts/cache-element
[class]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
[isSameNode]: https://github.com/choojs/nanomorph#caching-dom-elements
[onload]: https://github.com/shama/on-load
[choo]: https://github.com/choojs/choo
[nca]: https://github.com/choojs/nanocomponent-adapters
[nc]: https://github.com/choojs/nanocomponent
