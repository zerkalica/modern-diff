export default class ImmutableAdapter<V> {
  data: V
  _iterable: {
    isKeyed: (v: mixed) => boolean;
    isIndexed: (v: mixed) => boolean;
  }

  constructor(data) {
    this.data = data
    this._iterable = ImmutableAdapter.Immutable.Iterable
  }

  isEmpty() {
    return this.data === undefined
  }

  size() {
    return this.data.size
  }

  get(key) {
    return this.data.get(key)
  }

  has(key) {
    return this.data.has(key)
  }

  addIn(path, value) {
    return this.data.setIn(path, value)
  }

  setIn(path, value) {
    this.data = this.data.setIn(path, value)
    return this
  }

  getIn(path) {
    return this.data.getIn(path)
  }

  hasIn(path) {
    return this.data.hasIn(path)
  }

  removeIn(path) {
    this.data = this.data.removeIn(path)
    return this
  }

  toJS() {
    const data = this.data
    if (typeof data === 'object' && data.toJS) {
      return data.toJS()
    }

    return data
  }

  isMap() {
    return this._iterable.isKeyed(this.data)
  }

  isIndexed() {
    return this._iterable.isIndexed(this.data)
  }

  is(src, dest) {
    return ImmutableAdapter.Immutable.is(src, dest)
  }

  forEach(cb) {
    return this.data.forEach(cb)
  }
}

ImmutableAdapter.Immutable = null
