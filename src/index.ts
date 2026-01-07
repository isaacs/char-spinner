export type Options = {
  /** the output stream, defaults to process.stderr */
  stream?: NodeJS.WritableStream & { isTTY?: boolean }

  /** only create spinner for TTY streams (default true) */
  tty?: boolean

  /** the characters to use for the spinner */
  string?: string

  /** how often to update, in ms */
  interval?: number

  /** number of interval turns before spinner starts, default 2 */
  delay?: number

  /** unref the interval so the program can exit gracefully */
  unref?: boolean

  /** clear the timer on process exit, if still running */
  cleanup?: boolean

  /** automatically terminate spinner when promise resolves */
  promise?: Promise<unknown> | ((...a: any[]) => Promise<unknown>)
}

export const spinner = (opt: Options = {}): (() => void) | void => {
  /* c8 ignore start */
  const str = opt.stream || process.stderr
  const tty = typeof opt.tty === 'boolean' ? opt.tty : true
  /* c8 ignore stop */
  const string = opt.string || '/-\\|'
  const ms = Math.max(
    typeof opt.interval === 'number' ? opt.interval : 50,
    0,
  )

  // indicate that nothing is being done
  if (tty && !str.isTTY) return

  /* c8 ignore start */
  const CR = str.isTTY ? '\u001b[0G' : '\u000d'
  const CLEAR = str.isTTY ? '\u001b[2K' : '\u000d \u000d'
  /* c8 ignore stop */

  const sprite = string.split('')

  let s = 0
  let wrote = false
  let delay = typeof opt.delay === 'number' ? opt.delay : 2

  const interval = setInterval(() => {
    if (--delay >= 0) return
    s = ++s % sprite.length
    const c = sprite[s]
    str.write(c + CR)
    wrote = true
  }, ms)

  const unref = typeof opt.unref === 'boolean' ? opt.unref : true
  if (unref && typeof interval.unref === 'function') {
    interval.unref()
  }

  const cleanup = typeof opt.cleanup === 'boolean' ? opt.cleanup : true
  if (cleanup) {
    process.on('exit', () => {
      /* c8 ignore start */
      if (wrote) str.write(CLEAR)
      /* c8 ignore stop */
    })
  }

  let cleared = false
  const clear = () => {
    if (cleared) return
    cleared = true
    str.write(CLEAR)
    clearInterval(interval)
  }

  const promise =
    typeof opt.promise === 'function' ? opt.promise() : opt.promise
  promise?.then(clear)

  return clear
}
