// @flow
import type {ForEachCb} from '../interfaces'

export default class NativeAdapter<V: Object> {
  data: V

  constructor(data: V) {
    this.data = data
  }

  isEmpty(): boolean {
    return this.data === undefined
  }

  size(): number {
    return this.data.length
  }

  get<R>(key: string): R {
    return this.data[key]
  }

  has(key: string): boolean {
    return this.data[key] !== undefined
  }

  addIn(path: string[], value: any): NativeAdapter<V> {
    let val: any = this.data
    if (!path.length) {
      throw new Error('Need non-empty path')
    }

    const l: number = path.length - 1
    const index: string = path[l]
    for (let i = 0; i < l; i++) {
      val = val[path[i]]
    }

    if (Array.isArray(val)) {
      if (index === '-') {
        val.push(value)
      } else {
        val.splice(index, 0, value)
      }
    } else {
      if (!val || typeof val !== 'object') {
        throw new Error('Need an object instead of ' + String(val))
      }
      val[index] = value
    }

    return this.data
  }

  setIn<R>(path: string[], value: R): NativeAdapter<V> {
    if (!path.length) {
      this.data = (value: any)
      return this
    }

    const l = path.length - 1
    let ptr = this.data
    for (let i = 0; i < l; i++) {
      ptr = ptr[path[i]]
    }

    ptr[path[l]] = value

    return this
  }

  getIn<R>(path: string[]): R {
    if (!path.length) {
      return (this.data: any)
    }

    const l = path.length - 1
    let ptr = this.data
    for (let i = 0; i < l; i++) {
      ptr = ptr[path[i]]
    }

    return ptr[path[l]]
  }

  hasIn(path: string[]): boolean {
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

  removeIn(path: string[]): NativeAdapter<V> {
    if (!path.length) {
      throw new Error('Need non-empty path')
    }

    const l: number = path.length - 1
    const index: string = path[l]
    let ptr = this.data
    for (let i = 0; i < l; i++) {
      ptr = ptr[path[i]]
    }

    if (Array.isArray(ptr)) {
      ptr.splice(index, 1)
    } else {
      delete ptr[index]
    }

    return this
  }

  toJS(): V {
    return this.data
  }

  isMap(): boolean {
    return typeof this.data === 'object' && !Array.isArray(this.data)
  }

  isIndexed(): boolean {
    return Array.isArray(this.data)
  }

  is<V, R>(src: V, dest: R): boolean {
    return typeof src === 'object'
        ? JSON.stringify(src) === JSON.stringify(dest)
        : src === dest
  }

  forEach(cb: ForEachCb<*>): NativeAdapter<V> {
    const keys = Object.keys(this.data)
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        cb(this.data[key], key)
    }
    return this
  }
}
