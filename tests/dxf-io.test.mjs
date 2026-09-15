import assert from 'node:assert/strict';
import {makeAnchors} from '../dist/geometry.mjs';
import {largestPolygon,parseDxfText,shapeDxf,lineSystemDxf} from '../dist/dxf-io.mjs';

const lw=`0\nSECTION\n2\nHEADER\n9\n$INSUNITS\n70\n4\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nLWPOLYLINE\n70\n1\n10\n0\n20\n0\n10\n100\n20\n0\n10\n100\n20\n50\n10\n0\n20\n50\n0\nENDSEC\n0\nEOF\n`;
const parsed=parseDxfText(lw);assert.equal(parsed.unitsCode,4);assert.deepEqual(parsed.shapes[0],[{x:0,y:0},{x:100,y:0},{x:100,y:50},{x:0,y:50}]);
assert.equal(largestPolygon([[{x:0,y:0},{x:1,y:0},{x:0,y:1}],parsed.shapes[0]]),parsed.shapes[0]);
assert.throws(()=>parseDxfText('binary'),/ASCII DXF/);
const anchors=makeAnchors('Triangle'),shape=shapeDxf(anchors,4),lines=lineSystemDxf(anchors,{tangentFrom:1,tangentTo:1,tangentSeed:4,centerFrom:2,centerTo:2,centerSeed:8,showTangents:true,showCenters:true,showOutline:true},4);
assert.ok(shape.includes('$INSUNITS\n70\n4'));assert.ok(shape.includes('\nARC\n'));assert.ok(shape.includes('\nLINE\n'));
assert.equal((lines.match(/\nTANGENT\n/g)||[]).length,3,'tangent degree setting is exported');assert.ok(lines.includes('\nCENTER\n'));assert.ok(lines.includes('\nANCHOR POINT\n'));assert.ok(lines.includes('\nMETA DATA\n'));
console.log('PASS: ASCII DXF parsing, largest-boundary selection, units, exact arc export, and independent line systems.');
