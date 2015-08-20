import assert from 'power-assert'
import Diff from '../Diff'
import Immutable from 'immutable'
import ImmutableAdapter from '../adapters/ImmutableAdapter'
import NativeAdapter from '../adapters/NativeAdapter'
import RFC9602Codec from '../codecs/Rfc9602Codec'
import to from './testObjects.json'

ImmutableAdapter.Immutable = Immutable

const native = {
  diff: Diff({
    adapter: NativeAdapter,
    codec: RFC9602Codec
  }),
  getInPath(o, bits) {
      let obj = o
      for (let i = 0, j = bits.length; i < j; ++i) {
        obj = obj[bits[i]]
      }
      return obj
  },
  a: to['1.a'],
  b: to['1.b']
}

const immutable = {
  diff: Diff({
    adapter: ImmutableAdapter,
    codec: RFC9602Codec
  }),
  getInPath(o, bits) {
      return o.getIn(bits)
  },
  a: Immutable.fromJS(to['1.a']),
  b: Immutable.fromJS(to['1.b'])
}

function declareTests({diff, a, b, getInPath}, name) {
  describe('diff:' + name, () => {
    function makeDiff(path) {
      return diff(getInPath(a, path), getInPath(b, path))
    }

    describe('primitive', () => {
      it('should primitives value are equal', () => {
        const result = makeDiff(['primitives', 'val1'])
        assert.ok(result)
      })

      it('should primitives replaced correctly', () => {
        const result = makeDiff(['primitives', 'replace', 'name'])
        assert.deepEqual(result, [
          { op: 'test', path: '/', value: 'test-1a' },
          { op: 'replace', path: '/', value: 'test-1b' }
        ])
      })

      it('should object parts replaced correctly', () => {
        const result = makeDiff(['primitives', 'replace'])
        assert.deepEqual(result, [
          { op: 'test', path: '/name', value: 'test-1a' },
          { op: 'replace', path: '/name', value: 'test-1b' }
        ])
      })


      it('should object parts added correctly', () => {
        const result = makeDiff(['primitives', 'add'])
        assert.deepEqual(result, [
          { op: 'add', path: '/age', value: 33 }
        ])
      })

      it('should object parts removed correctly', () => {
        const result = makeDiff(['primitives', 'sub'])
        assert.deepEqual(result, [
          { op: 'test', path: '/age', value: 33 },
          { op: 'remove', path: '/age' }
        ])
      })
    })

    describe('arraysSimple', () => {
      it('should element of array of integers removed', () => {
        const result = makeDiff(['arraysSimple', 'remove'])
        assert.deepEqual(result, [
          { op: 'test', path: '/1', value: 2 },
          { op: 'remove', path: '/1' }
        ])
      })

      it('should element of array of integers added', () => {
        const result = makeDiff(['arraysSimple', 'add'])
        assert.deepEqual(result, [
          { op: 'add', path: '/3', value: 4 },
          { op: 'add', path: '/4', value: 5 }
        ])
      })
    })

    describe('arrayOfArray', () => {
      it('should element of array of array replaced', () => {
        const result = makeDiff(['arrayOfArray', 'replace'])
        assert.deepEqual(result, [
          { op: 'test', path: '/0/0', value: 'set1' },
          { op: 'replace', path: '/0/0', value: 'set1a' },
          { op: 'test', path: '/1/0', value: 'set3' },
          { op: 'replace', path: '/1/0', value: 'set3a' }
        ])
      })

      it('should element of array of array added', () => {
        const result = makeDiff(['arrayOfArray', 'add'])
        assert.deepEqual(result, [ { op: 'add', path: '/1/2', value: 'set5' } ])
      })
    })

    describe('arrayOfObjects', () => {
      it('should element of array of objects replaced', () => {
        const result = makeDiff(['arrayOfObjects', 'replace'])
        assert.deepEqual(result, [
          { op: 'test', path: '/2/name', value: 'phone 3' },
          { op: 'replace', path: '/2/name', value: 'phone 3b' }
        ])
      })

      it('should element of array of objects added', () => {
        const result = makeDiff(['arrayOfObjects', 'add'])
        assert.deepEqual(result, [
          { op: 'add', path: '/2', value: { val: '222-222-222', name: 'phone 2b' } }
        ])
      })

      it('should element of array of objects removed', () => {
        const result = makeDiff(['arrayOfObjects', 'remove'])
        assert.deepEqual(result, [
          { op: 'test', path: '/1', value: { val: '222-222-222', name: 'phone 2' } },
          { op: 'remove', path: '/1' }
        ])
      })
    })
  })
}

declareTests(native, 'native')
declareTests(immutable, 'immutable')
