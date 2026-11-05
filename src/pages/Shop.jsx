import React,{useEffect,useMemo,useState} from 'react';
import {Link,useParams,useSearchParams} from 'react-router-dom';
import {Card,Price} from '../components/ui.jsx';
import {COLLECTIONS,colBy,inCol,byHandle,products_,useStore,shortTitle,onSale,money,SHOP} from '../store.jsx';
import pages from '../data/pages.json';import Smoke from '../components/Smoke.jsx';import {Dust} from '../components/art.jsx';import Bottle from '../components/Bottle.jsx';
export const useTitle=(t,d)=>useEffect(()=>{document.title=t;if(d)document.querySelector('meta[name=description]')?.setAttribute('content',d)},[t,d]);
const SORTS={featured:['Featured',()=>0],low:['Price: Low to High',(a,b)=>a.price-b.price],high:['Price: High to Low',(a,b)=>b.price-a.price],az:['A–Z',(a,b)=>a.title.localeCompare(b.title)],new:['Newest',(a,b)=>b.order.localeCompare(a.order)]};
export function Collection({search}){
 const {handle}=useParams();const [sp]=useSearchParams();const q=(sp.get('q')||'').toLowerCase();
 const col=search?{slug:'search',title:`Search: “${sp.get('q')||''}”`}:colBy[handle];
 const [sort,setSort]=useState('featured');const [stock,setStock]=useState(false);const [max,setMax]=useState(0);
 const base=useMemo(()=>search?products_.filter(p=>p.title.toLowerCase().includes(q)||p.tags.some(t=>t.toLowerCase().includes(q))):(col?inCol(handle):[]),[handle,q,search]);
 const top=Math.ceil(Math.max(...base.map(p=>p.price),0)/500)*500;
 const list=useMemo(()=>base.filter(p=>(!stock||p.variants.some(v=>v.available))&&(!max||p.price<=max)).sort(SORTS[sort][1]),[base,sort,stock,max]);
 useTitle(col?`${col.title} | AR Fragrances`:'Not found | AR Fragrances',col&&`Shop ${col.title} at AR Fragrances — premium long-lasting perfumes delivered across Pakistan.`);
 useEffect(()=>{setMax(0);setSort('featured');scrollTo(0,0)},[handle,q]);
 if(!col)return <div className="page nf"><h1>Collection not found</h1><Link className="btn" to="/collections/all">Shop all</Link></div>;
 return <div className="page">
  <div className="phead"><span className="eyebrow">Collection</span><h1>{col.title}</h1><p>{list.length} products</p></div>
  <nav className="chips" aria-label="Collections">{COLLECTIONS.filter(c=>c.slug!=='buy-1-perfume-get-free-body-mist').map(c=><Link key={c.slug} to={'/collections/'+c.slug} className={c.slug===handle?'on':''}>{c.title.replace(' Perfumes','')}</Link>)}</nav>
  <div className="filters"><label>Sort <select value={sort} onChange={e=>setSort(e.target.value)}>{Object.entries(SORTS).map(([k,v])=><option key={k} value={k}>{v[0]}</option>)}</select></label>
   <label>Max price <select value={max} onChange={e=>setMax(+e.target.value)}><option value={0}>Any</option>{[1500,2500,3500,5000].filter(x=>x<top).map(x=><option key={x} value={x}>Up to {money(x)}</option>)}</select></label>
   <label className="chk"><input type="checkbox" checked={stock} onChange={e=>setStock(e.target.checked)}/> In stock only</label></div>
  <div className="grid">{list.map(p=><Card key={p.handle} p={p}/>)}</div>
  {!list.length&&<p className="empty">No products match these filters.</p>}</div>}
