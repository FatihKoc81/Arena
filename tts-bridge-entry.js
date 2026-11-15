import { TextToSpeech } from '@capacitor-community/text-to-speech';
let sequence=0;
async function getTurkishVoice(profile){
 try{
  const result=await TextToSpeech.getSupportedVoices();
  const voices=(result.voices||[]).map((v,index)=>({...v,index})).filter(v=>/^tr([-_]|$)/i.test(v.lang||""));
  if(!voices.length)return null;
  const male=/male|erkek|man|baritone|ahmet|mehmet|yusuf|burak/i;
  const premium=/neural|natural|premium|google/i;
  voices.sort((a,b)=>{
   const score=v=>(premium.test((v.name||"")+" "+(v.voiceURI||""))?0:20)+(profile==="male"?(male.test((v.name||"")+" "+(v.voiceURI||""))?0:10):0)+(v.localService?2:0);
   return score(a)-score(b);
  });
  return voices[0].index;
 }catch(e){return null;}
}
async function say(text,voice,profile){
 const options={text,lang:"tr-TR",rate:profile==="male"?0.88:0.92,pitch:profile==="male"?0.88:1.02,volume:1,queueStrategy:0};
 if(voice!==null&&voice!==undefined)options.voice=voice;
 await TextToSpeech.speak(options);
}
window.ArenaTTS={
 speakParts:async(question,answers,profile)=>{
  const id=++sequence;
  await TextToSpeech.stop();
  const voice=await getTurkishVoice(profile);
  if(id!==sequence)return;
  await say("Soru. "+question,voice,profile);
 },
 speak:async(text,profile)=>{const voice=await getTurkishVoice(profile);await say(text,voice,profile);},
 stop:async()=>{sequence++;await TextToSpeech.stop();}
};
