export default class NativeAdapter {
  constructor(data) {
    this._data = data
  }

  isEmpty() {
    return this._data === undefined
  }

  size() {
    return this._data.length
  }

  get(key) {
    return this._data[key]
  }

  has(key) {
    return this._data[key] !== undefined
  }

  toJS() {
    return this._data
  }

  isMap() {
    return typeof this._data === 'object' && !Array.isArray(this._data)
  }

  isIndexed() {
    return Array.isArray(this._data)
  }

  is(src, dest) {
    return typeof src === 'object'
        ? JSON.stringify(src) === JSON.stringify(dest)
        : src === dest
  }

  forEach(cb) {
    const keys = Object.keys(this._data)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      cb(this._data[key], key)
    }
  }
}
