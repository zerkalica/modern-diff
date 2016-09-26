export default {
  'should remove an element from self': [
    [ 1, 'x', 2, 3 ],
    [ 1, 2, 3 ],
    [
      { op: 'test', path: '/1', value: 'x' },
      { op: 'remove', path: '/1' }
    ]
  ],

  'should remove a property from self': [
    { a: 1, x: 'x' },
    { a: 1 },
    [
      { op: 'test', path: '/x', value: 'x' },
      { op: 'remove', path: '/x' }
    ]
  ],

  'should remove an element from an array member': [
    {a: [1, 'x', 2, 3]},
    {a: [1, 2, 3]},
    [
      { op: 'test', path: '/a/1', value: 'x'},
      { op: 'remove', path: '/a/1'}
    ]
  ],

  'should remove an element from a nested array member': [
    { a: { b: [1, 'x', 2, 3] } },
    { a: { b: [1, 2, 3] }},
    [
      { op: 'test', path: '/a/b/1', value: 'x'},
      { op: 'remove', path: '/a/b/1' }
    ]
  ],

  'should remove a property from a nested object member': [
    { a: { b: { c: 1, d: 'x' } }},
    { a: { b: { c: 1 } }},
    [
      {op: 'test', path: '/a/b/d', value: 'x'},
      {op: 'remove', path: '/a/b/d'}
    ]
  ]
}
