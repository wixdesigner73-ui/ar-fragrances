import React,{useEffect,useRef} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

function taperTube(curve,seg,rad,rf){const pts=curve.getPoints(seg);const fr=curve.computeFrenetFrames(seg,false);const pos=[],idx=[];
 for(let i=0;i<=seg;i++){const r=rf(i/seg),P=pts[i],N=fr.normals[i],B=fr.binormals[i];
  for(let j=0;j<=rad;j++){const a=j/rad*Math.PI*2,c=Math.cos(a),s=Math.sin(a);pos.push(P.x+r*(c*N.x+s*B.x),P.y+r*(c*N.y+s*B.y),P.z+r*(c*N.z+s*B.z))}}
 for(let i=0;i<seg;i++)for(let j=0;j<rad;j++){const a=i*(rad+1)+j,b=a+rad+1;idx.push(a,b,a+1,b,b+1,a+1)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g}
function blob(r,g,b,a){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const gr=x.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,`rgba(${r},${g},${b},${a})`);gr.addColorStop(1,`rgba(${r},${g},${b},0)`);x.fillStyle=gr;x.fillRect(0,0,64,64);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}

export default function NotesScene3D({mode='both',className=''}){
 const host=useRef();
 useEffect(()=>{
  const el=host.current;const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true})}catch(e){return}
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;renderer.outputColorSpace=THREE.SRGBColorSpace;
  el.appendChild(renderer.domElement);renderer.domElement.style.cssText='width:100%;height:100%;display:block';
  const scene=new THREE.Scene();const pm=new THREE.PMREMGenerator(renderer);scene.environment=pm.fromScene(new RoomEnvironment(),.04).texture;
  const cam=new THREE.PerspectiveCamera(30,1,.1,80);cam.position.set(0,3.2,14.3);cam.lookAt(0,0,0);
  const key=new THREE.SpotLight(0xffe0a8,420,0,.7,.7,1.5);key.position.set(-4,7,9);scene.add(key);
  const rim=new THREE.DirectionalLight(0xffd9a0,1.6);rim.position.set(5,3,-4);scene.add(rim);scene.add(new THREE.AmbientLight(0xffffff,.1));
  const gold=new THREE.MeshPhysicalMaterial({color:0xd9a93f,metalness:1,roughness:.13,clearcoat:1,clearcoatRoughness:.04,envMapIntensity:2.5,side:THREE.DoubleSide});
  const pale=new THREE.MeshPhysicalMaterial({color:0xf6dc96,metalness:1,roughness:.08,clearcoat:1,envMapIntensity:3,side:THREE.DoubleSide,emissive:0x3a2a08,emissiveIntensity:.5});
  const dark=new THREE.MeshPhysicalMaterial({color:0x16120e,metalness:.4,roughness:.12,clearcoat:1,clearcoatRoughness:.05,envMapIntensity:1.5});
  const left=new THREE.Group(),right=new THREE.Group();scene.add(left);
  // ───────── LEFT: liquid-gold swirl + droplet ─────────
  const main=new THREE.CatmullRomCurve3([[1.15,2.55,0],[.25,2.35,.3],[-.55,1.75,.15],[-.35,1.05,-.2],[.45,.6,.1],[.65,0,.25],[.28,-.5,.05],[0,-.82,0]].map(p=>new THREE.Vector3(...p)));
  left.add(new THREE.Mesh(taperTube(main,160,20,t=>.02+.125*Math.pow(Math.sin(Math.PI*Math.min(1,t*1.04)),.5)*(.55+.45*Math.sin(t*9+1))),gold));
  const hl=new THREE.CatmullRomCurve3(main.points.map(p=>p.clone().add(new THREE.Vector3(-.045,.02,.07))));
  left.add(new THREE.Mesh(taperTube(hl,160,8,t=>.003+.011*Math.sin(Math.PI*t)),pale));
  const c2=new THREE.CatmullRomCurve3([[.95,2.15,.15],[.35,2.5,.45],[-.25,2.3,.55],[-.7,2.0,.4]].map(p=>new THREE.Vector3(...p)));left.add(new THREE.Mesh(taperTube(c2,60,14,t=>.008+.05*Math.sin(Math.PI*t)),pale));
  const c3=new THREE.CatmullRomCurve3([[-.95,1.15,.1],[-1.25,.75,.2],[-1.05,.35,.1],[-.7,.3,0]].map(p=>new THREE.Vector3(...p)));left.add(new THREE.Mesh(taperTube(c3,50,12,t=>.006+.04*Math.sin(Math.PI*t)),gold));
  // droplet (teardrop lathe)
  const dp=[];for(let i=0;i<=60;i++){const th=Math.PI*(1-i/60);dp.push(new THREE.Vector2(Math.max(.001,Math.sin(th)*Math.pow(Math.sin(th/2),1.15)*.78),Math.cos(th)*.88-1.72))}
  const drop=new THREE.Mesh(new THREE.LatheGeometry(dp,96),new THREE.MeshPhysicalMaterial({color:0xe0ad45,metalness:.85,roughness:.07,clearcoat:1,clearcoatRoughness:.02,envMapIntensity:2.6,emissive:0x4a2e06,emissiveIntensity:.35}));left.add(drop);
  const sp=new THREE.Mesh(new THREE.PlaneGeometry(.4,.4),new THREE.MeshBasicMaterial({map:blob(255,240,200,.9),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));sp.position.set(-.22,-1.45,.62);left.add(sp);
  const gp=new Float32Array(40*3);for(let i=0;i<40;i++){const a=Math.random()*6.28,r=Math.random()*.65;gp[i*3]=Math.cos(a)*r;gp[i*3+1]=-1.72+(Math.random()-.4)*1.5;gp[i*3+2]=.2+Math.random()*.5}
  const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.BufferAttribute(gp,3));const glints=new THREE.Points(gg,new THREE.PointsMaterial({size:.07,map:blob(255,235,170,1),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));left.add(glints);
  const thread=new THREE.Mesh(taperTube(new THREE.LineCurve3(new THREE.Vector3(0,-2.55,0),new THREE.Vector3(0,-3.15,0)),12,10,t=>.03-.012*t),gold);left.add(thread);
  const dBead=new THREE.Mesh(new THREE.SphereGeometry(.065,20,20),gold);left.add(dBead);
  // ───────── RIGHT: tilted bottle pouring into a ripple pool + falling petals ─────────
  const bt=new THREE.Group();right.add(bt);
  const body=new THREE.Mesh(new RoundedBoxGeometry(1.5,1.9,1.1,6,.13),dark);bt.add(body);
  const edge=new THREE.LineSegments(new THREE.EdgesGeometry(new RoundedBoxGeometry(1.5,1.9,1.1,2,.13),20),new THREE.LineBasicMaterial({color:0xc9a45c,transparent:true,opacity:.4}));bt.add(edge);
  [[.34,.12,1.0],[.31,.1,1.1],[.28,.1,1.2],[.25,.1,1.3],[.2,.2,1.45]].forEach(([r,h,y],i)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r*1.04,h,48),i%2?pale:gold);m.position.y=y;bt.add(m)});
  bt.rotation.z=Math.PI-.62;
  const thr=new THREE.Mesh(new THREE.CylinderGeometry(1,1,1,10),gold);right.add(thr);const bead=new THREE.Mesh(new THREE.SphereGeometry(.075,20,20),gold);right.add(bead);
  const pool=new THREE.Group();right.add(pool);pool.rotation.x=-Math.PI/2;
  pool.add(new THREE.Mesh(new THREE.CircleGeometry(1.5,96),new THREE.MeshPhysicalMaterial({color:0x040302,metalness:1,roughness:.05,envMapIntensity:.8,transparent:true,opacity:.92})));
  [[1.42,1.47,.8],[.98,1.01,.5],[1.75,1.77,.25]].forEach(([a,b,o])=>pool.add(new THREE.Mesh(new THREE.RingGeometry(a,b,128),new THREE.MeshBasicMaterial({color:0xd9a93f,transparent:true,opacity:o,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}))));
  pool.add(new THREE.Mesh(new THREE.CircleGeometry(.34,48),new THREE.MeshBasicMaterial({color:0x1a1405,transparent:true,opacity:.9})));
  const ripples=[0,1,2].map(()=>{const m=new THREE.Mesh(new THREE.RingGeometry(.94,1,96),new THREE.MeshBasicMaterial({color:0xffd98a,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));pool.add(m);return m});
  const leafShape=new THREE.Shape();leafShape.moveTo(0,0);leafShape.bezierCurveTo(.15,.4,.6,.46,.9,.1);leafShape.bezierCurveTo(.55,-.22,.15,-.2,0,0);
  const leaves=[...Array(5)].map((_,i)=>{const m=new THREE.Mesh(new THREE.ShapeGeometry(leafShape,16),gold);m.scale.setScalar(.34+Math.random()*.16);right.add(m);return {m,ph:i/5,x:(Math.random()-.5)*1.6,sw:.4+Math.random()*.6,sp:.35+Math.random()*.25,rot:[Math.random()*3,Math.random()*3,Math.random()*3]}});
  if(mode==='both')scene.add(right);
  // ───────── layout / loop ─────────
  const L={bs:1};let vis=true;const st={mx:0,my:0,t:0};
  const layout=()=>{const w=el.clientWidth||2,h=el.clientHeight||2;renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();
   const dist=Math.hypot(14.3,3.2),visH=2*Math.tan(THREE.MathUtils.degToRad(15))*dist,visW=visH*cam.aspect;
   if(mode==='left'){const sc=Math.min(visH*.86/5.9,visW*.8/2.6);left.scale.setScalar(sc);left.position.set(0,.42*sc,0)}
   else{const sc=Math.min(visH*.9/5.9,visW*.26/1.4);left.scale.setScalar(sc);left.position.set(-visW*.405,.42*sc,0);
    L.bs=Math.min(visH/7.8,visW/9)*1.15;right.scale.setScalar(L.bs);L.bx=visW*.4;L.by=visH*.4;L.px=visW*.35;L.py=-visH*.34;right.userData={px:L.px,py:L.py,bx:L.bx,by:L.by,visH,visW}}};
  layout();const ro=new ResizeObserver(layout);ro.observe(el);const io=new IntersectionObserver(e=>{vis=e[0].isIntersecting});io.observe(el);
  const mm=e=>{const r=el.getBoundingClientRect();st.mx=((e.clientX-r.left)/r.width-.5)*2;st.my=((e.clientY-r.top)/r.height-.5)*2};addEventListener('pointermove',mm);
  const tip=new THREE.Vector3();let last=performance.now(),raf;
  const loop=(now)=>{raf=requestAnimationFrame(loop);if(!vis){last=now;return}const dt=Math.min(.05,(now-last)/1000);last=now;if(!rm)st.t+=dt;const t=st.t;
   left.rotation.y+=((st.mx*.35+(mode==='left'?Math.sin(t*.5)*.5:Math.sin(t*.4)*.12))-left.rotation.y)*.05;left.rotation.x+=((st.my*.1)-left.rotation.x)*.05;
   left.children[0].position.y=Math.sin(t*1.1)*.03;drop.scale.set(1+Math.sin(t*2)*.012,1+Math.sin(t*2.4)*.018,1);
   glints.material.opacity=.7+Math.sin(t*3)*.3;sp.material.opacity=.6+Math.sin(t*2.2)*.3;
   // hanging bead on droplet drip loops
   const dph=(t%2.4)/2.4;const dby=dph<.45?-3.15+.0:-3.15-((dph-.45)/.55)**2*1.6;dBead.position.set(0,dby,0);dBead.scale.setScalar(dph<.45?.4+dph/.45*.6:1);dBead.visible=true;
   if(mode==='both'){const u=right.userData;if(u&&u.px!==undefined){
    right.position.set(0,0,0);bt.position.set(u.bx/L.bs+Math.sin(t*.6)*.04,u.by/L.bs-.1,0);bt.rotation.z=Math.PI-.62+Math.sin(t*.7)*.015;
    pool.position.set(u.px/L.bs,u.py/L.bs,0);
    bt.updateMatrixWorld(true);tip.set(0,1.55,0);bt.localToWorld(tip);right.worldToLocal(tip);
    const P=2.8,ph=t%P,fall=.55,drop2=1.25;const poolY=pool.position.y;let by,bs=1,vis2=true;
    if(ph<fall){by=tip.y;bs=.25+ph/fall*.75}else if(ph<fall+drop2){const k=(ph-fall)/drop2;by=tip.y+(poolY-tip.y)*k*k;bs=1}else{by=poolY;vis2=false}
    bead.position.set(tip.x,by,0);bead.scale.set(bs,bs*(ph>fall&&ph<fall+drop2?1.9:1),bs);bead.visible=vis2;
    const len=Math.max(.001,tip.y-by);thr.position.set(tip.x,(tip.y+by)/2,0);thr.scale.set(.028,vis2?len:.001,.028);thr.visible=vis2&&ph>fall*.35;
    ripples.forEach((m,i)=>{const k=(ph-fall-drop2-i*.0)/1.0-i*.0;const r=ph>=fall+drop2?((ph-fall-drop2)-i*.28)/1.35:-1;if(r>0&&r<1){m.scale.setScalar(.12+r*1.55);m.material.opacity=(1-r)*.85;m.position.set(0,0,.002)}else m.material.opacity=0});
    leaves.forEach(o=>{const k=((t*o.sp+o.ph)%1);const x=tip.x-.2+o.x*.9+Math.sin(t*o.sw*2+o.ph*6)*.45,y=tip.y-.4-(tip.y-poolY+.4)*k;o.m.position.set(x,y,Math.sin(t+o.ph*5)*.4);o.m.rotation.set(o.rot[0]+t*.9,o.rot[1]+t*.7,o.rot[2]+t*.5);o.m.material=gold;o.m.visible=k<.95})}}
   key.position.x=-4+st.mx*3;key.position.y=7-st.my*2;
   renderer.render(scene,cam)};
  raf=requestAnimationFrame(loop);
  return()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();removeEventListener('pointermove',mm);scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{m.map&&m.map.dispose();m.dispose()})}});pm.dispose();renderer.dispose();renderer.domElement.remove()}},[mode]);
 return <div ref={host} className={'ns3d '+className} aria-hidden="true"/>}
