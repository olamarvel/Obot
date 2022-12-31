const express = require('express')
const Fotmob = require('./../fotmob')
const fotmob = new Fotmob()
const football = express.Router()
const fetch = require('node-fetch')
const NodeCache = require('node-cache')
const CACHE = new NodeCache()
async function Leagues() {
 let allLeagues = CACHE.get('allLeagues')
 if (allLeagues) return allLeagues
 const result = await fetch(fotmob.baseUrl + '/allLeagues')
 console.log(`result`, result)
 allLeagues = await result.json()
 CACHE.set('allLeagues', allLeagues.popular, 86400000)
 return allLeagues.popular
}

football.get('/live', async (req, res) => {
 let date = new Date()
 date = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`
 console.log(`date`, date)
 let matchesToday = await fotmob.getMatchesByDate(date)
 matchesToday = JSON.parse(matchesToday)
 console.log(`matchesToday`, matchesToday)
 res.json(matchesToday)
})
async function fetchMatchByRounds(req, res) {
 const leagueCast = {
  pl: 'Premier League',
  cl: 'Champions League',
  la: 'Laliga',
  bd: 'Bundesliga',
  sa: 'Serie A',
  ep: 'Europa League',
  le: 'Ligue 1',
  fc: 'FA Cup',
  eu: 'EURO',
 }

 const leagueName = leagueCast[req.params.league]
 let leaguseData = CACHE.get(leagueName)
 if (leaguseData) {
  res.json(JSON.parse(leaguseData))
  return
 }
 const leagues = await Leagues()
 const id = leagues.find(league => league.name === leagueName).id
 leaguseData = await fotmob.getLeague(id)
 leaguseData = JSON.parse(leaguseData)
 const { data, firstUnplayedMatch } = leaguseData.matches
 const { firstRoundWithUnplayedMatch: rounds } = firstUnplayedMatch
 console.log(`date`, data)
 console.log(`firstUnplayedMatch`, firstUnplayedMatch)
 return data.matchesCombinedByRound[rounds]
}

football.get('/:league/live', async (req, res) => {
 const NextMatches = await fetchMatchByRounds(req, res)
 res.json(
  NextMatches.filter(
   ({ status }) => status.started && !(status.finished || status.cancelled)
  )
 )
})

football.get('/:league/', async (req, res) => {
 const NextMatches = await fetchMatchByRounds(req, res)
 res.json(
  NextMatches.filter(
   ({ status }) => !(status.finished || status.cancelled)
  )
 )
})

// "status": {
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
football.get('/:league/live', async (req, res) => {
 const NextMatches = await fetchMatchByRounds(req, res)
 NextMatches.filter(
  ({ status }) => status.started && !(status.finished || status.cancelled)
 )
 res.json(NextMatches)
})
football.get('/:league/:round(d+)', async () => {})
football.get('/:league/:home-:away', async () => {})

// football.get('/match/:home-:away', (req, res) => {})

//  football.get('/league/:tabs/')
module.exports = football
