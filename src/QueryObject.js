export default class QueryObject {
  constructor (resolver) {
    this.resolver = resolver
    this.fragments = new Set()
    this.subscriptions = new Set()
  }

  addFragments (fragments) {
    if (!fragments) {
      fragments = []
    } else if (!Array.isArray(fragments)) {
      fragments = [fragments]
    }
    // TODO: Dedupe fields, merge objects, resolve conflicts!
    fragments.forEach(fragment => this.fragments.add(fragment))
  }

  fragmentString () {
    return [...this.fragments].join('\n')
  }

  subscribe (callback) {
    this.subscriptions.add(callback)
  }

  unsubscribe (callback) {
    this.subscriptions.delete(callback)
  }

  resolve (data) {
    return this.resolver(data)
  }

  notifySubscribers (value) {
    this.subscriptions.forEach(callback => callback(value))
  }
}
