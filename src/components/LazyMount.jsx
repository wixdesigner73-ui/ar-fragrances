import React,{useEffect,useRef,useState} from 'react';
/* Mounts children only while the box is near the viewport; unmounts (frees the WebGL context) once it is far away.
   Keeps at most a few heavy scenes alive at a time, which is what makes the page light on phones. */
export default function LazyMount({children,className='',style,near='250px',far=1.6,minHeight}){
 const ref=useRef();const [on,setOn]=useState(false);
 useEffect(()=>{const el=ref.current;if(!el)return;
  const io=new IntersectionObserver(([e])=>{if(e.isIntersecting)setOn(true)},{rootMargin:near+' 0px'});io.observe(el);
  const far_=()=>{if(!on)return;const r=el.getBoundingClientRect(),h=innerHeight;if(r.bottom<-h*far||r.top>h*(1+far))setOn(false)};
  let t=0;const sc=()=>{clearTimeout(t);t=setTimeout(far_,350)};addEventListener('scroll',sc,{passive:true});
  return()=>{io.disconnect();removeEventListener('scroll',sc);clearTimeout(t)}},[on,near,far]);
 return <div ref={ref} className={className} style={{width:'100%',height:'100%',minHeight,...style}}>{on?children:null}</div>}
