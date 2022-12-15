const fetch = require('node-fetch')
async function requestBible(passage, chapter, verse, ...args) {
 // TODO:add other functionalities
 //  let extrapassge = ''
 //  if(args.length > 1){
 //      args.join(':')
 //  }
 const endpoint = `https://labs.bible.org/api/?passage=${passage}%20${chapter}:${verse}&formatting=plain`
 try {
  const res = await fetch(endpoint)
  console.log(res)
  const result = await res.text()
  return result
 } catch (err) {
  console.log(err)
  return false
 }
}

module.exports = requestBible
