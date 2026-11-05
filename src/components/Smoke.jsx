import React,{useEffect,useRef} from 'react';
/* 2D-canvas smoke + perfume-spray engine (works on every browser, no WebGL needed).
   jet   : nozzle spray burst (triggered by `burst` prop change, every ~6s if `pulse`, or window 'ar-spray' event)
   amt>.3: ambient rolling smoke/cloud along a baseline at `src` ([x, y-from-bottom], 0..1) */
const sprite=(r,g,b)=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');
 const gr=x.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,`rgba(${r},${g},${b},1)`);gr.addColorStop(.35,`rgba(${r},${g},${b},.5)`);gr.addColorStop(.7,`rgba(${r},${g},${b},.12)`);gr.addColorStop(1,`rgba(${r},${g},${b},0)`);
 x.fillStyle=gr;x.fillRect(0,0,128,128);return c};
export default function Smoke({burst=0,amt=1,src=[.55,.2],className='',tint=[.93,.9,.86],wide=1,jet=false,rise=1,pulse=false}){
 const ref=useRef();const st=useRef({burst:0,src,last:0,fire:0});
 useEffect(()=>{st.current.fire=1;st.current.last=performance.now()},[burst]);
 useEffect(()=>{st.current.src=src},[src[0],src[1]]);
 useEffect(()=>{const c=ref.current,x=c.getContext('2d');if(!x)return;
  const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const S=sprite(Math.round(tint[0]*255),Math.round(tint[1]*255),Math.round(tint[2]*255));
  const W=sprite(255,255,255);
  let cw=2,ch=2,raf,vis=true,last=performance.now();const P=[];const sc=innerWidth<700?.6:.8;
  const rs=()=>{cw=c.width=Math.max(2,Math.round(c.clientWidth*sc));ch=c.height=Math.max(2,Math.round(c.clientHeight*sc))};rs();
  const ro=new ResizeObserver(rs);ro.observe(c);const io=new IntersectionObserver(e=>{vis=e[0].isIntersecting});io.observe(c);
  const onSpray=()=>{if(jet){st.current.fire=1;st.current.last=performance.now()}};addEventListener('ar-spray',onSpray);
  const R=Math.random;
  const spawnJet=(b)=>{const [sx,sy]=st.current.src;const ox=sx*cw,oy=(1-sy)*ch;const n=Math.ceil(b*7);
   for(let i=0;i<n;i++){const ang=-.24+(R()-.5)*.42,sp=cw*(.005+R()*.006)*(.7+b*.6);
    P.push({k:1,x:ox+R()*6,y:oy+(R()-.5)*6,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,s:10+R()*18,ds:.9+R()*1.5,a:.36*b+.08,life:85+R()*70,age:0,drag:.972,by:-.012})}
   if(R()<.7)P.push({k:2,x:ox,y:oy,vx:cw*(.006+R()*.006),vy:(R()-.6)*cw*.0035,s:2+R()*3,ds:0,a:.9*b,life:45+R()*35,age:0,drag:.975,by:.004})};
  const spawnAmb=(dt)=>{if(P.length>260)return;const [sx,sy]=st.current.src;const n=amt*.55*dt;let k=Math.floor(n)+(R()<n%1?1:0);
   while(k-->0)P.push({k:0,x:sx*cw+(R()-.5)*wide*cw*.8,y:(1-sy)*ch+R()*14,vx:(R()-.5)*.5+(R()<.5?-.15:.15),vy:-(.12+R()*.35)*rise,s:cw*(.12+R()*.16),ds:.35,a:(.05+R()*.09)*Math.min(amt,1.6),life:320+R()*260,age:0,drag:.999,by:0})};
  const step=(dt)=>{const s=st.current;
   if(s.fire>0&&jet&&!rm){spawnJet(s.fire);s.fire-=.012*dt;if(s.fire<0)s.fire=0}
   if(pulse&&jet&&!rm&&performance.now()-s.last>6500){s.fire=1;s.last=performance.now()}
   if(amt>.3)spawnAmb(dt);
   for(let i=P.length-1;i>=0;i--){const p=P[i];p.age+=dt;if(p.age>=p.life){P.splice(i,1);continue}
    p.vx*=Math.pow(p.drag,dt);p.vy=p.vy*Math.pow(p.drag,dt)+p.by*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.s+=p.ds*dt}};
  const draw=()=>{x.clearRect(0,0,cw,ch);
   for(const p of P){const t=p.age/p.life;let a=p.a*Math.pow(1-t,p.k===0?1:1.4);if(p.k===0)a*=Math.min(1,t*6);if(a<=.003)continue;x.globalAlpha=Math.min(a,1);const sp=p.k===2?W:S;x.drawImage(sp,p.x-p.s/2,p.y-p.s/2,p.s,p.s)}x.globalAlpha=1};
  if(rm||amt>.3){for(let i=0;i<(rm?260:140);i++)step(1)}
  const loop=(now)=>{raf=requestAnimationFrame(loop);if(!vis){last=now;return}if(rm){draw();return}const dt=Math.min(2.5,(now-last)/16.67);last=now;step(dt);draw()};
  raf=requestAnimationFrame(loop);
  return()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();removeEventListener('ar-spray',onSpray)}},[amt,jet,wide,pulse,rise,tint[0],tint[1],tint[2]]);
 return <canvas ref={ref} className={'smoke '+className} aria-hidden="true"/>}
