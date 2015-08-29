function getInPath(obj, path) {
  let result = obj
  for (let i = 0; i < path.length; i++) {
    result = result[path[i]]
  }
  return result
}

export default class NativeAdapter {
  constructor(data) {
    this._data = data
  }

  addIn(path, value) {
    const parentPath = path.slice(0, -1)
    const index = path[path.length - 1]
    const v = this.getIn(parentPath)
    if (v === undefined) {
      throw new Error('Data in path ' + parentPath.join('.') + ' is undefined')
    }
    if (Array.isArray(v)) {
      if (index === '-') {
        v.push(value)
      } else {
        v.splice(index, 0, value)
      }
    } else {
      v[index] = value
    }
    return this._data
  }

  setIn(path, value) {
    const parentPath = path.slice(0, -1)
    const index = path[path.length - 1]
    const v = this.getIn(parentPath)
    v[index] = value

    return this._data
  }

  hasIn(path) {
    const parentPath = path.slice(0, -1)
    const index = path[path.length - 1]
    const v = this.getIn(parentPath)

    return Array.isArray(v)
      ? v.length > index
      : v.hasOwnProperty(index)
  }

  removeIn(path) {
    const parentPath = path.slice(0, -1)
    const index = path[path.length - 1]
    const v = this.getIn(parentPath)
    delete v[index]

    return this._data
  }

  getIn(path) {
    let res
    try {
      res = getInPath(this._data, path)
    } catch(e) {
      e.message = 'Can\'t get data in path: ' + path.join('.') + ' ' + e.message
      throw e
    }

    return res
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
