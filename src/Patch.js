// @flow

import {IPatches} from './asserts'
import type {Codec, Patch, Adapter} from './interfaces'

function test<V, D>(adapter: Adapter<V>, path: string[], value: D): void {
  if (!adapter.hasIn(path)) {
    throw new TypeError(`Path not found: ${path.join('.')}`)
  }
  const v = adapter.getIn(path)
  if (!adapter.is(v, value)) {
    throw new TypeError(`Test is not passed in path ${path.join('.')}, ${v}!==${value}`)
  }
}

function patch<R>(adapter: Adapter<R>, skipTest: boolean, patches: Patch[]): R {
  if (!adapter) {
    throw new Error('Adapter is not set')
  }
  IPatches(patches)
  for (let i = 0; i < patches.length; i++) {
    const [id, path, value, toValue] = patches[i]
    switch (id) {
      case '+':
        adapter.addIn(path, value)
        break
      case '-':
        if (!skipTest) {
          test(adapter, path, value)
        }
        adapter.removeIn(path)
        break
      case 'r':
        if (!skipTest) {
          test(adapter, path, value)
        }
        adapter.setIn(path, toValue)
        break
      default:
        throw new Error('Unknown patch operation: ' + id)
    }
  }

  return adapter.data
}

export interface CreatePathOptions {
  adapter: Class<Adapter<*>>;
  codec: Codec;
  skipTest: boolean;
}

export type PatchFn<V, R> = (data: V, patches: Patch[]) => R;

export default function createPatch({adapter, codec, skipTest}: CreatePathOptions): PatchFn<*, *> {
  return function patchFn<V, R>(data: V, patches: Patch[]): R {
    return patch(new adapter(data), skipTest, codec.normalize(patches))
  }
}
