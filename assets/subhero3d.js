import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
const canvas=document.getElementById('subgl');
if(canvas){
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const grab=document.querySelector('.subgrab');
let renderer,scene,camera,razor,bladeG,raf;
try{
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
  scene=new THREE.Scene();
  const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(new RoomEnvironment(),0.04).texture;
  camera=new THREE.PerspectiveCamera(40,1,0.1,100);camera.position.set(0,0,11);
  const steel=new THREE.MeshStandardMaterial({color:0xdfe3e9,metalness:1,roughness:0.15});
  const brass=new THREE.MeshStandardMaterial({color:0xc07a44,metalness:1,roughness:0.28});
  const horn=new THREE.MeshStandardMaterial({color:0x14161c,metalness:.45,roughness:.32});
  razor=new THREE.Group();
  const handle=new THREE.Mesh(new THREE.BoxGeometry(3.2,0.52,0.34),horn);handle.geometry.translate(-1.55,0,0);razor.add(handle);
  const capEnd=new THREE.Mesh(new THREE.CylinderGeometry(0.27,0.27,0.36,20),brass);capEnd.rotation.x=Math.PI/2;capEnd.position.x=-3.05;razor.add(capEnd);
  bladeG=new THREE.Group();
  const blade=new THREE.Mesh(new THREE.BoxGeometry(3.0,0.82,0.06),steel);blade.geometry.translate(1.55,0,0);bladeG.add(blade);
  const spine=new THREE.Mesh(new THREE.BoxGeometry(3.0,0.16,0.12),brass);spine.geometry.translate(1.55,0.36,0);bladeG.add(spine);
  const nose=new THREE.Mesh(new THREE.CylinderGeometry(0.41,0.41,0.06,24,1,false,0,Math.PI),steel);nose.rotation.x=Math.PI/2;nose.position.x=3.05;nose.rotation.z=-Math.PI/2;bladeG.add(nose);
  razor.add(bladeG);
  const pin=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.16,0.42,16),brass);pin.rotation.x=Math.PI/2;razor.add(pin);
  razor.rotation.z=0.06;scene.add(razor);
  const key=new THREE.SpotLight(0xffffff,175,50,0.6,0.5);key.position.set(6,9,10);scene.add(key);
  const rim=new THREE.SpotLight(0x5c7bb0,90,50,0.7,0.6);rim.position.set(-8,-2,5);scene.add(rim);
  scene.add(new THREE.AmbientLight(0x3a4150,1.1));
  window.__setSceneTheme=(night)=>{renderer.toneMappingExposure=night?1.2:1.0;if(rim)rim.intensity=night?100:80;};
  window.__setSceneTheme(document.documentElement.getAttribute('data-theme')==='night');
  function resize(){const r=canvas.getBoundingClientRect();if(r.width<2){requestAnimationFrame(resize);return;}renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();
    const nw=matchMedia('(max-width:820px)').matches;razor.scale.setScalar(nw?0.6:0.82);}
  resize();addEventListener('resize',resize);
  let mx=0,my=0,tx=0,ty=0,t=0,dragAz=0,dragVel=0,dragging=false,lastX=0,didDrag=false;
  addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-0.5);my=(e.clientY/innerHeight-0.5);},{passive:true});
  canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;dragVel=0;try{canvas.setPointerCapture(e.pointerId)}catch(_){}});
  addEventListener('pointerup',()=>{dragging=false;});
  canvas.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastX;lastX=e.clientX;dragVel=dx*0.006;dragAz+=dragVel;if(Math.abs(dx)>2&&!didDrag){didDrag=true;if(grab)grab.style.opacity='0';}});
  function loop(){raf=requestAnimationFrame(loop);t+=0.016;
    const openA=reduce?0.28:0.28+Math.sin(t*0.7)*0.22;bladeG.rotation.z=openA;
    if(!dragging){dragVel*=0.92;dragAz+=dragVel;}
    tx+=(mx*0.3-tx)*0.05;ty+=(my*0.25-ty)*0.05;
    razor.rotation.y=Math.sin(t*0.33)*0.5+dragAz+tx;razor.rotation.x=0.08-ty*0.35;razor.position.y=Math.sin(t*0.6)*0.08;
    renderer.render(scene,camera);}
  loop();
}catch(err){console.warn('subhero WebGL fallback',err);canvas.style.display='none';}
}
