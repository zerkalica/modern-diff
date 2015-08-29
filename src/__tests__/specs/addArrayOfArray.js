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
  ]
}
