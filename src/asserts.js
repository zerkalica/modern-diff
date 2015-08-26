export function IPatch(patch) {
  if (process.env.NODE_ENV === 'development') {
    if (!Array.isArray(patch)) {
      throw new TypeError('patch is not an array ' + patch)
    }
    if (patch.length < 3) {
      throw new TypeError('patch format is wrong ' + patch)
    }
    if (['+', '-', 'r'].indexOf(patch[0]) === -1) {
      throw new TypeError('patch format is wrong ' + patch)
    }
  }
}

export function IPatches(patches) {
  if (process.env.NODE_ENV === 'development') {
    if (!Array.isArray(patches)) {
      throw new TypeError('patches is not an array ' + patches)
    }
    patches.forEach(patch => IPatch(patch))
  }
}
