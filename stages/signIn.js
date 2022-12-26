module.exports = async function (CACHE, USER, number) {
 try {
  const cache = CACHE.get(number.toString())
  console.log(`cache`, cache)
  if (cache) return cache
  const exist = await USER.findOne({ number })
  CACHE.set(number.toString(), exist, 300000)
  console.log(`exist`, exist)
  if (exist) return exist
 } catch (error) {
  console.error(error)
  return false
 }
}
