import fs from 'fs';import sharp from 'sharp';
const W='../work/';const P=JSON.parse(fs.readFileSync(W+'products.json')).products;
const txt=h=>h.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&#39;|&rsquo;/g,"'").replace(/\s+/g,' ').trim();
const notes=t=>{const g=(re)=>{const m=t.match(re);return m?m[1].replace(/\band\b/gi,',').split(/[,;&]/).map(s=>s.trim().replace(/\.$/,'')).filter(s=>s&&s.length<40):null};
 const top=g(/top notes?\s*(?:are|:|-|include)?\s*([^;.]+?)(?:[;.]|,?\s*(?:middle|heart|mid)\b)/i),mid=g(/(?:middle|heart|mid)\s*notes?\s*(?:are|:|-|include)?\s*([^;.]+?)(?:[;.]|,?\s*(?:base|and base)\b)/i),base=g(/base notes?\s*(?:are|:|-|include)?\s*([^;.]+?)(?:[.;]|$)/i);
 const cl=a=>a&&a.flatMap(x=>x.split(/[•·]/)).map(x=>x.replace(/[^\p{L}\p{N} '\-]/gu,'').trim()).filter(x=>x&&x.length<28&&!/free|occasion|get |:|wear/i.test(x));
 const T=cl(top),M=cl(mid),B=cl(base);
 return T&&M&&B&&T.length&&M.length&&B.length?{top:T.slice(0,4),heart:M.slice(0,4),base:B.slice(0,4)}:null};
const out=[];fs.mkdirSync('public/p',{recursive:true});
for(const p of P){
 if(/wallet/i.test(p.title+p.tags.join()))continue;
 const t=p.tags.map(x=>x.toLowerCase());const title=p.title;
 const isBundle=/pack|bundle|combo|deal|gift|box|\bset\b/i.test(title)||p.product_type==='Bundle Test';
 const kind=p.product_type==='Roll On'?'roll-on':/body mist/i.test(title)&&!isBundle?'body-mist':null;
 const cats=new Set();if(isBundle)cats.add('bundles');if(kind)cats.add(kind);
 if(!kind&&!isBundle){if(t.includes('men'))cats.add('men');if(t.includes('women'))cats.add('women');if(t.includes('unisex'))cats.add('unisex')}
 if(t.some(x=>/\boud\b/.test(x))||/oud/i.test(title))cats.add('oud');
 if(t.includes('best seller')||t.includes('best'))cats.add('best');
 if(t.includes('new arrival')||t.includes('new'))cats.add('new');
 const v=p.variants.map(x=>({id:x.id,title:x.title,price:+x.price,compare:+x.compare_at_price||0,available:x.available}));
 const d=txt(p.body_html);const h=p.handle;
 const BAD=/active-pulse|ck-one-body-mist|elegance-gucci|endless-mens|gift-bag|glamour-inspired|good-girl-body|taqwa|sixer-gold-inspired|cool-box|free|buy-|pack|bundle|gift|wallet|premium-oud-collection|gucci-flora-body|bright-crystal-body|cool-water-body|sensation-body|versace-eros-body|1-million-body/i;
 const hasCut=fs.existsSync(W+'cut/'+h+'.png')&&!BAD.test(h);
 const img=p.images[0]?.src;if(!img||!fs.existsSync(W+'img/'+h+'.jpg'))continue;
 const sz=async(f,o,w)=>{if(!fs.existsSync(o)) await sharp(f).resize({width:w,withoutEnlargement:true}).webp({quality:82,alphaQuality:90}).toFile(o)};
 await sz(W+'img/'+h+'.jpg',`public/p/${h}.webp`,900);await sz(W+'img/'+h+'.jpg',`public/p/${h}-s.webp`,420);
 if(hasCut){await sharp(W+'cut/'+h+'.png').trim().toBuffer().then(async b=>{if(!fs.existsSync(`public/p/${h}-cut.webp`)){await sharp(b).resize({height:1100,withoutEnlargement:true}).webp({quality:88,alphaQuality:92}).toFile(`public/p/${h}-cut.webp`)}})}
 const images=p.images.slice(0,6).map((x,i)=>i===0?`/p/${h}.webp`:x.src);
 out.push({handle:h,title,type:p.product_type,cats:[...cats],tags:p.tags.slice(0,12),price:Math.min(...v.map(x=>x.price)),compare:Math.max(...v.map(x=>x.compare)),variants:v,desc:d,descHtml:p.body_html,notes:notes(d),img:`/p/${h}.webp`,imgS:`/p/${h}-s.webp`,cut:hasCut?`/p/${h}-cut.webp`:null,images,order:p.created_at});
}
fs.mkdirSync('src/data',{recursive:true});fs.writeFileSync('src/data/products.json',JSON.stringify(out));
console.log(out.length,'products;',out.filter(o=>o.cut).length,'cut;',out.filter(o=>o.notes).length,'notes');
