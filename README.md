# char-spinner

Put a little spinner on process.stderr, as unobtrusively as possible.

## USAGE

```ts
import { spinner } from 'char-spinner'

// All options are optional
// even the options argument itself is optional
const clear = spinner(options)

// the return value is the clear function
// call it to stop the spinner
clear()
```

## OPTIONS

Usually the defaults are what you want. Mostly they're just
configurable for testing purposes.

- `stream` Output stream. Default=`process.stderr`
- `tty` Only show spinner if output stream has a truish `.isTTY`. Default=`true`
- `string` String of chars to spin. Default=`'/-\\|'`
- `interval` Number of ms between frames, bigger = slower. Default=`50`
- `cleanup` Print `'\r \r'` to stream on process exit. Default=`true`
- `unref` Unreference the spinner interval so that the process can
  exit normally. Default=`true`
- `delay` Number of frames to "skip over" before printing the spinner.
  Useful if you want to avoid showing the spinner for very fast
  actions. Default=`2`
- `promise` Pass in a promise or promise-returning function if
  you want it to automatically stop spinning when the promise
  resolves.

Returns a `clear` function if a spinner was created, otherwise
`undefined`.
