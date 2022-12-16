const constants = require('./const.js')
function sendHelpSuport(message) {
 message.reply('Error occured while processing')
 message.reply('pls try again if problem persist , try speaking to a human')
 message.reply(constants.onwer)
}

function sendCommandNotSupported(message) {
 message.reply('your messgage or command is not support ')
 message.reply('check below to see a short list ')
 message.reply('type {_blank_} to  .| ')
 message.reply('type {_blank_} to  .| ')
 message.reply('type {_blank_} to  .| ')
 message.reply('type {_blank_} to  .| ')
 message.reply('type {_blank_} to  .| ')
 message.reply('type {_blank_} to  .| ')
 message.reply('type {_blank_} to  .| ')
 message.reply('type {_blank_} to  .| ')
 message.reply('visit ' + constants.site + '/command .| ')
 message.reply('Or just type help me pls .| ')
}

/**
 *
 * @param {String} string
 * @returns {Array} commands
 */
function sanitizeMessage(string = '') {
 let D = string.trim().toLowerCase()
 if (!D.startsWith('!')) return [false]
 D = D.substring(1)
 return D.split(' ')
}

const { MessageMedia } = require('whatsapp-web.js')
const path = require('path')
async function formatNews(article) {
 try {
  let media
  if (article.image) media = await MessageMedia.fromUrl(article.image)
  else
   media = MessageMedia.fromFilePath(path.resolve(__dirname, './noImage.png'))
  const body = stringify(article.body)
  return { image: media, body }
 } catch (e) {
  console.log(e)
 }
}

function formatBible(passage, chapter, verse, text) {
 return `
    The book of ${passage} chapter ${chapter} verse ${verse}
    ${text}
    The above bilical passage was powered by Obot using labs.bible.org.
    Obot does not lay claim to any of the biblical passages versioning or text.
    Any name or trademark are subject to their respective owners and their copyrights. 
    Powered by olamarvel , <olamarvel /> and olamarvel media 
    follow at @olamarvel_web, or speak with a human by visiting ${constants.site} or calling ${constants.onwer}
  
  `
}

function stringify(article) {
 return `${article.title || 'this news has no tittle '} 
  ${article.description || 'this news has no description '} 
  By: ${article.author || ' no author was attributed to this article '} at
  ${article?.source?.name || ' no organization name'} 
  published: ${article.publishedAt || 'this news has no date of creation '}

  The above news article was powered by Obot using newsapi.
  Obot does not lay claim to any of the news outlet media's article.
  Any name or trademark are subject to their respective owners and their copyrights. 
  Powered by olamarvel , <olamarvel /> and olamarvel media 
  follow at @olamarvel_web, or speak with a human by visiting ${
   constants.site
  } or calling ${constants.onwer}
  
  `
}

module.exports = {
 sendCommandNotSupported,
 sendHelpSuport,
 sanitizeMessage,
 formatNews,
 formatBible,
}
