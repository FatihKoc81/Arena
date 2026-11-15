import * as THREE from 'three';

(() => {
  'use strict';
  if (window.Arena3D) return;
  const palette = {
    bilgi: ['#ffd45e','#fff0ae','#7e4a16'],
    kelime: ['#60d9ff','#d7f8ff','#1747a0'],
    masa: ['#58e5a4','#e8fff4','#17664a'],
    sudoku: ['#ffb65b','#fff0c9','#9c4c17'],
    sayi: ['#ff75c8','#ffe0f4','#812a9a'],
    renk: ['#64c7ff','#f7ffff','#164a9b'],
    dikkat: ['#a79aff','#f1edff','#4235a1'],
    refleks: ['#ff665f','#ffe1b4','#9e172c']
  };
  const colorFor = id => /milyoner|diniMilyoner|passaparola/.test(id) ? 'bilgi' :
    /kelime|word|rotasyon/.test(id) ? 'kelime' :
    /okey|tavla|poker|batak|checkers|backgammon/.test(id) ? 'masa' :
    /sudoku|nonogram/.test(id) ? 'sudoku' :
    /math|2048|ticTacToe|connectFour|mine/.test(id) ? 'sayi' :
    /color|sort|liquid|ball/.test(id) ? 'renk' :
    /memory/.test(id) ? 'dikkat' : 'refleks';

  let renderer, scene, camera, root, raf = 0, active = false, canvas, host;
  let audio, musicGain, musicTimer = 0, musicOn = true, sfxOn = true, step = 0;
  const mats = {};
  function mat(hex, metalness=.28, roughness=.28) {
    const key = hex + metalness + roughness;
    return mats[key] || (mats[key] = new THREE.MeshStandardMaterial({color:hex,metalness,roughness}));
  }
  function addMesh(parent, geometry, material, x=0,y=0,z=0) {
    const m = new THREE.Mesh(geometry,material); m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true; parent.add(m); return m;
  }
  function sphere(parent, color, x,y,z, scale=1) {
    const m=addMesh(parent,new THREE.SphereGeometry(.22,24,18),mat(color,.42,.18),x,y,z);m.scale.setScalar(scale);return m;
  }
  function cylinder(parent,color,x,y,z,r1,r2,h) {
    return addMesh(parent,new THREE.CylinderGeometry(r1,r2,h,32,1),mat(color,.55,.23),x,y,z);
  }
  function torus(parent,color,x,y,z,r=.38,t=.055) {
    return addMesh(parent,new THREE.TorusGeometry(r,t,12,48),mat(color,.72,.18),x,y,z);
  }
  function makeTrophy(g,c) {
    const gold=mat('#f7bd35',.78,.2),bright=mat('#fff0a4',.72,.16),dark=mat('#8b4a12',.55,.3);
    const profile=[new THREE.Vector2(.18,0),new THREE.Vector2(.27,.08),new THREE.Vector2(.34,.28),new THREE.Vector2(.42,.57),new THREE.Vector2(.35,.72),new THREE.Vector2(.16,.78),new THREE.Vector2(.12,.78)];
    const cup=addMesh(g,new THREE.LatheGeometry(profile,48),gold,0,.1,0);
    cup.rotation.x=Math.PI;
    const rim=torus(g,'#ffe48a',0,.86,0,.37,.055);
    const h1=torus(g,'#e8a82a',-.42,.48,0,.19,.065);h1.rotation.y=Math.PI/2;
    const h2=torus(g,'#e8a82a',.42,.48,0,.19,.065);h2.rotation.y=Math.PI/2;
    cylinder(g,'#e6a82e',0,-.12,0,.13,.13,.42);
    cylinder(g,'#ffe18a',0,-.38,0,.42,.34,.13);
    cylinder(g,'#8b4a12',0,-.51,0,.31,.31,.11);
    sphere(g,'#fff2b7',-.12,.56,.22,.07);
  }
  function makeTubes(g) {
    const glass=new THREE.MeshPhysicalMaterial({color:'#aeeaff',metalness:.18,roughness:.08,transparent:true,opacity:.28,clearcoat:1,side:THREE.DoubleSide});
    [-.58,0,.58].forEach((x,i)=>{
      const tube=addMesh(g,new THREE.CylinderGeometry(.22,.22,1.25,32,1,true),glass,x,-.02,0);
      tube.material=glass;
      torus(g,'#d7f4ff',x,-.65,0,.22,.035);
      torus(g,'#d7f4ff',x,.61,0,.22,.035);
      const cols=[['#ef526b','#ef526b','#e8b83e'],['#38d89c','#36a8ff','#38d89c'],['#4d9fff','#a67aff','#4d9fff']][i];
      cols.forEach((col,j)=>sphere(g,col,x,-.48+j*.27,.02,.48));
    });
  }
  function makeDice(g) {
    const cubeMat=mat('#f1f6ff',.22,.2);
    const die=addMesh(g,new THREE.BoxGeometry(.8,.8,.8),cubeMat,0,0,0);
    die.rotation.set(.42,.55,.22);
    const dot=mat('#17335d',.25,.3);
    const faceDots=[[0,0,.406],[.2,.2,.406],[-.2,-.2,.406],[-.2,.2,.406],[.2,-.2,.406]];
    faceDots.forEach(([x,y,z])=>addMesh(g,new THREE.SphereGeometry(.055,12,10),dot,x,y,z));
    cylinder(g,'#e3b94f',0,-.56,0,.35,.35,.14);
  }
  function makeCards(g) {
    const group=new THREE.Group();g.add(group);
    const colors=['#ffcf56','#53bfff','#df79ff'];
    colors.forEach((color,i)=>{
      const card=addMesh(group,new THREE.BoxGeometry(.52,.76,.035),mat(color,.3,.24),(i-1)*.34,(i===1?.06:0),0);
      card.rotation.z=(i-1)*-.24;card.rotation.y=(i-1)*.18;
      torus(group,'#fff1c7',(i-1)*.34,(i===1?.06:0),.035,.12,.018);
    });
  }
  function makeBrain(g) {
    const purple=mat('#9d8bff',.34,.24);
    const brain=addMesh(g,new THREE.SphereGeometry(.48,32,24),purple,0,.03,0);brain.scale.set(1.05,.82,.78);
    for(let i=0;i<8;i++){const a=i*Math.PI/4;const t=torus(g,'#d8d0ff',Math.cos(a)*.27,Math.sin(a)*.2,.25,.18,.025);t.rotation.x=Math.PI/2;t.rotation.z=a;}
  }
  function makeLightning(g) {
    const shape=new THREE.Shape();shape.moveTo(.08,.58);shape.lineTo(-.28,.02);shape.lineTo(-.03,.02);shape.lineTo(-.15,-.58);shape.lineTo(.32,.05);shape.lineTo(.06,.05);shape.closePath();
    const geo=new THREE.ExtrudeGeometry(shape,{depth:.16,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.055,bevelThickness:.055});
    const bolt=addMesh(g,geo,mat('#ffbd45',.65,.2),0,0,0);bolt.rotation.y=-.25;
  }
  function makeLetters(g) {
    const tile=addMesh(g,new THREE.BoxGeometry(.82,.82,.15),mat('#2396e8',.42,.2));
    tile.rotation.set(-.2,.3,.1);
    const edges=new THREE.EdgesGeometry(tile.geometry);
    addMesh(g,edges,mat('#bfefff',.5,.2),0,0,.08);
    const letter=new THREE.Mesh(new THREE.TorusGeometry(.22,.055,10,32),mat('#ffffff',.1,.18));
    letter.position.z=.12;letter.position.y=.02;g.add(letter);
  }
  function makeModel(id) {
    const g=new THREE.Group(),type=colorFor(id);
    if(type==='bilgi')makeTrophy(g);
    else if(type==='renk')makeTubes(g);
    else if(type==='masa')makeDice(g);
    else if(type==='kelime')makeLetters(g);
    else if(type==='dikkat')makeBrain(g);
    else if(type==='refleks')makeLightning(g);
    else if(type==='sayi')makeCards(g);
    else makeTrophy(g);
    const ring=torus(g,palette[type][0],0,-.72,0,.82,.018);ring.rotation.x=Math.PI/2;
    return g;
  }
  function init(canvasEl,id) {
    if(!canvasEl || !window.THREE) return false;
    try {
      if(renderer){renderer.dispose();renderer=null;}
      canvas=canvasEl;host=canvas.parentElement;
      renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
      renderer.setSize(112,92,false);
      renderer.outputColorSpace=THREE.SRGBColorSpace;
      renderer.toneMapping=THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure=1.25;
      scene=new THREE.Scene();
      camera=new THREE.PerspectiveCamera(34,112/92,.1,30);camera.position.set(0,.12,4.1);camera.lookAt(0,0,0);
      scene.add(new THREE.HemisphereLight(0xd9eeff,0x16223c,2.1));
      const key=new THREE.DirectionalLight(0xffffff,3.2);key.position.set(-2,3,4);scene.add(key);
      const rim=new THREE.PointLight(0x49aaff,8,8);rim.position.set(1.7,1.2,-1);scene.add(rim);
      const type=colorFor(id),model=makeModel(id);root=new THREE.Group();root.add(model);scene.add(root);
      const glow=new THREE.PointLight(palette[type][0],3.2,4);glow.position.set(0,0,1.3);scene.add(glow);
      active=true;let start=performance.now();
      const tick=now=>{if(!active||!renderer)return;const t=(now-start)/1000;root.rotation.y=Math.sin(t*.7)*.22;root.rotation.x=Math.sin(t*.9)*.055;root.position.y=Math.sin(t*1.5)*.045;model.rotation.y+=.003;renderer.render(scene,camera);raf=requestAnimationFrame(tick);};
      cancelAnimationFrame(raf);raf=requestAnimationFrame(tick);
      return true;
    } catch(e){console.warn('ARENA 3D init:',e);return false;}
  }
  function stop3D(){active=false;cancelAnimationFrame(raf);if(renderer){renderer.dispose();renderer=null;}if(scene){scene.traverse(o=>{if(o.geometry)o.geometry.dispose();});scene=null;}root=null;}
  function getAudio(){if(!audio){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;audio=new C();musicGain=audio.createGain();musicGain.gain.value=.13;musicGain.connect(audio.destination);}if(audio.state==='suspended')audio.resume();return audio;}
  function tone(freq,dur=.16,wave='sine',volume=.05,when=0){const c=getAudio();if(!c)return;const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+when;o.type=wave;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.018);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+dur+.03);}
  const scales={bilgi:[392,494,587,784,587,494],kelime:[330,392,440,523,440,392],masa:[262,330,392,523,392,330],sudoku:[294,370,440,587,440,370],sayi:[349,440,523,698,523,440],renk:[392,494,659,784,659,494],dikkat:[262,330,392,494,392,330],refleks:[440,554,659,880,659,554]};
  function startMusic(id){stopMusic();if(!musicOn)return;const c=getAudio();if(!c)return;const notes=scales[colorFor(id)]||scales.bilgi;step=0;const play=()=>{if(!active||!musicOn)return;const n=notes[step%notes.length];tone(n,0.36,'triangle',.018);tone(n/2,.48,'sine',.012,.02);step++;musicTimer=window.setTimeout(play,520);};play();}
  function stopMusic(){if(musicTimer)clearTimeout(musicTimer);musicTimer=0;}
  function sfx(id,action='tap'){if(!sfxOn)return;const map={tap:[520,.07],move:[660,.12],success:[784,.2],win:[988,.34],back:[390,.11],error:[180,.22],drop:[440,.1],reset:[330,.13]};const v=map[action]||map.tap;tone(v[0],v[1],action==='win'?'triangle':'sine',.055);if(action==='win'){tone(1175,.3,'triangle',.045,.13);tone(1480,.36,'triangle',.04,.27);}}
  function setMusic(v,id){musicOn=!!v;if(musicOn&&active)startMusic(id||'milyoner');else stopMusic();}
  function setSfx(v){sfxOn=!!v;}
  window.Arena3D={mount:init,stop:stop3D,sfx:sfx,music:setMusic,setSfx:setSfx,settings:()=>({musicOn,sfxOn})};
})();
