import Diff from '../Diff'
import Immutable from 'immutable'
import ImmutableAdapter from '../adapters/ImmutableAdapter'
import NativeAdapter from '../adapters/NativeAdapter'
import RFC9602Codec from '../codecs/Rfc9602Codec'
ImmutableAdapter.Immutable = Immutable

function ImmutableDiff() {
  const diff = Diff({
    adapter: ImmutableAdapter,
    codec: RFC9602Codec
  })
  function immutableDiff(a, b) {
    return diff(Immutable.fromJS(a), Immutable.fromJS(b))
  }
  immutableDiff.displayName = 'immutableDiff'
  return immutableDiff
}

function NativeDiff() {
  const diff = Diff({
    adapter: NativeAdapter,
    codec: RFC9602Codec
  })
  function nativeDiff(a, b) {
    return diff(a, b)
  }
  nativeDiff.displayName = 'nativeDiff'
  return nativeDiff
}

export default {
  immutableDiff: ImmutableDiff(),
  nativeDiff: NativeDiff()
}
