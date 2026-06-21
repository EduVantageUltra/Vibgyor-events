/* =====================================================
   VIBGYOR EVENTS — Shared interaction layer
   Loaded on every page → consistent motion everywhere
   ===================================================== */
(function(){
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGSAP = window.gsap;
if(hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

/* ---------- CURSOR ---------- */
(function(){
  const dot=document.querySelector('.cursor'), ring=document.querySelector('.cursor-ring');
  if(!dot||!ring) return;
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
  (function loop(){rx+=(mx-rx)*.18;ry+=(my-ry)*.18;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop);})();
  const watch=()=>document.querySelectorAll('a,button,[data-hover],.album,.tile').forEach(el=>{
    if(el.__c)return;el.__c=1;
    el.addEventListener('mouseenter',()=>ring.classList.add('hover'));
    el.addEventListener('mouseleave',()=>ring.classList.remove('hover'));
  });
  watch();window.__watchCursor=watch;
})();

/* ---------- PRELOADER + reveal trigger ---------- */
function startPage(){
  if(hasGSAP){
    gsap.to('nav',{opacity:1,y:0,duration:.8,ease:'power3.out'});
    // hero lines
    if(document.querySelector('.js-hero-line')){
      gsap.to('.js-hero-line span',{y:0,duration:1,stagger:.12,ease:'power4.out',delay:.1});
    }
    gsap.utils.toArray('.js-hero-fade').forEach((el,i)=>gsap.to(el,{opacity:1,y:0,duration:.9,delay:.5+i*.12,ease:'power3.out'}));
  }
  initReveals();
}
(function preload(){
  const loader=document.getElementById('loader');
  if(!loader){startPage();return;}
  const word=loader.querySelector('.loader-word');
  if(word) word.innerHTML='<span class="lw-main">'+'VIBGYOR'.split('').map(c=>`<b>${c}</b>`).join('')+'</span><span class="lw-sub">EVENTS</span>';
  if(hasGSAP){
    const tl=gsap.timeline();
    tl.to('.lw-main b',{y:0,duration:.75,stagger:.07,ease:'power4.out'})
      .to('.lw-sub',{opacity:1,y:0,duration:.6,ease:'power3.out'},'-=.25')
      .to('.loader-sub',{opacity:1,duration:.5},'-=.3')
      .to('.loader-bar',{width:'100%',duration:1.1,ease:'power2.inOut'},'-=.35')
      .to(loader,{yPercent:-100,duration:.9,ease:'power4.inOut',delay:.2})
      .set(loader,{display:'none'})
      .add(startPage,'-=.5');
  } else { loader.style.display='none'; startPage(); }
})();

/* ---------- SMOOTH SCROLL ---------- */
if(!reduce && window.Lenis){
  const lenis=new Lenis({lerp:.09,wheelMultiplier:.9});
  if(window.ScrollTrigger){lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);}
  else (function raf(t){lenis.raf(t);requestAnimationFrame(raf);})(0);
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();lenis.scrollTo(t,{offset:-20});}});
  });
  window.__lenis=lenis;
}

/* ---------- REVEALS / COUNTERS / TIMELINE ---------- */
function initReveals(){
  if(!hasGSAP||!window.ScrollTrigger){document.querySelectorAll('.reveal').forEach(e=>{e.style.opacity=1;e.style.transform='none';});return;}
  gsap.utils.toArray('.reveal').forEach(el=>gsap.to(el,{opacity:1,y:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));
  gsap.utils.toArray('[data-count]').forEach(el=>{
    const end=+el.dataset.count,suf=el.dataset.suffix||'',pre=el.dataset.prefix||'';
    ScrollTrigger.create({trigger:el,start:'top 90%',once:true,onEnter:()=>{
      gsap.to({v:0},{v:end,duration:2,ease:'power2.out',onUpdate:function(){el.textContent=pre+Math.round(this.targets()[0].v)+suf;}});
    }});
  });
  const fill=document.querySelector('.proc-line .fill');
  if(fill)gsap.to(fill,{height:'100%',ease:'none',scrollTrigger:{trigger:'.proc-line',start:'top 70%',end:'bottom 80%',scrub:true}});
  // hero parallax
  gsap.utils.toArray('[data-parallax]').forEach(img=>{
    gsap.to(img,{yPercent:18,scale:1.22,ease:'none',scrollTrigger:{trigger:img.closest('section,header,.page-hero')||img,start:'top top',end:'bottom top',scrub:true}});
  });
}

/* ---------- HORIZONTAL SERVICES ---------- */
function initHScroll(){
  const track=document.getElementById('hScroll');
  if(!track||!hasGSAP||!window.ScrollTrigger||innerWidth<880)return;
  const amount=track.scrollWidth-innerWidth+48;
  if(amount<=0)return;
  gsap.to(track,{x:-amount,ease:'none',scrollTrigger:{trigger:'.services-wrap',start:'top top',end:'+='+amount,pin:true,scrub:1,invalidateOnRefresh:true}});
}
window.addEventListener('load',initHScroll);

/* ---------- MAGNETIC ---------- */
if(!reduce&&hasGSAP){
  document.querySelectorAll('.btn-pill,.nav-cta').forEach(btn=>{
    btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect();gsap.to(btn,{x:(e.clientX-r.left-r.width/2)*.25,y:(e.clientY-r.top-r.height/2)*.35,duration:.5,ease:'power3.out'});});
    btn.addEventListener('mouseleave',()=>gsap.to(btn,{x:0,y:0,duration:.6,ease:'elastic.out(1,.4)'}));
  });
}

