import Promise from 'bluebird'
import moment from 'moment'
import request from 'request'

const MOMENT_FORMAT = 'DD-MM-YYYY'

export {
  find,
  markAsRead,
  markAsUnread
}

function find (n, options = {
  from: moment().format(MOMENT_FORMAT),
  to: moment().format(MOMENT_FORMAT)
}) {
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
          
          resolve(JSON.parse(res.body))
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
