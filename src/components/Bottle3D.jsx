import React,{useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import Bottle from './Bottle.jsx';
const MOBILE=typeof matchMedia!=='undefined'&&matchMedia('(pointer: coarse)').matches;
const HH=2.3; // bottle world height

/* ── read the product photo: silhouette → lathe profile, real cap / glass colours, real label decal ── */
function analyze(img){
 const H=820,W=Math.max(2,Math.round(img.naturalWidth*H/img.naturalHeight));
 const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0,W,H);
 const d=x.getImageData(0,0,W,H).data;const A=(xx,yy)=>d[(yy*W+xx)*4+3];
 const L=new Array(H).fill(-1),Rr=new Array(H).fill(-1);let top=-1,bot=-1;
 for(let y=0;y<H;y++){for(let xx=0;xx<W;xx++){if(A(xx,y)>128){if(L[y]<0)L[y]=xx;Rr[y]=xx}}if(L[y]>=0){if(top<0)top=y;bot=y}}
 const rows=[];for(let y=top;y<=bot;y++){rows.push(L[y]>=0?{y,hw:(Rr[y]-L[y])/2,cx:(Rr[y]+L[y])/2}:{y,hw:0,cx:W/2})}
 const N=rows.length;const sm=rows.map((r,i)=>{let s=0,n=0;for(let k=-6;k<=6;k++){const j=i+k;if(j>=0&&j<N){s+=rows[j].hw;n++}}return s/n});
 const cx=rows.reduce((a,r)=>a+r.cx,0)/N;
 let capMax=0;for(let i=1;i<N;i++){if(sm[i]>sm[capMax])capMax=i;else if(sm[i]<sm[capMax]*.72)break}
 let neck=capMax,mn=sm[capMax];for(let j=capMax;j<N;j++){if(sm[j]<mn){mn=sm[j];neck=j}else if(sm[j]>mn*1.35&&j>neck+3)break}
 if(neck<=capMax+4)neck=Math.min(N-2,capMax+Math.round(N*.08));
 if(capMax>N*.4){const cw0=sm[Math.round(N*.06)];let sh=Math.round(N*.06);while(sh<N-2&&sm[sh]<cw0*1.25)sh++;neck=Math.max(4,sh-1)}
 const lum=(i)=>d[i]*.3+d[i+1]*.59+d[i+2]*.11;
 // cap colour (average of lit opaque pixels in the cap area)
 let cr=0,cg=0,cb=0,cn=0;for(let i=0;i<neck;i++){const r=rows[i];for(let xx=Math.round(cx-r.hw*.5);xx<=cx+r.hw*.5;xx++){const p=(r.y*W+Math.round(xx))*4;if(d[p+3]>230){cr+=d[p];cg+=d[p+1];cb+=d[p+2];cn++}}}
 const cap=cn?[cr/cn,cg/cn,cb/cn]:[160,140,100];
 // glass colour (dark pixels of body)
 let br=0,bg=0,bb=0,bn=0;for(let i=neck+10;i<N;i++){const r=rows[i];for(let xx=Math.round(cx-r.hw*.7);xx<=cx+r.hw*.7;xx+=2){const p=(r.y*W+Math.round(xx))*4;if(d[p+3]>230&&lum(p)<95){br+=d[p];bg+=d[p+1];bb+=d[p+2];bn++}}}
 let ar=0,ag=0,ab=0,an=0,al=0;for(let i=neck+10;i<N;i++){const r=rows[i];for(let xx=Math.round(cx-r.hw*.6);xx<=cx+r.hw*.6;xx+=2){const p=(r.y*W+Math.round(xx))*4;if(d[p+3]>230){ar+=d[p];ag+=d[p+1];ab+=d[p+2];al+=lum(p);an++}}}
 const lumMean=an?al/an:0;const light=lumMean>115;
 const body=light?[ar/(an||1)*.8,ag/(an||1)*.8,ab/(an||1)*.8]:(bn?[br/bn,bg/bn,bb/bn]:[10,10,12]);
 // label decal: bright pixels on the body
 let x0=1e9,x1=-1,y0=1e9,y1=-1;
 const bh=N-neck;for(let i=neck+Math.round(bh*.22);i<N-Math.round(bh*.1);i++){const r=rows[i];for(let xx=Math.round(cx-r.hw*.68);xx<=cx+r.hw*.68;xx++){const p=(r.y*W+Math.round(xx))*4;if(d[p+3]>200&&(light?lum(p)<lumMean-62:lum(p)>130)){if(xx<x0)x0=xx;if(xx>x1)x1=xx;if(r.y<y0)y0=r.y;if(r.y>y1)y1=r.y}}}
 let decal=null;
 if(x1>x0&&y1>y0){const pad=10;x0-=pad;x1+=pad;y0-=pad;y1+=pad;const dw=x1-x0,dh=y1-y0;const dc=document.createElement('canvas');dc.width=dw;dc.height=dh;const dx=dc.getContext('2d');const im=dx.createImageData(dw,dh);
  for(let yy=0;yy<dh;yy++)for(let xx=0;xx<dw;xx++){const sx=Math.round(x0+xx),sy=Math.round(y0+yy);if(sx<0||sy<0||sx>=W||sy>=H)continue;const p=(sy*W+sx)*4;const l=lum(p);const a=(light?Math.min(1,Math.max(0,(lumMean-l-30)/55)*1.2):Math.min(1,Math.max(0,(l-34)/44)*1.3))*(d[p+3]/255);const q=(yy*dw+xx)*4;im.data[q]=d[p];im.data[q+1]=d[p+1];im.data[q+2]=d[p+2];im.data[q+3]=a*255}
  dx.putImageData(im,0,0);decal={canvas:dc,x0,x1,y0,y1}}
 if(light){let mhw=0;for(let i=neck+4;i<N;i++)mhw=Math.max(mhw,sm[i]);const lx0=Math.round(cx-mhw),lx1=Math.round(cx+mhw),ly0=rows[neck+4].y,ly1=rows[N-1].y;const dw=lx1-lx0,dh=ly1-ly0;
  const dc=document.createElement('canvas');dc.width=dw;dc.height=dh;const dx=dc.getContext('2d');dx.drawImage(c,lx0,ly0,dw,dh,0,0,dw,dh);
  dx.globalCompositeOperation='destination-in';const gr=dx.createLinearGradient(0,0,dw,0);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(.12,'rgba(0,0,0,1)');gr.addColorStop(.88,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,0)');dx.fillStyle=gr;dx.fillRect(0,0,dw,dh);
  decal={canvas:dc,x0:lx0,x1:lx1,y0:ly0,y1:ly1}}
 const s=HH/(bot-top);
 return {rows,sm,N,neck,cx,s,top,cap,body,decal,light};
}

