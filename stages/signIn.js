module.exports = async function (CACHE,USER, number ) {
 try {
  const cache = CACHE.get(number)
  console.log(`cache`, cache)
  if (cache) return cache
  const exist = await USER.findOne({ number })
  console.log(`exist`, exist)
  if (exist) return undefi
 } catch (error) {
  console.error(error)
  return false
 }
}
