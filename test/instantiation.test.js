import test from 'ava'
import Nexxera from '../src'

test('throw error when credentials are not provided', t => {
  t.throws(() => new Nexxera())
})

test('succeeds when credentials are ok', t => {
  new Nexxera({ username: 'hello', password: 'world' })
  t.pass()
})
