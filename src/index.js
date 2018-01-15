import * as auth from './auth'
import * as inbox from './inbox'

export default class Skyline {
  constructor (credentials = {}) {
    const { username, password } = credentials
    if (!username || !password) throw new Error('Please provide username and password when initializing!')

    this.username = username
    this.password = password
  }

  getMessages (opts) {
    return inbox.find(this, opts)
  }

  getMessage (message) {
    return inbox.getMessage(this, message)
  }

  markAsUnread (message) {
    return inbox.markAsUnread(this, message)
  }

  _authenticate () {
    const self = this
    return auth.getAuthToken(self)
      .then(token => {
        self.token = token
        return self
      })
  }
}
