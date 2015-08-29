export default {
  'should replace an element on self': [
    [1, 'r', 3, 4],
    [1, 2, 3, 4],
    [
      { op: 'test', path: '/1', value: 'r'},
      { op: 'replace', path: '/1', value: 2}
    ]
  ],

  'should replace property on self': [
    { a: 1, b: 'r'},
    { a: 1, b: 2 },
    [
      { op: 'test', path: '/b', value: 'r' },
      { op: 'replace', path: '/b', value: 2 }
    ]
  ],

  'should replace an element on an array member': [
    { a: [1, 'r', 3, 4] },
    { a: [1, 2, 3, 4] },
    [
      { op: 'test', path: '/a/1', value: 'r' },
      { op: 'replace', path: '/a/1', value: 2 }
    ]
  ],

  'should replace an element on a nested array member': [
    { a: { b: [1, 'r', 3, 4] }},
    { a: { b: [1, 2, 3, 4] }},
    [
      { op: 'test', path: '/a/b/1', value: 'r' },
      { op: 'replace', path: '/a/b/1', value: 2 }
    ]
  ],

  'should replace a property on a nested object member': [
    { a: { b: { c: 1, d: 'r' } } },
    { a: { b: { c: 1, d: 2 } } },
    [
      { op: 'test', path: '/a/b/d', value: 'r' },
      { op: 'replace', path: '/a/b/d', value: 2 }
    ]
  ]
}
