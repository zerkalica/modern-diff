// @flow

import {IPatches} from './asserts'
import type {Patch, Adapter} from './interfaces'

function test<V, D>(adapter: Adapter<V>, skipTest: boolean, path: string[], value: D): void {

  if (!adapter.hasIn(path)) {
    throw new TypeError(`Path not found: ${path.join('.')}`)
  }
  const v = adapter.getIn(path)
  if (!skipTest && !adapter.is(v, value)) {
    throw new TypeError(`Test is not passed in patch ${path.join('.')}, ${v}!==${value}`)
  }
}

function patch<R>(adapter: Adapter<R>, skipTest: boolean, rawPatches: Patch[]): R {
  if (!adapter) {
    throw new Error('Adapter is not set')
  }
  const patches: Patch[] = adapter.normalize(rawPatches)

  IPatches(patches)
  for (let i = 0; i < patches.length; i++) {
    const [id, path, value, toValue] = patches[i]
    switch (id) {
      case '+':
        adapter.addIn(path, value)
        break
      case '-':
        test(adapter, skipTest, path, value)
        adapter.removeIn(path)
        break
      case 'r':
        test(adapter, skipTest, path, value)
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
  skipTest: boolean;
}

export type PatchFn<V, R> = (data: V, patches: Patch[]) => R;

export default function createPatch({adapter, skipTest}: CreatePathOptions): PatchFn<*, *> {
  return function patchFn<V, R>(data: V, patches: Patch[]): R {
    return patch(new adapter(data), skipTest, patches)
  }
}
