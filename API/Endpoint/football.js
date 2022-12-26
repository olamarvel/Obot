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
 console.log(`result`, result);
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

football.get('/:league/', async (req, res) => {
 const leagueCast = {
  PL: 'Premier League',
  CL: 'Champions League',
  la: 'Laliga',
  BD: 'Bundesliga',
  SA: 'Serie A',
  EP: 'Europa League',
  LE: 'Ligue 1',
  FC: 'FA Cup',
  EU: 'EURO',
 }

 const leagueName = leagueCast[req.params.league]
 let leaguseData = CACHE.get(leagueName)
 if (leaguseData) {
  res.json(JSON.parse(leaguseData))
  return
 }
 const leagues = await Leagues();
 const id = leagues.find((league,i) => league.name === leagueName ).id
 leaguseData = await fotmob.getLeague(id)
 
 res.json(JSON.parse(leaguseData).matches)

})

football.get('/match/:home-:away', (req, res) => {})

//  football.get('/league/:tabs/')
module.exports = football
