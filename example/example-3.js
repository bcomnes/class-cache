const ClassCache = require('class-cache')
const TwitterComponent = require('twitter-component')
const c = new ClassCache()

const data = [
  {
    url: 'https://twitter.com/jondashkyle/status/939967462430294016',
    key: 'some-uniqe-app-id-to-cache-by'
  },
  {
    url: 'https://twitter.com/jondashkyle/status/939914121142665216',
    key: 'some-uniqe-app-id-to-cache-by',
    args: [foo, bar]
  }
]


data.map(tweet => c.(tweet.key, TwitterComponent, tweet.args).render(tweet.url))
