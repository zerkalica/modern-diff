export default {
  'should add an element to the end of array of array': [
    [['set1', 'set2'], ['set3', 'set4']],
    [['set1', 'set2'], ['set3', 'set4', 'set5']],
    [{ op: 'add', path: '/1/-', value: 'set5' }]
  ],
  'should add an element to the middle of array of array': [
    [['set1', 'set2'], ['set3', 'set4']],
    [['set1', 'set2'], ['set3', 'set3a', 'set4']],
    [{ op: 'add', path: '/1/1', value: 'set3a' }]
  ],
  'should replace an element in array of array': [
    [['set1', 'set2'], ['set3', 'set4']],
    [['set1a', 'set2'], ['set3a', 'set4']],
    [
      { op: 'test', path: '/0/0', value: 'set1' },
      { op: 'replace', path: '/0/0', value: 'set1a' },
      { op: 'test', path: '/1/0', value: 'set3' },
      { op: 'replace', path: '/1/0', value: 'set3a' }
    ]
  ],
  'should remove an subelement in array of array': [
    [['set1', 'set2'], ['set3', 'set4']],
    [['set1', 'set2'], ['set4']],
    [
      { op: 'test', path: '/1/0', value: 'set3'},
      { op: 'remove', path: '/1/0'}
    ]
  ],
  'should remove an element in array of array': [
    [['set1', 'set2'], ['set3', 'set4']],
    [['set1', 'set2']],
    [
      { op: 'test', path: '/1', value: ['set3', 'set4']},
      { op: 'remove', path: '/1'}
    ]
  ]
}
