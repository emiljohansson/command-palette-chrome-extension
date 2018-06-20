export default () => {
  const subscriptions = []
  let completed = false

  const unsubscribe = callback => () => {
    let index = subscriptions.length
    while (index--) {
      if (callback === subscriptions[index]) {
        subscriptions.splice(index, 1)
        return
      }
    }
  }

  const subject = {
    get numberOfSubscriptions () {
      return subscriptions.length
    },
    complete () {
      completed = true
      subscriptions.length = 0
    },
    next (value) {
      if (completed) {
        return
      }
      subscriptions.forEach(subscription => {
        subscription(value)
      })
    },
    subscribe (callback) {
      if (completed) {
        return
      }
      subscriptions.push(callback)
      return unsubscribe(callback)
    }
  }
  return subject
}
