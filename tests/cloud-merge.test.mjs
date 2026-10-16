// Node 20+ regression tests: node --test tests/cloud-merge.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {mergeAchievements,mergeEventLog} from '../js/cloud-merge.js';
test('achievement merge does not double-count repeated snapshots',()=>{
 const a={1:{times:3,last:'2026-10-10'}},b={1:{times:2,last:'2026-10-11'}};
 assert.deepEqual(mergeAchievements(a,b),{1:{times:3,last:'2026-10-11'}});
});
test('event merge is idempotent',()=>{
 const event={id:'event-1',timestamp:10,mission:1};
 assert.deepEqual(mergeEventLog([event],[event]),[event]);
});
test('events without stable IDs are rejected',()=>{
 assert.throws(()=>mergeEventLog([{mission:1}],[]),/stable unique IDs/);
});
test('events are ordered by timestamp',()=>{
 assert.deepEqual(mergeEventLog([{id:'b',timestamp:2}],[{id:'a',timestamp:1}]).map(x=>x.id),['a','b']);
});