/* ---------- MOBILE MENU ---------- */
(function(){
  const burger=document.querySelector('.burger'),menu=document.querySelector('.mobile-menu');
  if(!burger||!menu)return;
  burger.addEventListener('click',()=>{menu.classList.toggle('open');burger.classList.toggle('x');});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');burger.classList.remove('x');}));
})();

/* ---------- TESTIMONIAL ROTATOR ---------- */
(function(){
  const q=document.getElementById('testiQuote');if(!q||!window.TESTIMONIALS)return;
  const w=document.getElementById('testiWho'),dots=[...document.querySelectorAll('#tDots i')];
  let i=0;const d=window.TESTIMONIALS;
  function show(n){
    if(hasGSAP){gsap.to([q,w],{opacity:0,y:10,duration:.4,onComplete:set});}else set();
    function set(){q.textContent=d[n][0];w.innerHTML=d[n][1]+' — <span>'+d[n][2]+'</span>';if(hasGSAP)gsap.to([q,w],{opacity:1,y:0,duration:.6,stagger:.05});}
    dots.forEach((x,k)=>x.classList.toggle('on',k===n));i=n;
  }
  dots.forEach((x,k)=>x.addEventListener('click',()=>show(k)));
  show(0);setInterval(()=>show((i+1)%d.length),6000);
})();

/* ---------- LIGHTBOX (images + video) ---------- */
window.VibLightbox=(function(){
  let items=[],idx=0,lb,imgEl,vidEl,capEl;
  function build(){
    lb=document.createElement('div');lb.className='lb';
    lb.innerHTML=`<button class="lb-close" aria-label="Close">✕</button>
      <button class="lb-nav prev" aria-label="Prev">‹</button>
      <button class="lb-nav next" aria-label="Next">›</button>
      <div class="lb-stage"><img alt=""><video controls playsinline style="display:none"></video><div class="lb-cap"></div></div>`;
    document.body.appendChild(lb);
    imgEl=lb.querySelector('img');vidEl=lb.querySelector('video');capEl=lb.querySelector('.lb-cap');
    lb.querySelector('.lb-close').onclick=close;
    lb.querySelector('.prev').onclick=()=>go(-1);
    lb.querySelector('.next').onclick=()=>go(1);
    lb.addEventListener('click',e=>{if(e.target===lb)close();});
    document.addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')go(-1);if(e.key==='ArrowRight')go(1);});
    if(window.__watchCursor)window.__watchCursor();
  }
  function render(){
    const it=items[idx];
    if(it.type==='video'){imgEl.style.display='none';vidEl.style.display='block';vidEl.src=it.src;vidEl.poster=it.poster||'';vidEl.play().catch(()=>{});}
    else{vidEl.pause();vidEl.style.display='none';imgEl.style.display='block';imgEl.src=it.src;}
    capEl.textContent=it.cap||'';
  }
  function go(d){idx=(idx+d+items.length)%items.length;render();}
  function close(){lb.classList.remove('open');vidEl.pause();vidEl.src='';document.body.style.overflow='';}
  function open(list,start){if(!lb)build();items=list;idx=start||0;render();lb.classList.add('open');document.body.style.overflow='hidden';}
  return {open};
})();

/* ---------- EVENT GALLERY PAGE BUILDER ---------- */
(function(){
  const mount=document.getElementById('eventGallery');
  if(!mount||!window.GALLERY)return;
  const id=new URLSearchParams(location.search).get('id')||Object.keys(window.GALLERY)[0];
  const ev=window.GALLERY[id]||window.GALLERY[Object.keys(window.GALLERY)[0]];
  document.querySelectorAll('[data-ev-title]').forEach(e=>e.textContent=ev.title);
  document.querySelectorAll('[data-ev-meta]').forEach(e=>e.textContent=ev.meta);
  document.querySelectorAll('[data-ev-intro]').forEach(e=>e.textContent=ev.intro);
  const heroImg=document.querySelector('[data-ev-hero]');if(heroImg)heroImg.src=ev.cover;
  const lightItems=ev.media.map(m=>({type:m.type,src:m.type==='video'?m.src:m.src,poster:m.poster,cap:ev.title}));
  ev.media.forEach((m,i)=>{
    const tile=document.createElement('div');
    tile.className='tile reveal'+(m.type==='video'?' video':'');
    tile.innerHTML=`<img src="${m.type==='video'?(m.poster||m.src):m.src}" alt="${ev.title}">`+
      (m.type==='video'?`<span class="vtag">Film</span><div class="play">▶</div>`:'');
    tile.addEventListener('click',()=>window.VibLightbox.open(lightItems,i));
    mount.appendChild(tile);
  });
  if(window.__watchCursor)window.__watchCursor();
  // re-run reveals for injected tiles
  if(hasGSAP&&window.ScrollTrigger){gsap.utils.toArray('#eventGallery .reveal').forEach(el=>gsap.to(el,{opacity:1,y:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%'}}));ScrollTrigger.refresh();}
})();

/* ---------- GENERIC FORM ---------- */
window.vibForm=function(e){
  e.preventDefault();
  const btn=e.target.querySelector('[type=submit]');
  if(btn){const t=btn.innerHTML;btn.innerHTML='Thank you · We will call you ♥';if(hasGSAP)gsap.fromTo(btn,{scale:.96},{scale:1,duration:.5,ease:'back.out(2)'});}
  return false;
};
})();
