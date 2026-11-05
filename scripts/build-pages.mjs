import fs from 'fs';const o={};
for(const pg of ['about-us','contact','faqs','refund-policy','shipping-policy','our-outlets']){
 let h=fs.readFileSync('../work/data/'+pg+'.html','utf8');let m=h.match(/<main[\s\S]*?<\/main>/);h=m?m[0]:h;
 h=h.replace(/<(script|style|svg|form|noscript|button|iframe)[\s\S]*?<\/\1>/g,'').replace(/<!--[\s\S]*?-->/g,'');
 h=h.replace(/<(?!\/?(p|h[1-4]|ul|ol|li|strong|b|em|a|br)\b)[^>]+>/g,'').replace(/\s(class|style|id|data-[\w-]+|target|rel)="[^"]*"/g,'').replace(/href="\/(?!\/)/g,'href="https://arfragrances.pk/').replace(/<(\w+)\s*>\s*<\/\1>/g,'').replace(/\n\s*\n+/g,'\n');
 o[pg]=h.trim();console.log(pg,h.length)}
fs.writeFileSync('src/data/pages.json',JSON.stringify(o));
