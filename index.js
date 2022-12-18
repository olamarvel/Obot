const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const Bot = require('./Bot')
const dotenv = require('dotenv')
const noImage = require('./noImage')
const { MessageMedia } = require('whatsapp-web.js')

//test
const {
 sendHelpSuport,
 sanitizeMessage,
 sendCommandNotSupported,
 formatNews,
 formatBible,
 sendUserNotRegistered,
 sendAwaitingResponse,
 sendUserRegistrationFailed,
 checkForRegistrtionName,
} = require('./utils')

const { bibleTread } = require('./bibleTread')
const { newsTread } = require('./newsTread')
const { connectToMongoose } = require('./connectToMongoose')
if (!process.env.production) dotenv.config()

const media = new MessageMedia('image/png', noImage, 'noImage')
async function App() {
 console.log('handshaking database')
 const USER = await connectToMongoose()
 console.log('handshaking sucessful creating bot')
 try {
  var client = new Client({
   authStrategy: new LocalAuth(),
   qrMaxRetries: 5,
   puppeteer: {
    args: ['--no-sandbox'],
   },
  })

  client.on('message', async message => {
   const doNotRespond =
    message.fromMe || message.isStatus || message.from !== '2348103194540@c.us'
   if (doNotRespond) return
   const id = Number(message.from.split('@')[0])
   var user = await validateUser(message)
   if (user === false) sendHelpSuport(message)
   else if (user === undefined) {
    let name = checkForRegistrtionName(message.body)
    if (!name) {
     const name = await registrationProcess(message)
     createUser(id,name)
    } else client.emit(message.from, name);''
   } else handleMassage(message, user)
  })
  client.on('loading_screen', (percent, message) => {
   console.log('LOADING SCREEN', percent, message)
  })

  client.on('qr', qr => {
   console.log(qr)
   qrcode.generate(qr, { small: true })
  })

  client.on('authenticated', () => {
   console.log('AUTHENTICATED')
  })

  client.on('auth_failure', msg => {
   console.error('AUTHENTICATION FAILURE', msg)
  })

  client.on('ready', () => {
   console.log('Client is ready!')
  })

  client.on('disconnected', reason => {
   console.log('Client was logged out', reason)
  })

  client.initialize()
 } catch (e) {
  console.log('client failed to load ')
  console.error(e)
 }

 validateUser.pool = []
 async function registrationProcess(message) {
  try {
   sendUserNotRegistered(message)
   let name = await new Promise((resovle, reject) => {
    var resovleName = _name => {
     timeouts.forEach(timeout => {
      clearTimeout(timeout)
     })
     resovle(_name)
    }
    const timeouts = [
     setTimeout(() => sendAwaitingResponse(message), 30000),
     setTimeout(() => {
      reject('tElapsed')
      client.off(message.from,resovleName)
     }, 60000),
    ]

    client.on(message.from, resovleName)
   })
   return name
  } catch (e) {
   if (e === 'tElapsed') sendUserRegistrationFailed(message)
   else console.log(e)
  }
 }

 async function validateUser(message) {
  const id = Number(message.from.split('@')[0])
  let user
  if (validateUser.pool[id]) user = validateUser.pool[id]
  else {
   let user = await validateUserInCloud(message)
   if (user === undefined) return undefined
   if (!user) return false
   validateUser.pool[id] = user
   setTimeout(() => {
    validateUser.pool[id] = undefined
   }, 300000)
  }
  return user
 }

 async function validateUserInCloud(message) {
  const { from, fromMe, isStatus } = message
  if (fromMe || isStatus) return
  try {
   const id = from.split('@')[0]
   let user = await USER.findOne({ number: id })
   if (!user) {
    return undefined
   }
   return user
  } catch (e) {
   console.log(e)
   console.log('user not find')
   return false
  }
 }

 async function createUser(id, name) {
  return await USER.create({
   number: id,
   level: 0,
   paid: false,
   ads: 0,
   join: Date.now(),
   name,
  })
 }

 /**
  * handle incoming message and response to them
  * @param {String} message
  */
 async function handleMassage(message) {
  const chat = await message.getChat()
  const [endpoint, ...commands] = sanitizeMessage(message.body)
  if (!endpoint) {
   sendCommandNotSupported(message)
   return
  }
  console.log(endpoint)
  const url = 'http://localhost:3000/' + endpoint + '/' + commands.join('/')
  console.log(url)
  switch (endpoint) {
   case 'news':
    await newsTread(url, sendHelpSuport, message, formatNews, chat)
    break
   case 'bible':
    await bibleTread(url, sendHelpSuport, message, formatBible, commands, chat)
    break
   case 'livescore':
    break
   default:
    break
  }
 }
}

App().catch(e => {
 console.log('App refused to start')
 console.error(e)
})

{
 a: 1
}

/**
  improve validation funnctionality to include 
  1- name collection and name tracking 
  2-ads validation and collection
  3-number  of request per hour limitation 

*/
