import React,{useEffect,useMemo,useRef,useState} from 'react';
import {Link,NavLink,useLocation,useNavigate} from 'react-router-dom';
import {U,useStore,products_,shortTitle,SHOP,WA} from '../store.jsx';
import {Icon,Price} from './ui.jsx';
const find=(pre)=>products_.find(p=>p.handle.startsWith(pre));
const CATS=[
 ['Men Perfumes','/collections/men','Designer-inspired scents for men.','ar-elites'],
 ['Women Perfumes','/collections/women','Floral and sweet fragrances for women.','blush-me-up-inspired'],
 ['Unisex Perfumes','/collections/unisex','Scents made for everyone.','oud-al-sultan'],
 ['Body Mists','/collections/body-mists','Light, everyday fragrance mists.','bright-crystal-body-mist'],
 ["Roll On's",'/collections/roll-on','Pocket-size perfume oils.','ameer-ul-oud-inspired-roll-on'],
 ['Oud','/collections/oud','Rich, warm oriental oud.','oud-al-hussain-long'],
 ['Bundles','/collections/bundles','Perfume packs for less.','blush-me-up-crysto-perfume-pack-of-2'],
 ['Free Body Mist Offer','/collections/buy-1-perfume-get-free-body-mist','Buy 1 perfume, get a body mist free.','elites-perfume-free-1-million-body-mist']];
