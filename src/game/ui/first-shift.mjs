export function createFirstShift({ setMode, getGame, setGame, renderRoom, transition, cue }) {
 const stage=document.getElementById('stage');
 const overlay=document.createElement('section'); overlay.className='overlay first-shift'; overlay.hidden=true; overlay.setAttribute('aria-labelledby','shift-title');
 overlay.innerHTML='<button class="quiet" id="skip-shift">Skip scene</button><div class="shift-caption"><p>Anay</p><h2 id="shift-title"></h2><p id="shift-thought"></p><button id="shift-next" class="primary">Look around</button></div>';
 stage.append(overlay);
 const beats=[
 ['Wait… this was boarded up.', 'Anay steps back. The shutters are open. Somewhere beyond the platform, someone is calling for chai.', 'Look at the instrument'],
 ['1998.', 'The needle has stopped on the older date. He remembers this paint, these benches. He turns the dial back, carefully.', 'Turn it back'],
 ['Same place. Different evening.', 'The boarded windows return. His shoulder bag has not moved. He turns the dial once more, keeping his eyes on the station.', 'Try once more'],
 ['Prakash is still here.', 'This was the instrument Prakash kept in his coat. If it brings me back to that evening, I can ask him what happened. And I know how to get home.', 'Find the people he remembers']
 ];
 let index=0;
 function render(){document.getElementById('notification').textContent='';const [title,text,label]=beats[index];overlay.querySelector('h2').textContent=title;overlay.querySelector('#shift-thought').textContent=text;overlay.querySelector('#shift-next').textContent=label;stage.dataset.reaction=index===0?'surprise':'consider';}
 function year(value,done){cue('shift',value);transition(()=>{setGame({...getGame(),year:value});renderRoom();},done,'era');}
 function finish(){const complete=()=>{setGame({...getGame(),firstShiftSeen:true});overlay.hidden=true;delete stage.dataset.reaction;setMode('explore');document.getElementById('shift').focus();};if(getGame().year!==1998)year(1998,complete);else complete();}
 overlay.querySelector('#shift-next').onclick=()=>{if(stage.dataset.transition)return;if(index===3)return finish();index++;if(index===2||index===3)year(index===2?2028:1998,render);else render();};
 overlay.querySelector('#skip-shift').onclick=()=>{if(!stage.dataset.transition)finish();};
 return {start(){index=0;setMode('cutscene');overlay.hidden=false;render();overlay.querySelector('#shift-next').focus();}};
}
