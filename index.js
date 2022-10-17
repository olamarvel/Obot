const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const Bot = require('./Bot')
const dotenv = require('dotenv')
const Mongoose = require('mongoose')
const userSchema = require('./Schemes/User')
const noImage = require('./noImage')
const { MessageMedia } = require('whatsapp-web.js')
// if(!process.env.production)
// dotenv.config()

const pool = []
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
//    authStrategy: new LocalAuth(),
   // authTimeoutMs: 120000,
   qrMaxRetries: 5,
   puppeteer: {
    args: [
        '--no-sandbox',
    ],
},
  })

  client.on('message', async message => {
   if (message.fromMe || message.isStatus) return

   const id = Number(message.from.split('@')[0])
   //    console.log(pool[id])
   // message.r
   const chat = await message.getChat()

   let user
   if (pool[id]) user = pool[id]
   else {
    user = await Bot.validateUser(message, USER)
    pool[id] = user
    setTimeout(() => {
     pool[id] = undefined
    }, 300000)
   }
   //    console.log(user)
   chat.sendMessage('hello')
   Bot.handleMassage(message, user)
   //    message.reply()
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
}

App().catch(e => {
 console.log('App refused to start')
 console.error(e)
})
