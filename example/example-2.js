const ClassCache = require('class-cache')
const TwitterComponent = require('twitter-component')
const c = new ClassCache(TwitterComponent, arg0, arg1, arg2)
// Same as
const c = new ClassCache({
  default: [TwitterComponent, arg0, arg1, arg2]
})

const data = [
  {
    url: 'https://twitter.com/jondashkyle/status/939967462430294016',
    key: 'some-uniqe-app-id-to-cache-by'
  },
  {
    url: 'https://twitter.com/jondashkyle/status/939914121142665216',
    key: 'some-uniqe-app-id-to-cache-by'
  },
  {
    url: 'https://twitter.com/jondashkyle/status/939914121142665216',
    key: 'some-uniqe-app-id-to-cache-by',
    args: [some, override, args]
  }
]


data.map(tweet => c.(tweet.key, a).render(tweet.url))
