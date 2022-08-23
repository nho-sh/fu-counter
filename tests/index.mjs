// Test that the code loads as a module
import assert from 'assert';
import fuCounter from '../index.mjs';

assert.ok(fuCounter.create instanceof Function, "No function is exported");

console.log('Module loads okay');
console.log('bye.');
