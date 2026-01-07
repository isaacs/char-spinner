import t from 'tap'

import { spinner } from '../src/index.js'

t.test('does nothing when not a tty', t => {
  for (const tty of [true, undefined]) {
    const clear = spinner({
      tty,
      stream: {
        write: c => {
          throw new Error('wrote something: ' + JSON.stringify(c))
        },
        isTTY: false,
      },
    })
    t.notOk(clear)
  }
  t.end()
})

t.test('calls unref if told to, multiple clears are ok', t => {
  for (const unref of [true, undefined]) {
    const clear = spinner({
      delay: 3,
      stream: {
        isTTY: true,
        write: () => true,
      },
      unref,
    })
    clear()
    clear()
    clear()
  }
  t.end()
})

t.test('waits on a promise', async () => {
  let resolve
  const promise = new Promise(res => (resolve = res))
  const clear = spinner({
    stream: {
      isTTY: true,
      write: () => true,
    },
    unref: false,
    promise,
  })

  resolve()
  clear()

  return promise
})

t.test('write spinny stuff', t => {
  let output = ''
  let written = 0
  const expect =
    'b\u001b[0Gc\u001b[0Gd\u001b[0Ge\u001b[0Gf\u001b[0Gg\u001b[0Gh\u001b[0Gi\u001b[0Gj\u001b[0Gk\u001b[0Gl\u001b[0Gm\u001b[0Gn\u001b[0Go\u001b[0Gp\u001b[0Ga\u001b[0Gb\u001b[0Gc\u001b[0Gd\u001b[0Ge\u001b[0Gf\u001b[0Gg\u001b[0Gh\u001b[0Gi\u001b[0Gj\u001b[0Gk\u001b[0Gl\u001b[0Gm\u001b[0Gn\u001b[0Go\u001b[0Gp\u001b[0Ga\u001b[0Gb\u001b[0Gc\u001b[0Gd\u001b[0Ge\u001b[0Gf\u001b[0Gg\u001b[0Gh\u001b[0Gi\u001b[0Gj\u001b[0Gk\u001b[0Gl\u001b[0Gm\u001b[0Gn\u001b[0Go\u001b[0Gp\u001b[0Ga\u001b[0Gb\u001b[0Gc\u001b[0G'

  const clear = spinner({
    interval: 0,
    string: 'abcdefghijklmnop',
    unref: false,
    stream: {
      write: c => {
        output += c
        if (++written == 50) {
          t.equal(output, expect)
          clear()
          t.end()
        }
      },
      isTTY: true,
    },
    cleanup: false,
  })
})

t.test('spin on a function', async t => {
  let res
  const p = new Promise(resolve => res = resolve)
  const asunc = async () => {
    res(10)
  }
  spinner({
    promise: asunc,
    stream: {
      write: () => true,
      isTTY: true,
    },
  })
  // didn't do anything, just returns the value without any spinner
  t.equal(await p, 10)
  t.end()
})
