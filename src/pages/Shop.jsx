import React,{useEffect,useMemo,useState} from 'react';
import {Link,useParams,useSearchParams} from 'react-router-dom';
import {Card,Price} from '../components/ui.jsx';
import {COLLECTIONS,colBy,inCol,byHandle,products_,useStore,shortTitle,onSale,money,SHOP} from '../store.jsx';
import pages from '../data/pages.json';
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
    <div className="pdesc" dangerouslySetInnerHTML={{__html:p.descHtml}}/></div></div>
  {rel.length>0&&<section className="related"><h2 className="stitle">You May Also Like</h2><div className="grid">{rel.map(r=><Card key={r.handle} p={r}/>)}</div></section>}</div>}
export function Page(){
 const {handle}=useParams();const html=pages[handle];const T={'about-us':'About Us','contact':'Contact Us','faqs':'FAQs','refund-policy':'Refund Policy','shipping-policy':'Shipping Policy','our-outlets':'Our Outlets'}[handle];
 useTitle(T?`${T} | AR Fragrances`:'Not found');useEffect(()=>scrollTo(0,0),[handle]);
 if(!html)return <div className="page nf"><h1>Page not found</h1><Link className="btn" to="/">Home</Link></div>;
 return <div className="page prose"><div className="phead"><span className="eyebrow">AR Fragrances</span><h1>{T}</h1></div>
  <div dangerouslySetInnerHTML={{__html:html.replace(/<h1[\s\S]*?<\/h1>/,'')}}/>
  {handle==='contact'&&<form className="cform" onSubmit={e=>{e.preventDefault();const f=new FormData(e.target);open(`https://wa.me/923330499831?text=${encodeURIComponent(`Name: ${f.get('n')}\nEmail: ${f.get('e')}\nPhone: ${f.get('p')}\n${f.get('m')}`)}`)}}>
   <h3>Send us a message</h3><input name="n" placeholder="Name" required/><input name="e" type="email" placeholder="Email" required/><input name="p" placeholder="Phone / WhatsApp number" required/><textarea name="m" placeholder="Your message" rows="4" required/><button className="btn">Send via WhatsApp</button></form>}</div>}
