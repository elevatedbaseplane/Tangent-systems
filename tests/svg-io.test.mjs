import assert from 'node:assert/strict';
import {anchorsFromPoints,fitAnchors} from '../dist/geometry.mjs';
import {parsePointList,parseLinePath,parseTransform,parseSvgText,shapeSvg,lineSystemSvg} from '../dist/svg-io.mjs';
assert.deepEqual(parsePointList('0,0 100,0 100,50 0,50'),[{x:0,y:0},{x:100,y:0},{x:100,y:50},{x:0,y:50}]);
assert.deepEqual(parseLinePath('M 0 0 H 100 V 50 H 0 Z')[0],[{x:0,y:0},{x:100,y:0},{x:100,y:50},{x:0,y:50}]);
assert.deepEqual(parseLinePath('m10 20 40 0 0 30 -40 0z')[0],[{x:10,y:20},{x:50,y:20},{x:50,y:50},{x:10,y:50}]);
assert.deepEqual(parseLinePath('M1e3 0 L2e3 0 L2e3 1e3 Z')[0],[{x:1000,y:0},{x:2000,y:0},{x:2000,y:1000}]);
assert.throws(()=>parseLinePath('M0 0 C 1 2 3 4 5 6 Z'),/Only straight/);
assert.deepEqual(parseTransform('translate(10 20) scale(2)'),[2,0,0,2,10,20]);
const element=(tag,attributes,parentElement=null)=>({tagName:tag,parentElement,getAttribute:key=>attributes[key]??null});
class FakeParser{parseFromString(){const p=element('polygon',{points:'0,0 1000,0 1000,500 0,500',transform:'translate(25 50)'}),path=element('path',{d:'M 0 0 L 50 0 L 25 40 Z'});return {querySelector:()=>null,querySelectorAll:()=>[p,path]};}}
const parsed=parseSvgText('<svg/>',FakeParser);assert.equal(parsed.shapes.length,2);assert.deepEqual(parsed.shapes[0][0],{x:25,y:50});
const model=anchorsFromPoints([{x:100000,y:200000},{x:160000,y:200000},{x:160000,y:240000},{x:100000,y:240000}],3000,2000),fitted=fitAnchors(model);
assert.deepEqual(model.map(a=>[a.x,a.y]),[[100000,200000],[160000,200000],[160000,240000],[100000,240000]]);assert.ok(fitted.anchors.every(a=>a.x>=115&&a.x<=705&&a.y>=110&&a.y<=610));
const shape=shapeSvg(model,'large polygon');assert.ok(shape.includes('viewBox="95200 195200 69600 49600"'));assert.ok(shape.includes('data-source="large polygon"'));
const lines=lineSystemSvg(model,{tangentFrom:1,tangentTo:1,tangentSeed:3,centerFrom:2,centerTo:2,centerSeed:7,showTangents:true,showCenters:true,showOutline:true},'large polygon');assert.ok(lines.includes('id="center-lines"'));assert.ok(lines.includes('id="tangent-lines"'));assert.ok(lines.includes('id="anchor-radii"'));assert.ok(lines.includes('id="interpreted-shape"'));
console.log('PASS: straight SVG parsing, transforms, large-coordinate fitting and source-coordinate SVG exports.');
