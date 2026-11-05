import React,{useEffect,useRef} from 'react';
import gsap from 'gsap';
const rm=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
/* floating dust specks */
export function Dust({n=70,className=''}){const r=useRef();
 useEffect(()=>{const c=r.current,x=c.getContext('2d');let w,h,raf,vis=true;const P=[];
  const rs=()=>{w=c.width=c.clientWidth;h=c.height=c.clientHeight};rs();const ro=new ResizeObserver(rs);ro.observe(c);
  const io=new IntersectionObserver(e=>vis=e[0].isIntersecting);io.observe(c);
  for(let i=0;i<n;i++)P.push({x:Math.random(),y:Math.random(),s:Math.random()*1.6+.4,v:Math.random()*.00006+.00001,t:Math.random()*6});
  const d=t=>{raf=requestAnimationFrame(d);if(!vis)return;x.clearRect(0,0,w,h);
   for(const p of P){if(!rm()){p.y-=p.v;p.x+=Math.sin(t/3000+p.t)*.00008;if(p.y<0)p.y=1}
    const a=.25+.5*Math.abs(Math.sin(t/1400+p.t));x.fillStyle=`rgba(255,235,200,${a*.7})`;x.beginPath();x.arc(p.x*w,p.y*h,p.s,0,7);x.fill()}};
  raf=requestAnimationFrame(d);return()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect()}},[n]);
 return <canvas ref={r} className={'dust '+className} aria-hidden="true"/>}
export const SvgDefs=()=><svg width="0" height="0" style={{position:"absolute",width:0,height:0,overflow:"hidden"}} aria-hidden="true" focusable="false"><defs>
 <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fbe7b0"/><stop offset=".45" stopColor="#c9983f"/><stop offset="1" stopColor="#6b4a14"/></linearGradient>
 <linearGradient id="gold2" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#5a3d0e"/><stop offset=".5" stopColor="#d9ac55"/><stop offset="1" stopColor="#fff1c8"/></linearGradient>
 <radialGradient id="dropg" cx=".38" cy=".3" r=".8"><stop offset="0" stopColor="#fff3cf"/><stop offset=".35" stopColor="#d7a54c"/><stop offset="1" stopColor="#4a2f08"/></radialGradient>
 <filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg>;
/* gold liquid swirl + droplet (left art of notes section / story panel) */
export function GoldDrop({className=''}){const r=useRef();
 useEffect(()=>{if(rm())return;const ctx=gsap.context(()=>{
  gsap.fromTo('.dr',{y:-6,opacity:1},{y:70,opacity:0,duration:2.2,repeat:-1,ease:'power2.in'});
  gsap.to('.sw',{y:8,rotate:1.5,transformOrigin:'50% 50%',duration:3.4,yoyo:true,repeat:-1,ease:'sine.inOut'});
  gsap.to('.sp',{opacity:.2,duration:1.2,stagger:{each:.3,repeat:-1,yoyo:true}})},r);return()=>ctx.revert()},[]);
 return <svg ref={r} className={'gdrop '+className} viewBox="0 0 300 560" fill="none" aria-hidden="true">
  <g className="sw" filter="url(#glow)"><path d="M175 14C95 52 70 118 138 158c64 38 82 84 38 124" stroke="url(#gold)" strokeWidth="18" strokeLinecap="round"/><path d="M175 14C95 52 70 118 138 158c64 38 82 84 38 124" stroke="#fff3cf" strokeWidth="2.5" strokeLinecap="round" opacity=".7" transform="translate(-4 -2)"/>
  <path d="M205 40c-40 -6 -70 12 -62 38" stroke="url(#gold2)" strokeWidth="9" strokeLinecap="round"/><path d="M120 120c-34 10 -40 40 -16 60" stroke="url(#gold2)" strokeWidth="7" strokeLinecap="round" opacity=".8"/></g>
  <path d="M150 276C150 276 90 338 90 392c0 40 26 62 60 62s60-22 60-62c0-54-60-116-60-116z" fill="url(#dropg)" filter="url(#glow)"/>
  <path d="M112 372c0 -26 14 -52 30 -72" stroke="#fff3cf" strokeWidth="3" strokeLinecap="round" opacity=".55"/>
  {[[130,350],[160,372],[176,336],[146,392],[118,382]].map(([x,y],i)=><circle key={i} className="sp" cx={x} cy={y} r={i%2?1.6:2.4} fill="#fff2c4"/>)}
  <path d="M150 424c-6 24 -4 52 0 84" stroke="url(#gold)" strokeWidth="6" strokeLinecap="round"/><circle className="dr" cx="150" cy="500" r="6" fill="url(#dropg)"/></svg>}
