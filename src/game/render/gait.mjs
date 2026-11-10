const TAU = Math.PI * 2;
const degrees = (radians) => radians * 180 / Math.PI;

// A planted foot travels backwards at walking speed; the return arc clears the floor.
export function legPose(phase, strength, bodyDrop) {
  const cycle = ((phase / TAU) % 1 + 1) % 1;
  const stance = cycle < .6;
  const t = stance ? cycle / .6 : (cycle - .6) / .4;
  const x = (stance ? 28 - 56 * t : -28 + 56 * (t * t * (3 - 2 * t))) * strength;
  const lift = stance ? 0 : Math.sin(Math.PI * t) * 7 * strength;
  const y = 116 - bodyDrop - lift;
  const distance = Math.min(115.99, Math.hypot(x, y));
  const aim = Math.atan2(x, y);
  const hip = aim + Math.acos(Math.max(-1, Math.min(1, (3600 + distance * distance - 3136) / (120 * distance))));
  const knee = -Math.acos(Math.max(-1, Math.min(1, (distance * distance - 3600 - 3136) / (120 * 56))));
  return { hip: -degrees(hip), knee: -degrees(knee), foot: degrees(hip + knee), x, y, stance };
}

export const strideDistance = 56 / .6;

// Rise over the supporting foot instead of keeping both knees crouched.
export function bodyDrop(phase) {
 const cycle = ((phase / TAU) % 1 + 1) % 1;
 const supports = [cycle, (cycle + .5) % 1].filter(t => t < .6);
 const x = Math.min(...supports.map(t => Math.abs(28 - 56 * t / .6)));
 return 116 - Math.sqrt(114 * 114 - x * x);
}
