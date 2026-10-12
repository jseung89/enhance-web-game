import test from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../src/utils/random.js';
import { enhance, getEnhanceCost, getSuccessRate } from '../src/utils/enhanceLogic.js';
import { pickResultByWeight } from '../src/utils/rouletteLogic.js';
import { startRun, upgradeRun, enterRunBattle, attackRun, chooseRunReward, enemyMaxHp } from '../src/utils/runLogic.js';

const state = { enhanceLevel: 12, gold: 10000, stone: 50, protectScroll: 1, enhanceRngState: 123 };
const rolls = (...values) => () => values.shift() ?? 0;

test('seeded random resumes after JSON save and load', () => {
  const rng=createRng(23);rng();rng();
  const resumed=createRng(JSON.parse(JSON.stringify({seed:rng.getState()})).seed);
  assert.deepEqual(Array.from({length:100},rng),Array.from({length:100},resumed));
});
test('enhancement is repeatable and preserves its input', () => {
  const before=structuredClone(state), a=enhance(state,true), b=enhance(state,true);
  assert.deepEqual(a,b);assert.deepEqual(state,before);
  assert.equal(a.nextState.enhanceHistory[0].seed,123);
  assert.equal(a.nextState.enhanceAttempts,1);
});
test('enhancement consumes exact cost and protects only an actual downgrade', () => {
  const cost=getEnhanceCost(12);
  for(const [random,expected,level,scroll] of [
    [rolls(.1), 'success',13,1], [rolls(.9,.9),'fail',12,1],
    [rolls(.9,.1),'protected',12,0]]) {
    const result=enhance(state,true,random);
    assert.equal(result.result,expected);assert.equal(result.nextState.enhanceLevel,level);
    assert.equal(result.nextState.protectScroll,scroll);
    assert.equal(result.nextState.gold,state.gold-cost.goldCost);
    assert.equal(result.nextState.stone,state.stone-cost.stoneCost);
  }
  assert.equal(enhance(state,false,rolls(.9,.1)).nextState.enhanceLevel,11);
});
test('max level and insufficient funds neither spend nor advance random state', () => {
  for(const input of [{...state,enhanceLevel:20},{...state,gold:0},{...state,stone:0}]) {
    assert.equal(enhance(input,true,()=>{throw Error('must not roll');}).nextState,input);
  }
});
test('a zero-weight segment cannot win at the zero boundary',()=>{
  assert.equal(pickResultByWeight({miss:0,light:100,heavy:0,special:0},()=>0),'light');
});
test('one million seeded success rolls match displayed probability within 0.3 points',()=>{
  for(const level of [0,6,11,16]) {
    const rng=createRng(1234+level), rate=getSuccessRate(level);let successes=0;
    for(let i=0;i<250000;i++)if(rng()*100<rate)successes++;
    assert.ok(Math.abs(successes/250000*100-rate)<.3);
  }
});
test('run enforces preparation limits and stops upgrades during combat',()=>{
  let run=startRun(77);for(let i=0;i<4;i++)run=upgradeRun(run);
  assert.equal(run.stones,1);assert.equal(run.upgrades,4);assert.equal(upgradeRun(run),run);
  const fighting=enterRunBattle(run);assert.equal(upgradeRun(fighting),fighting);
  assert.equal(chooseRunReward(fighting,'edge'),fighting);
});
test('run rewards cannot be claimed twice and bosses have extra health',()=>{
  const reward={...startRun(1),phase:'reward',hp:4};
  const next=chooseRunReward(reward,'supplies');
  assert.equal(next.stage,2);assert.equal(next.hp,13);assert.equal(next.stones,9);
  assert.equal(chooseRunReward(next,'supplies'),next);
  assert.equal(chooseRunReward(reward,'invalid'),reward);
  assert.equal(enemyMaxHp(3),11);assert.equal(enemyMaxHp(6),14);assert.equal(enemyMaxHp(9),17);
});
test('combat resumes identically after serialization and terminal actions are inert',()=>{
  const fighting=enterRunBattle(startRun(888));
  assert.deepEqual(attackRun(fighting),attackRun(JSON.parse(JSON.stringify(fighting))));
  for(const phase of ['won','lost','reward','prepare']) {
    const run={...fighting,phase};assert.equal(attackRun(run),run);
  }
});
test('a complete run reaches stage nine and records all eight reward choices',()=>{
  let run={...startRun(456),damageBonus:100};let guard=0;
  while(run.phase!=='won' && guard++<100) {
    if(run.phase==='prepare')run=enterRunBattle(run);
    else if(run.phase==='reward')run=chooseRunReward(run,'supplies');
    else run=attackRun(run);
  }
  assert.equal(run.phase,'won');assert.equal(run.stage,9);
  assert.equal(run.events.filter(e=>e.action==='reward').length,8);
});
