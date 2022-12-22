const express = require('express')
const cors = require('cors')
const requestNews = require('./Endpoint/news')
const requestBible = require('./Endpoint/bible')
const football = require('./Endpoint/football')

const app = express()
const port = 3000
app.use(cors())
app.use(express.json())
app.use('/football', football)

app.get('/news/:ISO/:QUERY', (req, res) => {
 console.log('news endpoint hited')
 requestNews({ ISO: req.params.ISO, search: req.params.QUERY }).then(result => {
  console.log(result)

  if (!result) res.status(500).json({ message: 'something went wrong' })
  else res.status(200).json(result)
  res.end()
 })
})

app.get('/bible/:passage/:chapter/:verse', (req, res) => {
 // https://labs.bible.org/api/?passage=John%203:16
 console.log('biblical endpoint hited')
 requestBible(req.params.passage, req.params.chapter, req.params.verse).then(
  result => {
   console.log(result)
   if (!result) res.status(500).json({ message: 'something went wrong' })
   else res.status(200).send(result)
   res.end()
  }
 )
})

app.listen(port, () => {
 console.log(`Example app listening on port ${port}`)
})

module.exports = app
