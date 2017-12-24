const ClassCache = require('class-cache')
const TwitterComponent = require('twitter-component')
const c = new ClassCache(TwitterComponent)
// Same as
const c = new ClassCache({
  default: TwitterComponent
})

const data = [
  {
    url: 'https://twitter.com/jondashkyle/status/939967462430294016',
    key: 'some-uniqe-app-id-to-cache-by'
  },
  {
    url: 'https://twitter.com/jondashkyle/status/939914121142665216',
    key: 'some-uniqe-app-id-to-cache-by',
    arguments: [arg0,arg1,arg2]
  },
  {
    url: 'https://twitter.com/jondashkyle/status/939914121142665216',
    key: 'some-uniqe-app-id-to-cache-by',
    arguments: arg0
  }
]


data.map(tweet => c.(tweet.key, tweet.arguments).render(tweet.url))
