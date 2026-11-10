// Social responses are authored character behaviour, never sources of case evidence.
const voices = {
  stationmaster: {
    wellbeing: 'Theek hoon, shukriya. Bas aaj ka register khatam karna hai. Aap kaise hain?',
    weather: 'Aisi baarish mein ghadi dekhte rehna padta hai. Yahan chhat ke neeche aa jaiye.',
    tea: 'Nirmala ki chai mil jaaye toh baaki duty aasaan ho jaati hai.',
    work: 'Kulkarni. Stationmaster hoon. Trains, staff, ye registers… sabki zimmedari yahin aati hai.',
    goodbye: 'Achha ji. Platform par sambhal kar, farsh geela hai.',
  },
  nirmala: {
    wellbeing: 'Main theek hoon! Ketli garam hai, aur kya chahiye. Tum batao, bheeg toh nahi gaye?',
    weather: 'Baarish ko jaane ki jaldi nahi hai. Tumhe hai kya? Chhat ke neeche baitho.',
    tea: 'Adrak wali bana doon? Zyada cheeni chahiye toh pehle bolna.',
    work: 'Nirmala. Ye chai ki dukaan meri hai. Subah pehli train se raat aakhri train tak.',
    goodbye: 'Achha, phir aana. Cup yahin rakh dena, main utha loongi.',
  },
  prakash: {
    wellbeing: 'Theek hoon. Thoda bheeg gaya hoon, bas. Aap idhar khade ho jaiye, chhat hai.',
    weather: 'Baarish mein awaaz door tak aati hai. Kabhi train ko dekhe bina sun kar pehchana hai?',
    tea: 'Chai ka mann toh hai. Duty ke baad Nirmala ke paas jaaunga.',
    work: 'Prakash Naik. Signals dekhta hoon. Har train ko dhyaan se sunna padta hai.',
    goodbye: 'Phir milte hain. Patri se door rehna, haan?',
  },
  jadhav: {
    wellbeing: 'Theek hoon. Kursi thodi sakht hai, par aadat ho gayi. Aap bataiye?',
    weather: 'Baarish se bachne aaye ho toh baith sakte ho. Bas logbook par paani mat giraana.',
    tea: 'Nirmala ki dukaan par mil jaayegi. Meri toh kab ki thandi ho gayi.',
    work: 'Constable Jadhav. Railway police. Yahan duty par hoon.',
    goodbye: 'Theek hai. Zaroorat ho toh outpost yahin hai.',
  },
  retired: {
    wellbeing: 'Theek hoon, beta. Ghutne thoda sataate hain baarish mein. Tum kaise ho?',
    weather: 'Baarish ki khushboo ab bhi wahi hai. Tees saal mein itna toh nahi badla.',
    tea: 'Nirmala ki chai yaad aati hai. Yahan baith kar uski ketli ki awaaz sunai deti thi.',
    work: 'Jadhav. Pehle isi outpost par duty karta tha. Ab kabhi-kabhi dekhne aa jaata hoon.',
    goodbye: 'Aaram se jaana, beta. Phir kabhi baithenge.',
  },
  desai: {
    wellbeing: 'Theek hoon, bhai. Bas joote sukh jaayein toh aur badhiya. Tumhare toh sookhe lagte hain!',
    weather: 'Baarish ka kaam hai barasna, hamara kaam hai bheegna. Idhar thodi sookhi jagah hai.',
    tea: 'Chai? Abhi toh do cup pee loon. Nirmala ke adrak ka koi jawaab nahi.',
    work: 'Desai. Fitter hoon. Loha, patthar, nut-bolt… jo atke, mujhe bula lete hain.',
    goodbye: 'Achha, milte hain. Keechad mein kadam sambhal kar.',
  },
  leela: {
    wellbeing: 'Theek hoon! Dhool se thodi chheenk aa rahi hai. Ye jagah kaafi saalon se band thi.',
    weather: 'Baarish mein yahan kaam dheere hota hai. Kagaz ko sookha rakhna padta hai.',
    tea: 'Achha idea hai. Agle break mein chai dhoondhte hain.',
    work: 'Leela. Renovation team mein hoon. Purani cheezon ko bachane ki koshish kar rahe hain.',
    goodbye: 'Phir milte hain. Kuch interesting mile toh mujhe bhi dikhana.',
  },
};

export function smallTalk(id, input) {
  const text = input.normalize('NFKC').toLocaleLowerCase('en-IN').trim();
  const voice = voices[id];
  if (!voice) return null;
  if (/k(?:ai|a|e)s[aei]|कैस[ेीा]|how\s+(are|r)\s+(you|u)|how('?s| is)\s+it\s+going|kya\s+haal|kya\s+hal|kya\s+chal|(sab|aap|tum)\s+(theek|thik)|क्या हाल|(सब|आप|तुम) ठीक|doing\s+(ok|well)/iu.test(text)) return voice.wellbeing;
  if (/\b(thank(s| you)?|shukriya|dhanyavaad|dhanyawad)\b|धन्यवाद|शुक्रिया/iu.test(text)) return 'Koi baat nahi. Aur kuch poochna ho toh poochhiye.';
  if (/\b(bye|goodbye|alvida|milte|chalta|chalti)\b|अलविदा|फिर मिलेंगे/iu.test(text)) return voice.goodbye;
  if (/\b(naam|name|who are you|kaam|job|work|kya karte|kya karti)\b|नाम|कौन हैं|काम/iu.test(text)) return voice.work;
  if (/\b(weather|rain|raining|baarish|barish|mausam)\b|बारिश|मौसम/iu.test(text)) return voice.weather;
  if (/\b(chai|tea|coffee|bhook|hungry)\b|चाय|कॉफी/iu.test(text)) return voice.tea;
  if (/\b(hello|hi|hey|namaste|namaskar|salaam|namst[eay]|good morning|good afternoon|good evening)\b|नमस्ते|नमस्कार|सलाम/iu.test(text)) return 'Namaste! ' + voice.wellbeing;
  return null;
}
