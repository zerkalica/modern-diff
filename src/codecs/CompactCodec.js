// @flow

import type {Patch} from '../interfaces'

class CompactCodec {
  encodeSegment(s: string): string {
    return s
  }

  add<V>(ops: Patch[], path: string[], value: V): void {
    ops.push(['+', path, value])
  }

  remove<V>(ops: Patch[], path: string[], value: V): void {
    ops.push(['-', path, value])
  }

  replace<V, R>(ops: Patch[], path: string[], value: V, toValue: R): void {
    ops.push(['r', path, value, toValue])
  }

  invert(patches: Patch[]): Patch[] {
    const ops: Patch[] = []
    for (let i = patches.length - 1; i >= 0; --i) {
      const [op, path, value, toValue]: Patch = patches[i]
      switch (op) {
        /* eslint-disable indent */
        case '+':
          this.remove(ops, path, value)
          break
        case '-':
          this.add(ops, path, value)
          break
        case 'r':
          this.replace(ops, path, toValue, value)
          break
        default:
          throw new Error('Unknown operation: ' + op)
        /* eslint-enable indent */
      }
    }

    return ops
  }
}

export default new CompactCodec()
