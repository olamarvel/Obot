module.exports = async function (CACHE, USER, number, name) {
 try {
  if (!name) return 0
  const user = await USER.create({
   number,
   level: 0,
   paid: false,
   ads: 0,
   join: Date.now(),
   name,
  })
  CACHE.set(number.toString(), user, 300000)
  return user
 } catch (error) {
  console.error(error)
  return -1
 }
}
