import React,{createContext,useContext,useEffect,useMemo,useState,useCallback} from 'react';
import raw from './data/products.json';
const B=import.meta.env.BASE_URL;export const U=p=>p&&p.startsWith('/')?B+p.slice(1):p;
const products=raw.map(p=>({...p,img:U(p.img),imgS:U(p.imgS),cut:U(p.cut),cutS:U(p.cutS||p.cut),images:p.images.map(U)}));
export const SHOP='https://arfragrances.pk';
export const WA='923330499831';
export const money=n=>'Rs. '+Math.round(n).toLocaleString('en-PK');
export const byHandle=Object.fromEntries(products.map(p=>[p.handle,p]));
export const onSale=p=>p.compare>p.price;
export const COLLECTIONS=[
 {slug:'all',title:'All Perfumes',test:()=>true},
 {slug:'men',title:'Men Perfumes',test:p=>p.cats.includes('men')},
 {slug:'women',title:'Women Perfumes',test:p=>p.cats.includes('women')},
 {slug:'unisex',title:'Unisex Perfumes',test:p=>p.cats.includes('unisex')},
 {slug:'body-mists',title:'Body Mists',test:p=>p.cats.includes('body-mist')},
 {slug:'roll-on',title:"Roll On's",test:p=>p.cats.includes('roll-on')},
 {slug:'oud',title:'Oud',test:p=>p.cats.includes('oud')},
 {slug:'bundles',title:'Bundles',test:p=>p.cats.includes('bundles')},
 {slug:'buy-1-perfume-get-free-body-mist',title:'Buy 1 Perfume, Get a Free Body Mist',test:p=>/free/i.test(p.title)},
 {slug:'best-products',title:'Top Sellers',test:p=>p.cats.includes('best')},
 {slug:'new-arrival',title:'New Arrivals',test:p=>p.cats.includes('new')},
 {slug:'sale',title:'Sale',test:onSale},
];
export const colBy=Object.fromEntries(COLLECTIONS.map(c=>[c.slug,c]));
export const inCol=slug=>products.filter((colBy[slug]||colBy.all).test);
export const nice=t=>t.replace(/\s*[-–|]\s*(inspired by|premium creation|our most|long lasting).*$/i,'').replace(/SALE!+/i,'').replace(/🔥|🏆/g,'').trim();
export const shortTitle=t=>nice(t).replace(/\b(\w)(\w*)/g,(m,a,b)=>a.toUpperCase()+b.toLowerCase()).replace(/\bAr\b/,'AR').replace(/\bMl\b/,'ml').replace(/\bEdp\b/,'EDP');
export const firstSentence=p=>{const d=p.desc.replace(/^.*?\(\w+\)\s*/,'');const m=d.match(/^[^.!?]{40,220}[.!?]/);return m?m[0]:d.slice(0,160)+'…'};
export const products_=products;
const Ctx=createContext(null);export const useStore=()=>useContext(Ctx);
export function StoreProvider({children}){
 const [lines,setLines]=useState(()=>{try{return JSON.parse(localStorage.getItem('ar-cart')||'[]')}catch{return[]}});
 const [open,setOpen]=useState(false);const [searchOpen,setSearch]=useState(false);const [menu,setMenu]=useState(false);
 const [code,setCode]=useState(()=>{try{return localStorage.getItem('ar-code')||''}catch{return''}});
 useEffect(()=>{try{localStorage.setItem('ar-cart',JSON.stringify(lines));localStorage.setItem('ar-code',code)}catch{}},[lines,code]);
 const add=useCallback((p,v,qty=1)=>{setLines(l=>{const i=l.findIndex(x=>x.id===v.id);if(i>-1){const n=[...l];n[i]={...n[i],qty:n[i].qty+qty};return n}
  return[...l,{id:v.id,handle:p.handle,title:shortTitle(p.title),variant:v.title==='Default Title'?'':v.title,price:v.price,compare:v.compare,img:p.imgS,qty}]});setOpen(true)},[]);
 const setQty=useCallback((id,q)=>setLines(l=>q<=0?l.filter(x=>x.id!==id):l.map(x=>x.id===id?{...x,qty:q}:x)),[]);
 const count=lines.reduce((a,l)=>a+l.qty,0);const subtotal=lines.reduce((a,l)=>a+l.qty*l.price,0);
 const checkoutUrl=`${SHOP}/cart/${lines.map(l=>l.id+':'+l.qty).join(',')}${code?`?discount=${encodeURIComponent(code)}`:''}`;
 const v=useMemo(()=>({lines,add,setQty,count,subtotal,open,setOpen,searchOpen,setSearch,menu,setMenu,code,setCode,checkoutUrl}),[lines,count,subtotal,open,searchOpen,menu,code,checkoutUrl,add,setQty]);
 return <Ctx.Provider value={v}>{children}</Ctx.Provider>}
