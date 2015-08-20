export default class ImmutableAdapter {
  constructor(data) {
    this._data = data
  }

  isEmpty() {
    return this._data === undefined
  }

  size() {
    return this._data.size
  }

  get(key) {
    return this._data.get(key)
  }

  has(key) {
    return this._data.has(key)
  }

  toJS() {
    const data = this._data
    if (typeof data === 'object' && data.toJS) {
      return data.toJS()
    }

    return data
  }

  isMap() {
    return ImmutableAdapter.Immutable.Iterable.isKeyed(this._data)
  }

  isIndexed() {
    return ImmutableAdapter.Immutable.Iterable.isIndexed(this._data)
  }

  is(src, dest) {
    return ImmutableAdapter.Immutable.is(src, dest)
  }

  forEach(cb) {
    return this._data.forEach(cb)
  }
}

ImmutableAdapter.Immutable = null
