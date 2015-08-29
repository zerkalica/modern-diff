class CompactCodec {
  encodeSegment(s) {
    return s
  }

  add(ops, path, value) {
    ops.push(['+', path, value])
  }

  remove(ops, path, value) {
    ops.push(['-', path, value])
  }

  replace(ops, path, value, toValue) {
    ops.push(['r', path, value, toValue])
  }

  normalize(patches) {
    return patches
  }

  invert(patches) {
    const ops = []
    for (let i = patches.length - 1; i >= 0; --i) {
      const [op, path, value, toValue] = patches[i]
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
