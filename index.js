const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const Bot = require('./Bot')
const dotenv = require('dotenv')
const Mongoose = require('mongoose')
const userSchema = require('./Schemes/User')
const noImage = require('./noImage')
const { MessageMedia } = require('whatsapp-web.js')
const fetch = require('node-fetch')

const {
 sendHelpSuport,
 sanitizeMessage,
 sendCommandNotSupported,
 formatNews,
} = require('./utils')
if (!process.env.production) dotenv.config()

const media = new MessageMedia('image/png', noImage, 'noImage')
async function App() {
 console.log('handshaking database')
 try {
  await Mongoose.connect(process.env.URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
  })
  // Get the default connection
  const db = Mongoose.connection

  // Bind connection to error event (to get notification of connection errors)
  db.on('error', console.error.bind(console, 'MongoDB connection error:'))

  var USER = Mongoose.model('bot', userSchema)
 } catch (e) {
  console.log('handshaking failed')
  console.error(e)
  return
 }
 console.log('handshaking sucessful creating bot')
 try {
  const client = new Client({
   authStrategy: new LocalAuth(),
   // authTimeoutMs: 120000,
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
    const result = await fetch(url, {
     method: 'get', // *GET, POST, PUT, DELETE, etc.
     headers: {
      'Content-Type': 'application/json',
     },
    //  body: JSON.stringify({
    //   ISO: commands[0] || 'ng',
    //   query: commands[1] || '',
    //  }),
    })
    if (result.status !== 200) {
     sendHelpSuport(message)
     return
    }

    const articles = await result.json()
    articles
     .map(article => formatNews(article))
     .forEach(({ image, body }) => {
      chat.sendMessage(image, { caption: body })
     })

    break

   default:
    break
  }

  //    const command = commands[0]
  //    const API = stages(command)
  //    console.log(API)
  //    try {
  //     const array = await API
  //     // API.then(array => {
  //     //  console.log(array)
  //     const chat = await message.getChat()
  //     //  chat.sendMessage(API[0][0],{caption:API[0][1]})
  //     array.forEach((value, i) => {
  //      if (i === 0) {
  //       console.log(value.media, value.body)
  //      }
  //      // console.log(value)
  //      if (typeof value === 'string ') {
  //       chat.sendMessage(value)
  //      } else {
  //       const { media, body } = value
  //       //  console.log(media,caption)
  //       //  caption &&
  //       //  chat.sendMessage(media, {
  //       //    caption,
  //       //   })
  //       //  !caption && chat.sendMessage(media)
  //       chat.sendMessage(media, { caption: body })
  //      }
  //     })
  // })
  //    } catch (error) {
  //     console.log('error sending message ')
  //     console.error(error)
  //    }
  //   } catch (e) {
  //    console.error(e)
  //   }
 }
}

App().catch(e => {
 console.log('App refused to start')
 console.error(e)
})

{
 a: 1
}
