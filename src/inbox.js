import moment from 'moment'
import Promise from 'bluebird'
import request from 'request'

const MOMENT_FORMAT = 'DD-MM-YYYY'

export {
  find,
  markAsRead,
  markAsUnread,
  getMessage
}

function find (n, opts = {}) {
  const options = Object.assign({
    from: moment().format(MOMENT_FORMAT),
    to: moment().format(MOMENT_FORMAT),
    onlyDownloadHeaders: false
  }, opts)

  return n._authenticate()
    .then(nexxera => {
      return new Promise(function (resolve, reject) {
        request({
          url: `https://www.skyline.com.br/cloud/multi/skyline-web-gateway/file/list/${options.from}/${options.to}`,
          method: 'get',
          headers: {
            Cookie: nexxera.token
          }
        }, function (err, res, body) {
          if (err) return reject(err)
          if (res.statusCode !== 200) return reject(new Error('status code ' + res.statusCode + ': ' + body))

          const messages = JSON.parse(res.body)

          resolve(
            options.onlyDownloadHeaders
              ? messages
              : Promise.all(messages.map(message =>
                getMessage(nexxera, message)
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

function markAsRead (n, message) {
  return markAsReadOrUnread(n, message, true)
}

function markAsUnread (n, message) {
  return markAsReadOrUnread(n, message, false)
}

function getMessage (n, message) {
  return markAsUnread(n, message)
    .then(message => new Promise(function (resolve, reject) {
      request({
        url: `https://www.skyline.com.br/cloud/multi/skyline-web-gateway/file/download`,
        method: 'post',
        headers: {
          Cookie: n.token
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
    .then(r => markAsRead(n, message)
      .then(() => r)
    )
}

function markAsReadOrUnread (n, message, read) {
  const url = read
    ? 'https://www.skyline.com.br/cloud/multi/skyline-web-gateway/file/read'
    : 'https://www.skyline.com.br/cloud/multi/skyline-web-gateway/file/unread'

  return n._authenticate()
    .then(nexxera => {
      return new Promise(function (resolve, reject) {
        request({
          url,
          method: 'put',
          headers: {
            Cookie: nexxera.token
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
