const ClassCache = require('class-cache')
const TwitterComponent = require('twitter-component')
const YoutubeComponent = require('youtube-component')
const c = new ClassCache()

const data = [
  {
    url: 'https://twitter.com/jondashkyle/status/939967462430294016',
    key: 'some-uniqe-app-id-to-cache-by'
    component: TwitterComponent
  },
  {
    url: 'https://twitter.com/jondashkyle/status/939914121142665216',
    key: 'some-uniqe-app-id-to-cache-by',
    component: YoutubeComponent
    args: [foo, bar]
  }
]


data.map(thing => c.(tweet.key, thing.component, tweet.args).render(tweet.url))
