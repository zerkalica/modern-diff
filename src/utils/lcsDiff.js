// @flow

import type {Adapter, Processor} from '../interfaces'

interface LCSMatrix {
  xs: number[];
  ys: number[];
  rawDiff: Array<boolean[]>;
  matrix: Array<number[]>;
}

function compare<V>(i: number, j: number, src: LCSMatrix, cb: Processor): void {
  const {matrix, rawDiff, xs, ys} = src
  if (i === 0 && j === 0) {
    return
  }
  if (i > 0 && j > 0 && rawDiff[i - 1][j - 1]) {
    compare(i - 1, j - 1, src, cb)
    cb.eq(xs[i - 1])
  } else if (i === j && !rawDiff[i - 1][j - 1]) {
    compare(i - 1, j - 1, src, cb)
    cb.neq(xs[i - 1], ys[i - 1])
  } else if (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j]) {
    compare(i, j - 1, src, cb)
    cb.add(ys[j - 1])
  } else if (j === 0 || matrix[i][j - 1] < matrix[i - 1][j]) {
    compare(i - 1, j, src, cb)
    cb.sub(xs[i - 1])
  }
}

/**
 * Computes the Longest Common Subsequence table
 * @param xs Indexed Sequence 1
 * @param ys Indexed Sequence 2
 */
function computeLcsMatrix(xsSrc: Adapter<*>, ysSrc: Adapter<*>): LCSMatrix {
  let i: number
  let j: number
  const n: number = xsSrc.size()
  const m: number = ysSrc.size()
  const matrix: (number[])[] = []
  const rawDiff: (boolean[])[] = []
  const xs: number[] = []
  const ys: number[] = []

  for (i = 0; i < n; i++) {
    matrix[i] = [0]
    rawDiff.push([])
    xs.push(xsSrc.get(i))
  }
  matrix[n] = [0]
  for (j = 0; j < m; j++) {
    matrix[0][j] = 0
    ys.push(ysSrc.get(j))
  }
  matrix[0][m] = 0

  for (i = 0; i < n; i++) {
    for (j = 0; j < m; j++) {
      const isEqual: boolean = rawDiff[i][j] = xsSrc.is(xs[i], ys[j])
      if (isEqual) {
        matrix[i + 1][j + 1] = matrix[i][j] + 1
      } else {
        matrix[i + 1][j + 1] = Math.max(matrix[i + 1][j], matrix[i][j + 1])
      }
    }
  }

  return {
    matrix,
    rawDiff,
    xs,
    ys
  }
}

/**
 * Returns the resulting diff operations of LCS between two sequences
 * @param xs Indexed Sequence 1
 * @param ys Indexed Sequence 2
 * @returns Array of DiffResult {op:'=' | '+' | '-', val:any}
 */
export default function lcsDiff(xs: Adapter<*>, ys: Adapter<*>, cb: Processor): void {
  compare(xs.size(), ys.size(), computeLcsMatrix(xs, ys), cb)
}
