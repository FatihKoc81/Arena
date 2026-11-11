import { TextToSpeech } from '@capacitor-community/text-to-speech';
let sequence=0;
let selectedVoice;
async function getTurkishVoice(){
 if(selectedVoice!==undefined)return selectedVoice;
 selectedVoice=null;
 try{
  const result=await TextToSpeech.getSupportedVoices();
  const candidates=(result.voices||[]).map((v,index)=>({...v,index})).filter(v=>/^tr([-_]|$)/i.test(v.lang||""));
  if(candidates.length){
   candidates.sort((a,b)=>{
    if(a.localService!==b.localService)return a.localService?1:-1;
    const score=v=>/google|neural|natural|premium/i.test((v.voiceURI||"")+" "+(v.name||""))?0:1;
    return score(a)-score(b);
   });
   selectedVoice=candidates[0].index;
  }
 }catch(e){}
 return selectedVoice;
}
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function say(text,voice){
 const options={text,lang:"tr-TR",rate:0.80,pitch:1,volume:1,queueStrategy:0};
 if(voice!==null&&voice!==undefined)options.voice=voice;
 await TextToSpeech.speak(options);
}
window.ArenaTTS={
 speakParts:async(question,answers)=>{
  const id=++sequence;
  await TextToSpeech.stop();
  const voice=await getTurkishVoice();
  if(id!==sequence)return;
  await say("Soru. "+question,voice);
  if(id!==sequence)return;
  await pause(1100);
  await say("Seçenekler.",voice);
  for(let i=0;i<answers.length;i++){
   if(id!==sequence)return;
   await pause(420);
   await say(["A","B","C","D"][i]+" seçeneği. "+answers[i]+".",voice);
  }
 },
 speak:async(text)=>{const voice=await getTurkishVoice();await say(text,voice);},
 stop:async()=>{sequence++;await TextToSpeech.stop();}
};
