export default class ImmutableAdapter {
  constructor(data) {
    this._data = data
  }

  addIn(path, value) {
    const parentPath = path.slice(0, -1)
    const index = path[path.length - 1]
    const v = this.getIn(parentPath)
    if (ImmutableAdapter.Immutable.Iterable.isIndexed(v)) {
      this._data = this._data.updateIn(parentPath, coll =>
        index === '-'
          ? coll.push(value)
          : coll.splice(index, 0, value)
      )
    } else {
      this.setIn(path, value)
    }
  }

  setIn(path, value) {
    this._data = this._data.setIn(path, value)
  }

  hasIn(path) {
    return this._data.hasIn(path)
  }

  removeIn(path) {
    this._data = this._data.removeIn(path)
  }

  getIn(path) {
    return this._data.getIn(path)
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
