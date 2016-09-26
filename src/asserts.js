// @flow

import type {Patch} from './interfaces'

export function IPatch(patch: Patch): void {
  if (process.env.NODE_ENV !== 'production') {
    if (!Array.isArray(patch)) {
      throw new TypeError('patch is not an array ' + patch)
    }
    if (patch.length < 3) {
      throw new TypeError('patch format is wrong ' + patch.join('.'))
    }
    if (['+', '-', 'r'].indexOf(patch[0]) === -1) {
      throw new TypeError('patch format is wrong ' + patch.join('.'))
    }
  }
}

export function IPatches(patches: Patch[]): void {
  if (process.env.NODE_ENV !== 'production') {
    if (!Array.isArray(patches)) {
      throw new TypeError('patches is not an array ' + patches)
    }
    for (let i = 0, l = patches.length; i < l; i++) {
        IPatch(patches[i])
    }
  }
}