export function Product(){
 const {handle}=useParams();const p=byHandle[handle];const {add}=useStore();
 const [det,setDet]=useState(null);useEffect(()=>{let ok=true;import('../data/details.json').then(m=>ok&&setDet(m.default[handle]||null));return()=>{ok=false;setDet(null)}},[handle]);
 const [vi,setVi]=useState(0);const [qty,setQty]=useState(1);const [gi,setGi]=useState(0);
 useEffect(()=>{setVi(0);setQty(1);setGi(0);scrollTo(0,0)},[handle]);
 useTitle(p?`${shortTitle(p.title)} | AR Fragrances`:'Not found',p&&p.desc.slice(0,155));
 useEffect(()=>{if(!p)return;const v=p.variants[0];const s=document.createElement('script');s.type='application/ld+json';
  s.text=JSON.stringify({'@context':'https://schema.org','@type':'Product',name:p.title,image:p.images.map(i=>i.startsWith('http')?i:location.origin+i),description:p.desc.slice(0,300),brand:{'@type':'Brand',name:'AR Fragrances'},offers:p.variants.map(v=>({'@type':'Offer',priceCurrency:'PKR',price:v.price,availability:v.available?'https://schema.org/InStock':'https://schema.org/OutOfStock',url:SHOP+'/products/'+p.handle}))});
  document.head.appendChild(s);return()=>s.remove()},[p]);
 if(!p)return <div className="page nf"><h1>Product not found</h1><Link className="btn" to="/collections/all">Shop all</Link></div>;
 const v=p.variants[vi];const gallery=[p.cut&&{src:p.cut,cut:1},...p.images.map(s=>({src:s}))].filter(Boolean);
 const rel=products_.filter(x=>x.handle!==p.handle&&x.cats.some(c=>p.cats.includes(c))).slice(0,4);
 return <div className="page pdp">
  <nav className="crumb"><Link to="/">Home</Link> / <Link to="/collections/all">Shop</Link> / <span>{shortTitle(p.title)}</span></nav>
  <div className="pgrid">
   <div className="gal"><div className={'gmain'+(gallery[gi].cut?' cutbg':'')}><img src={gallery[gi].src} alt={p.title}/></div>
    {gallery.length>1&&<div className="thumbs">{gallery.map((g,i)=><button key={i} className={i===gi?'on':''} onClick={()=>setGi(i)} aria-label={'Image '+(i+1)}><img src={g.src} alt="" loading="lazy"/></button>)}</div>}</div>
   <div className="pinfo"><span className="eyebrow">AR Fragrances</span><h1>{shortTitle(p.title)}</h1><div className="pp"><Price p={p} v={v}/>{onSale(v)&&<em className="save">Save {money(v.compare-v.price)}</em>}</div>
    {p.variants.length>1&&<div className="vars" role="radiogroup" aria-label="Size">{p.variants.map((x,i)=><button key={x.id} role="radio" aria-checked={i===vi} className={i===vi?'on':''} disabled={!x.available} onClick={()=>setVi(i)}>{x.title}</button>)}</div>}
    <p className={'stock '+(v.available?'in':'out')}>{v.available?'In stock':'Sold out'}</p>
    <div className="buy"><div className="qty big"><button onClick={()=>setQty(Math.max(1,qty-1))} aria-label="Decrease quantity">−</button><i>{qty}</i><button onClick={()=>setQty(qty+1)} aria-label="Increase quantity">+</button></div>
     <button className="btn" disabled={!v.available} onClick={()=>add(p,v,qty)}>{v.available?'Add to Cart':'Sold Out'}</button></div>
    <div className="pdesc" dangerouslySetInnerHTML={{__html:det?det.html:'<p>'+p.desc+'</p>'}}/></div></div>
  {rel.length>0&&<section className="related"><h2 className="stitle">You May Also Like</h2><div className="grid">{rel.map(r=><Card key={r.handle} p={r}/>)}</div></section>}</div>}
