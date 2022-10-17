const fetch = require('node-fetch')
const Api =
 'https://newsapi.org/v2/top-headlines?country=ng&apiKey=4538235f069947b18cf4aecb409b47b1'

async function fetchNews() {
 try {
  console.log('fetching News')
  const res = await fetch(Api)
  const json = await res.json()
  if (json.status !== 'ok') {
   console.log('unable to fecth news ', json.status)
   return false
  }
  let Articles = json.articles.map(article =>
   convertNewToMessage(article)
  )
  return Articles
 } catch (err) {
  // chat.sendMessage('unable to fecth due to internal error')
  console.log(err)
 }
}

const { MessageMedia } = require('whatsapp-web.js');
const noImage = require('./../noImage')
const path = require("path");
async function convertNewToMessage(art) {
 try {
  let media
  if (art.urlToImge) media = await MessageMedia.fromUrl(art.urlToImage)
  else media =  MessageMedia.fromFilePath( path.resolve(__dirname, './../noImage.png'))
  const body = stringify(art)
  return {media, body}
 } catch (e) {
  console.log(e)
 }
}

module.exports = fetchNews

function stringify(art) {
  return `*${art.title || 'this news has no tittle '}* /n *${art.description || 'this news has no description '}* /n By: ${art.author || ' no name '} at  ${art?.source?.name || ' no organization name'} /n    _published: ${art.publishedAt || 'this news has no date of creation '}_ /n the above new s article was powered by Obot using newsapi /n Obot does not lay claim to any of the new media's actircle and any name or /n trademark are subject to their respective owners and their copyrights /n prowerd by olamarvel ,<olamarvel /> and olamarvel media /n follow at @olamarvel_web`
}