/* bottle pouring into ripple pool + leaves (right art of notes section) */
export function PourArt({className=''}){const r=useRef();
 useEffect(()=>{if(rm())return;const ctx=gsap.context(()=>{
  gsap.fromTo('.pd',{y:0,opacity:1},{y:250,opacity:0,duration:1.8,repeat:-1,ease:'power1.in'});
  gsap.fromTo('.rp',{scale:.35,opacity:.9,transformOrigin:'50% 50%'},{scale:1.25,opacity:0,duration:2.6,repeat:-1,stagger:.65,ease:'power1.out'});
  gsap.to('.lf',{y:'+=14',rotate:'+=14',duration:2.6,yoyo:true,repeat:-1,ease:'sine.inOut',stagger:.5,transformOrigin:'50% 50%'})},r);return()=>ctx.revert()},[]);
 return <svg ref={r} className={'pour '+className} viewBox="0 0 420 560" fill="none" aria-hidden="true">
  <defs><linearGradient id="bk" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#050403"/><stop offset=".5" stopColor="#2a2118"/><stop offset="1" stopColor="#0a0806"/></linearGradient></defs>
  <g transform="translate(300 40) rotate(-38)"><rect x="-70" y="-40" width="150" height="150" rx="10" fill="url(#bk)" stroke="#6b5a3b" strokeWidth="1"/><rect x="-70" y="-48" width="150" height="14" fill="url(#gold)"/>
   <rect x="-26" y="108" width="62" height="14" rx="2" fill="url(#gold)"/><rect x="-22" y="122" width="54" height="8" fill="#e8c985"/><rect x="-18" y="130" width="46" height="8" fill="url(#gold)"/><rect x="-14" y="138" width="38" height="8" fill="#e8c985"/><rect x="-10" y="146" width="30" height="16" rx="3" fill="url(#gold2)"/></g>
  <path d="M236 150c-8 10 -10 40 -6 70" stroke="url(#gold)" strokeWidth="5" strokeLinecap="round"/><circle className="pd" cx="231" cy="236" r="5" fill="url(#dropg)"/>
  <g transform="translate(250 466)" filter="url(#glow)"><ellipse className="rp" rx="130" ry="34" stroke="url(#gold)" strokeWidth="3"/><ellipse className="rp" rx="130" ry="34" stroke="url(#gold)" strokeWidth="2"/><ellipse className="rp" rx="130" ry="34" stroke="url(#gold)" strokeWidth="1.5"/><ellipse rx="40" ry="10" fill="#0a0806" opacity=".9"/></g>
  {[[300,300,20],[250,360,-30],[330,400,40]].map(([x,y,a],i)=><path key={i} className="lf" d="M0 0C14 -24 40 -28 58 -10 40 8 14 16 0 0Z" fill="url(#gold)" transform={`translate(${x} ${y}) rotate(${a}) scale(.7)`}/>)}</svg>}
/* tilted-bottle accessories for Brand Story */
export function Petals(){const r=useRef();
 useEffect(()=>{if(rm())return;const ctx=gsap.context(()=>{gsap.to('.pt',{y:'+=22',x:'+=10',rotate:'+=25',duration:3.4,yoyo:true,repeat:-1,ease:'sine.inOut',stagger:.35,transformOrigin:'50% 50%'});gsap.to('.cube',{rotateX:360,rotateY:360,duration:18,repeat:-1,ease:'none'})},r);return()=>ctx.revert()},[]);
 const P=[[6,16,30,1],[78,8,-20,.8],[88,52,60,1.1],[0,62,-40,.7],[70,84,15,.9],[18,88,80,.6],[50,2,-60,.5]];
 return <div ref={r} className="petals" aria-hidden="true">
  {P.map(([x,y,a,s],i)=><svg key={i} className="pt" style={{left:x+'%',top:y+'%',transform:`rotate(${a}deg) scale(${s})`}} width="60" height="30" viewBox="0 0 60 30"><path d="M0 14C14 -6 40 -8 58 8 40 26 14 30 0 14Z" fill="url(#gold)"/></svg>)}
  <div className="cubewrap"><div className="cube"><i/><i/><i/><i/><i/><i/></div></div></div>}
/* glowing gold light-trail spiral around the CTA bottle */
export function Trail(){const r=useRef();
 useEffect(()=>{if(rm())return;const ctx=gsap.context(()=>{gsap.to('.tr',{strokeDashoffset:-260,duration:3.2,repeat:-1,ease:'none'});gsap.to('.tw',{opacity:.1,scale:.4,transformOrigin:'50% 50%',duration:1,stagger:{each:.12,repeat:-1,yoyo:true}})},r);return()=>ctx.revert()},[]);
 const S=Array.from({length:22},(_,i)=>{const t=i/21;return[50+Math.cos(t*5)*180*(1-t*.2),300-t*190+Math.sin(t*5)*60,1+((i*7)%5)*.5]});
 return <svg ref={r} className="trail" viewBox="0 0 400 500" fill="none" aria-hidden="true">
  <g filter="url(#glow)"><path className="trb" d="M392 250C396 150 300 84 226 128" stroke="url(#gold2)" strokeWidth="3" opacity=".55"/><path className="tr" d="M8 400C130 470 350 440 392 250" stroke="#fff3cf" strokeWidth="4" strokeLinecap="round" strokeDasharray="130 130"/><path d="M8 400C130 470 350 440 392 250" stroke="url(#gold)" strokeWidth="2" opacity=".8"/></g>
  {S.map(([x,y,s],i)=><circle key={i} className="tw" cx={x+120} cy={y+30} r={s} fill="#ffe9ad"/>)}</svg>}
