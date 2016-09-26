/* eslint-env mocha */
import assert from 'power-assert'
import helper from './helper'
import specs from './specs'

function testGen({adapters, groups, types}) {
  types.forEach(type => {
    describe(type, () => {
      Object.keys(adapters).forEach(name => {
        const o = adapters[name]
        describe(name, () => {
          Object.keys(groups).forEach(group => {
            describe(group, () => {
              Object.keys(groups[group]).forEach(key => {
                const [a, b, testDiff] = groups[group][key]
                it(`${type} ${name} ${group} ${key}`, () => {
                  type === 'diff'
                    ? assert.deepEqual(o.diff()(a, b), testDiff)
                    : assert.deepEqual(o.patch()(a, testDiff), b)
                })
              })
            })
          })
        })
      })
    })
  })
}

testGen({
  adapters: helper,
  groups: specs,
  types: ['patch', 'diff']
})
