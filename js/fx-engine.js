/* ARENA FX Engine — no external dependency; safe when audio is unavailable */
(function(w){
 "use strict";
 if(w.ArenaFX)return;
 var ctx=null,enabled=true;
 function audio(){if(!enabled)return null;try{var C=w.AudioContext||w.webkitAudioContext;if(!C)return null;if(!ctx)ctx=new C();if(ctx.state==="suspended")ctx.resume();return ctx;}catch(e){return null;}}
 function tone(freq,duration,type,volume){var c=audio();if(!c)return;try{var o=c.createOscillator(),g=c.createGain(),now=c.currentTime;o.type=type||"sine";o.frequency.setValueAtTime(freq,now);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(volume||.045,now+.012);g.gain.exponentialRampToValueAtTime(.0001,now+(duration||.12));o.connect(g);g.connect(c.destination);o.start(now);o.stop(now+(duration||.12)+.02);}catch(e){}}
 w.ArenaFX={setEnabled:function(v){enabled=!!v;},play:function(name){if(name==="move")tone(520,.09,"sine",.035);else if(name==="select")tone(740,.07,"triangle",.025);else if(name==="invalid")tone(150,.16,"square",.025);else if(name==="win"){tone(660,.13,"sine",.04);setTimeout(function(){tone(880,.18,"sine",.04);},110);}else if(name==="click")tone(420,.045,"triangle",.018);},pulse:function(el){if(!el)return;el.classList.remove("arena-fx-pulse");void el.offsetWidth;el.classList.add("arena-fx-pulse");setTimeout(function(){el.classList.remove("arena-fx-pulse");},360);}};
})(window);
