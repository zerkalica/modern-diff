export default {
  'should add an element to self': [
    [1, 3, 4],
    [1, 2, 3, 4],
    [{op: 'add', path: '/1', value: 2}]
  ],
  'should append an element to self': [
    [1, 2, 3],
    [1, 2, 3, 4],
    [{op: 'add', path: '/-', value: 4}]
  ],
  'should add a property to self': [
    {a: 1},
    {a: 1, b: 2},
    [{ op: 'add', path: '/b', value: 2 }]
  ],
  'should add an element to an array member': [
    { a: [1, 3, 4] },
    { a: [1, 2, 3, 4] },
    [{ op: 'add', path: '/a/1', value: 2 }]
  ],
  'should append an element to an array member': [
    { a: [1, 2, 3] },
    { a: [1, 2, 3, 4] },
    [{ op: 'add', path: '/a/-', value: 4 }]
  ],
  'should add an element to a nested array member': [
    { a: { b: [1, 3, 4] } },
    { a: { b: [1, 2, 3, 4] } },
    [{ op: 'add', path: '/a/b/1', value: 2 }]
  ],
  'should append an element to a nested array member': [
    { a: { b: [1, 2, 3] } },
    { a: { b: [1, 2, 3, 4] } },
    [{ op: 'add', path: '/a/b/-', value: 4 }]
  ],
  'should add a property to a nested object member': [
    { a: { b: { c: 1 } } },
    { a: { b: { c: 1, d: 2 } } },
    [{ op: 'add', path: '/a/b/d', value: 2}]
  ]
}
