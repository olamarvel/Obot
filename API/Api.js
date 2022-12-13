const express = require('express')
const cors = require('cors')
const requestNews = require('./functions')
const app = express()
const port = 3000
app.use(cors())
app.use(express.json())

app.get('/news/:ISO', (req, res) => {
 requestNews({ ISO: req.params.ISO, search: req.body.query }).then(result => {
  if (!result) res.status(500).json({ message: 'something went wrong' })
  else res.status(200).json(result)
  res.end()
 })
})

app.listen(port, () => {
 console.log(`Example app listening on port ${port}`)
})
