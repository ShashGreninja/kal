import assert from 'node:assert/strict';
import {openBrowser,pause,until} from './browser.mjs';
const b=await openBrowser(3027);const {evaluate:e,send,click}=b;
const key=(type,key,code,modifiers=0)=>send('Input.dispatchKeyEvent',{type,key,code,modifiers});
const x=()=>e('parseFloat(document.getElementById("player").style.getPropertyValue("--x"))');
try {
 await b.viewport(1440,900);await b.navigate('/play.html');await until(()=>e('!!document.querySelector("#player svg")'),'shell');await click('start');await click('skip-intro');
 await key('keyDown','d','KeyD');await pause(250);let start=await x();await pause(600);let walk=(await x())-start;
 await key('keyDown','Shift','ShiftLeft',8);start=await x();await pause(600);let sprint=(await x())-start;
 assert.ok(sprint/walk>1.8&&sprint/walk<2.4,`sprint ratio ${sprint/walk}`);
 await key('keyUp','Shift','ShiftLeft');start=await x();await pause(600);let normal=(await x())-start;assert.ok(normal/walk>.8&&normal/walk<1.2);
 for(let i=0;i<4;i++){await pause(120);await b.shot('walk-revised-'+i);}
 await key('keyUp','d','KeyD');await click('pause');start=await x();await key('keyDown','Shift','ShiftLeft',8);await key('keyDown','d','KeyD',8);await pause(300);assert.equal(await x(),start);
 assert.deepEqual(b.errors,[]);console.log('Sprint verified: '+(sprint/walk).toFixed(2)+'x, release restores walking, menus prevent movement.');
}finally{b.close()}
