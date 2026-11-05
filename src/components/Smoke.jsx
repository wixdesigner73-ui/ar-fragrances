import React,{useEffect,useRef} from 'react';
const VS='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const FS=`precision mediump float;uniform vec2 r;uniform float t;uniform float burst;uniform vec2 m;uniform vec2 src;uniform float amt;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/r;float asp=r.x/r.y;vec2 q=(uv-src)*vec2(asp,1.);
 vec2 w=vec2(fbm(q*2.2+vec2(0.,-t*.07)),fbm(q*2.2+vec2(5.2,1.3)+t*.05));
 float d=fbm(q*1.8+w*1.6+vec2(0.,-t*.12-burst*.6));
 float mask=smoothstep(.95,.0,length(q*vec2(.8,1.1)))*(.35+.65*smoothstep(-.3,.6,q.y+.15));
 float jet=burst*smoothstep(.5,0.,abs(q.y-.1))*smoothstep(.9,0.,q.x+.4)*smoothstep(-.9,.3,q.x);
 float mouse=smoothstep(.5,0.,length((uv-m)*vec2(asp,1.)))*.25;
 float a=(smoothstep(.35,.85,d)*mask*amt+jet*d*1.3+mouse*d)*.55;
 vec3 col=mix(vec3(.55,.5,.45),vec3(.95,.92,.88),d);
 gl_FragColor=vec4(col*a,a);}`;
export default function Smoke({burst=0,amt=1,src=[.55,.2],className=''}){
 const ref=useRef();const st=useRef({burst:0,m:[.5,.5],src});
 useEffect(()=>{st.current.burst=1},[burst]);
 useEffect(()=>{st.current.src=src},[src[0],src[1]]);
 useEffect(()=>{const c=ref.current;const gl=c.getContext('webgl',{premultipliedAlpha:true,alpha:true,antialias:false});if(!gl)return;
  const mk=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o};
  const pr=gl.createProgram();gl.attachShader(pr,mk(gl.VERTEX_SHADER,VS));gl.attachShader(pr,mk(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);gl.useProgram(pr);
  const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
  const U=n=>gl.getUniformLocation(pr,n);const u={r:U('r'),t:U('t'),burst:U('burst'),m:U('m'),src:U('src'),amt:U('amt')};
  const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;const mobile=innerWidth<700;
  const scale=mobile?.45:.6;let raf,vis=true,t0=performance.now();
  const rs=()=>{const w=c.clientWidth,h=c.clientHeight;c.width=Math.max(2,w*scale);c.height=Math.max(2,h*scale);gl.viewport(0,0,c.width,c.height)};rs();
  const ro=new ResizeObserver(rs);ro.observe(c);const io=new IntersectionObserver(e=>{vis=e[0].isIntersecting});io.observe(c);
  const mv=e=>{const R=c.getBoundingClientRect();st.current.m=[(e.clientX-R.left)/R.width,1-(e.clientY-R.top)/R.height]};addEventListener('pointermove',mv);
  const draw=()=>{raf=requestAnimationFrame(draw);if(!vis)return;const s=st.current;s.burst*=.972;
   gl.uniform2f(u.r,c.width,c.height);gl.uniform1f(u.t,rm?3:(performance.now()-t0)/1000);gl.uniform1f(u.burst,rm?0:s.burst);gl.uniform2f(u.m,s.m[0],s.m[1]);gl.uniform2f(u.src,s.src[0],s.src[1]);gl.uniform1f(u.amt,amt);
   gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,3)};draw();
  return()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();removeEventListener('pointermove',mv)}},[amt]);
 return <canvas ref={ref} className={'smoke '+className} aria-hidden="true"/>}
