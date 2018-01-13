import * as auth from './auth'

export default class Nexxera {

  constructor (credentials = {}) {
    const { username, password } = credentials
    if (!username || !password) throw new Error('Please provide username and password when initializing!')

    this.username = username
    this.password = password
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