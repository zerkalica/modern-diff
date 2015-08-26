import lcsDiff from './utils/lcsDiff'

class Diff {
  constructor({adapter, codec}) {
    this._adapter = adapter
    this._codec = codec

    this.make = ::this.make
    this._seqDiff = ::this._seqDiff
    this._mapDiff = ::this._mapDiff
  }

  _seqDiff(a, b, path, ops) {
    let pathIndex = 0
    const codec = this._codec
    const make = this.make

    const processor = {
      eq() {
        pathIndex++
      },
      neq(val, newVal) {
        make(val, newVal, path.concat([codec.encodeSegment(pathIndex)]), ops)
        pathIndex++
      },
      add(val) {
        make(undefined, val, path.concat([codec.encodeSegment(pathIndex)]), ops)
        pathIndex++
      },
      sub(newVal) {
        make(newVal, undefined, path.concat([codec.encodeSegment(pathIndex)]), ops)
      }
    }

    lcsDiff(a, b, processor)
  }

  _mapDiff(a, b, path, ops) {
    const codec = this._codec
    a.forEach((aVal, aKey) => {
      this.make(aVal, b.get(aKey), path.concat([codec.encodeSegment(aKey)]), ops)
    })

    b.forEach((bVal, bKey) => {
      if (!a.has(bKey)) {
        this.make(undefined, bVal, path.concat([codec.encodeSegment(bKey)]), ops)
      }
    })
  }

  make(aSrc, bSrc, _path, _ops) {
    const a = new this._adapter(aSrc)
    const b = new this._adapter(bSrc)

    const codec = this._codec
    const ops = _ops || []
    const path = _path || []

    if (a.is(aSrc, bSrc)) {
      return ops
    } else if (b.isEmpty()) {
      codec.remove(ops, path, a.toJS())
    } else if (a.isEmpty()) {
      codec.add(ops, path, b.toJS())
    } else if (a.isMap() && b.isMap()) {
      this._mapDiff(a, b, path, ops)
    } else if (a.isIndexed() && b.isIndexed()) {
      this._seqDiff(a, b, path, ops)
    } else {
      codec.replace(ops, path, a.toJS(), b.toJS())
    }

    return ops
  }
}

export default function createDiff({adapter, codec}) {
  return (new Diff({adapter, codec})).make
}
