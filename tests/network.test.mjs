import assert from 'node:assert/strict';
import {connectAnchors,interiorShare,networkTangents} from '../dist/network.mjs';
import {makeAnchors} from '../dist/geometry.mjs';
for(const n of [3,8,15]){
 const points=Array.from({length:n},(_,i)=>({id:i+1,x:Math.cos(i/n*Math.PI*2)*100,y:Math.sin(i/n*Math.PI*2)*100}));
 for(const from of [1,2,5,10])for(const to of [1,2,5,10]){
  const net=connectAnchors(points,from,to,42);
  assert.equal(net.edges.length,n*Math.min(n-1,from,to));
  assert.equal(new Set(net.edges.map(e=>`${e.from}:${e.to}`)).size,net.edges.length);
  for(const e of net.edges){assert.notEqual(e.from,e.to);assert.deepEqual(e.a,{x:points[e.from-1].x,y:points[e.from-1].y});}
  assert.ok(net.outgoing.every(x=>x<=from&&x<=n-1));assert.ok(net.incoming.every(x=>x<=to&&x<=n-1));
  assert.deepEqual(net,connectAnchors(points,from,to,42));
 }
}
const points=makeAnchors();
for(const mode of ['shape','external','internal']){
 const net=networkTangents(points,connectAnchors(points,2,2,0).edges,mode);
 for(const e of net.edges){const a=points.find(a=>a.id===e.from),b=points.find(a=>a.id===e.to),dx=e.b.x-e.a.x,dy=e.b.y-e.a.y;
  assert.ok(Math.abs(Math.hypot(e.a.x-a.x,e.a.y-a.y)-a.radius)<1e-7);
  assert.ok(Math.abs(Math.hypot(e.b.x-b.x,e.b.y-b.y)-b.radius)<1e-7);
  assert.ok(Math.abs(dx*(e.a.x-a.x)+dy*(e.a.y-a.y))<1e-7);
 }
}
assert.equal(networkTangents([{id:1,x:0,y:0,radius:10,side:1},{id:2,x:5,y:0,radius:10,side:1}],[{from:1,to:2}],'internal').invalid.length,1);
assert.notDeepEqual(connectAnchors(points,2,2,0).edges,connectAnchors(points,2,2,1).edges);
assert.deepEqual(connectAnchors(points,2,2,0),connectAnchors(points.map(p=>({...p,radius:99,side:-p.side})),2,2,0));
const octagon=Array.from({length:8},(_,i)=>({id:i,x:100*Math.cos(i*Math.PI/4),y:100*Math.sin(i*Math.PI/4)}));
for(let seed=0;seed<10;seed++){
 const edges=connectAnchors(octagon,2,2,seed).edges;
 assert.ok(edges.every(e=>Math.abs(e.from-e.to)!==1&&Math.abs(e.from-e.to)!==7),'Prefer interior diagonals when capacity allows');
 assert.ok(edges.every(e=>interiorShare(e.a,e.b,octagon)===1));
}
const weighted=octagon.map((point,index)=>({...point,centerParticipation:index===0?0:index===1?2:1})),weightedNet=connectAnchors(weighted,2,2,3,'mixed','centerParticipation');
assert.equal(weightedNet.outgoing[0],0);assert.equal(weightedNet.incoming[0],0);assert.ok(weightedNet.outgoing[1]>1||weightedNet.incoming[1]>1,'High participation increases the available line capacity.');
console.log('PASS: network capacities, routing, participation, unique directed edges, fixed centers, repeatable variation and independence from radius/wrap.');
