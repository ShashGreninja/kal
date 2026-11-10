import '../styles/tokens.css';
import '../styles/fonts.css';
import '../styles/landing.css';
import { drawRoom, drawPortrait } from '../game/render/art.mjs';
import { getRoom } from '../shared/world.mjs';

const el = (id) => document.getElementById(id);
drawRoom(el('hero-art'), getRoom('platform'), 1998);
drawRoom(el('story-scene'), getRoom('approach'), 2028);
drawRoom(el('era-past'), getRoom('tea'), 1998);
drawRoom(el('era-future'), getRoom('tea'), 2028);
drawPortrait(el('nirmala-portrait'), 0);
drawPortrait(el('jadhav-portrait'), 3);
drawPortrait(el('visit-image'), 'stationmaster');


const dial = el('era-dial');
const updateEra = () => {
  const value = Number(dial.value);
  el('era-future').style.clipPath = `inset(0 0 0 ${100 - value}%)`;
  el('era-output').textContent = value < 15 ? 'Devgarh, 1998' : value > 85 ? 'Devgarh, 2028' : 'Between two years';
  dial.setAttribute('aria-valuetext', `${100 - value}% 1998, ${value}% 2028`);
};
dial.addEventListener('input', updateEra);
updateEra();

document.querySelectorAll('.questions details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('.questions details').forEach((other) => { if (other !== detail) other.open = false; });
  });
});

const reduced=matchMedia('(prefers-reduced-motion: reduce)');
if(!reduced.matches){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.animate([{opacity:.15,transform:'translateY(20px)'},{opacity:1,transform:'none'}],{duration:800,fill:'both',easing:'cubic-bezier(.22,1,.36,1)'});observer.unobserve(entry.target);}),{threshold:.12});
 document.querySelectorAll('[data-reveal]').forEach(item=>observer.observe(item));
 const portrait=document.querySelector('.hero-character');
 window.addEventListener('scroll',()=>{portrait.style.transform='translateY('+Math.min(scrollY*.09,60)+'px)';},{passive:true});
}
