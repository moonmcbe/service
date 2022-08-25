export default (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined)
    }, timeout)

  })
}