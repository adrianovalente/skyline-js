import request from 'request'
import Promise from 'bluebird'

const AUTH_URL = 'https://www.skyline.com.br/cloud/multi/skyline-web-gateway/login'

/**
 * Gets the auth token for a fiven skyline instance
 *
 * @param {skyline}
 * @returns {Promise}
 */
export function getAuthToken (skyline) {
  return new Promise((resolve, reject) => {
    request({
      url: AUTH_URL,
      method: 'post',
      form: {
        username: skyline.username,
        password: skyline.password
      }
    }, (err, res, body) => {
      if (err) return reject(err)
      if (res.statusCode !== 200) return reject(new Error(`statusCode ${res.statusCode}: ${body}`))

      try {
        const token = res.headers['set-cookie'][0]
          .split('session=')[1]
          .split(';')[0]

        return resolve(`firstAccess=false; defaultServer=2; currentUser=${skyline.username}; session=${token}`)
      } catch (e) {
        reject(e)
      }
    })
  })
}
