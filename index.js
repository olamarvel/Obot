const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const Bot = require('../../Bot')
const dotenv = require('dotenv')
const noImage = require('../../noImage')
const { MessageMedia } = require('whatsapp-web.js')

const {
 sendHelpSuport,
 sanitizeMessage,
 sendCommandNotSupported,
 formatNews,
 formatBible,
} = require('../../utils')

const { bibleTread } = require('../../bibleTread')
const { newsTread } = require('../../newsTread')
const { connectToMongoose } = require('../../connectToMongoose')
if (!process.env.production) dotenv.config()

const media = new MessageMedia('image/png', noImage, 'noImage')
async function App() {
 console.log('handshaking database')
 const USER = await connectToMongoose()
 console.log('handshaking sucessful creating bot')
 try {
  const client = new Client({
   authStrategy: new LocalAuth(),
   qrMaxRetries: 5,
   puppeteer: {
    args: ['--no-sandbox'],
   },
  })

  client.on('message', async message => {
   if (
    message.fromMe ||
    message.isStatus ||
    message.from !== '2348103194540@c.us'
   )
    return
   console.log(message.from)
   // return
   var { user } = await validateUser(message)
   if (!user) sendHelpSuport(message)
   else handleMassage(message, user)
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
 async function validateUser(message) {
  const id = Number(message.from.split('@')[0])
  let user
  if (validateUser.pool[id]) user = validateUser.pool[id]
  else {
   user = await validateUserInCloud(message)
   validateUser.pool[id] = user
   setTimeout(() => {
    validateUser.pool[id] = undefined
   }, 300000)
  }
  return { user }
 }

 async function validateUserInCloud({ from, fromMe, isStatus }) {
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
   console.log('user not find')
   return false
  }
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
    await newsTread(url, sendHelpSuport, message, formatNews,chat)
    break
   case 'bible':
    await bibleTread(url, sendHelpSuport, message, formatBible, commands,chat)
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