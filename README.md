```javascript
var find = require('level-find')
var memdb = require('memdb')
var assert = require('assert')

var level = memdb()

// Put some test data.
level.batch([
  {type: 'put', key: 'a', value: 1},
  {type: 'put', key: 'b', value: 2},
  {type: 'put', key: 'c', value: 3}
], function (error, done) {
  assert.ifError(error)

  function greaterThan2 (data, callback) {
    callback(null, data.value > 2)
  }

  find(level, greaterThan2, function (error, found) {
    assert.ifError(error)
    assert.deepEqual(found, {
      key: 'c',
      value: 3
    })
  })

  function keyIsB (key, callback) {
    callback(null, key === 'b')
  }

  // Optional option-object arguments are just like the option-object
  // arguments to `levelup.createReadStream()`.
  var justKeysAfterA = {
    keys: true,
    values: false,
    gt: 'a'
  }

  find(level, justKeysAfterA, keyIsB, function (error, found, matched) {
    assert.ifError(error)
    assert.deepEqual(found, 'b')
    assert.strictEqual(matched, true)
  })

  var justKeysAfterB = {
    keys: true,
    values: false,
    gt: 'b'
  }

  find(level, justKeysAfterB, keyIsB, function (error, found, matched) {
    assert.ifError(error)
    // Like Array.prototype.find, level-find sends back undefined if
    // there's no match.
    assert.strictEqual(found, undefined)
    // Since undefined is valid LevelUP value, level-find also calls
    // back with an additional boolean argument showing whether there
    // was any match.
    assert.strictEqual(matched, false)
  })
})
```
