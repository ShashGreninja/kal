// Hindi-preferred voices should receive phonetic Devanagari, not ambiguous Roman spellings.
const words={Prakash:'प्रकाश',Nirmala:'निर्मला',Jadhav:'जाधव',Anay:'अनय',Devgarh:'देवगढ़',Kulkarni:'कुलकर्णी',Desai:'देसाई',Leela:'लीला',train:'ट्रेन',station:'स्टेशन',report:'रिपोर्ट',signal:'सिग्नल',duty:'ड्यूटी',log:'लॉग',platform:'प्लैटफ़ॉर्म',renovation:'रेनोवेशन',record:'रिकॉर्ड',records:'रिकॉर्ड्स',message:'मैसेज',final:'फ़ाइनल',bridge:'ब्रिज',copy:'कॉपी'};
export function pronunciationText(text){return text.replace(/[A-Za-z]+/g,word=>words[word]||words[word.toLowerCase()]||word);}
