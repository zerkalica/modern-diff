// @flow

type UpdateCb<V> = (val: V) => V
type Is = (src: Immutable<*>, dest: Immutable<*>) => boolean
type FromJS = (js: Object) => Immutable<Object>

interface Immutable<V> {
    get(key: string): V;
    has(key: string): boolean;
    getIn<T>(path: string[]): T;
    hasIn(path: string[]): boolean;
    removeIn(path: string[]): Immutable<V>;
    setIn<T>(path: string[], value: T): void;
    updateIn(path: string[], cb: UpdateCb<*>): void;
    forEach(cb: UpdateCb<*>): Immutable<*>;
    size: number;
}

interface Iterable {
  isKeyed: (v: mixed) => boolean;
  isIndexed: (v: mixed) => boolean;
}

export default class ImmutableAdapter {
  data: Immutable<*>
  _iterable: Iterable
  _is: Is
  _fromJS: FromJS

  static Immutable: {
      is: Is;
      Iterable: Iterable;
      fromJS: FromJS;
  }

  constructor(data: Immutable<*>) {
    this.data = data
    this._iterable = this.constructor.Immutable.Iterable
    this._is = this.constructor.Immutable.is
    this._fromJS = this.constructor.Immutable.fromJS
  }

  isEmpty(): boolean {
    return this.data === undefined
  }

  size(): number {
    return this.data.size
  }

  get(key: string): mixed {
    return this.data.get(key)
  }

  has(key: string): boolean {
    return this.data.has(key)
  }

  addIn<T>(path: string[], value: T): ImmutableAdapter {
    const index: string = path[path.length - 1]
    const parentPath: string[] = path.slice(0, -1)
    const v = this.data.getIn(parentPath)
    if (this._iterable.isIndexed(v)) {
      this.data = this.data.updateIn(parentPath, coll =>
        index === '-'
          ? coll.push(value)
          : coll.splice(index, 0, value)
      )
    } else {
      this.data = this.data.setIn(path, value)
    }

    return this
  }

  setIn<T>(path: string[], value: T) {
    this.data = this.data.setIn(path, value)
    return this
  }

  getIn<T>(path: string[]): T {
    return this.data.getIn(path)
  }

  hasIn(path: string[]): boolean {
    return this.data.hasIn(path)
  }

  removeIn(path: string[]): ImmutableAdapter {
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

  isMap(): boolean {
    return this._iterable.isKeyed(this.data)
  }

  isIndexed(): boolean {
    return this._iterable.isIndexed(this.data)
  }

  is(src: Immutable<*>, dest: Immutable<*>): boolean {
    let d = dest
    if (dest !== null && typeof dest === 'object') {
      d = this._fromJS(dest)
    }
    return this._is(src, d)
  }

  forEach(cb: UpdateCb<*>): Immutable<*> {
    return this.data.forEach(cb)
  }
}
