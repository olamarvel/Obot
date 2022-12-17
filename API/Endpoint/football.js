const express = require('express')
const Fotmob = require('fotmob/dist/fotmob')
const fotmob = new Fotmob()
const football = express.Router()

football.get('/live', async (req, res) => {
 let date = new Date()
 date = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`
 console.log(`date`, date)
 let matchesToday = await fotmob.getMatchesByDate(date)
 console.log(`matchesToday`, fotmob.getMatchesByDate(date))
 res.json(matchesToday)
})

football.get('/match/:home-:away', (req, res) => { 

 })

//  football.get('/league/:tabs/')
module.exports = football
