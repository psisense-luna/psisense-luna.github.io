'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {Engine,FS}=require('../signal-engine.js');
test('deterministic generator remains identical across streaming chunk sizes',()=>{
  const a=new Engine(),b=new Engine();a.advance(32);for(let i=0;i<128;i++)b.advance(.25);
  assert.deepEqual(a.samples(16),b.samples(16));assert.equal(a.count,FS*32);assert.ok(a.analyze().demo16!==null);assert.ok(a.analyze().demo30!==null);
});
test('a rhythm change moves the measured spectrum instead of only changing a label',()=>{
  const a=new Engine();a.advance(32);const fast=a.spectrum().bands;a.setPreset('slow');a.advance(32);const slow=a.spectrum().bands;
  assert.ok(slow[0]>fast[0]+.4);assert.ok(fast[2]>slow[2]+.3);assert.ok(Math.abs(slow.reduce((x,y)=>x+y,0)-1)<1e-10);
});
test('disconnect and clipping suppress readings; clean data must refill the past windows',()=>{
  const a=new Engine();a.advance(32);a.artifact='disconnect';assert.equal(a.analyze().demo16,null);a.advance(3);assert.equal(a.analyze().quality,'disconnected');
  a.artifact='clip';a.advance(3);assert.equal(a.analyze().quality,'clipped');assert.equal(a.analyze().demo30,null);
  a.artifact='none';a.advance(3);assert.equal(a.analyze().quality,'usable');assert.equal(a.analyze().demo16,null);assert.equal(a.analyze().demo30,null);
  a.advance(14);assert.ok(a.analyze().demo16!==null);assert.equal(a.analyze().demo30,null);a.advance(14);assert.ok(a.analyze().demo30!==null);
});
test('outputs remain unavailable before complete causal windows; exports are synthetic',()=>{
  const a=new Engine();a.advance(15);assert.equal(a.analyze().demo16,null);a.advance(1);assert.ok(a.analyze().demo16!==null);assert.equal(a.analyze().demo30,null);
  const snapshot=a.export();assert.equal(snapshot.protected_model_inference,false);assert.equal(snapshot.clinical_labels,false);assert.equal(snapshot.eeg_uv[0].length,2048);assert.ok(!JSON.stringify(snapshot).includes('patient'));
});
test('ring buffers and histories stay bounded in a long session',()=>{
  const a=new Engine();for(let i=0;i<5;i++)a.advance(60);
  assert.equal(a.history.length,240);assert.equal(a.samples(100).length,8192);assert.ok(Number.isFinite(a.analyze().rms));
});
