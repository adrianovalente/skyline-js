import test from 'ava'
import Skyline from '../src'

test('throw error when credentials are not provided', t => {
  t.throws(() => new Skyline())
})

test('succeeds when credentials are ok', t => {
  t.notThrows(() => new Skyline({ username: 'hello', password: 'world' }))
})