const CACHE=new Map();
const rgb=a=>new THREE.Color(`rgb(${Math.round(a[0])},${Math.round(a[1])},${Math.round(a[2])})`);
function blobTex(r,g,b,a){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');const gr=x.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,`rgba(${r},${g},${b},${a})`);gr.addColorStop(1,`rgba(${r},${g},${b},0)`);x.fillStyle=gr;x.fillRect(0,0,128,128);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}

export default function Bottle3D({src,alt='',className='',spray=false,anchorRef,autoSpeed=.35,rotate=true,ring=false,platform=false,hint=false,viewY=.75,dist=7.4,xShift=0}){
 const wrap=useRef();const [fail,setFail]=useState(false);const [touched,setTouched]=useState(false);
 useEffect(()=>{
  const host=wrap.current;let disposed=false,raf=0,cleanup=()=>{};
  const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;try{renderer=new THREE.WebGLRenderer({antialias:!MOBILE,alpha:true,powerPreference:'high-performance'})}catch(e){setFail(true);return}
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,MOBILE?1.25:1.6));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.outputColorSpace=THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);renderer.domElement.className='b3d-canvas';
  const scene=new THREE.Scene();const pm=new THREE.PMREMGenerator(renderer);scene.environment=pm.fromScene(new RoomEnvironment(),.04).texture;
  const cam=new THREE.PerspectiveCamera(28,1,.1,60);cam.position.set(0,1.35,dist);cam.lookAt(0,viewY,0);
  // lights
  const key=new THREE.SpotLight(0xffe2b0,260,0,.5,.8,1.6);key.position.set(3.2,5.5,3.4);key.target.position.set(0,1,0);scene.add(key,key.target);
  const rim=new THREE.DirectionalLight(0xbfd2ff,2.2);rim.position.set(-4,3,-3);scene.add(rim);
  const fill=new THREE.DirectionalLight(0xffd9a0,.7);fill.position.set(-3,1.5,4);scene.add(fill);scene.add(new THREE.AmbientLight(0xffffff,.18));
  const root=new THREE.Group();scene.add(root);const bottle=new THREE.Group();root.add(bottle);
  let capG=null,reflCap=null,nz=null,nzY=0,nzR=.14,orif=null,pick=[],capTop=1.9,capR=.45,ringG=null,sparks=null,discs=[];
  const img=new Image();img.onload=()=>{if(disposed)return;
   let a=CACHE.get(src);if(!a){try{a=analyze(img);CACHE.set(src,a)}catch(e){setFail(true);return}}
   const {rows,sm,N,neck,s,top,cap,body,decal,cx,light}=a;
   const Y=i=>(rows[N-1].y-rows[i].y)*s; // world y of row i
   // body lathe (bottom→neck)
   const bp=[new THREE.Vector2(0,0)];for(let i=N-1;i>=neck;i-=3)bp.push(new THREE.Vector2(Math.max(.002,sm[i]*s),Y(i)));bp.push(new THREE.Vector2(Math.max(.002,sm[neck]*s*.6),Y(neck)));bp.push(new THREE.Vector2(0,Y(neck)));
   // cap lathe (neck→top)
   const cp=[new THREE.Vector2(0,Y(neck)-.01)];for(let i=neck;i>=0;i-=2)cp.push(new THREE.Vector2(Math.max(.002,sm[i]*s),Y(i)));cp.push(new THREE.Vector2(0,Y(0)));
   const bodyMat=new THREE.MeshPhysicalMaterial({color:rgb(body).multiplyScalar(.9),metalness:.2,roughness:.12,clearcoat:.8,clearcoatRoughness:.08,envMapIntensity:1.0,reflectivity:.6});
   const capCol=rgb(cap);const hsl={};capCol.getHSL(hsl);const capMat=new THREE.MeshPhysicalMaterial({color:new THREE.Color().setHSL(hsl.h,Math.min(1,hsl.s*1.2+.05),Math.min(.78,Math.max(.56,hsl.l*1.5))),metalness:.92,roughness:.26,clearcoat:.4,clearcoatRoughness:.1,envMapIntensity:2.3});
   if(light){const bc=rgb(body),hh={};bc.getHSL(hh);bc.setHSL(hh.h,Math.min(1,hh.s*1.3+.1),Math.min(.55,hh.l*.9));bodyMat.color.copy(bc).multiplyScalar(.55);bodyMat.emissive.copy(bc).multiplyScalar(.5);bodyMat.emissiveIntensity=1;bodyMat.metalness=0;bodyMat.roughness=.45;bodyMat.clearcoat=.2;bodyMat.envMapIntensity=.25}
   const bm=new THREE.Mesh(new THREE.LatheGeometry(bp,128),bodyMat);const cm=new THREE.Mesh(new THREE.LatheGeometry(cp,128),capMat);bottle.add(bm);capG=new THREE.Group();capG.add(cm);scene.add(capG);pick=[bm,cm];
   capTop=Y(0);capR=sm[Math.round(neck*.55)]*s;
   if(spray){nzR=Math.max(.1,sm[neck]*s);nzY=Y(neck);nz=new THREE.Group();
    const mt=new THREE.MeshStandardMaterial({color:0xdcdcdc,metalness:1,roughness:.2,envMapIntensity:1.8});const blk=new THREE.MeshPhysicalMaterial({color:0x0c0c0c,metalness:.4,roughness:.2,clearcoat:1,envMapIntensity:1.2});
    const c1=new THREE.Mesh(new THREE.CylinderGeometry(nzR*.95,nzR*1.05,.05,48),mt);c1.position.y=.025;
    const c2=new THREE.Mesh(new THREE.CylinderGeometry(nzR*.5,nzR*.58,.2,36),mt);c2.position.y=.15;
    const c3=new THREE.Mesh(new THREE.CylinderGeometry(nzR*.8,nzR*.8,.1,40),blk);c3.position.y=.3;c3.name='act';
    const c4=new THREE.Mesh(new THREE.CylinderGeometry(.017,.017,.08,16),new THREE.MeshBasicMaterial({color:0x000000}));c4.rotation.z=Math.PI/2;c4.position.set(nzR*.8,.3,0);c3.add(c4);c4.position.set(nzR*.8,0,0);
    const rg=new THREE.Mesh(new THREE.TorusGeometry(nzR*.82,.013,10,40),new THREE.MeshStandardMaterial({color:0xd9b25b,metalness:1,roughness:.25}));rg.rotation.x=Math.PI/2;rg.position.y=.36;
    nz.add(c1,c2,c3,rg);nz.position.y=nzY;scene.add(nz);orif=new THREE.Vector3(nzR*.8+.045,nzY+.3,0)}
   if(decal){const wmid=(decal.x0+decal.x1)/2,ymid=(decal.y0+decal.y1)/2;const rowI=Math.min(N-1,Math.max(0,Math.round(ymid-top)));const R=sm[rowI]*s+.004;
    const wid=(decal.x1-decal.x0)*s,hei=(decal.y1-decal.y0)*s;const th=Math.min(Math.PI*1.1,wid/R);
    const tex=new THREE.CanvasTexture(decal.canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;
    const dm=new THREE.Mesh(new THREE.CylinderGeometry(R,R,hei,64,1,true,-th/2,th),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,toneMapped:false,side:THREE.FrontSide}));
    dm.position.y=Y(rowI);dm.position.x=0;bottle.add(dm);
    // decal sits where the photo had it: shift the arc centre if the label is off-centre
    dm.rotation.y=Math.atan2((wmid-cx)*s,R)}
   // reflection (flipped clone, fading out)
   const refl=bottle.clone(true);refl.scale.y=-1;
   const patchR=o=>{if(o.isMesh){o.material=o.material.clone();o.material.transparent=true;o.material.opacity=.3;o.material.depthWrite=false;
    o.material.onBeforeCompile=sh=>{sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying float vWY;').replace('#include <begin_vertex>','#include <begin_vertex>\nvWY=(modelMatrix*vec4(transformed,1.0)).y;');
     sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying float vWY;').replace('#include <dithering_fragment>','#include <dithering_fragment>\ngl_FragColor.a*=clamp(1.0+vWY/1.15,0.0,1.0);')}}};if(innerWidth>=860){refl.traverse(patchR);root.add(refl)}
   if(innerWidth>=860){reflCap=new THREE.Group();const rcm=cm.clone();reflCap.add(rcm);reflCap.scale.y=-1;reflCap.traverse(patchR);scene.add(reflCap)}
   // contact shadow + floor glow
   const sh=new THREE.Mesh(new THREE.PlaneGeometry(2.6,2.6),new THREE.MeshBasicMaterial({map:blobTex(0,0,0,.75),transparent:true,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.004;scene.add(sh);
   const gl=new THREE.Mesh(new THREE.PlaneGeometry(5.2,3.2),new THREE.MeshBasicMaterial({map:blobTex(255,200,120,.22),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));gl.rotation.x=-Math.PI/2;gl.position.y=.006;scene.add(gl);
   if(platform){const dm2=new THREE.Mesh(new THREE.CylinderGeometry(1.55,1.6,.07,96),new THREE.MeshPhysicalMaterial({color:0x1a140c,metalness:.9,roughness:.25,envMapIntensity:1.2}));dm2.position.y=-.035;scene.add(dm2);
    [1.62,1.85,2.1].forEach((r,i)=>{const t=new THREE.Mesh(new THREE.RingGeometry(r,r+.012,128),new THREE.MeshBasicMaterial({color:0xffe2a8,transparent:true,opacity:.5-i*.14,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));t.rotation.x=-Math.PI/2;t.position.y=.01;scene.add(t);discs.push(t)})}
   if(ring){ringG=new THREE.Group();[[1.25,.016,.95],[1.42,.008,.5]].forEach(([r,t,o],i)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(r,t,12,200),new THREE.MeshBasicMaterial({color:i?0xffd98a:0xfff0c4,transparent:true,opacity:o,blending:THREE.AdditiveBlending,depthWrite:false}));ringG.add(m)});
    const orb=new THREE.Mesh(new THREE.SphereGeometry(.05,16,16),new THREE.MeshBasicMaterial({color:0xfff6dc}));orb.name='orb';ringG.add(orb);
    const g=new THREE.Mesh(new THREE.PlaneGeometry(.55,.55),new THREE.MeshBasicMaterial({map:blobTex(255,225,150,.9),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));g.name='orbglow';ringG.add(g);
    ringG.position.y=HH*.48;ringG.rotation.x=1.2;ringG.rotation.z=-.35;scene.add(ringG);
    const n=260,pos=new Float32Array(n*3);for(let i=0;i<n;i++){const t=Math.random()*6.283,rr=1.1+Math.random()*.9,yy=Math.random()*HH*1.15;pos[i*3]=Math.cos(t)*rr;pos[i*3+1]=yy;pos[i*3+2]=Math.sin(t)*rr}
    const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));sparks=new THREE.Points(pg,new THREE.PointsMaterial({size:.035,map:blobTex(255,230,170,1),color:0xffe4a0,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,sizeAttenuation:true}));scene.add(sparks)}
   ready=true;host.classList.add('ready');if(spray&&!rm)demoT=setTimeout(()=>{st.seq<0&&doSpray()},1800)};
  img.onerror=()=>setFail(true);img.src=src;
  let ready=false,demoT=0;
  // ── interaction ──
  const st={seq:-1,pumped:0,rot:rotate?-.5:0,vel:0,drag:false,lx:0,idle:0,press:0,hover:false,nextSpray:0,mx:0,my:0,t:0,tilt:0};
  const ray=new THREE.Raycaster(),nd=new THREE.Vector2();
  const doSpray=()=>{if(!spray||!ready||st.seq>=0)return;st.seq=0;st.pumped=0};
  const onDemo=()=>doSpray();addEventListener('ar-demo',onDemo);
  const ptr=e=>{const r=renderer.domElement.getBoundingClientRect();nd.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);st.mx=nd.x;st.my=nd.y};
  const hit=()=>{ray.setFromCamera(nd,cam);return ready&&ray.intersectObjects(pick,false).length>0};
  const dn=e=>{if(!rotate){if(hit())doSpray();return}st.drag=true;st.lx=e.clientX;st.vel=0;st.idle=0;setTouched(true);renderer.domElement.setPointerCapture?.(e.pointerId);host.classList.add('grab')};
  const mv=e=>{ptr(e);if(rotate&&st.drag){const dx=e.clientX-st.lx;st.lx=e.clientX;st.rot+=dx*.011;st.vel=dx*.011;st.idle=0}
   else{const h=hit();if(h&&!st.hover){st.hover=true;host.classList.add('hot');doSpray();st.nextSpray=performance.now()+2300}if(!h&&st.hover){st.hover=false;host.classList.remove('hot')}}};
  const up=e=>{if(st.drag&&Math.abs(e.clientX-st.lx)<3&&hit())doSpray();st.drag=false;host.classList.remove('grab')};
  const lv=()=>{st.hover=false;host.classList.remove('hot');st.mx=0;st.my=0};
  const cv=renderer.domElement;cv.addEventListener('pointerdown',dn);cv.addEventListener('pointermove',mv);cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);cv.addEventListener('pointerleave',lv);
  // ── size / visibility / loop ──
  let vis=true;const rs=()=>{const w=host.clientWidth||2,h=host.clientHeight||2;renderer.setSize(w,h,false);cam.aspect=w/h;cam.position.x=xShift;cam.lookAt(xShift,viewY,0);cam.updateProjectionMatrix()};rs();
  const ro=new ResizeObserver(rs);ro.observe(host);const io=new IntersectionObserver(e=>{vis=e[0].isIntersecting});io.observe(host);
  const v3=new THREE.Vector3();let last=performance.now();
  let skip=0;const loop=(now)=>{raf=requestAnimationFrame(loop);if(!vis||document.hidden){last=now;return}if(MOBILE&&(skip^=1)){return}const dt=Math.min(.05,(now-last)/1000);last=now;st.t+=dt;
   if(rotate&&!st.drag){st.rot+=st.vel;st.vel*=.94;st.idle+=dt;if(!rm&&Math.abs(st.vel)<.002&&st.idle>.4)st.rot+=dt*autoSpeed*(st.hover?.35:1)}
   // scroll-linked extra spin
   const sc=host.getBoundingClientRect();const prog=Math.max(-1,Math.min(1,(sc.top+sc.height/2-innerHeight/2)/innerHeight));
   root.rotation.y=rotate?st.rot+prog*.9:0;
   st.tilt+=((rotate?st.my*.12:0)-st.tilt)*.06;root.rotation.x=st.tilt;
   root.position.y=Math.sin(st.t*1.2)*.035;
   const bob=root.position.y;let o=0,press=0;
   if(st.seq>=0){st.seq+=dt;const t=st.seq;const e3=x=>1-Math.pow(1-x,3),eio=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
    if(t<.6)o=e3(t/.6);else if(t<2.9)o=1;else if(t<3.6)o=1-eio((t-2.9)/.7);else{o=0;st.seq=-1}
    [[.8,0],[1.75,1]].forEach(([tp,k])=>{if(t>=tp&&st.pumped<=k){st.pumped=k+1;dispatchEvent(new Event('ar-spray'))}if(t>=tp&&t<tp+.3)press=Math.sin((t-tp)/.3*Math.PI)});
    if(st.seq<0&&spray&&st.hover)st.nextSpray=performance.now()+900}
   if(capG){capG.position.set((innerWidth<500?.34:innerWidth<1100?.58:.82)*o,bob+(-.5+Math.sin(st.t*2.4)*.04)*o,.5*o);capG.rotation.set(.25*o,0,-.5*o)}
   if(reflCap&&capG){reflCap.position.set(capG.position.x,-capG.position.y,capG.position.z);reflCap.rotation.set(-capG.rotation.x,0,-capG.rotation.z)}
   if(nz){nz.position.y=nzY+bob;const a=nz.getObjectByName('act');a.position.y=.3-press*.05}
   bottle.position.x=Math.sin(st.t*70)*press*.004;
   if(spray&&st.hover&&st.seq<0&&performance.now()>st.nextSpray){doSpray();st.nextSpray=performance.now()+2500}
   if(ringG){ringG.rotation.y+=dt*.55;const o=ringG.getObjectByName('orb'),g=ringG.getObjectByName('orbglow');const a=st.t*1.6;o.position.set(Math.cos(a)*1.25,Math.sin(a)*1.25,0);g.position.copy(o.position);g.quaternion.copy(cam.quaternion)}
   if(sparks){sparks.rotation.y+=dt*.12;sparks.material.opacity=.6+Math.sin(st.t*3)*.3}
   discs.forEach((d,i)=>d.material.opacity=Math.max(.05,(.5-i*.14)*(.75+Math.sin(st.t*1.4+i)*.25)));
   if(anchorRef){(orif?v3.copy(orif).add(new THREE.Vector3(0,bob-(press*.05),0)):v3.set(capR*.85,capTop-.18,0)).project(cam);const r=cv.getBoundingClientRect();anchorRef.current={x:r.left+(v3.x*.5+.5)*r.width,y:r.top+(-v3.y*.5+.5)*r.height}}
   renderer.render(scene,cam)};
  raf=requestAnimationFrame(loop);
  cleanup=()=>{disposed=true;clearTimeout(demoT);cancelAnimationFrame(raf);ro.disconnect();io.disconnect();cv.removeEventListener('pointerdown',dn);cv.removeEventListener('pointermove',mv);cv.removeEventListener('pointerup',up);cv.removeEventListener('pointercancel',up);cv.removeEventListener('pointerleave',lv);removeEventListener('ar-demo',onDemo);
   scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{m.map&&m.map.dispose();m.dispose()})}});pm.dispose();renderer.dispose();cv.remove()};
  return()=>cleanup()},[src,spray,rotate,ring,platform,viewY,dist,xShift]);
 if(fail)return <div className={'b3d '+className}><Bottle src={src} alt={alt} eager/></div>;
 return <div ref={wrap} className={'b3d '+className} role="img" aria-label={alt+' — interactive 3D view'}>{hint&&!touched&&<span className="b3d-hint"><i/>{!rotate?'Hover to spray':spray?'Hover to spray · Drag to rotate 360°':'Drag to rotate 360°'}</span>}</div>}
