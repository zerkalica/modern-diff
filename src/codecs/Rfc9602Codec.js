// @flow

import type {RFC9602Patch} from '../interfaces'

function rfcGetString(path: string): string {
  return typeof path === 'string' ? path : ('/' + path.join('/'))
}

// http://tools.ietf.org/html/rfc6901#page-2
const separatorRx: RegExp = /\//g
const encodedSeparator: string = '~1'
const escapeRx: RegExp = /~/g
const encodedEscape: string = '~0'

class RFC9602Codec {
  /**
  * Encode a JSON Pointer path segment
  * @see http://tools.ietf.org/html/rfc6901#page-3
  * @param {string} s decoded segment
  * @returns {string} encoded segment
  */
  encodeSegment(segment: string): string {
    const s = '' + segment

    return (s.indexOf('~') !== -1 || s.indexOf('/') !== -1)
      ? s.replace(escapeRx, encodedEscape).replace(separatorRx, encodedSeparator)
      : s
  }

  add<V>(ops: RFC9602Patch[], path: string, value: V): void {
    ops.push({op: 'add', path: rfcGetString(path), value: value})
  }

  remove<V>(ops: RFC9602Patch[], path: string, value: V): void {
    const p = rfcGetString(path)
    ops.push({op: 'test', path: p, value: value})
    ops.push({op: 'remove', path: p})
  }

  replace<V, R>(ops: RFC9602Patch[], path: string, value: V, toValue: R): void {
    const p: string = rfcGetString(path)
    ops.push({op: 'test', path: p, value: value})
    ops.push({op: 'replace', path: p, value: toValue})
  }

  invert(patches: RFC9602Patch[]) {
    const ops: RFC9602Patch[] = []
    let prevValue: mixed
    let prevPatch: RFC9602Patch
    for (let i = patches.length - 1; i >= 0; --i) {
      const patch: RFC9602Patch = patches[i]
      switch (patch.op) {
        /* eslint-disable indent */
        case 'add':
          this.remove(ops, patch.path, patch.value)
          break
        case 'remove':
          i--
          prevPatch = patches[i]
          if (prevPatch.op !== 'test') {
            throw new Error(`need test op before remove in ${patch.path}`)
          }
          prevValue = i >= 0 ? prevPatch.value : undefined
          this.add(ops, patch.path, prevValue)
          break
        case 'replace':
          i--
          prevPatch = patches[i]
          if (prevPatch.op !== 'test') {
            throw new Error(`need test op before remove in ${patch.path}`)
          }
          prevValue = i >= 0 ? prevPatch.value : undefined
          this.replace(ops, patch.path, patch.value, prevValue)
          break
        default:
          throw new Error(`Unknown operation: ${patch.op}`)
          /* eslint-enable indent */
      }
    }

    return ops
  }
}

export default new RFC9602Codec()
