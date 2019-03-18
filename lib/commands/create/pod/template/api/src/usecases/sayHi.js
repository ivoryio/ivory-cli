
module.exports = () => async function () {
  const msg = await new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: 'Hello' })
    }, 100)
  })

  return msg
}
