// @flow

import type {Adapter, Codec, Processor, Patch} from './interfaces'

import lcsDiff from './utils/lcsDiff'

class Diff {
  _adapter: Class<Adapter<*>>
  _codec: Codec

  constructor(adapter: Class<Adapter<*>>, codec: Codec) {
    this._adapter = adapter
    this._codec = codec
  }

  _seqDiff(a: Adapter<*>, b: Adapter<*>, path: string[], ops: Patch[]) {
    let pathIndex = 0
    const codec: Codec = this._codec
    const t = this
    const processor: Processor = {
      eq() {
        pathIndex++
      },
      neq(val, newVal) {
        t.make(val, newVal, path.concat([codec.encodeSegment(pathIndex)]), ops)
        pathIndex++
      },
      add(val) {
        t.make(undefined, val, path.concat([codec.encodeSegment(pathIndex)]), ops)
        pathIndex++
      },
      sub(newVal) {
        t.make(newVal, undefined, path.concat([codec.encodeSegment(pathIndex)]), ops)
      }
    }

    lcsDiff(a, b, processor)
  }

  _mapDiff(a: Adapter<*>, b: Adapter<*>, path: string[], ops: Patch[]) {
    const codec: Codec = this._codec
    const t = this
    a.forEach((aVal, aKey) => {
      t.make(aVal, b.get(aKey), path.concat([codec.encodeSegment(aKey)]), ops)
    })

    b.forEach((bVal, bKey) => {
      if (!a.has(bKey)) {
        t.make(undefined, bVal, path.concat([codec.encodeSegment(bKey)]), ops)
      }
    })
  }

  make(aSrc: mixed, bSrc: mixed, _path?: string[], _ops?: Patch[]) {
    const a: Adapter<*> = new this._adapter(aSrc)
    const b: Adapter<*> = new this._adapter(bSrc)

    const codec: Codec = this._codec
    const ops: Patch[] = _ops || []
    const path: string[] = _path || []

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

export interface CreateDiffOptions {
  adapter: Class<Adapter<*>>;
  codec: Codec;
}

export type DiffFn = (a: mixed, b: mixed) => Patch[]

export default function createDiff({adapter, codec}: CreateDiffOptions): DiffFn {
  const diff = new Diff(adapter, codec)
  return function diffFn(a: mixed, b: mixed): Patch[] {
    return diff.make(a, b)
  }
}
