import assert from 'power-assert'
import Diff from '../Diff'
import Patch from '../Patch'
import NativeAdapter from '../adapters/NativeAdapter'
import CompactCodec from '../codecs/CompactCodec'

const diffObject = Diff({adapter: NativeAdapter, codec: CompactCodec})
const patchObject = Patch({adapter: NativeAdapter, codec: CompactCodec})

describe('PatcherTest', () => {
    it('should patch simple objects', () => {
        const a = {
            items: {
                a: {id: 'a'},
                b: {id: 'b'},
                c: {id: 'c'},
                d: {id: 'd'}
            }
        }
        const b = {
            items: {
                b: {id: 'b'},
                c: {id: 'c'},
                d: {id: 'd'},
                e: {id: 'e'}
            }
        }
        const diff = diffObject(a, b)
        const result = patchObject(a, diff)
        assert.deepEqual(result, b)
    })
})
