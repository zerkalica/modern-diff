/* eslint-env mocha */
import assert from 'power-assert'
import {immutableDiff, nativeDiff} from './helper'

function initTests(diff) {
  describe('diff:add:' + diff.displayName, () => {
    it('should add an element to self', () => {
      const a = [1, 3, 4]
      const testDiff = [{op: 'add', path: '/1', value: 2}]
      assert.deepEqual(diff(a, [1, 2, 3, 4]), testDiff)
    })

    it('should append an element to self', () => {
      const a = [1, 2, 3]
      const testDiff = [{op: 'add', path: '/-', value: 4}]
      assert.deepEqual(diff(a, [1, 2, 3, 4]), testDiff)
    })

    it('should add a property to self', () => {
      const a = { a: 1 }
      const testDiff = [{ op: 'add', path: '/b', value: 2 }]
      assert.deepEqual(diff(a, { a: 1, b: 2 }), testDiff)
    })

    it('should add an element to an array member', () => {
      const a = { a: [1, 3, 4] }
      const testDiff = [{ op: 'add', path: '/a/1', value: 2 }]
      assert.deepEqual(diff(a, { a: [1, 2, 3, 4] }), testDiff)
    })

    it('should append an element to an array member', () => {
      const a = { a: [1, 2, 3] }
      const testDiff = [{ op: 'add', path: '/a/-', value: 4 }]
      assert.deepEqual(diff(a, { a: [1, 2, 3, 4] }), testDiff)
    })

    it('should add an element to a nested array member', () => {
      const a = { a: { b: [1, 3, 4] } }
      const testDiff = [{ op: 'add', path: '/a/b/1', value: 2 }]
      assert.deepEqual(diff(a, { a: { b: [1, 2, 3, 4] } }), testDiff)
    })

    it('should append an element to a nested array member', () => {
      const a = { a: { b: [1, 2, 3] } }
      const testDiff = [{ op: 'add', path: '/a/b/-', value: 4 }]
      assert.deepEqual(diff(a, { a: { b: [1, 2, 3, 4] } }), testDiff)
    })

    it('should add a property to a nested object member', () => {
      const a = { a: { b: { c: 1 } } }
      const testDiff = [{ op: 'add', path: '/a/b/d', value: 2}]
      assert.deepEqual(diff(a, { a: { b: { c: 1, d: 2 } } }), testDiff)
    })
  })
}

initTests(immutableDiff)
initTests(nativeDiff)
