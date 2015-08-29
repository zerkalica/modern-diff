/* eslint-env mocha */
import assert from 'power-assert'
import CompactCodec from '../CompactCodec'

describe('CompactCodec', () => {
  it('should revert patchset', () => {
    const a = [
      ['-', ['a'], 1],
      ['r', ['b'], 2, 22],
      ['+', ['d'], 4]
    ]

    const b = [
      [ '-', [ 'd' ], 4 ],
      [ 'r', [ 'b' ], 22, 2 ],
      [ '+', [ 'a' ], 1 ]
    ]

    assert.deepEqual(CompactCodec.invert(a), b)
  })
})
