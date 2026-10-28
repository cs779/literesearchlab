/* mobile menu */
(function(){
  var b=document.querySelector(".menu-btn"), n=document.querySelector(".nav");
  if(b&&n) b.addEventListener("click",function(){var o=n.classList.toggle("open");b.setAttribute("aria-expanded",String(o));});
})();

/* videos: click to play with controls */
document.querySelectorAll("video[data-click]").forEach(function(v){
  v.addEventListener("click",function(){ if(!v.controls){ v.controls=true; v.play(); } });
});

/* copy email */
(function(){
  var b=document.getElementById("copybtn"); if(!b) return;
  b.addEventListener("click",function(){
    var out=document.getElementById("copied"), addr="cs779@njit.edu";
    function fb(){ var r=document.createRange(); r.selectNodeContents(document.getElementById("addr")); var s=getSelection(); s.removeAllRanges(); s.addRange(r); out.textContent="Selected. Press Ctrl/Cmd+C to copy."; }
    try{ navigator.clipboard.writeText(addr).then(function(){out.textContent="Copied";},fb); }catch(e){ fb(); }
  });
})();

/* hero banner: a laser sweeps across a polymer lattice, leaving graphene behind */
(function(){
  var cv=document.getElementById("lattice"); if(!cv) return;
  var ctx=cv.getContext("2d"), reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  var W=0,H=0,cells=[],start=performance.now();
  function size(){
    var dpr=Math.min(2,window.devicePixelRatio||1);
    W=cv.clientWidth; H=cv.clientHeight; cv.width=W*dpr; cv.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    cells=[]; var r=24, dx=r*Math.sqrt(3), dy=r*1.5;
    for(var j=-1,y=-r; y<H+r; j++,y+=dy) for(var x=(j%2?dx/2:0)-dx; x<W+dx; x+=dx) cells.push({x:x,y:y,r:r});
  }
  function hex(x,y,r){ ctx.beginPath(); for(var k=0;k<6;k++){ var a=Math.PI/180*(60*k-30); ctx.lineTo(x+r*Math.cos(a),y+r*Math.sin(a)); } ctx.closePath(); }
  function draw(now){
    var t=(now-start)/1000, period=10, s=reduce?1:((t%period)/period);
    var bx=-60+s*(W+120), by=H*0.18;
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<cells.length;i++){
      var c=cells[i], lit=c.x<bx, dc=Math.abs(c.x-W/2)/(W/2), dyc=Math.abs(c.y-H/2)/(H/2);
      var calm=Math.min(1,0.35+0.65*Math.max(dc,dyc*0.8));          /* quieter behind the centered title */
      var a=(lit?0.26:0.08)*calm;
      hex(c.x,c.y,c.r-2); ctx.strokeStyle=lit?"rgba(63,209,193,"+a+")":"rgba(184,198,214,"+a+")"; ctx.lineWidth=1.2; ctx.stroke();
    }
    if(!reduce){
      var g=ctx.createLinearGradient(bx-200,0,bx,0); g.addColorStop(0,"rgba(255,94,58,0)"); g.addColorStop(1,"rgba(255,138,61,.85)");
      ctx.strokeStyle=g; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(bx-200,by); ctx.lineTo(bx,by); ctx.stroke();
      var rg=ctx.createRadialGradient(bx,by,0,bx,by,40); rg.addColorStop(0,"rgba(255,138,61,.55)"); rg.addColorStop(1,"rgba(255,138,61,0)");
      ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(bx,by,40,0,6.28); ctx.fill();
      ctx.fillStyle="#FF5E3A"; ctx.beginPath(); ctx.arc(bx,by,4.5,0,6.28); ctx.fill();
      requestAnimationFrame(draw);
    }
  }
  size(); addEventListener("resize",size); requestAnimationFrame(draw);
})();

/* publications */
(function(){
  var el=document.getElementById("publist"); if(!el||!window.PUBS) return;
  var PUBS=window.PUBS, filt="all", q="";
  function esc(s){ return s.replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
  function boldMe(a){ return esc(a).replace(/Sharma, C\. P\.\*?/g,function(m){return "<b>"+m+"</b>";}); }
  function render(){
    var list=PUBS.filter(function(p){ return (filt==="all"||p.f.indexOf(filt)>-1) && (!q||(p.t+" "+p.j+" "+p.a).toLowerCase().indexOf(q)>-1); });
    document.getElementById("pubcount").textContent=list.length+" of "+PUBS.length;
    if(!list.length){ el.innerHTML='<p class="count">No publications match. Clear the search or pick another topic.</p>'; return; }
    var years=[]; list.forEach(function(p){ if(years.indexOf(p.y)<0) years.push(p.y); });
    el.innerHTML=years.map(function(y){
      return '<div class="year"><h3>'+y+'</h3><ol>'+list.filter(function(p){return p.y===y;}).map(function(p){
        var link=p.doi?'<a class="doi" href="https://doi.org/'+p.doi+'" target="_blank" rel="noopener">doi.org/'+esc(p.doi)+'</a>':(p.url?'<a class="doi" href="'+p.url+'" target="_blank" rel="noopener">Read article</a>':'');
        var tags=(p.tags||[]).map(function(t){return '<span class="tag'+(/first|Corresponding/i.test(t)?' first':'')+'">'+esc(t)+'</span>';}).join("");
        return '<li class="pub"><p class="t">'+esc(p.t)+'</p><p class="a">'+boldMe(p.a)+'</p><p class="j"><i>'+esc(p.j)+'</i></p><div class="meta">'+tags+link+'</div></li>';
      }).join("")+'</ol></div>';
    }).join("")+(list.some(function(p){return p.a.indexOf("*")>-1;})?'<p class="count" style="padding-top:14px">* Equal contribution</p>':'');
  }
  document.querySelectorAll(".chipbtn").forEach(function(b){ b.addEventListener("click",function(){
    filt=b.dataset.f; document.querySelectorAll(".chipbtn").forEach(function(x){x.setAttribute("aria-pressed",String(x===b));}); render();
  });});
  document.getElementById("pubsearch").addEventListener("input",function(e){ q=e.target.value.trim().toLowerCase(); render(); });
  render();
})();
