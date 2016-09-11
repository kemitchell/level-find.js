var assign = require('object-assign')
var once = require('once')

module.exports = function (/* variadic */) {
  var level, options, predicate, callback
  var argc = arguments.length
  if (argc === 4) {
    level = arguments[0]
    options = assign({}, arguments[1])
    predicate = arguments[2]
    callback = once(arguments[3])
  } else if (argc === 3) {
    level = arguments[0]
    options = {}
    predicate = arguments[1]
    callback = once(arguments[2])
  } else {
    throw new Error('missing arguments')
  }

  var stream = level.createReadStream(options)
  .on('data', function (data) {
    predicate(data, function (error, matches) {
      if (error) {
        callback(error)
      } else {
        if (matches) {
          stream.destroy()
          callback(null, data, true)
        }
      }
    })
  })
  .once('end', function () {
    callback(null, undefined, false)
  })
  .once('error', function (error) {
    callback(error)
  })
}
