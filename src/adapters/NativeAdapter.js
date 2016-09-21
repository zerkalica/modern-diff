export default class NativeAdapter {
  constructor(data) {
    this.data = data
  }

  isEmpty() {
    return this.data === undefined
  }

  size() {
    return this.data.length
  }

  get(key) {
    return this.data[key]
  }

  has(key) {
    return this.data[key] !== undefined
  }

  addIn(path, value) {
    this.setIn(path, value)
    return this
  }

  setIn(path, value) {
    if (!path.length) {
      this.data = value
      return
    }

    const l = path.length - 1
    let ptr = this.data
    for (let i = 0; i < l; i++) {
      ptr = ptr[path[i]]
    }

    ptr[path[l]] = value

    return this
  }

  getIn(path) {
    if (!path.length) {
      return this.data
    }

    const l = path.length - 1
    let ptr = this.data
    for (let i = 0; i < l; i++) {
      ptr = ptr[path[i]]
    }

    return ptr[path[l]]
  }

  hasIn(path) {
    if (!path.length) {
      throw new Error('Need non-empty path')
    }

    const l = path.length - 1
    let ptr = this.data
    for (let i = 0; i < l; i++) {
      ptr = ptr[path[i]]
    }

    return ptr[path[l]] !== undefined
  }

  removeIn(path) {
    if (!path.length) {
      throw new Error('Need non-empty path')
    }

    const l = path.length - 1
    let ptr = this.data
    for (let i = 0; i < l; i++) {
      ptr = ptr[path[i]]
    }

    delete ptr[path[l]]

    return this
  }

  toJS() {
    return this.data
  }

  isMap() {
    return typeof this.data === 'object' && !Array.isArray(this.data)
  }

  isIndexed() {
    return Array.isArray(this.data)
  }

  is(src, dest) {
    return typeof src === 'object'
        ? JSON.stringify(src) === JSON.stringify(dest)
        : src === dest
  }

  forEach(cb) {
    const keys = Object.keys(this.data)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      cb(this.data[key], key)
    }
  }
}
