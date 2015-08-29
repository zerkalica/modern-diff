modern-diff
===========

Compare two data structures and create patches with some additional info. Apply patches to objects. Reverting patches.

Features:

-	Can produce RFC 6902 style patches or compact patches
-	Supports immutable-js or native-data structures via adapters
-	Fastest lcs algorithm for arrays
-	Can revert patches
-	Can patch objects
-	Extensible via adapters
-	Tests

Limitations: can produce only add, replace, remove, test patches.

Diff immutable with rfc codec
-----------------------------

```javascript
// diff-rfc-immutable.js
import Immutable from 'immutable'
import Diff from 'modern-diff'
import Rfc9602Codec from 'modern-diff/codecs/Rfc9602Codec'
import ImmutableAdapter from 'modern-diff/adapters/ImmutableAdapter'
ImmutableAdapter.Immutable = Immutable

const diff = Diff({
    adapter: ImmutableAdapter,
    codec: Rfc9602Codec
})

diff(
  Immutable.fromJS({a: 1, b: 2, c: 3}),
  Immutable.fromJS({b: 22, c: 3, d: 4})
)
/*
[
  { op: 'test', path: '/a', value: 1 },
  { op: 'remove', path: '/a'},
  { op: 'test', path: '/b', value: 2 },
  { op: 'replace', path: '/b', value: 22 },
  { op: 'add', path: '/d', value: 4 }
]
*/
```

Diff native with compact codec
------------------------------

```javascript
import Immutable from 'immutable'
import Diff from 'modern-diff'
import CompactCodec from 'modern-diff/codecs/CompactCodec'
import NativeAdapter from 'modern-diff/adapters/NativeAdapter'

const diffCompact = Diff({
    adapter: NativeAdapter,
    codec: CompactCodec
})

diffCompact({a: 1, b: 2, c: 3}, {b: 22, c: 3, d: 4})
/*
[
  ['-', ['a'], 1],
  ['r', ['b'], 2, 22],
  ['+', ['d'], 4]
]
*/
```

Inverting patches
-----------------

```js
import Rfc9602Codec from 'modern-diff/codecs/Rfc9602Codec'
import CompactCodec from 'modern-diff/codecs/CompactCodec'

CompactCodec.invert([
  ['-', ['a'], 1],
  ['r', ['b'], 2, 22],
  ['+', ['d'], 4]
])
/*
[
  [ '-', [ 'd' ], 4 ],
  [ 'r', [ 'b' ], 22, 2 ],
  [ '+', [ 'a' ], 1 ]
]
*/

Rfc9602Codec.invert([
  { op: 'test', path: '/a', value: 1 },
  { op: 'remove', path: '/a'},
  { op: 'test', path: '/b', value: 2 },
  { op: 'replace', path: '/b', value: 22 },
  { op: 'add', path: '/d', value: 4 }
])

/*
[
  { op: 'test', path: '/d', value: 4 },
  { op: 'remove', path: '/d' },
  { op: 'test', path: '/b', value: 22 },
  { op: 'replace', path: '/b', value: 2 },
  { op: 'add', path: '/a', value: 1 }
]
*/
```

Patch immutable with rfc codec
------------------------------

```js
import Immutable from 'immutable'
import Patch from 'modern-diff/Patch'
import Rfc9602Codec from 'modern-diff/codecs/Rfc9602Codec'
import ImmutableAdapter from 'modern-diff/adapters/ImmutableAdapter'
ImmutableAdapter.Immutable = Immutable

const patch = Patch({
    adapter: ImmutableAdapter,
    codec: Rfc9602Codec
})

patch(Immutable.fromJS({a: 1, b: 2, c: 3}), [
  { op: 'test', path: '/a', value: 1 },
  { op: 'remove', path: '/a'},
  { op: 'test', path: '/b', value: 2 },
  { op: 'replace', path: '/b', value: 22 },
  { op: 'add', path: '/d', value: 4 }
])
/*
  Map {b: 22, c: 3, d: 4}
*/
```
