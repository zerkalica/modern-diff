function rfcGetString(path) {
  return typeof path === 'string' ? path : ('/' + path.join('/'))
}

// http://tools.ietf.org/html/rfc6901#page-2
const separatorRx = /\//g
const encodedSeparator = '~1'
const escapeRx = /~/g
const encodedEscape = '~0'


/**
 * Unescape and a reference token
 *
 * @private
 * @param {string} token
 * @returns {string}
 */

function unescape(token) {
  return token.replace(/~1/g, '/').replace(/~0/g, '~')
}

/**
 * Convert a JSON Pointer into a key path array
 *
 * @private
 * @param {string} pointer
 * @returns {array}
 */
function parsePointer(pointer) {
  if (pointer === '') {
    return []
  }
  if (pointer.charAt(0) !== '/') {
    throw new error.PointerError('Invalid JSON pointer: ' + pointer)
  }
  return pointer.substring(1).split(/\//).map(unescape)
}

const opMap = {
  'add': '+',
  'remove': '-',
  'replace': 'r'
}

class RFC9602Codec {
  /**
  * Encode a JSON Pointer path segment
  * @see http://tools.ietf.org/html/rfc6901#page-3
  * @param {string} s decoded segment
  * @returns {string} encoded segment
  */
  encodeSegment(segment) {
    const s = '' + segment

    return (s.indexOf('~') !== -1 || s.indexOf('/') !== -1)
      ? s.replace(escapeRx, encodedEscape).replace(separatorRx, encodedSeparator)
      : s
  }
  add(ops, path, value) {
    ops.push({op: 'add', path: rfcGetString(path), value: value})
  }

  remove(ops, path, value) {
    const p = rfcGetString(path)
    ops.push({op: 'test', path: p, value: value})
    ops.push({op: 'remove', path: p})
  }

  replace(ops, path, value, toValue) {
    const p = rfcGetString(path)
    ops.push({op: 'test', path: p, value: value})
    ops.push({op: 'replace', path: p, value: toValue})
  }

  normalize(patches) {
    const result = []
    let fromValue
    for (let i = 0; i < patches.length; i++) {
      const {op, path, value} = patches[i]
      if (op === 'test') {
        fromValue = value
      } else {
        const item = [
          opMap[op],
          parsePointer(path)
        ]

        if (op === 'replace' || op === 'remove') {
          item.push(fromValue)
          if (fromValue === undefined) {
            throw new Error('previous test patch not found: ' + JSON.stringify(patches.slice(i - 1, 2), 0, '  '))
          }
        }
        if (op === 'replace' || op === 'add') {
          item.push(value)
        }

        result.push(item)
        fromValue = undefined
      }
    }
    return result
  }

  invert(patches) {
    const ops = []
    let prevValue
    for (let i = patches.length - 1; i >= 0; --i) {
      const {op, path, value} = patches[i]
      switch (op) {
        /* eslint-disable indent */
        case 'add':
          this.remove(ops, path, value)
          break
        case 'remove':
          i--
          prevValue = i >= 0 ? patches[i].value : undefined
          if (prevValue === undefined) {
            throw new Error('need test op before remove in ' + path)
          }
          this.add(ops, path, prevValue)
          break
        case 'replace':
          i--
          prevValue = i >= 0 ? patches[i].value : undefined
          if (prevValue === undefined) {
            throw new Error('need test op before remove in ' + path)
          }
          this.replace(ops, path, value, prevValue)
          break
        default:
          throw new Error('Unknown operation: ' + op)
          /* eslint-enable indent */
      }
    }

    return ops
  }
}

export default new RFC9602Codec()
