const assert = require('assert');

// Emulate browser, part1
global.window = {};

const fuCounter = require('../index.cjs');

// Assert browser initializes
assert.ok(!!global.window.FuCounter, "FuCounter was not injected in the browser");
delete global.window; // Cleanup again

assert.ok(fuCounter.create instanceof Function, "No function is exported");

// Dummy for coverage
fuCounter.create();

// Dummy for auto-name detection, name of passed function
(function whatsMyName() {
  const nameInferred = fuCounter.create();
  nameInferred(function iDunno() {})();
  nameInferred.print();
})();

// Dummy for auto-name detection, name of parent function
(function whatsMyName() {
  const nameInferred = fuCounter.create();
  nameInferred(() => {})();
  nameInferred.print();
})();

// Dummy for stopwatch
fuCounter.create({ watch: 1, debug: 1 }).stopWatch();

// Setup a counter
const fuc1 = fuCounter.create({
  debug: true,
  name: 'fuc1',
  printOnExit: true,
  watch: 30,
});

// Assert basic signature
assert.ok(fuc1.print instanceof Function, "print is not a function");
assert.ok(fuc1.reset instanceof Function, "reset is not a function");
assert.ok(fuc1.stats instanceof Function, "stats is not a function");
assert.ok(fuc1.stopWatch instanceof Function, "stopWatch is not a function");

// Call some function early on, expect no errors
assert.ok(typeof fuc1.print() === 'undefined', "print should return nothing");
assert.ok(typeof fuc1.stats() === 'object', "Stats are not a object");
assert.ok(typeof fuc1.reset() === 'undefined', "reset should return nothing");

// Assert stats() work
fuc1('fnc1', (v1, v2) => {
  assert.equal(v1, 'a1');
  assert.equal(v2, 'a2');
})('a1', 'a2');
fuc1('fnc2', () => {})();
assert(fuc1.stats()['fnc1'], 1, "Counter for fnc1 does not work");
assert(fuc1.stats()['fnc2'], 1, "Counter for fnc1 does not work");

// Assert reset works
fuc1.reset();
assert.equal(fuc1.stats()['fnc1'], 0, "Counter for fnc1 does not reset");
assert.equal(fuc1.stats()['fnc2'], 0, "Counter for fnc1 does not reset");

// Assert print works
// + force alternative branch in print, when sorting on name '?'
fuc1('a', () => {})();
fuc1.print();

// Generate a larger count
Array.from(Array(1000)).forEach(fuc1('fnc1', () => {}));
assert.equal(fuc1.stats()['fnc1'], 1000, "Counter for fnc1 does not work");

// Assert watch works
setTimeout(fuc1.stopWatch, 40);
setTimeout(() => {
  console.log('Code tests are okay');
  console.log('bye.');
}, 50);
