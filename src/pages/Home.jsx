import React,{Suspense,lazy,useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import gsap from 'gsap';import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Bottle from '../components/Bottle.jsx';import Smoke from '../components/Smoke.jsx';
import {Dust,GoldDrop,PourArt,Petals} from '../components/art.jsx';
import {Price} from '../components/ui.jsx';
import {products_,byHandle,shortTitle,firstSentence,onSale} from '../store.jsx';
import pages from '../data/pages.json';
const NotesScene3D=lazy(()=>import('../components/NotesScene3D.jsx'));
const Bottle3D=lazy(()=>import('../components/Bottle3D.jsx'));
gsap.registerPlugin(ScrollTrigger);
const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
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
const Fallback=({p})=><div className="b3d"><Bottle src={p.cut} alt={p.title} eager/></div>;
export default function Home(){
 const root=useRef();const anchor=useRef(null);
 const cutP=useMemo(()=>products_.filter(p=>p.cut),[]);
 const hp=useMemo(()=>pick(['golden-era'],cutP)[0]||cutP[0],[cutP]);
 const showcase=useMemo(()=>{const a=pick(SHOW_PREF,cutP);return a.length>=5?a:cutP.slice(0,9)},[cutP]);
 const [ci,setCi]=useState(1);const [tab,setTab]=useState(0);
 const notesList=Object.keys(NOTES).map(h=>byHandle[h]).filter(p=>p&&p.cut);const [ni,setNi]=useState(0);const nP=notesList[ni]||hp;const notes=NOTES[nP?.handle];
 const ctaP=pick(['ar-sixer','ar-addiction'],cutP)[0]||hp;const storyP=pick(['ar-elites'],cutP)[0]||hp;
 const about=useMemo(()=>para(pages['about-us']),[]);
 useLayoutEffect(()=>{const rm=reduce();const q=gsap.utils.selector(root);
  const tl=gsap.timeline({defaults:{ease:'power3.out'}});
  tl.fromTo(q('.hero3d'),{opacity:0,scale:rm?1:.9,y:rm?0:60,filter:'blur(10px)'},{opacity:1,scale:1,y:0,filter:'blur(0px)',duration:rm?.01:1.8},0)
    .fromTo(q('.hero .ln > *'),{yPercent:rm?0:110,opacity:rm?1:0},{yPercent:0,opacity:1,duration:rm?.01:1.1,stagger:.12},.2)
    .fromTo(q('.hero .hfade'),{opacity:0,y:rm?0:22},{opacity:1,y:0,duration:rm?.01:.9,stagger:.1},.55);
  const t=rm?0:setTimeout(()=>dispatchEvent(new Event('ar-demo')),2000);
  return()=>{tl.kill();clearTimeout(t)}},[]);
 useLayoutEffect(()=>{if(reduce())return;const ctx=gsap.context(()=>{
  gsap.to('.hero .hstage',{yPercent:-8,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.hero .rays',{xPercent:-4,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.hero3d',{y:-60,scale:1.06,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.sb-bot',{y:-40,ease:'none',scrollTrigger:{trigger:'.sa',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.to('.sb-panel .gdrop',{y:-50,ease:'none',scrollTrigger:{trigger:'.sbb',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.utils.toArray('.nb').forEach(el=>gsap.from(el,{opacity:0,y:50,rotateX:-14,transformPerspective:900,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%'}}));
  gsap.from('.cfin > *',{y:30,opacity:0,stagger:.12,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.cfin',start:'top 82%'}});
  // hero mouse parallax (text + rays + dust drift against the bottle for depth)
  const hx=gsap.quickTo('.hero .htxt',"x",{duration:1.2,ease:'power3'}),hy=gsap.quickTo('.hero .htxt',"y",{duration:1.2,ease:'power3'}),rx=gsap.quickTo('.hero .rays',"x",{duration:1.6,ease:'power3'}),dx=gsap.quickTo('.hero .dust',"x",{duration:2,ease:'power3'});
  const mm=e=>{const nx=e.clientX/innerWidth-.5,ny=e.clientY/innerHeight-.5;hx(nx*-18);hy(ny*-10);rx(nx*34);dx(nx*-24)};addEventListener('pointermove',mm);
  return()=>removeEventListener('pointermove',mm)
 },root);return()=>ctx.revert()},[]);
 useEffect(()=>{if(reduce())return;const t=setInterval(()=>setTab(i=>(i+1)%3),5200);return()=>clearInterval(t)},[]);
 const cs=showcase.length;const cgo=d=>setCi(i=>Math.max(0,Math.min(cs-1,i+d)));
 const nn=d=>{setNi(i=>(i+d+notesList.length)%notesList.length);setTab(0)};
 const name=shortTitle(hp.title).replace(/ - .*/,'');
 const title=shortTitle(nP?nP.title:'').replace(/ - .*/,'');
 return <div ref={root}>
 <section className="hero" id="hero" aria-label="Featured perfume">
  <div className="rays"/><div className="floorbg"/><Dust/>
  <Smoke amt={1.6} wide={2.6} tint={[.82,.76,.66]} src={[.62,.03]} className="low"/><Smoke amt={.9} wide={3} tint={[.7,.62,.5]} rise={.6} src={[.5,.3]} className="mid"/><Smoke jet amt={.12} anchorRef={anchor}/>
  <div className="hstage">
   <div className="htxt">
    <span className="eyebrow hfade">Premium Collection</span>
    <h1 className="ln"><span>Luxury Meets</span><span>Affordability</span></h1>
    <p className="hfade"><b>{name}</b> — A captivating fragrance impression, meticulously crafted by AR Fragrances.</p>
    <div className="hcta hfade"><Link className="btn" to={'/products/'+hp.handle}>Shop Now</Link><Link className="btn sq" to="/collections/all" aria-label="View all perfumes">→</Link><span className="hprice"><Price p={hp}/></span></div>
   </div>
  </div>
  <div className="hero3d"><Suspense fallback={<Fallback p={hp}/>}><Bottle3D src={hp.cut} alt={hp.title} spray hint anchorRef={anchor}/></Suspense></div>
 </section>

 <section className="coll" id="coll">
  <div className="rays soft"/><Dust n={40}/><Smoke amt={.9} tint={[.8,.72,.6]} wide={2} src={[.5,.02]} className="low"/>
  <h2 className="stitle rv">Product Collection</h2>
  <div className="car rv"><button className="arr l" onClick={()=>cgo(-1)} aria-label="Previous">‹</button><button className="arr r" onClick={()=>cgo(1)} aria-label="Next">›</button>
   <div className="track" style={{'--i':ci}}>{showcase.map((p,i)=><div key={p.handle} className={'cslot'+(i===ci?' on':'')+(Math.abs(i-ci)>1?' far':'')} onClick={()=>i!==ci&&setCi(i)}>
     <Link to={'/products/'+p.handle} className="pcard tilt" tabIndex={i===ci?0:-1}>{onSale(p)&&<em className="ptag">Sale</em>}<div className="pimg"><img src={p.cut} alt={p.title} loading="lazy"/></div><h3>{shortTitle(p.title).replace(/ - .*/,'')}</h3><Price p={p}/></Link></div>)}</div></div>
  <div className="dots light">{showcase.map((p,i)=><button key={p.handle} className={i===ci?'on':''} onClick={()=>setCi(i)} aria-label={'Product '+(i+1)}/>)}</div>
 </section>

 {notes&&<section className="n360" id="n360">
  <div className="vig"/><Smoke amt={1.5} tint={[.86,.7,.46]} wide={1.6} src={[.5,.2]} className="low"/>
  <div className="n360g">
   <div className="n360l"><h2 className="mini">Fragrance Notes</h2>
    <div className="tabs">{TABS.map(([k,l],i)=><button key={k} className={'tab'+(i===tab?' on':'')} onClick={()=>setTab(i)}>{l}<span className="bar"><i key={tab+'-'+i} style={i===tab?{}:{animation:'none',width:0}}/></span></button>)}</div>
    <p className="tnotes">{notes[TABS[tab][0]].join(' · ')}</p></div>
   <div className="n360c"><div className="stage"><Suspense fallback={<Fallback p={nP}/>}><Bottle3D key={nP.handle} src={nP.cut} alt={nP.title} platform hint autoSpeed={.55} viewY={.7} dist={7.2}/></Suspense></div></div>
   <div className="n360r"><span className="lbl">Fragrance Notes</span><svg className="lead" viewBox="0 0 120 40" aria-hidden="true"><path d="M2 38 L34 6 L118 6" stroke="rgba(255,255,255,.55)" fill="none"/></svg>
    <b>360°</b><span className="sub">{title}</span><p>{lead(nP)}</p><Link className="more" to={'/products/'+nP.handle}>Discover →</Link></div>
  </div>
  {notesList.length>1&&<><button className="arr l" onClick={()=>nn(-1)} aria-label="Previous">‹</button><button className="arr r" onClick={()=>nn(1)} aria-label="Next">›</button></>}
 </section>}

 <section className="sa" id="sa">
  <div className="rays soft"/><Dust n={30}/><Smoke amt={1.1} tint={[.8,.68,.5]} wide={1.8} src={[.3,.05]} className="low"/><Petals/>
  <div className="sa-g"><div className="sa-t"><span className="eyebrow rv">AR Fragrances</span><h2 className="rv">Brand Story</h2><p className="rv">{about[1]||about[0]}</p><Link to="/pages/about-us" className="btn rv">Read Our Story</Link></div>
   <div className="sa-b"><img className="sb-bot" src={storyP.cut} alt={storyP.title} loading="lazy"/></div></div>
 </section>

 <section className="sbb">
  <div className="sb-panel"><Suspense fallback={<GoldDrop/>}><NotesScene3D mode="left"/></Suspense></div>
  <div className="sb-t"><h2 className="rv">Brand Story</h2>{[about[0],about[2]].filter(Boolean).map((t,i)=><p className="rv" key={i}>{t}</p>)}</div>
 </section>

 {notes&&<section className="breakdown"><Smoke amt={1} tint={[.8,.66,.42]} wide={2} src={[.5,.02]} className="low"/>
  <Suspense fallback={<><GoldDrop className="bdl"/><PourArt className="bdr"/></>}><NotesScene3D mode="both" className="bd3d"/></Suspense>
  <div className="bdc">
   {TABS.map(([k,l])=><div className="nb" key={k}><h3>{l}</h3><p>{notes[k].join(', ')}</p></div>)}
   <p className="bfoot">{title} · <Link to={'/products/'+nP.handle}>View product</Link></p></div>
 </section>}

 <section className="cta" id="cta">
  <div className="rays soft"/><Dust n={40}/><div className="bokeh" aria-hidden="true"><i/><i/><i/><i/><i/></div>
  <Smoke amt={2.2} wide={2.2} src={[.62,.1]} className="low"/>
  <div className="ctag">
   <div className="ctat"><span className="eyebrow rv">Exclusive Collection</span><h2 className="rv">Buy 1 Perfume,<br/>Get a Free Body Mist</h2>
    <p className="rv">Pair any signature perfume with a complimentary body mist. Explore the full offer, or save more with our bundles.</p>
    <div className="hcta rv"><Link className="btn" to="/collections/buy-1-perfume-get-free-body-mist">Shop The Offer</Link><Link className="btn sq" to="/collections/bundles" aria-label="View bundles">→</Link></div></div>
   <div className="ctab"><Suspense fallback={<Fallback p={ctaP}/>}><Bottle3D className="cta3d" src={ctaP.cut} alt={ctaP.title} ring autoSpeed={.4} viewY={.85} dist={7.6}/></Suspense></div>
  </div>
 </section>

 <section className="cfin"><Smoke amt={1.2} tint={[.8,.7,.5]} wide={2.4} src={[.5,.02]} className="low"/><h2>Find Your Signature Scent</h2>
  <p>With 25+ outlets nationwide and delivery across Pakistan, AR Fragrances brings designer-inspired perfumes with high oil concentration to your door — or your nearest store.</p>
  <Link className="pill" to="/collections/all">Shop All Perfumes</Link><Link className="chip" to="/pages/our-outlets">Find an outlet</Link></section>
 </div>}
