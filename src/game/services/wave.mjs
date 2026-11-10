export function encodeSpeech(channels, sampleRate = 16000, maxSeconds = 20) {
 if(!channels.length || !channels[0].length) throw new Error('NO_AUDIO');
 // Some stereo devices deliver voice on only one channel. Keep the strongest channel.
 const energy=channel=>channel.reduce((sum,value)=>sum+value*value,0)/channel.length;
 const mono=channels.reduce((best,channel)=>energy(channel)>energy(best)?channel:best);
 const length=Math.min(mono.length,sampleRate*maxSeconds);
 let mean=0;for(let i=0;i<length;i++)mean+=mono[i];mean/=length;
 let peak=0,squares=0;for(let i=0;i<length;i++){const n=mono[i]-mean;peak=Math.max(peak,Math.abs(n));squares+=n*n;}
 const rms=Math.sqrt(squares/length);
 if(rms<.0001)throw new Error('NO_AUDIO');
 // Lift quiet speech without unlimited amplification of room noise or clipping peaks.
 const gain=Math.min(4,.85/Math.max(peak,.0001));
 const data=new DataView(new ArrayBuffer(44+length*2));
 const tag=(offset,text)=>{for(let i=0;i<text.length;i++)data.setUint8(offset+i,text.charCodeAt(i));};
 tag(0,'RIFF');data.setUint32(4,36+length*2,true);tag(8,'WAVE');tag(12,'fmt ');data.setUint32(16,16,true);data.setUint16(20,1,true);data.setUint16(22,1,true);data.setUint32(24,sampleRate,true);data.setUint32(28,sampleRate*2,true);data.setUint16(32,2,true);data.setUint16(34,16,true);tag(36,'data');data.setUint32(40,length*2,true);
 for(let i=0;i<length;i++)data.setInt16(44+i*2,Math.max(-1,Math.min(1,(mono[i]-mean)*gain))*32767,true);
 return data.buffer;
}
