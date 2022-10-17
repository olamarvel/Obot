const EventEmitter = require('events')
const lists = require('./messages')
const fetch = require('node-fetch-commonjs')
const { Client, MessageMedia } = require('whatsapp-web.js')
const NEWS = require('./stages/news')

async function timeMessage(message, type) {
 try {
  const chat = await this.client.getChatById(message.from)
  chat.sendStateTyping()
  setTimeout(_ => chat.sendMessage(lists[type]), 1000 + Math.random() * 500)

  return chat
 } catch (err) {
  console.error(
   'a error occur at sending a timed message of type ' +
    type +
    ' failed to send message reply',
   err
  )
 }
}

async function validateUser({ from, fromMe, isStatus }, USER) {
 if (fromMe || isStatus) return
 try {
  const id = from.split('@')[0]
  let user = await USER.findOne({ number: id })
  if (!user) {
   user = await USER.create({
    number: id,
    level: 0,
    paid: false,
    ads: 0,
    join: Date.now(),
   })
  }
  return user
 } catch (e) {
  console.log(e)
 }
}

/**
 * handle incoming message and response to them
 * @param {String} message
 */

async function handleMassage(message, user) {
 try {
  const commands = sanitizeMessage(message.body)
  if (!commands) {
   message.reply('message not reconginse sedn !help for help ')
   return
  }
  console.log(commands)
  const command = commands[0]
  const API = stages(command)
  console.log(API)
  try {
   const array = await API
   // API.then(array => {
  //  console.log(array)
   const chat = await message.getChat()
  //  chat.sendMessage(API[0][0],{caption:API[0][1]})
   array.forEach((value,i) => {
    if(i === 0){
      console.log(value.media,value.body)
    }
    // console.log(value)
    if (typeof value === 'string ') {
      chat.sendMessage(value)
    } else {
     const {media, body} = value
    //  console.log(media,caption)
    //  caption &&
    //  chat.sendMessage(media, {
    //    caption,
    //   })
    //  !caption && chat.sendMessage(media)
      chat.sendMessage(media,{caption:body})
    }
   })
    // })
  } catch (error) {
   console.log('error sending message ')
   console.error(error)
  }
 } catch (e) {
  console.error(e)
 }
}

/**
 *
 * @param {String} string
 * @returns {Array} commands
 */
function sanitizeMessage(string = '') {
 let D = string.trim().toLowerCase()
 if (!D.startsWith('!')) return false
 D = D.substring(1)
 return D.split('_')
}

async function stages(command) {
 switch (command) {
  case 'news':
  case 'n':
   let art = await NEWS()
   art = await Promise.all(art)
   return art
   break
  default:
   return 'command not regonsied'
 }
}
module.exports = { validateUser, handleMassage }
