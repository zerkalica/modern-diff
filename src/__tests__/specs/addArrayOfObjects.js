export default {
  'should add an element to the end of array of objects': [
    [
      {
        val: '111-111-111',
        name: 'phone 1'
      },
      {
        val: '222-222-222',
        name: 'phone 2'
      }
    ],
    [
      {
        val: '111-111-111',
        name: 'phone 1'
      },
      {
        val: '222-222-222',
        name: 'phone 2'
      },
      {
        val: '333-333-333',
        name: 'phone 3'
      }
    ],
    [{
      op: 'add',
      path: '/-',
      value: {
        val: '333-333-333',
        name: 'phone 3'
      }
    }]
  ],
  'should add an element to the middle of array of objects': [
    [
      {
        val: '111-111-111',
        name: 'phone 1'
      },
      {
        val: '222-222-222',
        name: 'phone 2'
      }
    ],
    [
      {
        val: '111-111-111',
        name: 'phone 1'
      },
      {
        val: '222-222-222',
        name: 'phone 1a'
      },
      {
        val: '222-222-222',
        name: 'phone 2'
      }
    ],
    [{
      op: 'add',
      path: '/1',
      value: {
        val: '222-222-222',
        name: 'phone 1a'
      }
    }]
  ]
}
