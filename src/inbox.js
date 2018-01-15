import moment from 'moment'
import Promise from 'bluebird'
import request from 'request'

const MOMENT_FORMAT = 'DD-MM-YYYY'
const ROOT_URL = 'https://www.skyline.com.br/cloud/multi/skyline-web-gateway/file'

export {
  find,
  markAsRead,
  markAsUnread,
  getMessage
}

function find (skyline, opts = {}) {
  const options = Object.assign({
    from: moment().format(MOMENT_FORMAT),
    to: moment().format(MOMENT_FORMAT),
    onlyDownloadHeaders: false
  }, opts)

  return skyline._authenticate()
    .then(skyline => {
      return new Promise(function (resolve, reject) {
        request({
          url: `${ROOT_URL}/list/${options.from}/${options.to}`,
          method: 'get',
          headers: {
            Cookie: skyline.token
          }
        }, function (err, res, body) {
          if (err) return reject(err)
          if (res.statusCode !== 200) return reject(new Error('status code ' + res.statusCode + ': ' + body))

          const messages = JSON.parse(res.body)

          resolve(
            options.onlyDownloadHeaders
              ? messages
              : Promise.all(messages.map(message =>
                getMessage(skyline, message)
                  .then(content => ({
                    ...message,
                    content
                  }))
              ))
          )
        })
      })
    })
}

function markAsRead (skyline, message) {
  return markAsReadOrUnread(skyline, message, true)
}

function markAsUnread (skyline, message) {
  return markAsReadOrUnread(skyline, message, false)
}

function getMessage (skyline, message) {
  return markAsUnread(skyline, message)
    .then(message => new Promise(function (resolve, reject) {
      request({
        url: `${ROOT_URL}/download`,
        method: 'post',
        headers: {
          Cookie: skyline.token
        },
        form: {
          filename: message.filename
        }
      }, function (err, res, body) {
        if (err) return reject(err)
        if (res.statusCode !== 200) return reject(new Error('status code ' + res.statusCode + ': ' + body))

        resolve(body)
      })
    }))
    .then(r => markAsRead(skyline, message)
      .then(() => r)
    )
}

function markAsReadOrUnread (skyline, message, read) {
  return skyline._authenticate()
    .then(skyline => {
      return new Promise(function (resolve, reject) {
        request({
          url: `${ROOT_URL}/${read ? 'read' : 'unread'}`,
          method: 'put',
          headers: {
            Cookie: skyline.token
          },
          json: [message]
        }, function (err, res, body) {
          if (err) return reject(err)
          if (res.statusCode !== 200) return reject(new Error('status code ' + res.statusCode + ': ' + body))

          resolve(message)
        })
      })
    })
}
