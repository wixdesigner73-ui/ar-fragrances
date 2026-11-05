import React,{useMemo} from 'react';
import {Link} from 'react-router-dom';
import Bottle from './Bottle.jsx';import Smoke from './Smoke.jsx';import {Dust} from './art.jsx';
import {Price} from './ui.jsx';
import {products_,shortTitle} from '../store.jsx';
const pick=(pre,pool)=>pre.map(x=>pool.find(p=>p.handle.startsWith(x))).filter(Boolean);
/* plumeria flower: 5 cream petals + warm centre */
const Flower=({x,y,s=1,r=0})=><g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
 {[0,72,144,216,288].map(a=><path key={a} transform={`rotate(${a})`} d="M0 0C-16 -10 -20 -42 0 -54C20 -42 16 -10 0 0Z" fill="url(#petal)" stroke="rgba(200,170,110,.35)" strokeWidth=".8"/>)}
 <circle r="7" fill="url(#pcore)"/></g>;
function Scene(){return <svg className="op-scene" viewBox="0 0 1640 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
 <defs>
  <radialGradient id="petal" cx=".5" cy=".85" r=".9"><stop offset="0" stopColor="#f5e3a6"/><stop offset=".4" stopColor="#fff6dd"/><stop offset="1" stopColor="#f1e6cf"/></radialGradient>
  <radialGradient id="pcore"><stop offset="0" stopColor="#ffcf5a"/><stop offset="1" stopColor="#d98e1c"/></radialGradient>
  <linearGradient id="rock1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4a4540"/><stop offset=".5" stopColor="#1d1b19"/><stop offset="1" stopColor="#0a0908"/></linearGradient>
  <linearGradient id="rock2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a5148"/><stop offset=".6" stopColor="#201d1a"/><stop offset="1" stopColor="#080706"/></linearGradient>
 </defs>
 <path d="M0 200V150C200 120 380 118 560 140C700 156 760 150 860 132C940 118 1040 122 1120 140C1260 120 1460 116 1640 146V200Z" fill="url(#rock1)"/>
 <path d="M0 200V132C80 102 220 98 330 130C420 112 520 122 600 152V200Z" fill="url(#rock2)"/>
 <path d="M770 200V142C810 124 890 120 950 132C1010 128 1060 136 1110 154V200Z" fill="url(#rock1)"/>
 <path d="M1100 200V152C1200 114 1360 106 1480 130C1560 122 1610 132 1640 142V200Z" fill="url(#rock2)"/>
 <path d="M0 132C80 102 220 98 330 130M560 140C700 156 760 150 860 132M810 124C890 120 950 132 1010 128M1100 152C1200 114 1360 106 1480 130" stroke="rgba(255,220,160,.32)" strokeWidth="2" fill="none"/>
 <g className="leaf" fill="#15110c" stroke="rgba(255,220,160,.25)" strokeWidth="1.2"><path d="M1060 150C1090 100 1160 88 1220 96C1190 140 1130 160 1060 150Z"/><path d="M1260 150C1240 106 1290 84 1340 84C1340 126 1310 146 1260 150Z"/></g>
 <Flower x={1150} y={112} s={.95} r={-10}/><Flower x={1235} y={138} s={.8} r={14}/><Flower x={1085} y={150} s={.62} r={30}/><Flower x={1335} y={152} s={.55} r={-20}/>
 <circle cx="1190" cy="78" r="5" fill="#fff6dd"/><circle cx="1290" cy="108" r="4" fill="#f5e3a6"/>
</svg>}
const TILES=['ar-elites','royal-musk','the-boss','a-legacy'];
export default function Opening(){
 const cut=useMemo(()=>products_.filter(p=>p.cut),[]);
 const star=useMemo(()=>pick(['ar-sixer','ar-addiction'],cut)[0],[cut]);
 const tiles=useMemo(()=>pick(TILES,cut),[cut]);
 return <section className="op" aria-label="Welcome">
  <div className="op-banner">
   <div className="op-bg"/><div className="op-glow"/><Dust n={45}/>
   <Smoke amt={.9} tint={[1,.78,.45]} wide={.45} rise={1.3} src={[.64,.28]}/>
   <div className="op-txt"><span className="eyebrow">Premium Perfumes</span>
    <h1><span>More Than a Fragrance</span><span>It’s a Presence</span></h1>
    <p>Designer-inspired perfumes with a high oil concentration — crafted to leave a lasting impression.</p>
    <Link to="/collections/all" className="op-btn">Discover The Collection <span>→</span></Link></div>
   <div className="op-bot">{star&&<Bottle src={star.cut} alt={star.title} eager/>}</div>
   <Scene/>
  </div>
  <div className="op-coll"><h2>Our Signature Collection</h2><p className="op-sub">Handpicked favourites from the AR Fragrances range.</p>
   <div className="op-grid">{tiles.map((p,i)=><Link key={p.handle} to={'/products/'+p.handle} className={'op-tile t'+i}>
    <div className="op-img"><div className="op-floor"/><img src={p.cut} alt={p.title} loading="lazy"/></div>
    <h3>{shortTitle(p.title).replace(/ - .*/,'')}</h3><Price p={p}/></Link>)}</div></div>
 </section>}
