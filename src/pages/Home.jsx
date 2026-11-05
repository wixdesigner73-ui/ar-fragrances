import React,{useCallback,useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import gsap from 'gsap';import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Opening from '../components/Opening.jsx';import Bottle from '../components/Bottle.jsx';import Smoke from '../components/Smoke.jsx';
import {Dust,GoldDrop,PourArt,Petals,Trail} from '../components/art.jsx';
import {Price} from '../components/ui.jsx';
import {products_,byHandle,shortTitle,firstSentence,onSale} from '../store.jsx';
import pages from '../data/pages.json';
gsap.registerPlugin(ScrollTrigger);
const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const HERO_PREF=['ar-addiction','ar-elites','ar-sixer','golden-era','swaggy','the-boss'];
const SHOW_PREF=['ar-crush','ar-addiction','ar-crysto','ar-elites','ar-glam-girl','ar-divine','ar-mr-blue','ar-ocean-shades','ar-the-legend','royal-musk','ar-our-signature-chocolate'];
const pick=(pre,pool)=>pre.map(x=>pool.find(p=>p.handle.startsWith(x))).filter(Boolean);
// notes hand-verified against the product descriptions on arfragrances.pk
const NOTES={
 'ar-elites-inspired-by-one-million-elites-perfume':{top:['Blood Mandarin','Grapefruit','Mint'],heart:['Cinnamon','Spicy Notes','Rose'],base:['Amber','Leather','Woody Notes','Indian Patchouli']},
 'blush-me-up-inspired-by-my-way-women-30ml':{top:['Orange Blossom','Bergamot'],heart:['Tuberose','Indian Jasmine'],base:['Madagascar Vanilla','White Musk','Virginian Cedar']},
 'sun-kissed-gold-24-hours-lasting':{top:['Saffron','Jasmine','Bergamot'],heart:['Amberwood','Cedarwood','Cashmeran','Fir Balsam'],base:['Ambergris','Musk','Tonka Bean']}};
const TABS=[['top','Top Notes'],['heart','Heart Notes'],['base','Base Notes']];
const para=h=>h.replace(/<h1[\s\S]*?<\/h1>/,'').replace(/<br\s*\/?>\s*<br\s*\/?>/g,'\n\n').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').split(/\n\s*\n/).map(t=>t.replace(/\s+/g,' ').trim()).filter(t=>t.length>70&&!t.startsWith('-')&&!/first to know|subscribe|newsletter/i.test(t));
const lead=p=>firstSentence(p).replace(/^.*?\)\s*is\s+/,'').replace(/^./,c=>c.toUpperCase());
export default function Home(){
 const root=useRef();const bref=useRef();
 const cutP=useMemo(()=>products_.filter(p=>p.cut),[]);
 const hero=useMemo(()=>pick(HERO_PREF,cutP).concat(cutP.filter(p=>p.cats.includes('men')&&!HERO_PREF.some(x=>p.handle.startsWith(x))&&!/free|pack|bundle|destiny/i.test(p.handle))).slice(0,5),[cutP]);
 const showcase=useMemo(()=>{const a=pick(SHOW_PREF,cutP);return a.length>=5?a:cutP.slice(0,9)},[cutP]);
 const [hi,setHi]=useState(0);const [ci,setCi]=useState(1);const [tab,setTab]=useState(0);const [jsrc,setJsrc]=useState([.55,.5]);
 const notesList=Object.keys(NOTES).map(h=>byHandle[h]).filter(p=>p&&p.cut);const [ni,setNi]=useState(0);const nP=notesList[ni]||hero[0];const notes=NOTES[nP?.handle];
 const ctaP=hero[4]||hero[1]||hero[0];const storyP=hero[1]||hero[0];
 const hp=hero[hi];
 const about=useMemo(()=>para(pages['about-us']),[]);
 const calc=useCallback(()=>{const i=bref.current,c=root.current?.querySelector('.hero .smoke');if(!i||!c)return;const a=i.getBoundingClientRect(),b=c.getBoundingClientRect();if(!a.width)return;setJsrc([(a.left+a.width*.6-b.left)/b.width,1-(a.top+a.height*.2-b.top)/b.height])},[]);
 useEffect(()=>{addEventListener('resize',calc);return()=>removeEventListener('resize',calc)},[calc]);
 useLayoutEffect(()=>{if(!hp)return;const q=gsap.utils.selector(root);const rm=reduce();
  const tl=gsap.timeline({defaults:{ease:'power3.out'}});
  tl.fromTo(q('.hero .bottle'),{y:rm?0:70,scale:rm?1:.92,opacity:0,filter:'blur(8px)'},{y:0,scale:1,opacity:1,filter:'blur(0px)',duration:rm?.01:1.5},0)
    .fromTo(q('.hero .ln > *'),{yPercent:rm?0:110,opacity:rm?1:0},{yPercent:0,opacity:1,duration:rm?.01:1.1,stagger:.12},.2)
    .fromTo(q('.hero .hfade'),{opacity:0,y:rm?0:22},{opacity:1,y:0,duration:rm?.01:.9,stagger:.1},.55);
  const t=setTimeout(calc,60);return()=>{tl.kill();clearTimeout(t)}},[hi,hp?.handle]);
 useLayoutEffect(()=>{if(reduce())return;const ctx=gsap.context(()=>{
  gsap.to('.hbot-wrap',{y:-10,duration:3.4,yoyo:true,repeat:-1,ease:'sine.inOut'});
  gsap.to('.hero .hstage',{yPercent:-8,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.hero .rays',{xPercent:-4,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.sb-bot',{y:-40,ease:'none',scrollTrigger:{trigger:'.sa',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.to('.sb-panel .gdrop',{y:-50,ease:'none',scrollTrigger:{trigger:'.sbb',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.to('.rot360',{rotateY:22,duration:5,yoyo:true,repeat:-1,ease:'sine.inOut',startAt:{rotateY:-22}});
  gsap.utils.toArray('.nb').forEach(el=>gsap.from(el,{opacity:0,y:50,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%'}}));
  gsap.from('.ctaP',{y:80,opacity:0,duration:1.4,ease:'power3.out',scrollTrigger:{trigger:'.cta',start:'top 70%'}});
  gsap.from('.cfin > *',{y:30,opacity:0,stagger:.12,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.cfin',start:'top 82%'}});
 },root);return()=>ctx.revert()},[]);
 // 360 drag
 const drag=useRef(null);const dr=useRef({x:0,on:false});
 useEffect(()=>{const el=drag.current;if(!el)return;
  const dn=e=>{dr.current.on=true;dr.current.x=e.clientX;gsap.killTweensOf(el)};
  const mv=e=>{if(!dr.current.on)return;const dx=e.clientX-dr.current.x;dr.current.x=e.clientX;gsap.to(el,{rotateY:'+='+dx*.7,duration:.3,overwrite:true})};
  const up=()=>{if(!dr.current.on)return;dr.current.on=false;gsap.to(el,{rotateY:0,duration:1.6,ease:'elastic.out(1,.5)',onComplete:()=>!reduce()&&gsap.to(el,{rotateY:22,duration:5,yoyo:true,repeat:-1,ease:'sine.inOut',startAt:{rotateY:-22}})})};
  el.addEventListener('pointerdown',dn);addEventListener('pointermove',mv);addEventListener('pointerup',up);
  return()=>{el.removeEventListener('pointerdown',dn);removeEventListener('pointermove',mv);removeEventListener('pointerup',up)}},[]);
 const go=d=>setHi(i=>(i+d+hero.length)%hero.length);
 useEffect(()=>{if(reduce())return;const t=setInterval(()=>setHi(i=>(i+1)%hero.length),8000);return()=>clearInterval(t)},[hero.length]);
 useEffect(()=>{if(reduce())return;const t=setInterval(()=>setTab(i=>(i+1)%3),5200);return()=>clearInterval(t)},[]);
 const cs=showcase.length;const cgo=d=>setCi(i=>Math.max(0,Math.min(cs-1,i+d)));
 const nn=d=>{setNi(i=>(i+d+notesList.length)%notesList.length);setTab(0)};
 if(!hp)return null;
 const title=shortTitle(nP?nP.title:'').replace(/ - .*/,'');
 return <div ref={root}>
 <Opening/>
 <section className="hero" aria-label="Featured perfume">
  <div className="rays"/><div className="floorbg"/><Dust/>
  <Smoke jet pulse burst={hi} src={jsrc} amt={.18}/>
  <div className="hstage">
   <div className="htxt">
    <span className="eyebrow hfade">Premium Collection</span>
    <h1 className="ln"><span>Luxury Meets</span><span>Affordability</span></h1>
    <p className="hfade"><b>{shortTitle(hp.title).replace(/ - .*/,'')}</b> — {lead(hp)}</p>
    <div className="hcta hfade"><Link className="btn" to={'/products/'+hp.handle}>Shop Now</Link><Link className="btn sq" to="/collections/all" aria-label="View all perfumes">→</Link><span className="hprice"><Price p={hp}/></span></div>
   </div>
   <div className="hbot-wrap"><span className="spray-hit" onClick={()=>dispatchEvent(new Event("ar-spray"))} role="button" tabIndex={0} aria-label="Spray" onKeyDown={e=>e.key==="Enter"&&dispatchEvent(new Event("ar-spray"))}><Bottle key={hp.handle} imgRef={bref} onLoad={calc} src={hp.cut} alt={hp.title} eager/></span></div>
  </div>
  <button className="arr l" onClick={()=>go(-1)} aria-label="Previous">‹</button><button className="arr r" onClick={()=>go(1)} aria-label="Next">›</button>
  <div className="dots">{hero.map((h,i)=><button key={h.handle} className={i===hi?'on':''} onClick={()=>setHi(i)} aria-label={'Slide '+(i+1)}/>)}</div>
 </section>

 <section className="coll">
  <div className="rays soft"/><Dust n={40}/>
  <h2 className="stitle rv">Product Collection</h2>
  <div className="car rv"><button className="arr l" onClick={()=>cgo(-1)} aria-label="Previous">‹</button><button className="arr r" onClick={()=>cgo(1)} aria-label="Next">›</button>
   <div className="track" style={{'--i':ci}}>{showcase.map((p,i)=><div key={p.handle} className={'cslot'+(i===ci?' on':'')+(Math.abs(i-ci)>1?' far':'')} onClick={()=>i!==ci&&setCi(i)}>
     <Link to={'/products/'+p.handle} className="pcard" tabIndex={i===ci?0:-1}>{onSale(p)&&<em className="ptag">Sale</em>}<div className="pimg"><img src={p.cut} alt={p.title} loading="lazy"/></div><h3>{shortTitle(p.title).replace(/ - .*/,'')}</h3><Price p={p}/></Link></div>)}</div></div>
  <div className="dots light">{showcase.map((p,i)=><button key={p.handle} className={i===ci?'on':''} onClick={()=>setCi(i)} aria-label={'Product '+(i+1)}/>)}</div>
 </section>

 {notes&&<section className="n360">
  <div className="vig"/><Smoke amt={1.5} tint={[.86,.7,.46]} wide={1.6} src={[.5,.2]} className="low"/>
  <div className="n360g">
   <div className="n360l"><h2 className="mini">Fragrance Notes</h2>
    <div className="tabs">{TABS.map(([k,l],i)=><button key={k} className={'tab'+(i===tab?' on':'')} onClick={()=>setTab(i)}>{l}<span className="bar"><i key={tab+'-'+i} style={i===tab?{}:{animation:'none',width:0}}/></span></button>)}</div>
    <p className="tnotes">{notes[TABS[tab][0]].join(' · ')}</p></div>
   <div className="n360c"><div className="stage"><div className="platform"/><div className="rot360" ref={drag}><Bottle src={nP.cut} alt={nP.title}/></div></div></div>
   <div className="n360r"><span className="lbl">Fragrance Notes</span><svg className="lead" viewBox="0 0 120 40" aria-hidden="true"><path d="M2 38 L34 6 L118 6" stroke="rgba(255,255,255,.55)" fill="none"/></svg>
    <b>360°</b><span className="sub">{title}</span><p>{lead(nP)}</p><Link className="more" to={'/products/'+nP.handle}>Discover →</Link></div>
  </div>
  {notesList.length>1&&<><button className="arr l" onClick={()=>nn(-1)} aria-label="Previous">‹</button><button className="arr r" onClick={()=>nn(1)} aria-label="Next">›</button></>}
 </section>}

 <section className="sa">
  <div className="rays soft"/><Dust n={30}/><Petals/>
  <div className="sa-g"><div className="sa-t"><span className="eyebrow rv">AR Fragrances</span><h2 className="rv">Brand Story</h2><p className="rv">{about[1]||about[0]}</p><Link to="/pages/about-us" className="btn rv">Read Our Story</Link></div>
   <div className="sa-b"><img className="sb-bot" src={storyP.cut} alt={storyP.title} loading="lazy"/></div></div>
 </section>

 <section className="sbb">
  <div className="sb-panel"><GoldDrop/></div>
  <div className="sb-t"><h2 className="rv">Brand Story</h2>{[about[0],about[2]].filter(Boolean).map((t,i)=><p className="rv" key={i}>{t}</p>)}</div>
 </section>

 {notes&&<section className="breakdown">
  <GoldDrop className="bdl"/><PourArt className="bdr"/>
  <div className="bdc">
   {TABS.map(([k,l])=><div className="nb" key={k}><h3>{l}</h3><p>{notes[k].join(', ')}</p></div>)}
   <p className="bfoot">{title} · <Link to={'/products/'+nP.handle}>View product</Link></p></div>
 </section>}

 <section className="cta">
  <div className="rays soft"/><Dust n={40}/><div className="bokeh" aria-hidden="true"><i/><i/><i/><i/><i/></div>
  <Smoke amt={2.2} wide={2.2} src={[.55,.1]} className="low"/>
  <div className="ctag">
   <div className="ctat"><span className="eyebrow rv">Exclusive Collection</span><h2 className="rv">Buy 1 Perfume,<br/>Get a Free Body Mist</h2>
    <p className="rv">Pair any signature perfume with a complimentary body mist. Explore the full offer, or save more with our bundles.</p>
    <div className="hcta rv"><Link className="btn" to="/collections/buy-1-perfume-get-free-body-mist">Shop The Offer</Link><Link className="btn sq" to="/collections/bundles" aria-label="View bundles">→</Link></div></div>
   <div className="ctab"><div className="trailbox"><Trail/><Bottle className="ctaP" src={ctaP.cut} alt={ctaP.title}/></div></div>
  </div>
 </section>

 <section className="cfin"><h2>Find Your Signature Scent</h2>
  <p>With 25+ outlets nationwide and delivery across Pakistan, AR Fragrances brings designer-inspired perfumes with high oil concentration to your door — or your nearest store.</p>
  <Link className="pill" to="/collections/all">Shop All Perfumes</Link><Link className="chip" to="/pages/our-outlets">Find an outlet</Link></section>
 </div>}
