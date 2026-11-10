import test from 'node:test';
import assert from 'node:assert/strict';
import { legPose, strideDistance } from '../src/game/render/gait.mjs';

test('a planted foot cancels body travel and stays on the same floor', () => {
  for (let cycle = .05; cycle < .55; cycle += .05) {
    const pose = legPose(cycle * Math.PI * 2, 1, 4.8);
    assert.ok(pose.stance);
    assert.ok(Math.abs(pose.x + cycle * strideDistance - 28) < .00001);
    assert.equal(pose.y + 4.8, 116);
    const hip = -pose.hip * Math.PI / 180;
    const knee = -pose.knee * Math.PI / 180;
    assert.ok(Math.abs(60 * Math.sin(hip) + 56 * Math.sin(hip + knee) - pose.x) < .001);
    assert.ok(Math.abs(60 * Math.cos(hip) + 56 * Math.cos(hip + knee) - pose.y) < .001);
    assert.ok(Math.abs(pose.hip + pose.knee + pose.foot) < .001);
  }
  assert.ok(legPose(.8 * Math.PI * 2, 1, 4.8).y < 111.2);
});
