import React, { useEffect, useRef } from 'react';
const touch=()=>matchMedia('(hover:none)').matches, still=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;

export function CursorFX(){
 const ref=useRef(null);
 useEffect(()=>{
  if(touch()||still())return;
  const c=ref.current,g=c.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2),ps=[],m={x:-999,y:-999,gx:-999,gy:-999};
  let w,h,raf;
  const size=()=>{w=innerWidth;h=innerHeight;c.width=w*dpr;c.height=h*dpr;g.setTransform(dpr,0,0,dpr,0,0)};size();
  const mv=e=>{m.x=e.clientX;m.y=e.clientY;if(ps.length<90&&Math.random()<.7)ps.push({x:m.x,y:m.y,vx:(Math.random()-.5)*1.2,vy:(Math.random()-.5)*1.2-.3,l:1,r:1+Math.random()*2})};
  const draw=()=>{
   g.clearRect(0,0,w,h);m.gx+=(m.x-m.gx)*.15;m.gy+=(m.y-m.gy)*.15;
   const gr=g.createRadialGradient(m.gx,m.gy,0,m.gx,m.gy,170);gr.addColorStop(0,'rgba(100,200,255,.16)');gr.addColorStop(1,'rgba(100,200,255,0)');
   g.fillStyle=gr;g.fillRect(m.gx-170,m.gy-170,340,340);
   for(let i=ps.length-1;i>=0;i--){const p=ps[i];p.x+=p.vx;p.y+=p.vy;p.l-=.02;if(p.l<=0){ps.splice(i,1);continue}g.globalAlpha=p.l;g.fillStyle='#69e5ff';g.beginPath();g.arc(p.x,p.y,p.r,0,6.283);g.fill()}
   g.globalAlpha=1;raf=requestAnimationFrame(draw)};
  draw();window.addEventListener('pointermove',mv);window.addEventListener('resize',size);
  return()=>{cancelAnimationFrame(raf);window.removeEventListener('pointermove',mv);window.removeEventListener('resize',size)}
 },[]);
 return <canvas ref={ref} className="cursor-fx" aria-hidden="true"/>
}

export function NetworkBG(){
 const ref=useRef(null);
 useEffect(()=>{
  const c=ref.current,g=c.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2),reduce=still(),m={x:-999,y:-999};
  let w,h,nodes=[],raf,vis=true;
  const init=()=>{const r=c.getBoundingClientRect();w=r.width;h=r.height;c.width=w*dpr;c.height=h*dpr;g.setTransform(dpr,0,0,dpr,0,0);
   const n=Math.min(70,Math.round(w*h/16000));nodes=Array.from({length:n},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4}))};
  init();
  const frame=()=>{
   if(vis){
    g.clearRect(0,0,w,h);
    for(const a of nodes){
     if(!reduce){a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>w)a.vx*=-1;if(a.y<0||a.y>h)a.vy*=-1;
      const dx=a.x-m.x,dy=a.y-m.y,d=Math.hypot(dx,dy);if(d<140&&d>0){a.x+=dx/d*(140-d)*.03;a.y+=dy/d*(140-d)*.03}}}
    for(let i=0;i<nodes.length;i++){
     const a=nodes[i];g.fillStyle='rgba(105,229,255,.85)';g.beginPath();g.arc(a.x,a.y,2,0,6.283);g.fill();
     for(let j=i+1;j<nodes.length;j++){const b=nodes[j],d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<130){g.strokeStyle='rgba(100,180,255,'+(1-d/130)*.35+')';g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke()}}
     const dm=Math.hypot(a.x-m.x,a.y-m.y);
     if(dm<170){g.strokeStyle='rgba(155,139,255,'+(1-dm/170)*.6+')';g.beginPath();g.moveTo(a.x,a.y);g.lineTo(m.x,m.y);g.stroke()}
    }
   }
   if(!reduce)raf=requestAnimationFrame(frame)};
  frame();
  const mv=e=>{const r=c.getBoundingClientRect();m.x=e.clientX-r.left;m.y=e.clientY-r.top};
  const io=new IntersectionObserver(([e])=>{vis=e.isIntersecting});io.observe(c);
  window.addEventListener('pointermove',mv);window.addEventListener('resize',init);
  return()=>{cancelAnimationFrame(raf);io.disconnect();window.removeEventListener('pointermove',mv);window.removeEventListener('resize',init)}
 },[]);
 return <canvas ref={ref} className="net-bg" aria-hidden="true"/>
}

export function Tilt(){
 useEffect(()=>{
  if(touch()||still())return;
  let cur=null;
  const reset=el=>{el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')};
  const mv=e=>{
   const el=e.target.closest&&e.target.closest('.project-card,.service-card');
   if(cur&&cur!==el)reset(cur);cur=el;if(!el)return;
   const r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
   el.style.setProperty('--ry',px*14+'deg');el.style.setProperty('--rx',-py*14+'deg')};
  const lv=()=>{if(cur){reset(cur);cur=null}};
  document.addEventListener('pointermove',mv);document.documentElement.addEventListener('mouseleave',lv);
  return()=>{document.removeEventListener('pointermove',mv);document.documentElement.removeEventListener('mouseleave',lv)}
 },[]);
 return null
}
