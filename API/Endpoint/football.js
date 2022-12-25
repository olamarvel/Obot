const express = require('express')
const Fotmob = require('./../fotmob')
const fotmob = new Fotmob()
const football = express.Router()
const NodeCache = require('node-cache')
const CACHE = new NodeCache()


football.get('/live', async (req, res) => {
 let date = new Date()
 date = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`
 console.log(`date`, date)
 let matchesToday = await fotmob.getMatchesByDate(date)
 matchesToday = JSON.parse(matchesToday)
 console.log(`matchesToday`, matchesToday)
 res.json(matchesToday)
})

football.get('/match/:home-:away', (req, res) => { 

 })

//  football.get('/league/:tabs/')
module.exports = football
