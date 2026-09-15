import assert from 'node:assert/strict';
import {makeAnchors,solve,randomize,tangent,samples} from '../dist/geometry.mjs';
let checked=0;
function verify(a){const g=solve(a);for(const e of g.edges){if(!e)continue;const p=a.find(x=>x.id===e.from),q=a.find(x=>x.id===e.to),dx=e.b.x-e.a.x,dy=e.b.y-e.a.y;assert.ok(Math.abs(Math.hypot(e.a.x-p.x,e.a.y-p.y)-p.radius)<1e-6);assert.ok(Math.abs(Math.hypot(e.b.x-q.x,e.b.y-q.y)-q.radius)<1e-6);assert.ok(Math.abs(dx*e.n1.x+dy*e.n1.y)<1e-6);assert.ok(Math.abs(dx*e.n2.x+dy*e.n2.y)<1e-6);checked++;}for(const arc of g.arcs){if(!arc)continue;const p=arc.center;assert.ok(Math.abs(p.x+arc.radius*Math.cos(arc.start+arc.delta)-arc.to.x)<1e-6);assert.ok(Math.abs(p.y+arc.radius*Math.sin(arc.start+arc.delta)-arc.to.y)<1e-6);}assert.ok(!/NaN|Infinity/.test(g.path));return g;}
for(const name of Object.keys(samples)){const a=makeAnchors(name);assert.equal(verify(a).invalid.length,0);for(let seed=0;seed<80;seed++)verify(randomize(a,seed,100));const zero=a.map(x=>({...x,radius:0}));assert.equal(verify(zero).invalid.length,0);}
const a=makeAnchors();a[0].locked=true;assert.deepEqual(randomize(a,123,80),randomize(a,123,80));assert.deepEqual(randomize(a,123,80)[0],a[0]);assert.deepEqual(randomize(a,123,0),a);
assert.equal(tangent({x:0,y:0,radius:20,side:1},{x:10,y:0,radius:20,side:-1}),null);
assert.equal(tangent({x:0,y:0,radius:30,side:1},{x:10,y:0,radius:5,side:1}),null);
assert.equal(solve(makeAnchors('Triangle')).crosses,false);
console.log(`PASS: ${checked} tangent checks; arc endpoints, zero radius, invalid configurations, repeatability, and locks.`);