export function Page(){const {handle:hh}=useParams();if(hh==="about-us")return <About/>;if(hh==="contact")return <Contact/>;return <PageBase/>}
function PageBase(){
 const {handle}=useParams();const html=pages[handle];const T={'about-us':'About Us','contact':'Contact Us','faqs':'FAQs','refund-policy':'Refund Policy','shipping-policy':'Shipping Policy','our-outlets':'Our Outlets'}[handle];
 useTitle(T?`${T} | AR Fragrances`:'Not found');useEffect(()=>scrollTo(0,0),[handle]);
 if(!html)return <div className="page nf"><h1>Page not found</h1><Link className="btn" to="/">Home</Link></div>;
 return <div className="page prose"><div className="phead"><span className="eyebrow">AR Fragrances</span><h1>{T}</h1></div>
  <div dangerouslySetInnerHTML={{__html:html.replace(/<h1[\s\S]*?<\/h1>/,'')}}/>
  {handle==='contact'&&<form className="cform" onSubmit={e=>{e.preventDefault();const f=new FormData(e.target);open(`https://wa.me/923330499831?text=${encodeURIComponent(`Name: ${f.get('n')}\nEmail: ${f.get('e')}\nPhone: ${f.get('p')}\n${f.get('m')}`)}`)}}>
   <h3>Send us a message</h3><input name="n" placeholder="Name" required/><input name="e" type="email" placeholder="Email" required/><input name="p" placeholder="Phone / WhatsApp number" required/><textarea name="m" placeholder="Your message" rows="4" required/><button className="btn">Send via WhatsApp</button></form>}</div>}

const strip=h=>h.replace(/<br\s*\/?>/g,'\n').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ');
const PageHero=({eyebrow,title,sub,children})=><section className="ph"><div className="rays soft"/><Dust n={36}/><Smoke amt={1.3} tint={[.8,.7,.52]} wide={2.4} src={[.5,.02]} className="low"/><div className="ph-in"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{sub&&<p>{sub}</p>}{children}</div></section>;
function About(){useTitle('About Us | AR Fragrances','AR Fragrances — luxury meets affordability. Designer-inspired perfumes with a high oil concentration, made for Pakistan.');useEffect(()=>scrollTo(0,0),[]);
 const t=strip(pages['about-us']);const mission=(t.match(/Our Mission:\s*([\s\S]*?)Elevating/)||[])[1]?.trim();const local=(t.match(/Elevating Local Industries:\s*([\s\S]*?)Why AR/)||[])[1]?.trim();const join=(t.match(/Join Us on this Fragrance Journey:\s*([\s\S]*?)SUBSCRIBE/)||[])[1]?.trim();const welcome=(t.match(/About Us\s*([\s\S]*?)Our Mission/)||[])[1]?.trim();
 const why=[...t.matchAll(/-\s*([A-Za-z\- ]+):\s*([^\n-][^\n]*?)(?=\n|- |Join)/g)].map(m=>[m[1].trim(),m[2].trim()]);
 const outlets=(pages['our-outlets'].match(/<li/g)||[]).length;
 const bt=products_.filter(p=>p.cut&&/^(ar-sixer|golden-era|ar-elites)/.test(p.handle)).slice(0,3);
 return <div className="abt">
  <PageHero eyebrow="About AR Fragrances" title="Where Luxury Meets Affordability" sub={welcome&&welcome.replace(/AR Fragrances - /,'')}><Link className="btn" to="/collections/all">Explore The Collection</Link></PageHero>
  <section className="ab-sec ab-mission"><div className="ab-txt"><span className="eyebrow">Our Mission</span><h2>The essence of the world’s finest fragrances</h2><p>{mission}</p></div>
   <div className="ab-bots">{bt.map((p,i)=><div key={p.handle} className={'ab-b b'+i}><Bottle src={p.cut} alt={p.title}/></div>)}</div></section>
  <section className="ab-stats">{[['25+','Outlets nationwide'],['150+','Fragrances & sets'],['High','Oil concentration'],['3–5','Days delivery']].map(([n,l])=><div key={l}><b>{n}</b><span>{l}</span></div>)}</section>
  {why.length>0&&<section className="ab-sec ab-why"><h2 className="stitle">Why AR Fragrances?</h2><div className="ab-cards">{why.map(([h,p],i)=><div className="ab-card" key={h}><span>0{i+1}</span><h3>{h}</h3><p>{p}</p></div>)}</div></section>}
  <section className="ab-sec ab-local"><div className="ab-txt"><span className="eyebrow">Elevating Local Industries</span><h2>Scent with purpose</h2><p>{local}</p></div></section>
  <section className="cfin"><Smoke amt={1.2} tint={[.8,.7,.5]} wide={2.4} src={[.5,.02]} className="low"/><h2>Join Us on This Fragrance Journey</h2><p>{join}</p><Link className="pill" to="/collections/all">Shop All Perfumes</Link><Link className="chip" to="/pages/our-outlets">Find an outlet</Link></section></div>}
