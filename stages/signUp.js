module.exports = async function (CACHE, USER, number, name) {
 try {
  if (!name) throw new Error('no name  provided')
  const user = await USER.create({
   number,
   level: 0,
   paid: false,
   ads: 0,
   join: Date.now(),
   name,
  })
  CACHE.set(number.toString(), user, 300000)
  return true
 } catch (error) {
  console.error(error)
  return false
 }
}
