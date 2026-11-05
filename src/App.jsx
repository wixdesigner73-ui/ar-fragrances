import React,{useEffect} from 'react';
import {Routes,Route,useLocation} from 'react-router-dom';
import gsap from 'gsap';import {ScrollTrigger} from 'gsap/ScrollTrigger';import Lenis from 'lenis';
import {Header,Footer,CartDrawer,Search,WaFab} from './components/ui.jsx';
import {SvgDefs} from './components/art.jsx';import Home from './pages/Home.jsx';import {Collection,Product,Page,useTitle} from './pages/Shop.jsx';
gsap.registerPlugin(ScrollTrigger);
function Motion(){const {pathname}=useLocation();
 useEffect(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const l=new Lenis({duration:1.15,smoothWheel:true});l.on('scroll',ScrollTrigger.update);
  const tick=t=>l.raf(t*1000);gsap.ticker.add(tick);gsap.ticker.lagSmoothing(0);window.__lenis=l;
  return()=>{gsap.ticker.remove(tick);l.destroy()}},[]);
 useEffect(()=>{const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let bt=[];const t=setTimeout(()=>{const els=gsap.utils.toArray('.rv:not(.done)');if(rm){gsap.set(els,{opacity:1,y:0});return}
   gsap.set(els,{opacity:0,y:40});bt=ScrollTrigger.batch(els,{start:'top 88%',once:true,onEnter:b=>{b.forEach(e=>e.classList.add('done'));gsap.to(b,{opacity:1,y:0,duration:1,stagger:.12,ease:'power3.out',overwrite:true})}});ScrollTrigger.refresh()},120);
  window.__lenis?.scrollTo(0,{immediate:true});return()=>{clearTimeout(t);bt.forEach(s=>s.kill())}},[pathname]);
 return null}
export default function App(){useTitle('AR Fragrances | Premium Perfumes Pakistan');
 return <><a className="skip" href="#main">Skip to content</a><SvgDefs/><Motion/><Header/>
  <main id="main"><Routes><Route path="/" element={<Home/>}/><Route path="/collections/:handle" element={<Collection/>}/><Route path="/search" element={<Collection search/>}/>
   <Route path="/products/:handle" element={<Product/>}/><Route path="/pages/:handle" element={<Page/>}/><Route path="*" element={<div className="page nf"><h1>Page not found</h1></div>}/></Routes></main>
  <Footer/><CartDrawer/><Search/><WaFab/></>}
