var test = require('tap').test
var spinner = require('../spin.js')

test('does nothing when not a tty', function(t) {
  var int = spinner({
    stream: { write: function(c) {
      throw new Error('wrote something: ' + JSON.stringify(c))
    }, isTTY: false },
  })
  t.notOk(int)
  t.end()
})

test('write spinny stuff', function(t) {
  var output = ''
  var written = 0
  var expect = "b\bc\bd\be\bf\bg\bh\bi\bj\bk\bl\bm\bn\bo\bp\ba\bb\bc\bd\be\bf\bg\bh\bi\bj\bk\bl\bm\bn\bo\bp\ba\bb\bc\bd\be\bf\bg\bh\bi\bj\bk\bl\bm\bn\bo\bp\ba\bb\bc\b"

  var int = spinner({
    interval: 0,
    string: 'abcdefghijklmnop',
    stream: {
      write: function(c) {
        output += c
        if (++written == 50) {
          t.equal(output, expect)
          clearInterval(int)
          t.end()
        }
      },
      isTTY: true
    },
    cleanup: false
  })
})
