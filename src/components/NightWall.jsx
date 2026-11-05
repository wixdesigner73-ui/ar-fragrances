import React,{useCallback,useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import gsap from 'gsap';import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Smoke from './Smoke.jsx';import {Dust} from './art.jsx';
import {products_,shortTitle,firstSentence,useStore,money} from '../store.jsx';
gsap.registerPlugin(ScrollTrigger);
// notes taken from each product's own description on arfragrances.pk
const LINEUP=[
 {h:'oud-al-hussain-long',c:'#e08a3c',notes:{top:['Turkish Rose','Lavender','Lemon'],heart:['Sandalwood','White Flowers'],base:['Musk']}},
 {h:'blush-me-up-inspired',c:'#f08ba6',notes:{top:['Orange Blossom','Bergamot'],heart:['Tuberose','Indian Jasmine'],base:['Madagascar Vanilla','White Musk','Virginian Cedar']}},
 {h:'ar-elites',c:'#cfd8ee',notes:{top:['Blood Mandarin','Grapefruit','Mint'],heart:['Cinnamon','Spicy Notes','Rose'],base:['Amber','Leather','Woody Notes','Indian Patchouli']}},
 {h:'ar-addiction',c:'#5b93ff',notes:{top:['Orange'],heart:['Neroli','Seaweed'],base:['Amber','Virginia Cedar']}},
 {h:'oud-al-sultan',c:'#e8c05c',notes:{top:['Sicilian Mandarin','Lavender','Nutmeg'],heart:['Violet Leaf','Leather'],base:['Cedar','Vetiver','Musk']}}];
const ROWS=[['top','Top'],['heart','Heart'],['base','Base']];
const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const split=t=>{const w=t.trim().split(/\s+/);if(w.length<2)return[t,''];return[w.slice(0,-1).join(' '),w[w.length-1]]};
export default function NightWall(){
 const {add}=useStore();const root=useRef();
 const items=useMemo(()=>LINEUP.map(l=>{const p=products_.find(x=>x.handle.startsWith(l.h)&&x.cut);return p&&{...l,p}}).filter(Boolean),[]);
 const [sel,setSel]=useState(-1);const [hov,setHov]=useState(-1);const [added,setAdded]=useState(false);
 const open=sel>=0,it=open?items[sel]:null;
 const go=useCallback(d=>setSel(s=>(s+d+items.length)%items.length),[items.length]);
 useEffect(()=>{if(!open)return;const k=e=>{if(e.key==='Escape')setSel(-1);if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1)};addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[open,go]);
 useEffect(()=>{setAdded(false)},[sel]);
 useLayoutEffect(()=>{if(reduce())return;const ctx=gsap.context(()=>{
  gsap.from('.nw-box',{y:90,opacity:0,duration:1.3,stagger:.14,ease:'power3.out',scrollTrigger:{trigger:'.nw-wall',start:'top 80%',once:true}});
  gsap.from('.nw-title > *',{y:30,opacity:0,duration:1,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'.nw-title',start:'top 92%',once:true}});
  gsap.to('.nw-stone',{yPercent:-6,ease:'none',scrollTrigger:{trigger:root.current,start:'top bottom',end:'bottom top',scrub:true}});
 },root);return()=>ctx.revert()},[]);
 // detail content swap animation
 useLayoutEffect(()=>{if(!open||reduce())return;const ctx=gsap.context(()=>{gsap.fromTo('.nw-info > *',{y:26,opacity:0},{y:0,opacity:1,duration:.9,stagger:.07,ease:'power3.out',delay:.35})},root);return()=>ctx.revert()},[sel,open]);
 // parallax tilt of bottle toward pointer
 const mv=e=>{if(reduce()||open)return;const n=e.currentTarget,r=n.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;gsap.to(n.querySelector('.nw-bot'),{x:x*14,rotateY:x*16,duration:.6,ease:'power2.out'})};
 const lv=e=>{gsap.to(e.currentTarget.querySelector('.nw-bot'),{x:0,rotateY:0,duration:.9,ease:'power3.out'});setHov(-1)};
 const n2=n=>String(n).padStart(2,'0');
 const p=it&&it.p;const [t1,t2]=p?split(shortTitle(p.title).replace(/ - .*/,'').replace(/^AR /i,'')):['',''];
 const who=p&&(p.cats.includes('women')?'For women':p.cats.includes('unisex')?'Unisex':'For men');
 return <section ref={root} id="night" className={'nw'+(open?' open':'')} aria-label="The Night Collection">
  <div className="nw-stone" aria-hidden="true"/><div className="nw-vig" aria-hidden="true"/><Dust n={34}/>
  <div className={'nw-wall'} onMouseLeave={()=>setHov(-1)}>
   {items.map((x,i)=><div key={x.p.handle} className={'nw-niche'+(i===sel?' sel':'')+(i===hov?' hot':'')+(open&&i!==sel?' gone':'')} style={{'--c':x.c}}
     onMouseEnter={()=>setHov(i)} onMouseMove={mv} onMouseLeave={lv} onClick={()=>!open&&setSel(i)} role={open?undefined:'button'} tabIndex={open?-1:0} aria-label={'Open '+x.p.title} onKeyDown={e=>{if(!open&&(e.key==='Enter'||e.key===' ')){e.preventDefault();setSel(i)}}}>
     <div className="nw-box"><i className="nw-lamp"/><i className="nw-beam"/><i className="nw-edge"/><i className="nw-glow"/>
      <img className="nw-bot" src={x.p.cut} alt={x.p.title} loading="lazy" draggable="false"/>
      <i className="nw-sill"/></div>
     <img className="nw-refl" src={x.p.cut} alt="" aria-hidden="true" draggable="false"/>
     <div className="nw-cap"><b>{shortTitle(x.p.title).replace(/ - .*/,'').replace(/^AR /i,'')}</b><span>{money(x.p.price)}</span></div>
    </div>)}
  </div>
  <Smoke amt={1.5} tint={[.84,.74,.56]} wide={2.6} src={[.5,.1]} className="low"/>
  <div className="nw-title"><span className="eyebrow">AR Fragrances · Collection No. 1</span><h2>The <em>night</em> collection</h2><p>Five signature fragrances, lit one by one. Select a niche to step inside.</p></div>
  <div className="nw-hint" aria-hidden="true"><i/>Hover to illuminate · Select to open</div>
  <aside className="nw-info" aria-live="polite" aria-hidden={!open}>{p&&<>
   <span className="eyebrow">No. {n2(sel+1)} · {who}</span>
   <h3>{t1} {t2&&<em>{t2}</em>}</h3>
   <p className="nw-desc">{firstSentence(p).replace(/^.*?\)\s*is\s+/,'').replace(/^./,c=>c.toUpperCase())}</p>
   <dl className="nw-notes">{ROWS.map(([k,l])=><div key={k}><dt>{l}</dt><dd>{it.notes[k].join(', ')}</dd></div>)}</dl>
   <div className="nw-price"><b>{money(p.price)}</b>{p.compare>p.price&&<s>{money(p.compare)}</s>}{p.variants[0].title!=='Default Title'&&<small>{p.variants[0].title}</small>}</div>
   <div className="nw-act"><button className="btn" onClick={()=>{add(p,p.variants[0],1);setAdded(true)}}>{added?'Added to bag ✓':'Add to bag'}</button><Link to={'/products/'+p.handle} className="nw-link">View details →</Link></div>
   <div className="nw-nav"><button onClick={()=>setSel(-1)} className="nw-back">← Back to the wall</button><div className="nw-pg"><button onClick={()=>go(-1)} aria-label="Previous">‹</button><span>{n2(sel+1)} / {n2(items.length)}</span><button onClick={()=>go(1)} aria-label="Next">›</button></div></div></>}</aside>
 </section>}
