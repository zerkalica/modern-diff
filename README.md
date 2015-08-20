modern-diff
===========

Compare two data structures and create patches with some additional info.

-	Different patch codecs: can produce RFC 6902 style patches or compact patches
-	Supports immutable-js or native-data structures via adapters
-	Fastest lcs algorithm
-	Can create inverted patches

Install:

```
npm install modern-diff
```

Immutable.JS
------------

You can then use it to get the diff ops between you Immutable.JS data structures.

```javascript
import Immutable from 'immutable'
import Diff from 'modern-diff'
import Rfc9602Codec from 'modern-diff/codecs/Rfc9602Codec'
import ImmutableAdapter from 'modern-diff/adapters/ImmutableAdapter'
const diff = Diff({
    adapter: ImmutableAdapter,
    codec: Rfc9602Codec
})
const map1 = Immutable.Map({a:1, b:2, c:3})
const map2 = Immutable.Map({a:1, b:2, c:3, d: 4})

diff(map1, map2)
// [ { op: "add", path: "/d", value: 4 } ]
```

Native
------

```javascript
import Immutable from 'immutable'
import Diff from 'modern-diff'
import Rfc9602Codec from 'modern-diff/codecs/Rfc9602Codec'
import NativeAdapter from 'modern-diff/adapters/NativeAdapter'
const diff = Diff({
    adapter: NativeAdapter,
    codec: Rfc9602Codec
})
const map1 = {a:1, b:2, c:3}
const map2 = {a:1, b:2, c:3, d: 4}

diff(map1, map2)
// [ { op: "add", path: "/d", value: 4 } ]
```
