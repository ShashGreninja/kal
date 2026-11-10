import { legPose, bodyDrop } from './gait.mjs';
const namespace = 'http://www.w3.org/2000/svg';
const styles = {
  anay: { shirt: '#465866', shade: '#2e3d48', trousers: '#857960', skin: '#b78157', hair: '#262824', age: 'young', bag: true },
  nirmala: { shirt: '#87594d', shade: '#583d37', trousers: '#754e44', skin: '#ae7b51', hair: '#292b25', sari: true },
  stationmaster: { shirt: '#b4a281', shade: '#847255', trousers: '#75684e', skin: '#ac7d54', hair: '#37362a', uniform: true, moustache: true },
  prakash: { shirt: '#b4a684', shade: '#847658', trousers: '#726c55', skin: '#b38459', hair: '#303128', uniform: true },
  jadhav: { shirt: '#ae9974', shade: '#837052', trousers: '#877651', skin: '#a77950', hair: '#282d25', uniform: true, moustache: true },
  retired: { shirt: '#53535b', shade: '#383d43', trousers: '#756b5b', skin: '#b18460', hair: '#aaa18c', cardigan: true, moustache: true, old: true },
  desai: { shirt: '#6c7358', shade: '#4b5340', trousers: '#68654e', skin: '#a77b53', hair: '#464438', moustache: true, cap: true },
  leela: { shirt: '#65705b', shade: '#414e3f', trousers: '#565e4e', skin: '#ac7d55', hair: '#242b25', glasses: true, woman: true },
};

