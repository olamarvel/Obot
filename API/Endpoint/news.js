const fetch = require('node-fetch')

async function requestNews({ ISO = 'ng', search = '' }) {
 const endpoint = `https://newsapi.org/v2/top-headlines?q=${search}&country=${ISO}&apiKey=4538235f069947b18cf4aecb409b47b1`
 try {
  const res = await fetch(endpoint)
  const result = await res.json()
  if (result.status !== 'ok') {
   console.log('unable to fecth news ', result.status)
   return false
  }
  let formatted = result.articles.map(jsons => format(jsons))
  return formatted
 } catch (err) {
  console.log(err)
  return false
 }
}

function format(art) {
 return {
  image: art.urlToImage,
  body: {
   title: art.title,
   description: art.description,
   author: art.author,
   organization: art?.source?.name,
   published: art.publishedAt,
  },
 }
}

module.exports = requestNews