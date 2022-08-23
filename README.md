```txt
█▀▀ █  █   █▀▀ █▀▀█ █  █ █▀▀▄ ▀▀█▀▀ █▀▀ █▀▀█
█▀  █  █ - █   █  █ █  █ █  █   █   █▀  █▄▄▀
▀    ▀▀▀   ▀▀▀ ▀▀▀▀  ▀▀▀ ▀  ▀   ▀   ▀▀▀ ▀ ▀▀
           Function usage counter
```

# Function Usage Counter - `fu-counter`

Function usage counter is a small, basic call counter.
It allows you to quickly throw some usage counters on functions,
give em names, and later, print out the counts.
With these counts, you can find parts of the code that execute
a lot (and find places for performance tuning?).

- 100% Test coverage
- No dependencies
- `.mjs` and `.cjs` support
- Browser compatible

## Reasoning

**Q:** *"Hey, why don't you profile using the debugger? Much better!"*.  
**A:** Sure, but if your application runs an algorithm for a few minutes,
   the debugger does not hold out, and crashes.

## Usage

Counts are gathered in a (named) group. You can have multiple groups,
or just one, whatever you like:

```js
const group1Counts = FuCounter.create({
  name: 'group1'
});

// Now you can:
//  - pass it around
//  - stick it on a context
//  - assign to global
//  - ...
```

Next, start wrapping a function, which slighly degraded performance,
due to the counting itself.

```js
// Before:
module.exports = {
  doWork: () => {
    /// ... i work hard ...
  }
}

// After:
module.exports = {
  doWork: group1Counts('doWorkCount', () => {
    /// ... i work hard ...
  })
}
```

Finally, get some insights:

- A `stats` function returns the count for each counter
- A `print` function does a `console.log` with a nice human
  readable format

```js
group1Counts.stats()
// Returns
/*
{
  doWorkCount: 123
}
*/
```

or

```js
group1Counts.print()
// Prints to console.log
/*
group1 (fu counter):
  123 doWorkCount
   .. ...
    1 didOneWork
*/
```

## Watching a running process

If you want to track the counts in a running process,
you can use a `watch: <milliseconds>` option when creating the group.
The `print` function will automatically be called using a `setInterval`.

```js
const group = FuCounter.create({
  // ...
  watch: 1000 // group.print() every second
})

// You can stop watching as well:
group.stopWach();
```

## Dealing with `process` crashes (node)

If your process has a tendency to crash,
you can also get a final print before the process dies:

```js
const group = FuCounter.create({
  // ...
  printOnExit: true // group.print() is called during process.on('exit', )
})
```

## Browser support

If you want to get counts in a browser, simply load the file `./fu-counter.js`
into your browser, and `window.FuCounter.create(...)` will be available.
(Do not load the index files in your browser, not supported)