export function makeActor(name) {
  const s = styles[name] || styles.anay;
  const svg = document.createElementNS(namespace, 'svg');
  svg.setAttribute('viewBox', '0 0 140 320');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('character-art');
  const leg = (side, color) => `<g data-leg="${side}">
    <path fill="${color}" d="M-12-5Q0-10 12-3L9 58Q7 67-7 65L-11 24Z"/>
    <path d="M4 8 3 51" stroke="#252e28" stroke-opacity=".23" fill="none"/>
    <g data-shin><path fill="${color}" d="M-8-2 9-1 7 51 3 60-8 58-10 24Z"/><path d="m-8 49 15 1" stroke="#32352b" stroke-width="2"/>
    <g data-foot><path fill="#2b302b" d="m-8 56 13 1 5 6 13 4q6 2 5 7H-10Z"/><path d="M-9 73H27" stroke="#171e1b" stroke-width="3"/><path d="m5 63 8 3" stroke="#8c8872" stroke-width="1.5"/></g></g></g>`;
  const arm = (side) => `<g data-arm="${side}">
    <path fill="${side === 'far' ? s.shade : s.shirt}" d="M-9 0Q0-8 10-1L12 37 7 44-8 42-11 12Z"/>
    <path d="M-8 35 11 33 12 40-8 42Z" fill="${s.shade}"/>
    <g data-forearm><path fill="${s.skin}" d="M-7-2 9-2 7 36 10 42 8 52 3 55-4 51-7 39Z"/><path d="M4 43 3 51m3-9v8" stroke="#744f38" stroke-width="1" fill="none"/>
    ${side === 'near' && name !== 'nirmala' ? '<path d="M-6 30H8v5H-6Z" fill="#3a3b31"/><circle cx="2" cy="32" r="4" fill="#c0b68b"/>' : ''}</g></g>`;
  svg.innerHTML = `<ellipse data-shadow cx="70" cy="309" rx="29" ry="4.5" fill="#0a1512" opacity=".35"/>
    <g data-body>
      ${leg('far', s.trousers)}${arm('far')}${leg('near', s.trousers)}
      ${s.sari ? `<path d="M48 159Q70 154 83 164L92 291Q69 300 40 292L46 219Z" fill="${s.trousers}"/><path d="m57 176-7 114m16-112 1 115m7-114 9 113" stroke="#a37861" stroke-width="2" opacity=".6"/><path d="M40 287q29 8 52 0v7q-25 8-52 0Z" fill="#b69470"/>` : ''}
      <path fill="${s.shirt}" d="M49 67 65 62 81 67Q94 74 95 94L88 164Q70 177 44 165L42 111 39 87Q39 74 49 67Z"/>
      <path fill="${s.shade}" d="M44 92 52 113 48 153 88 157 87 166Q65 174 44 166Z"/>
      <path d="M78 80 79 158" fill="none" stroke="${s.shade}" stroke-width="2"/>
      <path d="m55 130 14 4m-19 12 17 5" stroke="${s.shade}" fill="none" stroke-width="2"/>
      ${s.uniform ? `<path d="M48 83h17v18q-9 5-17 0Zm30 0h12v17l-12 1Z" fill="${s.shade}"/><path d="M47 85h19m11 0h14" stroke="#cabb94" stroke-width="2"/><path d="M44 71 56 68m24 0 13 8" stroke="${s.shade}" stroke-width="5"/><path d="M44 160q21 6 44-1v7q-24 7-44 0Z" fill="#4b4535"/><rect x="70" y="161" width="8" height="6" rx="1" fill="#c2ad78"/>` : ''}
      ${s.cardigan ? `<path d="M64 65 78 69 82 157 67 164Z" fill="#b8a782"/><path d="M55 68 68 67 63 101 52 86Z" fill="#323c40"/><path d="m78 68 11 8-4 28-7-8Z" fill="#333d40"/>` : ''}
      <path fill="${s.skin}" d="M60 49 78 48 78 68 69 77 57 67Z"/>
      <path fill="#815b40" d="m60 49 18 1v9l-13 4-6-5Z"/>
      <path fill="${s.shirt}" d="m56 65 13 12-8 10-12-17m30-5-10 12 9 8 8-15Z"/>
      <g data-head>
        ${s.sari || s.woman ? `<path fill="${s.hair}" d="M51 19Q49 4 67 3 88 2 90 23L86 55 73 63 52 50Z"/><ellipse cx="49" cy="36" rx="9" ry="11" fill="${s.hair}"/>` : ''}
        <path fill="${s.skin}" d="M57 15Q68 6 82 16L88 30 95 37 88 40 87 51Q82 60 72 58L60 52 54 36Z"/>
        <path fill="#c79a71" opacity=".5" d="M76 20 84 24 85 34 82 45 77 49 72 37Z"/>
        <path fill="${s.hair}" d="M53 32Q44 17 53 8 62-2 76 4 87 1 90 13L85 23 77 20 75 16Q65 18 62 30L61 40 54 38Z"/>
        <path fill="${s.skin}" d="M60 30Q50 24 52 37 54 43 60 40Z"/>
        <path d="M56 31q-4 0-1 6" stroke="#80563a" fill="none" stroke-width="1.3"/>
        <path d="m78 29 8 1" stroke="${s.hair}" stroke-width="2"/>
        <path data-eye d="M80 33h4" stroke="#252b25" stroke-width="2.3" stroke-linecap="round"/>
        <path d="m87 37-2 3h4m-7 8 6-1" stroke="#774e37" fill="none" stroke-width="1.4"/>
        ${s.moustache ? `<path d="M79 42q8-3 12 2l-1 5-7-2-7 1Z" fill="${s.hair}"/>` : ''}
        ${s.old ? '<path d="m75 26 9 1m-13-5 11 1m-4 15 5 1m-12 10 5 4" stroke="#856347" fill="none"/>' : ''}
        ${s.sari ? '<circle cx="84" cy="26" r="1.8" fill="#81413a"/><circle cx="56" cy="42" r="2.8" fill="#d4ad67"/>' : ''}
        ${s.glasses ? '<path d="m76 29 12 1-1 9H77Zm0 2-18 1" stroke="#282d26" stroke-width="2" fill="none"/>' : ''}
        ${s.cap ? '<path d="M50 22Q47 4 67 4 85 4 88 19l9 5-13 2-10-6-23 6Z" fill="#767957"/><path d="m52 19 32-3" stroke="#a39e74" stroke-width="2"/>' : ''}
      </g>
      ${arm('near')}
      ${s.sari ? `<path d="M81 67 92 76 58 159 46 160 51 139Z" fill="#a1745e"/><path d="m86 72-33 86" stroke="#c3a179" stroke-width="3"/><path d="M47 147 41 224 47 258 56 178Z" fill="#966753"/>` : ''}
      ${s.bag ? '<path d="m82 71-37 104" stroke="#493c2c" stroke-width="8"/><path d="m82 71-37 104" stroke="#9a825a" stroke-width="5"/><g data-bag><path fill="#8d704b" d="M31 145 53 143 57 180 31 185 26 175Z"/><path d="M29 145 54 144 54 158 30 164Z" fill="#aa895d"/><path d="m40 156 1 12" stroke="#5d4c35" stroke-width="3"/><rect x="38" y="161" width="6" height="6" rx="1" fill="#c8b186"/></g>' : ''}
    </g>`;
  const heldDial=document.createElementNS(namespace,'g');
  heldDial.innerHTML='<circle cx="103" cy="83" r="10" fill="#a68b55"/><circle cx="103" cy="83" r="7" fill="#30231f"/><path d="M103 78v5l4 2" fill="none" stroke="#ead7af" stroke-width="1.5"/>';
  heldDial.style.display='none'; svg.querySelector('[data-body]').append(heldDial);
  const body = svg.querySelector('[data-body]');
  const legs = [...svg.querySelectorAll('[data-leg]')].map((group) => ({ group, shin: group.querySelector('[data-shin]') }));
  const arms = [...svg.querySelectorAll('[data-arm]')].map((group) => ({ group, forearm: group.querySelector('[data-forearm]') }));
  const head = svg.querySelector('[data-head]');
  const bag = svg.querySelector('[data-bag]');
  function pose(phase = 0, strength = 0, time = 0) {
    svg.querySelector('[data-eye]').setAttribute('stroke-width','2.3');
    heldDial.style.display='none';
    const swing = Math.cos(phase);
    const bounce = bodyDrop(phase) * strength;
    const breath = Math.sin(time * 1.6) * .65 * (1 - strength);
    body.setAttribute('transform', `translate(0 ${bounce + breath})`);
    legs.forEach(({ group, shin }, i) => {
      const pose = legPose(phase + (i ? Math.PI : 0), strength, bounce + breath);
      group.setAttribute('transform', `translate(${i ? 66 : 72} 172) rotate(${pose.hip})`);
      shin.setAttribute('transform', `translate(0 60) rotate(${pose.knee})`);
      shin.querySelector('[data-foot]').setAttribute('transform', `rotate(${pose.foot} 0 56)`);
    });
    arms.forEach(({ group, forearm }, i) => {
      group.setAttribute('transform', `translate(${i ? 49 : 84} 81) rotate(${swing * (i ? 11 : -11) * strength + (i ? 2 : -5)})`);
      forearm.setAttribute('transform', `translate(0 40) rotate(${-8 - Math.max(0, swing * (i ? -1 : 1)) * 12 * strength})`);
    });
    head.setAttribute('transform', `rotate(${Math.sin(time * .7) * .65 * (1 - strength)} 68 52)`);
    if (bag) bag.setAttribute('transform', `rotate(${swing * 4 * strength} 43 146)`);
  }
  pose();
  function react(surprised) {
    heldDial.style.display='';
    body.setAttribute('transform', 'rotate(-5 70 288)');
    head.setAttribute('transform', 'rotate(-9 68 52)');
    const arm=arms[1]; arm.group.setAttribute('transform','translate(49 81) rotate(-25)');
    arm.forearm.setAttribute('transform','translate(0 40) rotate(-105)');
    if(surprised) svg.querySelector('[data-eye]').setAttribute('stroke-width','4');
    else svg.querySelector('[data-eye]').setAttribute('stroke-width','2.3');
  }
  return { svg, pose, react };
}
