import {IPatches} from './asserts'

class Patch {
  constructor({data, isTestThrows}) {
    this._methods = {
      '+': ::this.add,
      '-': ::this.remove,
      'r': ::this.replace
    }

    this._data = data
    this._isTestThrows = !!isTestThrows
    this.patch = ::this.patch
  }

  test(path, value) {
    if (!this._data.hasIn(path)) {
      throw new TypeError('Path not found: ' + path)
    }
    const v = this._data.getIn(path)
    if (this._isTestThrows && !this._data.is(v, value)) {
      throw new TypeError('Test is not passed in patch ' + path + ', ' + v + '!==' + value)
    }
  }

  remove(path, value) {
    this.test(path, value)
    this._data.removeIn(path)
  }

  add(path, value) {
    this.test(path, value)
  }

  replace(path, value, toValue) {
    this.test(path, value)
    this._data.setIn(path, toValue)
  }

  patch(patches) {
    IPatches(patches)
    for (let i = 0; i < patches.length; i++) {
      const [id, path, value, toValue] = patches[i]
      this._methods(id)(path, value, toValue)
    }
  }
}

export default function createPatch(options) {
  return (new Patch(options)).patch
}
