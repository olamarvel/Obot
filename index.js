const { Client, RemoteAuth } = require('whatsapp-web.js')
const Mongoose = require('mongoose')
const { MongoStore } = require('wwebjs-mongo')
const qrcode = require('qrcode-terminal')
const TIME = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
// const Api = require('./API/Api')
// const Bot = require('../../Bot')
const dotenv = require('dotenv')
// const noImage = require('../../noImage')
const { MessageMedia } = require('whatsapp-web.js')
const NodeCache = require('node-cache')
const signIn = require('./stages/signIn')
const signUp = require('./stages/signUp')
const CACHE = new NodeCache()

const {
 sendHelpSuport,
 sanitizeMessage,
 sendCommandNotSupported,
 formatNews,
 formatBible,
} = require('./utils')

const { bibleTread } = require('./bibleTread')
const { newsTread } = require('./newsTread')
const { connectToMongoose } = require('./connectToMongoose')
if (!process.env.production) dotenv.config()
TIME.extend(relativeTime)

async function App() {
 console.log('handshaking database')
 const USER = await connectToMongoose()
 console.log('handshaking sucessful creating bot')
 try {
  const store = new MongoStore({ mongoose: Mongoose })
  var client = new Client({
   authStrategy: new RemoteAuth({
    store: store,
    backupSyncIntervalMs: 300000,
   }),
   qrMaxRetries: 5,
   puppeteer: {
    args: ['--no-sandbox'],
   },
  })

  client.on('remote_session_saved', () => {
   //Do Stuff...
   console.log('remote session saved')
  })

  client.on('message', async message => {
   const doNotRespond =
    message.fromMe || message.isStatus || message.from !== '2348103194540@c.us'
   if (doNotRespond) return
   const id = Number(message.from.split('@')[0])
   const user = await signIn(CACHE, USER, id)
   if (user === false) {
    sendHelpSuport(message)
    return
   }
   if (user !== undefined) {
    handleMassage(message, user)
    return
   }
   //  user not signin
   console.log('user not registered ')
   const name = checkForRegistrtionName(message.body)
   if (!name) {
    sendUserNotRegistered(message)
    return
   }
   const succesful = await signUp(CACHE, USER, id, name)
   if (!succesful) {
    sendUserRegistrationFailed(message)
    return
   }
   message.reply(
    ` hello ${name} 
    you have been registerd successfully 
    I would send you the help sectin now`
   )
   sendCommandNotSupported(message)
   message.reply('enjoy !!!')
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

 //  /**
 //   * handle incoming message and response to them
 //   * @param {String} message
 //   */
 async function handleMassage(message) {
  try {
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
    case 'football':
     const football = await fetch(url, {
      method: 'get',
      headers: {
       'Content-Type': 'application/json',
      },
     })
     if (football.status !== 200) {
      sendHelpSuport(message)
      return
     }
     // switch (commands[0]) {
     //  case 'live':
     const NextMatches = await football.json()
     //  const {
     //   firstRoundWithUnplayedMatch: rounds,
     //   firstUnplayedMatchIndex: index,
     //  } = firstUnplayedMatch
     //  console.log(`date`, data);
     //  console.log(`firstUnplayedMatch`, firstUnplayedMatch);
     //  const NextMatches = data.matchesCombinedByRound[rounds]
     // {
     //   "round": 17,
     //   "roundName": 17,
     //   "pageUrl": "/match/3901094/matchfacts/brentford-vs-tottenham-hotspur",
     //   "id": "3901094",
     //   "home": {
     //     "name": "Brentford",
     //     "shortName": "Brentford",
     //     "id": "9937"
     //   },
     //   "away": {
     //     "name": "Tottenham Hotspur",
     //     "shortName": "Tottenham",
     //     "id": "8586"
     //   },
     //   "status": {
     //     "utcTime": "2022-12-26T12:30:00.000Z",
     //     "finished": true,
     //     "started": true,
     //     "cancelled": false,
     //     "scoreStr": "2 - 2",
     //     "reason": {
     //       "short": "FT",
     //       "long": "Full-Time"
     //     }
     //   }
     // }
     NextMatches.map(
      //.filter(({ status }) => status.finished)
      match => `${match.home.shortName} vs ${match.away.shortName} 
       ${
        (match.status.started ? 'started' : 'starting ') + match.status.utcTime
       }
      ${
       match.status.started
        ? 'scores' + match.status.scoreStr
        : 'match not started starting ' +
          new TIME(match.status.utcTime).fromNow()
      }`
     ).forEach(msg => {
      console.log(`msg`, msg)
      chat.sendMessage(msg)
     })

     //   break
     // }
     break
    default:
     break
   }
  } catch (error) {
   console.error(error)
  }
 }
}

App().catch(e => {
 console.log('App refused to start')
 console.error(e)
})

/**
  improve validation funnctionality to include 
  1- name collection and name tracking 
  2-ads validation and collection
  3-number  of request per hour limitation 

*/