const COLS=[['Top Sellers','/collections/best-products','best-products'],['New Arrivals','/collections/new-arrival','new'],['The Night Collection','/#night','night'],['Fragrance Notes','/#n360','notes'],['Our Outlets','/pages/our-outlets','outlets']];
const NAV=[['Best Sellers','/collections/best-products'],['New Arrivals','/collections/new-arrival'],['Sale','/collections/sale','sale'],['Our Story','/pages/about-us'],['Contact','/pages/contact']];
const sec=(nav,loc,id)=>{const run=()=>{const el=document.getElementById(id);if(el){const y=el.getBoundingClientRect().top+scrollY-110;window.__lenis?window.__lenis.scrollTo(y,{duration:1.4}):scrollTo({top:y,behavior:'smooth'})}};if(loc.pathname==='/')run();else{nav('/');setTimeout(run,800)}};
function useCats(){return useMemo(()=>CATS.map(([t,h,d,pre])=>{const p=find(pre);return{t,h,d,img:p&&(p.imgS)}}),[])}
export default function Header(){
 const {count,setOpen,setSearch,menu,setMenu}=useStore();const [sc,setSc]=useState(false);const [mega,setMega]=useState(false);const loc=useLocation();const timer=useRef(0);
 const cats=useCats();const feat=useMemo(()=>find('golden-era')||products_[0],[]);
 useEffect(()=>{const f=()=>setSc(scrollY>40);f();addEventListener('scroll',f,{passive:true});return()=>removeEventListener('scroll',f)},[]);
 useEffect(()=>{setMenu(false);setMega(false)},[loc.pathname,loc.hash]);
 useEffect(()=>{const k=e=>{if(e.key==='Escape'){setMega(false);setMenu(false)}};addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[]);
 useEffect(()=>{document.body.classList.toggle('lock',menu);return()=>document.body.classList.remove('lock')},[menu]);
 const hover=v=>{clearTimeout(timer.current);if(v)setMega(true);else timer.current=setTimeout(()=>setMega(false),140)};
 const go=useNavigate();
 const goSec=(e,id)=>{e.preventDefault();setMega(false);setMenu(false);sec(go,loc,id)};
 return <div className={'hbar'+(sc?' sc':'')+(mega?' mopen':'')}>
  <div className="topbar" role="note"><span>Luxury meets affordability</span><i/><span>25+ outlets nationwide</span><i/><span>Delivery in 3–5 working days</span></div>
  <header className="hdr2">
   <button className="burger2" aria-label="Open menu" aria-expanded={menu} onClick={()=>setMenu(true)}><i/><i/><i/></button>
   <nav className="navl" aria-label="Main" onMouseLeave={()=>hover(false)}>
    <div className="ni2" onMouseEnter={()=>hover(true)}><button className={'shopbtn'+(mega?' on':'')} aria-expanded={mega} aria-haspopup="true" onClick={()=>setMega(m=>!m)}>Shop<i className="chev"/></button></div>
    {NAV.map(([t,h,c])=><NavLink key={h} to={h} className={c==='sale'?'sale':''} onMouseEnter={()=>hover(false)}>{t}</NavLink>)}
    <div className="mega2" onMouseEnter={()=>hover(true)} onMouseLeave={()=>hover(false)} aria-hidden={!mega}>
     <div className="m2in">
      <div className="m2cats"><h5>Shop by category</h5>
       <div className="m2grid">{cats.map(c=><Link key={c.h} to={c.h} className="m2row" tabIndex={mega?0:-1}><span className="m2th">{c.img&&<img src={c.img} alt="" loading="lazy" decoding="async"/>}</span><span><b>{c.t}</b><small>{c.d}</small></span><em>→</em></Link>)}</div>
       <Link to="/collections/all" className="m2all" tabIndex={mega?0:-1}>Shop everything →</Link></div>
      <div className="m2col"><h5>Collections</h5>{COLS.map(([t,h,k])=>h.startsWith('/#')?<a key={k} href={h} tabIndex={mega?0:-1} onClick={e=>goSec(e,k==='night'?'night':'n360')}><span className="dot"/>{t}</a>:<Link key={k} to={h} tabIndex={mega?0:-1}><span className="dot"/>{t}</Link>)}
       <Link to="/collections/sale" className="m2sale" tabIndex={mega?0:-1}><b>SALE</b><span>Perfumes for less →</span></Link></div>
      <Link to={'/products/'+feat.handle} className="m2feat" tabIndex={mega?0:-1}><img src={feat.cutS||feat.cut} alt="" loading="lazy" decoding="async"/><span><small>Featured</small><b>{shortTitle(feat.title).replace(/ - .*/,'')}</b><Price p={feat}/><em className="btn sm">Shop now</em></span></Link>
     </div></div>
   </nav>
   <Link to="/" className="logo2" aria-label="AR Fragrances home"><img src={U('/logo-white.png')} alt="AR Fragrances" width="64" height="40"/></Link>
   <div className="hact2">
    <button aria-label="Search" onClick={()=>setSearch(true)}><Icon n="search"/></button>
    <a className="acc" aria-label="Account" href={SHOP+'/account/login'}><Icon n="user"/></a>
    <button aria-label={`Cart, ${count} items`} onClick={()=>setOpen(true)} className="bag"><Icon n="bag"/>{count>0&&<b>{count}</b>}</button>
   </div>
  </header>
  <div className="mveil" onClick={()=>setMega(false)}/>
  <div className={'mdr'+(menu?' on':'')} role="dialog" aria-label="Menu" aria-hidden={!menu}>
   <div className="mdr-h"><b>Menu</b><button aria-label="Close menu" onClick={()=>setMenu(false)}><Icon n="x" s={22}/></button></div>
   <div className="mdr-body">
    <div className="mdr-chips"><Link to="/collections/best-products">Best Sellers</Link><Link to="/collections/new-arrival">New Arrivals</Link><Link to="/collections/sale" className="hot">Sale</Link></div>
    <h5>Shop by category</h5>
    <div className="mdr-tiles">{cats.map(c=><Link key={c.h} to={c.h} className="tile">{c.img&&<img src={c.img} alt="" loading="lazy" decoding="async"/>}<span>{c.t.replace(' Perfumes','')}</span></Link>)}</div>
    <h5>Explore</h5>
    <div className="mdr-links"><Link to="/collections/all">Shop all perfumes</Link><a href="/#night" onClick={e=>goSec(e,'night')}>The Night Collection</a><Link to="/pages/about-us">Our Story</Link><Link to="/pages/our-outlets">Our Outlets</Link><Link to="/pages/faqs">FAQs</Link><Link to="/pages/contact">Contact</Link></div>
    <div className="mdr-foot"><a href={SHOP+'/account/login'}>My account</a><a href={'https://wa.me/'+WA} target="_blank" rel="noreferrer">WhatsApp us</a><p>Luxury meets affordability — designer-inspired fragrances, made to last.</p></div>
   </div></div>
 </div>}
