import Diff from '../Diff'
import Patch from '../Patch'
import Immutable from 'immutable'
import ImmutableAdapter from '../adapters/ImmutableAdapter'
import NativeAdapter from '../adapters/NativeAdapter'
import RFC9602Codec from '../codecs/Rfc9602Codec'

ImmutableAdapter.Immutable = Immutable

export default {
  immutable: {
    patch() {
      const patch = Patch({
        adapter: ImmutableAdapter,
        normalize: RFC9602Codec.normalize
      })
      return function immutablePatch(data, patches) {
        return patch(Immutable.fromJS(data), patches).toJS()
      }
    },
    diff() {
      const diff = Diff({
        adapter: ImmutableAdapter,
        codec: RFC9602Codec
      })
      return function immutableDiff(a, b) {
        return diff(Immutable.fromJS(a), Immutable.fromJS(b))
      }
    }
  },
  native: {
    patch() {
      const patch = Patch({
        adapter: NativeAdapter,
        normalize: RFC9602Codec.normalize
      })
      return function nativePatch(data, patches) {
        const clonedData = Immutable.fromJS(data).toJS()
        return patch(clonedData, patches)
      }
    },
    diff() {
      const diff = Diff({
        adapter: NativeAdapter,
        codec: RFC9602Codec
      })
      return function nativeDiff(a, b) {
        return diff(a, b)
      }
    }
  }
}
