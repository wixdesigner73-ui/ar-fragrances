// Post-process src/data/products.json for speed: slim main data, lazy details, small card images, prune unused files.
import fs from 'fs';import sharp from 'sharp';
const P=JSON.parse(fs.readFileSync('src/data/products.json','utf8'));
const detailsPath='src/data/details.json';const details=fs.existsSync(detailsPath)?JSON.parse(fs.readFileSync(detailsPath,'utf8')):{};
for(const p of P){
 if(p.descHtml!==undefined){details[p.handle]={html:p.descHtml.toWellFormed(),desc:p.desc};delete p.descHtml}
 p.desc=(p.desc||'').slice(0,700).toWellFormed();p.title=p.title.toWellFormed();
 if(p.cut){const s=p.cut.replace(/-cut\.webp$/,'-cuts.webp');const out='public'+s;
  if(!fs.existsSync(out))await sharp('public'+p.cut).resize({height:520,withoutEnlargement:true}).webp({quality:80,alphaQuality:85}).toFile(out);p.cutS=s}
 p.tags=(p.tags||[]).slice(0,6);
}
fs.writeFileSync('src/data/products.json',JSON.stringify(P));fs.writeFileSync(detailsPath,JSON.stringify(details));
// prune files in public/p that nothing references
const used=new Set();for(const p of P){for(const k of ['img','imgS','cut','cutS'])if(p[k])used.add(p[k].replace(/^\/p\//,''));(p.images||[]).forEach(i=>{if(i.startsWith('/p/'))used.add(i.slice(3))})}
let removed=0,freed=0;for(const f of fs.readdirSync('public/p')){if(!used.has(f)){freed+=fs.statSync('public/p/'+f).size;fs.unlinkSync('public/p/'+f);removed++}}
console.log('products',P.length,'| main data KB',Math.round(fs.statSync('src/data/products.json').size/1024),'| details KB',Math.round(fs.statSync(detailsPath).size/1024),'| removed unused files',removed,'freed MB',(freed/1048576).toFixed(1));
