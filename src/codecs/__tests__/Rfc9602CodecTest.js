/* eslint-env mocha */
import assert from 'power-assert'
import Rfc9602Codec from '../Rfc9602Codec'

describe('Rfc9602Codec', () => {
  it('should revert patchset', () => {
    const a = [
      { op: 'test', path: '/a', value: 1 },
      { op: 'remove', path: '/a'},
      { op: 'test', path: '/b', value: 2 },
      { op: 'replace', path: '/b', value: 22 },
      { op: 'add', path: '/d', value: 4 }
    ]

    const b = [
      { op: 'test', path: '/d', value: 4 },
      { op: 'remove', path: '/d' },
      { op: 'test', path: '/b', value: 22 },
      { op: 'replace', path: '/b', value: 2 },
      { op: 'add', path: '/a', value: 1 }
    ]

    assert.deepEqual(Rfc9602Codec.invert(a), b)
  })
})
