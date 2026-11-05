import React,{useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import gsap from 'gsap';import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Smoke from '../components/Smoke.jsx';
import {Card,Price} from '../components/ui.jsx';
import {products_,byHandle,shortTitle,firstSentence,inCol,money} from '../store.jsx';
import pages from '../data/pages.json';
gsap.registerPlugin(ScrollTrigger);
const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const isPerfume=p=>!p.cats.includes('bundles')&&!p.cats.includes('body-mist')&&!p.cats.includes('roll-on')&&!/free|pack|bundle/i.test(p.title);
const HERO_PREF=['ar-addiction','ar-elites','ar-reflections','ar-sixer','golden-era','swaggy','the-boss'];
const SHOW_PREF=['ar-crush','ar-addiction','ar-crysto','ar-elites','ar-glam-girl','ar-divine','ar-mr-blue','ar-reflections','ar-ocean-shades','ar-the-legend','royal-musk','ar-our-signature-chocolate'];
const pick=(pre,pool)=>pre.map(x=>pool.find(p=>p.handle.startsWith(x))).filter(Boolean);
// notes hand-verified against the product descriptions on arfragrances.pk
const NOTES={
 'ar-elites-inspired-by-one-million-elites-perfume':{top:['Blood Mandarin','Grapefruit','Mint'],heart:['Cinnamon','Spicy Notes','Rose'],base:['Amber','Leather','Woody Notes','Indian Patchouli']},
 'blush-me-up-inspired-by-my-way-women-30ml':{top:['Orange Blossom','Bergamot'],heart:['Tuberose','Indian Jasmine'],base:['Madagascar Vanilla','White Musk','Virginian Cedar']},
 'sun-kissed-gold-24-hours-lasting':{top:['Saffron','Jasmine','Bergamot'],heart:['Amberwood','Cedarwood','Cashmeran','Fir Balsam'],base:['Ambergris','Musk','Tonka Bean']}};
export default function Home(){
 const root=useRef();
 const cutP=useMemo(()=>products_.filter(p=>p.cut),[]);
 const hero=useMemo(()=>{const a=pick(HERO_PREF,cutP);const rest=cutP.filter(p=>isPerfume(p)&&!a.includes(p)&&p.handle!=='ar-destiny-inspired-by-oud-wood-destiny-perfume');return[...a,...rest].slice(0,5)},[cutP]);
 const showcase=useMemo(()=>{const a=pick(SHOW_PREF,cutP);return a.length>=5?a:cutP.filter(isPerfume).slice(0,9)},[cutP]);
 const [hi,setHi]=useState(0);const [ci,setCi]=useState(1);
 const notesList=Object.keys(NOTES).map(h=>byHandle[h]).filter(p=>p&&p.cut);const [ni,setNi]=useState(0);const nP=notesList[ni]||hero[0];const notes=NOTES[nP?.handle];
 const ctaP=hero[4]||hero[1]||hero[0];
 const hp=hero[hi];const first=useRef(true);
 useLayoutEffect(()=>{if(!hp)return;const q=gsap.utils.selector(root);const rm=reduce();
  const tl=gsap.timeline({defaults:{ease:'power3.out'}});
  tl.fromTo(q('.hbot'),{y:rm?0:90,scale:rm?1:.9,opacity:0,rotate:rm?0:-3},{y:0,scale:1,opacity:1,rotate:0,duration:rm?.01:1.4},0)
    .fromTo(q('.hero .ln > *'),{yPercent:rm?0:110,opacity:rm?1:0},{yPercent:0,opacity:1,duration:rm?.01:1,stagger:.1},.15)
    .fromTo(q('.hero .hfade'),{opacity:0,y:rm?0:20},{opacity:1,y:0,duration:rm?.01:.9,stagger:.1},.5);
  return()=>tl.kill()},[hi,hp?.handle]);
 useLayoutEffect(()=>{const rm=reduce();const ctx=gsap.context(()=>{
  if(rm)return;
  gsap.to('.hbot-wrap',{y:-14,duration:3.2,yoyo:true,repeat:-1,ease:'sine.inOut'});
  gsap.to('.hero .bg',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.hero .hbot-wrap',{yPercent:-6,scale:1.05,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.utils.toArray('.story .pl').forEach((el,i)=>gsap.to(el,{yPercent:(i%2?-1:1)*18,ease:'none',scrollTrigger:{trigger:'.story',start:'top bottom',end:'bottom top',scrub:true}}));
  gsap.fromTo('.story .mask',{backgroundPositionY:'0%'},{backgroundPositionY:'100%',ease:'none',scrollTrigger:{trigger:'.story',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.fromTo('.rot360',{rotateY:-28},{rotateY:28,ease:'none',scrollTrigger:{trigger:'.n360',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.utils.toArray('.nb').forEach((el,i)=>gsap.from(el,{opacity:0,y:50,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 82%'}}));
  gsap.utils.toArray('.swirl path').forEach(p=>{const l=p.getTotalLength?.()||800;gsap.set(p,{strokeDasharray:l,strokeDashoffset:l});gsap.to(p,{strokeDashoffset:0,duration:2.4,ease:'power2.out',scrollTrigger:{trigger:'.breakdown',start:'top 70%'}})});
  gsap.to('.ring',{rotateZ:360,duration:14,repeat:-1,ease:'none'});
  gsap.from('.ctaP',{y:80,opacity:0,duration:1.4,ease:'power3.out',scrollTrigger:{trigger:'.cta',start:'top 70%'}});
 },root);return()=>ctx.revert()},[]);
 // 360 drag
 const drag=useRef(null);const dr=useRef({x:0,on:false,v:0});
 useEffect(()=>{const el=drag.current;if(!el)return;
  const dn=e=>{dr.current.on=true;dr.current.x=e.clientX;el.setPointerCapture?.(e.pointerId)};
  const mv=e=>{if(!dr.current.on)return;const dx=e.clientX-dr.current.x;dr.current.x=e.clientX;const cur=gsap.getProperty(el,'rotateY')||0;gsap.to(el,{rotateY:cur+dx*.6,duration:.4,overwrite:true})};
  const up=()=>{dr.current.on=false;gsap.to(el,{rotateY:0,duration:1.6,ease:'elastic.out(1,.5)'})};
  el.addEventListener('pointerdown',dn);addEventListener('pointermove',mv);addEventListener('pointerup',up);
  return()=>{el.removeEventListener('pointerdown',dn);removeEventListener('pointermove',mv);removeEventListener('pointerup',up)}},[]);
 const go=d=>setHi(i=>(i+d+hero.length)%hero.length);
 useEffect(()=>{if(reduce())return;const t=setInterval(()=>setHi(i=>(i+1)%hero.length),7500);return()=>clearInterval(t)},[hero.length]);
 const sc=useRef();const cs=showcase.length;const cgo=d=>setCi(i=>Math.max(0,Math.min(cs-1,i+d)));
 const about=useMemo(()=>{const t=pages['about-us'].replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();const m=t.match(/Our Mission:\s*(.*?)(?:Elevating|$)/);return m?m[1].trim():t.slice(0,420)},[]);
 const mistC=inCol('buy-1-perfume-get-free-body-mist').length;
 if(!hp)return null;
 return <div ref={root}>
 <section className="hero" aria-label="Featured perfume">
  <div className="bg"/><div className="spot"/>
  <Smoke burst={hi} src={[.7,.3]}/>
  <div className="hwrap">
   <div className="htxt">
    <span className="eyebrow hfade">Premium Collection</span>
    <h1 className="ln"><span>{shortTitle(hp.title).replace(/ - .*/,'').split(' ').slice(0,3).join(' ')}</span><span>{hp.cats.includes('women')?'for Women':hp.cats.includes('unisex')?'Unisex Perfume':'for Men'}</span></h1>
    <p className="hfade">{firstSentence(hp)}</p>
    <div className="hcta hfade"><Link className="btn" to={'/products/'+hp.handle}>Shop Now</Link><Link className="btn sq" to="/collections/all" aria-label="View all perfumes">→</Link></div>
    <div className="hprice hfade"><Price p={hp}/></div>
   </div>
   <div className="hbot-wrap"><img key={hp.handle} className="hbot" src={hp.cut} alt={hp.title} fetchpriority="high"/><div className="floor"/></div>
  </div>
  <button className="arr l" onClick={()=>go(-1)} aria-label="Previous">‹</button><button className="arr r" onClick={()=>go(1)} aria-label="Next">›</button>
  <div className="dots">{hero.map((h,i)=><button key={h.handle} className={i===hi?'on':''} onClick={()=>setHi(i)} aria-label={'Slide '+(i+1)}/>)}</div>
 </section>

 <section className="sec coll">
  <h2 className="stitle rv">Product Collection</h2><p className="ssub rv">Our most-loved fragrances, crafted to last all day.</p>
  <div className="car rv" ref={sc}><button className="arr l" onClick={()=>cgo(-1)} aria-label="Previous">‹</button><button className="arr r" onClick={()=>cgo(1)} aria-label="Next">›</button>
   <div className="track" style={{'--i':ci}}>{showcase.map((p,i)=><div key={p.handle} className={'cslot'+(i===ci?' on':'')+(Math.abs(i-ci)>1?' far':'')} onClick={()=>i!==ci&&setCi(i)}><Card p={p} big={i===ci}/></div>)}</div></div>
  <div className="dots light">{showcase.map((p,i)=><button key={p.handle} className={i===ci?'on':''} onClick={()=>setCi(i)} aria-label={'Product '+(i+1)}/>)}</div>
  <div className="center rv"><Link className="btn ghost" to="/collections/all">View All Perfumes</Link></div>
 </section>

 {notes&&<section className="sec n360">
  <Smoke amt={1.2} src={[.5,.12]} className="low"/>
  <div className="n360g">
   <div className="n360l rv"><span className="eyebrow">Fragrance Notes</span><h2 className="stitle left">{shortTitle(nP.title).replace(/ - .*/,'')}</h2>
    <ul className="nlist"><li><i>Top</i>{notes.top.join(' · ')}</li><li><i>Heart</i>{notes.heart.join(' · ')}</li><li><i>Base</i>{notes.base.join(' · ')}</li></ul>
    <Link className="btn ghost" to={'/products/'+nP.handle}>Discover</Link></div>
   <div className="n360c"><div className="stage"><div className="rot360" ref={drag}><img src={nP.cut} alt={nP.title} loading="lazy" draggable="false"/></div></div><span className="hint">Drag to explore · 360°</span></div>
   <div className="n360r rv"><b>360°</b><span>Fragrance Notes</span>{notesList.length>1&&<div className="dots light">{notesList.map((p,i)=><button key={p.handle} className={i===ni?'on':''} onClick={()=>setNi(i)} aria-label={shortTitle(p.title)}/>)}</div>}</div>
  </div></section>}

 <section className="story">
  <div className="pls" aria-hidden="true">{cutP.slice(2,6).map((p,i)=><img key={p.handle} className={'pl pl'+i} src={p.cut} alt="" loading="lazy"/>)}</div>
  <div className="sec in"><span className="eyebrow rv">AR Fragrances</span>
   <h2 className="mask rv">Brand Story</h2>
   <p className="rv lead">{about}</p><Link to="/pages/about-us" className="btn ghost rv">Read Our Story</Link></div>
 </section>

 {notes&&<section className="sec breakdown">
  <svg className="swirl a" viewBox="0 0 300 500" fill="none" aria-hidden="true"><path d="M250 10C60 70 40 160 150 220s120 140 20 200c-40 24-100 40-130 70" stroke="url(#g)" strokeWidth="3"/><path d="M270 60C110 120 90 190 170 250s90 120 0 180" stroke="url(#g)" strokeWidth="1.5" opacity=".6"/><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f0d79a"/><stop offset="1" stopColor="#8b6a2c"/></linearGradient></defs></svg>
  <svg className="swirl b" viewBox="0 0 300 500" fill="none" aria-hidden="true"><path d="M60 0c30 90 90 110 60 190-20 50-70 60-50 130s80 60 70 180" stroke="url(#g)" strokeWidth="3"/><path d="M110 0c20 80 60 100 40 160" stroke="url(#g)" strokeWidth="1.5" opacity=".6"/></svg>
  <div className="bdc">
   <div className="nb"><span className="num">01</span><h3>Top Notes</h3><p>{notes.top.join(', ')}</p></div>
   <div className="nb"><span className="num">02</span><h3>Heart Notes</h3><p>{notes.heart.join(', ')}</p></div>
   <div className="nb"><span className="num">03</span><h3>Base Notes</h3><p>{notes.base.join(', ')}</p></div>
   <p className="bfoot">{shortTitle(nP.title).replace(/ - .*/,'')} · <Link to={'/products/'+nP.handle}>View product</Link></p></div>
 </section>}

 <section className="cta">
  <div className="bg"/><Smoke amt={1.3} src={[.5,.18]} className="low"/>
  <div className="sec ctag">
   <div className="ctat rv"><span className="eyebrow">Exclusive Collection</span><h2 className="stitle left">Buy 1 Perfume,<br/>Get a Free Body Mist</h2>
    <p>{mistC} perfume + body mist pairings — a complete scent for every moment. Also: bundles from {money(Math.min(...inCol('bundles').map(p=>p.price).filter(x=>x>1000)))}.</p>
    <div className="hcta"><Link className="btn" to="/collections/buy-1-perfume-get-free-body-mist">Shop The Offer</Link><Link className="btn ghost" to="/collections/bundles">View Bundles</Link></div></div>
   <div className="ctab"><div className="ring" aria-hidden="true"/><img className="ctaP" src={ctaP.cut||ctaP.img} alt={ctaP.title} loading="lazy"/></div>
  </div></section>
 </div>}
