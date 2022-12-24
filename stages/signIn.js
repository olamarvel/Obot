module.exports = async function (CACHE,USER, number ) {
 try {
  const cache = CACHE.get(number)
  console.log(`cache`, cache)
  if (cache) return 0
  const exist = await USER.findOne({ number })
  console.log(`exist`, exist)
  if (exist) return 0
 } catch (error) {
  console.error(error)
  return -1
 }
}