function Contact(){useTitle('Contact Us | AR Fragrances','Contact AR Fragrances on WhatsApp or email, find our 25+ outlets, and read answers to common questions.');useEffect(()=>scrollTo(0,0),[]);
 const [open,setOpen]=useState(0);
 const faq=[...pages.faqs.matchAll(/<h3>\s*([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3>|$)/g)].map(m=>({q:strip(m[1]).replace(/^\s*\d+\./,'').trim(),a:m[2].replace(/<(?!\/?(p|strong|ul|li|br)\b)[^>]+>/g,'')})).filter(x=>x.q);
 return <div className="cnt">
  <PageHero eyebrow="Get in touch" title="We’d Love to Hear From You" sub="Questions about a fragrance, an order or an outlet? Reach us the way that suits you best."/>
  <section className="ct-grid"><div className="ct-cards">
   <a className="ct-card" href={'https://wa.me/923330499831'} target="_blank" rel="noreferrer"><span className="ic"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15L2 22l5.1-1.3A10 10 0 1012 2z"/></svg></span><div><h3>WhatsApp</h3><p>+92 333 0499831</p><small>Fastest way to reach us</small></div></a>
   <a className="ct-card" href="mailto:arfragrancespk@gmail.com"><span className="ic"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></span><div><h3>Email</h3><p>arfragrancespk@gmail.com</p><small>We reply within one business day</small></div></a>
   <Link className="ct-card" to="/pages/our-outlets"><span className="ic"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.800 7 12 7 12z"/><circle cx="12" cy="10" r="2.500"/></svg></span><div><h3>Visit an outlet</h3><p>25+ stores across Pakistan</p><small>Lahore · Karachi · Islamabad & more</small></div></Link></div>
   <form className="ct-form" onSubmit={e=>{e.preventDefault();const f=new FormData(e.target);open2(`https://wa.me/923330499831?text=${encodeURIComponent(`Name: ${f.get('n')}\nEmail: ${f.get('e')}\nPhone: ${f.get('p')}\n${f.get('m')}`)}`)}}>
    <h2>Send us a message</h2><div className="ct-row"><input name="n" placeholder="Your name" required/><input name="e" type="email" placeholder="Email" required/></div><input name="p" placeholder="Phone / WhatsApp number" required/><textarea name="m" placeholder="How can we help?" rows="5" required/><button className="btn">Send via WhatsApp</button></form></section>
  <section className="ab-sec ct-faq"><h2 className="stitle">Frequently Asked Questions</h2><div className="faqs">{faq.map((x,i)=><div key={i} className={'fq'+(open===i?' on':'')}><button onClick={()=>setOpen(open===i?-1:i)} aria-expanded={open===i}><span>{x.q}</span><i/></button><div className="fa"><div dangerouslySetInnerHTML={{__html:x.a}}/></div></div>)}</div></section></div>}
const open2=u=>window.open(u,'_blank');
