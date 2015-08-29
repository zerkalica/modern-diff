import {IPatches} from './asserts'

class Patcher {
  constructor({data, skipTest}) {
    this._methods = {
      '+': ::this.add,
      '-': ::this.remove,
      'r': ::this.replace
    }

    this._data = data
    this._skipTest = !!skipTest
    this.patch = ::this.patch
  }

  test(path, value) {
    if (!this._skipTest) {
      if (!this._data.hasIn(path)) {
        throw new TypeError('Path not found: ' + path)
      }
      const v = this._data.getIn(path)
      if (!this._data.is(v, value)) {
        throw new TypeError('Test is not passed in path ' + path.join('.') + ', ' + v + '!==' + value)
      }
    }
  }

  add(path, value) {
    this._data.addIn(path, value)
  }

  remove(path) {
    this._data.removeIn(path)
  }

  replace(path, value) {
    this._data.setIn(path, value)
  }

  patch(patches) {
    IPatches(patches)
    for (let i = 0; i < patches.length; i++) {
      const [id, path, value, toValue] = patches[i]
      if (id !== '+') {
        this.test(path, value)
      }
      this._methods[id](path, toValue === undefined ? value : toValue)
    }
    return this._data.toJS()
  }
}

export default function createPatch({normalize, skipTest, adapter}) {
  return function _patch(data, patches) {
    const patcher = new Patcher({
      skipTest,
      data: new adapter(data)
    })

    return patcher.patch(normalize(patches))
  }
}
