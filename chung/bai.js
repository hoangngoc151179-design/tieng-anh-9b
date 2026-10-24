/* Khuôn bài dùng chung (20/10/2026): đọc nội dung bài trong window.BAI (sinh từ bai.json) rồi dựng cả trang.
   Giữ đúng các điều Sếp đã dặn: học lần lượt từng phần (nút sang phần sau luôn bấm được), mỗi phần có lời cô giảng,
   bài tập có lời giải + nghe cô giải, bấm từ để nghe / xem họ từ, làm sai thì ghi vào Sổ lỗi sai, trang Kết quả xem bất cứ lúc nào.
   Các loại khối: html, hoithoai, baidoc, tuvung, chon, go, dien, noi, cot, to, loisai, tick, viet, khaosat, vai, dongvai, bang, nic, chonghe. */
(function(){
const GOCW=((document.currentScript&&document.currentScript.src)||"").replace(/chung\/bai\.js(\?.*)?$/,"")||"../../";   // gốc web, tính theo vị trí file này (bài có thể nằm sâu 2 hoặc 3 cấp)
const B=window.BAI, A="audio/", KEY=B.key, LG=window.LOIGIANG||{giang:{},giai:{}};
const SL=id=>{ try{ window.SoLoi&&SoLoi.ghi(KEY+":"+id); }catch(e){} };   // mã câu = khoá bài + mã bài tập, để các bài không trùng nhau
let st={done:{}}; try{ st=Object.assign(st, JSON.parse(localStorage.getItem(KEY)||"{}")); }catch(e){}
const save=()=>{ try{ localStorage.setItem(KEY, JSON.stringify(st)); }catch(e){} };
const player=new Audio(); window.player=player; let playDone=null;
function play(src){ if(playDone) playDone(); return new Promise(res=>{ playDone=res; player.pause(); player.src=A+src; player.onended=res; player.onerror=res; player.play().catch(res); }); }
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const cum=w=>`cum/${w.toLowerCase().replace(/ /g,"-")}.mp3`;
const chuan=s=>String(s).trim().toLowerCase().replace(/[’‘]/g,"'").replace(/[.!?,;:]/g,"").replace(/\s+/g," ");
const E=s=>String(s??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const mk=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };
const giai=k=>(LG.giai||{})[k]||"";
const tip=mk("div","tip"); document.body.appendChild(tip); let tipT;
function showTip(h){ tip.innerHTML=h; tip.classList.add("show"); clearTimeout(tipT); tipT=setTimeout(()=>tip.classList.remove("show"),2600); }
function nutGiai(k){ const b=mk("button","giai","👩‍🏫 Nghe cô giải"); b.onclick=e=>{ e.stopPropagation(); play(`giang/giai-${k}.mp3`); }; return b; }
function nutCau(k){ const b=mk("button","giai","🔊 Nghe câu đúng"); b.onclick=e=>{ e.stopPropagation(); play(k+".mp3"); }; return b; }
document.addEventListener("click",e=>{ const g=e.target.closest("[data-giai]"); if(g) play(`giang/giai-${g.dataset.giai}.mp3`);
  const c=e.target.closest("[data-cau]"); if(c) play(c.dataset.cau+".mp3"); const w=e.target.closest("[data-cum]"); if(w) play(cum(w.dataset.cum)); });
const boc=el=>{ try{ BamTu.boc(el); }catch(e){} };
const fmt=s=>String(s).replace(/\{([^}]+)\}/g,"<span class='w'>$1</span>").replace(/\[\[(.+?)\]\]/g,"<span class='hl'>$1</span>");
const DIEM=[];   // các khối có chấm điểm: {ma, ten, tong}
function phanHoi(fb,ok,dapHtml,g,a){ fb.className="fb "+(ok?"ok":"no"); fb.innerHTML=(ok?"Correct! ":dapHtml?`Incorrect – Answer: <b>${dapHtml}</b>${/[.?!]\s*$/.test(String(dapHtml).replace(/<[^>]*>/g,""))?"":"."} `:"Incorrect. ")+(g?giai(g)+" ":""); if(a) fb.appendChild(nutCau(a)); if(g) fb.appendChild(nutGiai(g)); }
function hangNut(chamTxt){ const r=mk("div","row"); r.style.marginTop="8px"; r.innerHTML=`<button class="btn">${chamTxt||"Chấm điểm"}</button><button class="btn ghost hide">Làm lại</button><span class="score"></span>`; return r; }
function toVang(ids){ document.querySelectorAll(".line.ev,.s.ev").forEach(x=>x.classList.remove("ev")); (ids||[]).forEach(i=>document.querySelectorAll(`[data-s="${i}"]`).forEach(x=>x.classList.add("ev"))); }
const so=n=>String(n).padStart(2,"0");

/* ================= các loại khối ================= */
const R={};
R.html=b=>mk("div","",b.html);
R.hoithoai=(b,id)=>{ const d=mk("div",""); d.id=b.id||id; const ai=[]; b.luot.forEach(l=>{ if(!ai.includes(l[0])) ai.push(l[0]); });
  const coVn=b.luot.some(l=>l[2]);
  d.innerHTML=`<div class="row" style="margin-bottom:8px"><button class="btn">▶ Nghe cả bài</button>${coVn?'<button class="btn ghost">Xem nghĩa tiếng Việt</button>':""}</div>`;
  const ds=mk("div",""); d.appendChild(ds);
  b.luot.forEach(([w,s,vn],i)=>{ const l=mk("div","line"); l.dataset.s=`${b.tep}-${so(i+1)}`;
    l.innerHTML=`<button class="lplay" title="Nghe câu này">🔊</button><div class="who c${ai.indexOf(w)%5}">${E(w)}:</div><div class="say"><span class="en">${fmt(s)}</span>${vn?`<div class="vn">${E(vn)}</div>`:""}</div>`;
    l.querySelector(".lplay").onclick=async()=>{ l.classList.add("playing"); await play(`${b.tep}-${so(i+1)}.mp3`); l.classList.remove("playing"); };
    boc(l.querySelector(".en")); ds.appendChild(l); });
  const [all,vnb]=d.querySelectorAll(".row button"); let on=false;
  all.onclick=async()=>{ if(on){ on=false; player.pause(); all.textContent="▶ Nghe cả bài"; return; } on=true; all.textContent="⏸ Dừng";
    const ls=[...ds.children]; for(let i=0;i<ls.length&&on;i++){ ls[i].classList.add("playing"); await play(`${b.tep}-${so(i+1)}.mp3`); ls[i].classList.remove("playing"); await sleep(300); } on=false; all.textContent="▶ Nghe cả bài"; };
  if(vnb) vnb.onclick=()=>{ d.classList.toggle("showvn"); vnb.textContent=d.classList.contains("showvn")?"Ẩn nghĩa tiếng Việt":"Xem nghĩa tiếng Việt"; };
  return d; };
R.nghe=(b,id)=>{ /* bài nghe: nghe cả bài trước, lời bài nghe ẩn – làm xong mới bấm xem (thêm 20/10/2026) */
  const d=mk("div",""); d.innerHTML=`<div class="row" style="margin-bottom:8px"><button class="btn">▶ Nghe bài</button><button class="btn ghost">📜 Xem lời bài nghe</button></div>`;
  const hd=R.hoithoai(b,id); hd.style.display="none"; d.appendChild(hd); const [nb,xb]=d.querySelectorAll(".row button"); let on=false;
  nb.onclick=async()=>{ if(on){ on=false; player.pause(); nb.textContent="▶ Nghe bài"; return; } on=true; nb.textContent="⏸ Dừng"; await play(`${b.tep}-full.mp3`); on=false; nb.textContent="▶ Nghe lại"; };
  xb.onclick=()=>{ const mo=hd.style.display==="none"; hd.style.display=mo?"":"none"; xb.textContent=mo?"🙈 Ẩn lời bài nghe":"📜 Xem lời bài nghe"; };
  return d; };
R.baidoc=(b,id)=>{ const d=mk("div",""); d.id=b.id||id; let n=0;
  b.doan.forEach(dn=>{ const p=mk("div","sub-card"); const ids=[];
    const html=dn.cau.map(s=>{ n++; const k=`${b.tep}-${so(n)}`; ids.push(k); return `<span class="s" data-s="${k}">${fmt(E(s))}</span>`; }).join(" ");
    p.innerHTML=`${dn.anh?`<img src="anh/${dn.anh}" alt="" style="width:100%;max-height:200px;object-fit:cover;border-radius:10px;margin-bottom:6px">`:""}<div class="row" style="justify-content:space-between"><b style="color:#123a7a;font-size:18px">${E(dn.tieu||"")}</b><button class="loa" title="Nghe cả đoạn">🔊</button></div><div class="tx" style="font-size:17px;line-height:1.8">${html}</div>${dn.vn?`<div class="vn">${E(dn.vn)}</div>`:""}`;
    p.querySelector(".loa").onclick=async()=>{ for(const k of ids){ const s=p.querySelector(`[data-s="${k}"]`); s.classList.add("ev"); await play(k+".mp3"); s.classList.remove("ev"); } };
    boc(p.querySelector(".tx")); d.appendChild(p); });
  if(b.doan.some(x=>x.vn)){ const v=mk("button","btn ghost","Xem nghĩa tiếng Việt"); v.style.marginTop="8px"; v.onclick=()=>{ d.classList.toggle("showvn"); v.textContent=d.classList.contains("showvn")?"Ẩn nghĩa":"Xem nghĩa tiếng Việt"; }; d.appendChild(v); }
  return d; };
R.tuvung=b=>{ const g=mk("div","vg"); b.the.forEach(([w,ipa,vi,vd,anh])=>{ const c=mk("div","vw");
    c.innerHTML=`${anh?`<img src="anh/${anh}" alt="">`:'<button class="loa">🔊</button>'}<div><b>${E(w)}</b> <span class="ipa">${E(ipa||"")}</span><div class="vi">${E(vi||"")}</div>${vd?`<div class="vd">${E(vd)}</div>`:""}</div>`;
    c.onclick=e=>{ if(!e.target.closest(".tu")) play(cum(w)); }; g.appendChild(c); }); return g; };
R.chon=b=>{ const d=mk("div",""), ds=mk("div",""); d.appendChild(ds); const nut=hangNut(); if(!b.nhanh) d.appendChild(nut);
  const L=b.chu===false?null:"ABCDEF"; if(b.ma) DIEM.push({ma:b.ma,ten:b.ten,tong:b.cau.length});
  const ve=()=>{ ds.innerHTML=""; let lam=0,dung=0; b.cau.forEach((q,i)=>{ const c=mk("div","cq");
      c.innerHTML=`<div class="qt"><b>${i+1}.</b> ${q.w?`<button class="mini" data-cum="${E(q.w)}" title="Nghe phát âm">🔊</button> `:""}${q.anh?`<img src="anh/${q.anh}" alt="">`:""}<span class="qs">${fmt(q.h).replace(/_{3,}/g,"<b>________</b>")}</span>${q.nghe?` <button class="mini" data-cau="${q.nghe}">🔊</button>`:""}</div><div class="opts ${b.doc?"doc":""}"></div><div class="fb"></div>`;
      boc(c.querySelector(".qs"));
      q.c.forEach((o,j)=>{ const bt=mk("button","opt",(L?L[j]+". ":"")+E(o));
        bt.onclick=()=>{ if(c.dataset.lock) return;
          if(b.nhanh){ c.dataset.lock=1; const ok=j===q.d; lam++; if(ok) dung++; else SL(`${b.ma}-${i+1}`); bt.classList.add(ok?"right":"wrong"); if(!ok) c.querySelectorAll(".opt")[q.d].classList.add("right");
            phanHoi(c.querySelector(".fb"),ok,ok?"":(L?L[q.d]+". ":"")+E(q.c[q.d]),q.g,q.a); if(b.ma){ st[b.ma]=Math.max(st[b.ma]||0,dung); save(); } return; }
          c.dataset.v=j; c.querySelectorAll(".opt").forEach(x=>x.classList.toggle("sel",x===bt)); };
        c.querySelector(".opts").appendChild(bt); });
      ds.appendChild(c); });
    nut.children[0].classList.remove("hide"); nut.children[1].classList.add("hide"); nut.children[2].textContent=""; };
  ve();
  nut.children[0].onclick=()=>{ const cs=[...ds.children]; if(cs.some(c=>c.dataset.v===undefined)){ showTip("Em chọn đáp án cho tất cả các câu rồi mới chấm nhé!"); return; }
    let s=0; cs.forEach((c,i)=>{ const q=b.cau[i], v=+c.dataset.v, ok=v===q.d; c.dataset.lock=1; if(ok) s++; else SL(`${b.ma}-${i+1}`);
      c.querySelectorAll(".opt").forEach((x,j)=>{ x.classList.remove("sel"); if(j===q.d) x.classList.add("right"); else if(j===v) x.classList.add("wrong"); });
      phanHoi(c.querySelector(".fb"),ok,(L?L[q.d]+". ":"")+E(q.c[q.d]),q.g,q.a); });
    toVang(b.cau.flatMap(q=>q.e||[]));
    st[b.ma]=Math.max(st[b.ma]||0,s); save(); nut.children[2].textContent=`Em đúng ${s}/${b.cau.length}`; nut.children[0].classList.add("hide"); if(s<b.cau.length) nut.children[1].classList.remove("hide"); };
  nut.children[1].onclick=()=>{ toVang([]); ve(); };
  return d; };
R.go=b=>{ const d=mk("div",""), ds=mk("div",""); d.appendChild(ds); const nut=hangNut(); d.appendChild(nut); DIEM.push({ma:b.ma,ten:b.ten,tong:b.cau.length});
  const ve=()=>{ ds.innerHTML=""; b.cau.forEach((q,i)=>{ const c=mk("div","cq"); const coGap=/_{3,}/.test(q.h);
      c.innerHTML=`<div class="qt"><b>${i+1}.</b> <span class="qs">${coGap?fmt(q.h).replace(/_{3,}/,'<input class="go" autocomplete="off" autocapitalize="off" spellcheck="false">'):fmt(q.h)}</span>${coGap?"":'<input class="go dai" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Câu trả lời của em">'}</div><div class="fb"></div>`;
      boc(c.querySelector(".qs")); ds.appendChild(c); });
    nut.children[0].classList.remove("hide"); nut.children[1].classList.add("hide"); nut.children[2].textContent=""; toVang([]); };
  ve();
  nut.children[0].onclick=()=>{ const ins=[...ds.querySelectorAll("input")]; if(ins.some(x=>!x.value.trim())){ showTip("Em điền hết các ô rồi mới chấm nhé!"); return; }
    let s=0; ins.forEach((x,i)=>{ const q=b.cau[i], v=chuan(x.value), qua=q.toi_da&&v.split(" ").length>q.toi_da;
      const ok=!qua&&(q.kt?new RegExp(q.kt,"i").test(v):q.d.map(chuan).includes(v)); x.readOnly=true; x.classList.add(ok?"right":"wrong"); if(ok) s++; else if(!q.kt) SL(`${b.ma}-${i+1}`);   // câu tự do (kt) không ghi Sổ lỗi
      const fb=x.closest(".cq").querySelector(".fb"); phanHoi(fb,ok,ok?"":(q.mau||q.d[0]),q.g,q.a); if(qua) fb.insertAdjacentHTML("afterbegin",`Em viết quá ${q.toi_da} từ. `); });
    toVang(b.cau.flatMap(q=>q.e||[]));
    st[b.ma]=Math.max(st[b.ma]||0,s); save(); nut.children[2].textContent=`Em đúng ${s}/${b.cau.length}`; nut.children[0].classList.add("hide"); if(s<b.cau.length) nut.children[1].classList.remove("hide"); };
  nut.children[1].onclick=ve; return d; };
R.dien=b=>{ const d=mk("div",""), box=mk("div","box"), ds=mk("div",b.doan?"doan":""); d.append(box,ds); const nut=hangNut(); d.appendChild(nut); DIEM.push({ma:b.ma,ten:b.ten,tong:b.cau.length});
  let on=null, lock=false;
  const sel=g=>{ ds.querySelectorAll(".gap").forEach(x=>x.classList.toggle("on",x===g)); on=g; };
  const bo=g=>{ const ci=g.dataset.ci; delete g.dataset.v; delete g.dataset.ci; g.innerHTML="&nbsp;"; if(ci!=null) box.children[ci].classList.remove("used"); };
  const ve=()=>{ box.innerHTML=""; ds.innerHTML=""; lock=false; box.style.position="";
    b.tu.forEach((w,ci)=>{ const c=mk("button","chip",E(w)); c.onclick=()=>{ if(lock||c.classList.contains("used")) return; const g=on||ds.querySelector(".gap:not([data-v])"); if(!g) return; if(g.dataset.v) bo(g);
        g.dataset.v=w; g.dataset.ci=ci; g.textContent=w; c.classList.add("used"); sel(ds.querySelector(".gap:not([data-v])")); }; box.appendChild(c); });
    b.cau.forEach((q,i)=>{ const c=mk(b.doan?"span":"div",b.doan?"":"cq");
      const h=fmt(q.h).replace(/_{3,}/,`${b.doan?`<b>(${i+1})</b>`:""}<button class="gap">&nbsp;</button>`);
      c.innerHTML=b.doan?h+" ":`<div class="qt"><b>${i+1}.</b> <span class="qs">${h}</span></div><div class="fb"></div>`;
      const g=c.querySelector(".gap"); g.onclick=e=>{ e.stopPropagation(); if(lock) return; if(g.dataset.v) bo(g); sel(g); }; ds.appendChild(c); });
    if(b.doan){ const f=mk("div",""); f.id=""; ds.appendChild(f); }
    sel(ds.querySelector(".gap")); nut.children[0].classList.remove("hide"); nut.children[1].classList.add("hide"); nut.children[2].textContent=""; d.querySelectorAll(".giaidoan").forEach(x=>x.remove()); };
  ve();
  nut.children[0].onclick=()=>{ const gs=[...ds.querySelectorAll(".gap")]; if(gs.some(g=>!g.dataset.v)){ showTip("Em điền hết các chỗ trống rồi mới chấm nhé!"); return; }
    lock=true; sel(null); box.style.position="static"; let s=0;
    gs.forEach((g,i)=>{ const q=b.cau[i], ok=chuan(g.dataset.v)===chuan(q.d); g.classList.add(ok?"right":"wrong"); if(ok) s++; else { SL(`${b.ma}-${i+1}`); g.textContent=q.d; }
      if(b.doan){ const f=mk("div","fb giaidoan"); phanHoi(f,ok,q.d,q.g,q.a); f.insertAdjacentHTML("afterbegin",`<b>(${i+1})</b> `); d.insertBefore(f,nut); }
      else phanHoi(g.closest(".cq").querySelector(".fb"),ok,q.d,q.g,q.a); });
    if(b.a_doan){ const f=mk("div","giaidoan"); f.appendChild(nutCau(b.a_doan)); d.insertBefore(f,nut); }
    st[b.ma]=Math.max(st[b.ma]||0,s); save(); nut.children[2].textContent=`Em đúng ${s}/${b.cau.length}`; nut.children[0].classList.add("hide"); if(s<b.cau.length) nut.children[1].classList.remove("hide"); };
  nut.children[1].onclick=ve; return d; };
R.noi=b=>{ const d=mk("div",""); DIEM.push({ma:b.ma,ten:b.ten,tong:b.trai.length});
  if(b.phai.some(p=>p[2])){ const g=mk("div","phai-anh"); b.phai.forEach(([l,t,a])=>g.appendChild(mk("figure","",`<img src="anh/${a}" alt=""><figcaption>${l}${t?". "+E(t):""}</figcaption>`))); d.appendChild(g); }
  else d.appendChild(mk("ul","phai",b.phai.map(([l,t])=>`<li><b>${l}.</b> ${fmt(E(t))}</li>`).join("")));
  const ds=mk("div",""); d.appendChild(ds); const nut=hangNut(); d.appendChild(nut);
  const ve=()=>{ ds.innerHTML=""; b.trai.forEach((t,i)=>{ const q=mk("div","mrow cq"); q.innerHTML=`<b style="min-width:160px">${i+1}. ${E(t)}</b><span class="opts" style="display:inline-flex;gap:6px;margin:0"></span><div class="fb"></div>`;
      b.phai.forEach(([l])=>{ const bt=mk("button","opt",l); bt.style.minWidth="auto"; bt.onclick=()=>{ if(q.dataset.lock) return; q.dataset.v=l; q.querySelectorAll(".opt").forEach(x=>x.classList.toggle("sel",x===bt)); }; q.querySelector(".opts").appendChild(bt); });
      if(b.am) q.querySelector("b").onclick=()=>play(cum(t)); ds.appendChild(q); });
    nut.children[0].classList.remove("hide"); nut.children[1].classList.add("hide"); nut.children[2].textContent=""; };
  ve();
  nut.children[0].onclick=()=>{ const qs=[...ds.children]; if(qs.some(q=>!q.dataset.v)){ showTip("Em nối hết rồi mới chấm nhé!"); return; }
    let s=0; qs.forEach((q,i)=>{ q.dataset.lock=1; const r=b.d[i], ok=q.dataset.v===r; if(ok) s++; else SL(`${b.ma}-${i+1}`);
      q.querySelectorAll(".opt").forEach(x=>{ x.classList.remove("sel"); if(x.textContent===r) x.classList.add("right"); else if(x.textContent===q.dataset.v) x.classList.add("wrong"); });
      const p=b.phai.find(x=>x[0]===r); phanHoi(q.querySelector(".fb"),ok,`${r}${p&&p[1]?" – "+E(p[1]):""}`,(b.g||[])[i],(b.a||[])[i]); });
    st[b.ma]=Math.max(st[b.ma]||0,s); save(); nut.children[2].textContent=`Em đúng ${s}/${b.trai.length}`; nut.children[0].classList.add("hide"); if(s<b.trai.length) nut.children[1].classList.remove("hide"); };
  nut.children[1].onclick=ve; return d; };
R.cot=b=>{ const d=mk("div",""), box=mk("div","box"), cs=mk("div","cols"); cs.style.setProperty("--n",b.cot.length); d.append(box,cs); const nut=hangNut(); d.appendChild(nut); const gi=mk("div",""); d.appendChild(gi);
  DIEM.push({ma:b.ma,ten:b.ten,tong:b.tu.length}); let selc=null, lock=false;
  const ve=()=>{ box.innerHTML=""; cs.innerHTML=""; gi.innerHTML=""; lock=false; selc=null;
    b.tu.forEach(([w],i)=>{ const c=mk("button","chip",E(w)); c.dataset.i=i; c.onclick=e=>{ e.stopPropagation(); if(lock) return; if(c.parentElement!==box){ box.appendChild(c); return; }
        box.querySelectorAll(".chip").forEach(x=>x.classList.toggle("sel",x===c&&selc!==c)); selc=selc===c?null:c; if(b.am!==false) play(cum(w)); }; box.appendChild(c); });
    b.cot.forEach((t,k)=>{ const col=mk("div","col",`<h4>${E(t)}</h4><div class="in"></div>`); col.dataset.k=k;
      col.onclick=()=>{ if(lock||!selc) return; selc.classList.remove("sel"); col.querySelector(".in").appendChild(selc); selc=null; }; cs.appendChild(col); });
    nut.children[0].classList.remove("hide"); nut.children[1].classList.add("hide"); nut.children[2].textContent=""; };
  ve();
  nut.children[0].onclick=()=>{ if(box.querySelector(".chip")){ showTip("Em xếp hết các từ vào cột rồi mới chấm nhé!"); return; } lock=true; let s=0;
    cs.querySelectorAll(".col").forEach(col=>col.querySelectorAll(".chip").forEach(c=>{ const i=+c.dataset.i, ok=b.tu[i][1]===+col.dataset.k; c.classList.add(ok?"right":"wrong"); if(ok) s++; else { SL(`${b.ma}-${i+1}`); c.title="Đúng là cột "+b.cot[b.tu[i][1]]; c.textContent+=" → "+b.cot[b.tu[i][1]]; } }));
    if(b.g){ const f=mk("div","fb ok"); f.style.cssText="display:block;background:#fff8e1;color:#5a4300"; f.innerHTML=giai(b.g)+" "; f.appendChild(nutGiai(b.g)); gi.appendChild(f); }
    st[b.ma]=Math.max(st[b.ma]||0,s); save(); nut.children[2].textContent=`Em xếp đúng ${s}/${b.tu.length}`; nut.children[0].classList.add("hide"); if(s<b.tu.length) nut.children[1].classList.remove("hide"); };
  nut.children[1].onclick=ve; return d; };
R.to=b=>{ const d=mk("div",""), pens=mk("div","pens"), ds=mk("div",""); d.append(pens,ds); const nut=hangNut(); d.appendChild(nut);
  let tong=0; b.cau.forEach(c=>tong+=Object.keys(c.d).length); DIEM.push({ma:b.ma,ten:b.ten,tong}); let pen=b.but[0][0], lock=false;
  b.but.forEach(([k,lab,mau],i)=>{ const p=mk("button","pen"+(i?"":" on"),E(lab)); p.style.color=mau; p.onclick=()=>{ pen=k; pens.querySelectorAll(".pen").forEach(x=>x.classList.toggle("on",x===p)); }; pens.appendChild(p); });
  const mau=k=>(b.but.find(x=>x[0]===k)||[])[2];
  const ve=()=>{ ds.innerHTML=""; lock=false; b.cau.forEach((c,i)=>{ const s=mk("div","sen");
      s.innerHTML=`<div class="row" style="justify-content:space-between"><b>Câu ${i+1}</b>${c.a?`<button class="mini" data-cau="${c.a}">🔊 Nghe câu</button>`:""}</div><div class="tx">${E(c.s).replace(/[A-Za-z']+/g,w=>`<span class="tw" data-w="${w.toLowerCase()}">${w}</span>`)}</div><div class="fb"></div>`;
      s.querySelectorAll(".tw").forEach(t=>t.onclick=()=>{ if(lock) return; const had=t.dataset.p===pen; delete t.dataset.p; t.style.cssText=""; if(!had){ t.dataset.p=pen; t.style.cssText=`color:${mau(pen)};text-decoration:underline;font-weight:700;background:#f6f8fc`; } });
      ds.appendChild(s); }); nut.children[0].classList.remove("hide"); nut.children[1].classList.add("hide"); nut.children[2].textContent=""; };
  ve();
  nut.children[0].onclick=()=>{ if(!ds.querySelector("[data-p]")){ showTip("Em tô các từ trước rồi mới chấm nhé!"); return; } lock=true; let s=0;
    [...ds.children].forEach((sn,i)=>{ const c=b.cau[i]; let du=true;
      sn.querySelectorAll(".tw").forEach(t=>{ const k=c.d[t.dataset.w], m=t.dataset.p; if(k){ if(m===k) s++; else { du=false; t.classList.add("miss"); t.dataset.p=k; t.style.cssText=`color:${mau(k)};text-decoration:underline;font-weight:700`; } } else if(m){ du=false; t.classList.add("bad"); } });
      if(!du) SL(`${b.ma}-${i+1}`); const fb=sn.querySelector(".fb"); fb.className="fb "+(du?"ok":"no");
      fb.innerHTML=(du?"All correct! ":"Not all correct – khung xanh nét đứt là từ em bỏ sót hoặc tô nhầm màu, khung đỏ là từ không có các âm này. ")+(c.g?giai(c.g)+" ":""); if(c.g) fb.appendChild(nutGiai(c.g)); });
    st[b.ma]=Math.max(st[b.ma]||0,s); save(); nut.children[2].textContent=`Em tô đúng ${s}/${tong} từ`; nut.children[0].classList.add("hide"); nut.children[1].classList.remove("hide"); };
  nut.children[1].onclick=ve; return d; };
R.loisai=b=>{ const d=mk("div",""), ds=mk("div",""); d.appendChild(ds); const nut=hangNut(); d.appendChild(nut); DIEM.push({ma:b.ma,ten:b.ten,tong:b.cau.length});
  const ve=()=>{ ds.innerHTML=""; b.cau.forEach((q,i)=>{ const c=mk("div","cq ls");
      c.innerHTML=`<div class="qt" style="line-height:2.3"><b>${i+1}.</b> ${q.p.map(([t,l])=>l?`<span class="u" data-l="${l}">${E(t)}<sub>${l}</sub></span>`:`<span class="seg">${E(t)}</span>`).join("")}</div><div class="row" style="margin-top:4px"><span class="mute" style="font-size:14px">Sửa thành:</span><input class="go" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="từ đúng"></div><div class="fb"></div>`;
      c.querySelectorAll(".u").forEach(u=>u.onclick=()=>{ if(c.dataset.lock) return; c.dataset.v=u.dataset.l; c.querySelectorAll(".u").forEach(x=>x.classList.toggle("on",x===u)); c.querySelector("input").focus(); });
      ds.appendChild(c); }); nut.children[0].classList.remove("hide"); nut.children[1].classList.add("hide"); nut.children[2].textContent=""; };
  ve();
  nut.children[0].onclick=()=>{ const cs=[...ds.children]; if(cs.some(c=>!c.dataset.v||!c.querySelector("input").value.trim())){ showTip("Mỗi câu em bấm chọn chỗ sai và gõ từ sửa rồi mới chấm nhé!"); return; }
    let s=0; cs.forEach((c,i)=>{ const q=b.cau[i], inp=c.querySelector("input"), okL=c.dataset.v===q.d, okS=q.sua.map(chuan).includes(chuan(inp.value)), ok=okL&&okS; c.dataset.lock=1; inp.readOnly=true;
      if(ok) s++; else SL(`${b.ma}-${i+1}`); c.querySelectorAll(".u").forEach(u=>{ u.classList.remove("on"); if(u.dataset.l===q.d) u.classList.add("right"); else if(u.dataset.l===c.dataset.v) u.classList.add("wrong"); }); inp.classList.add(okS?"right":"wrong");
      phanHoi(c.querySelector(".fb"),ok,`${q.d} → ${q.sua[0]}`,q.g,q.a); });
    st[b.ma]=Math.max(st[b.ma]||0,s); save(); nut.children[2].textContent=`Em đúng ${s}/${b.cau.length}`; nut.children[0].classList.add("hide"); if(s<b.cau.length) nut.children[1].classList.remove("hide"); };
  nut.children[1].onclick=ve; return d; };
R.tick=b=>{ const d=mk("div",""); const k="tk-"+(b.id||"x"); st[k]=st[k]||[];
  b.muc.forEach((m,i)=>{ const r=mk("div","tk"+(st[k].includes(i)?" on":""),`<div class="bx">${st[k].includes(i)?"✓":""}</div><span class="qs">${fmt(E(m))}</span>`); boc(r.querySelector(".qs"));
    r.querySelector(".bx").onclick=()=>{ const on=r.classList.toggle("on"); r.querySelector(".bx").textContent=on?"✓":""; st[k]=on?[...st[k],i]:st[k].filter(x=>x!==i); save(); }; d.appendChild(r); });
  if(b.them){ const t=mk("div","row",`<input class="go dai" style="flex:1;min-width:0" placeholder="${E(b.them)}"><button class="mini">Thêm</button>`); t.style.marginTop="8px"; const ls=mk("div","ngoai"); ls.style.marginTop="6px";
    const veT=()=>{ ls.innerHTML=(st[k+"t"]||[]).map(x=>`<span class="chip right">${E(x)}</span>`).join(""); };
    t.querySelector("button").onclick=()=>{ const v=t.querySelector("input").value.trim(); if(!v) return; st[k+"t"]=[...(st[k+"t"]||[]),v]; save(); t.querySelector("input").value=""; veT(); }; veT(); d.append(t,ls); }
  return d; };
R.viet=b=>{ const d=mk("div",""); const k="viet-"+b.ma;
  d.innerHTML=`${b.dan?`<div class="memo">${b.dan}</div>`:""}<textarea class="van" spellcheck="false" placeholder="${E(b.goi_y||"")}"></textarea><div class="dem"></div><ul class="ck"></ul>
   <div class="row"><button class="btn">👩‍🏫 Cô xem giúp</button>${b.mau?'<button class="btn ghost">📖 Xem bài mẫu</button>':""}<button class="mini">📋 Chép bài</button></div><div class="fb"></div>
   ${b.mau?`<div class="sub-card hide"><h3>Bài mẫu ${b.a_mau?`<button class="mini" data-cau="${b.a_mau}">🔊 Nghe</button>`:""}</h3><div class="mauvan">${E(b.mau)}</div></div>`:""}`;
  const ta=d.querySelector("textarea"), dem=d.querySelector(".dem"), ck=d.querySelector(".ck"), [xem,moMau,chep]=d.querySelectorAll(".row button"), fb=d.querySelector(".fb");
  ta.value=st[k]||b.khung||"";
  const soTu=s=>(s.match(/[A-Za-z0-9'’-]+/g)||[]).length;
  const kiem=s=>{ const n=soTu(s), cs=s.split(/(?<=[.!?])\s+/).map(x=>x.trim()).filter(Boolean);
    return {n, ck:[...(b.so?[[`${b.so[0]}–${b.so[1]} từ`,n>=b.so[0]&&n<=b.so[1]]]:[]), ...(b.can||[]).map(([r,t])=>[t,new RegExp(r,"i").test(s)]),
      ["Mỗi câu bắt đầu bằng chữ hoa",cs.length>0&&cs.every(x=>/^[A-Z0-9"“]/.test(x))],["Cuối bài có dấu chấm",/[.!?]\s*$/.test(s)||/(cheers|best wishes|love|regards|all the best|best|yours|yours sincerely|see you soon),?\s+[A-Z][A-Za-z ]{0,25}$/i.test(s.trim())]]}; };
  const veDem=()=>{ const r=kiem(ta.value); if(b.so){ dem.className="dem "+(r.n>=b.so[0]&&r.n<=b.so[1]?"ok":"no"); dem.textContent=`Số từ: ${r.n} / ${b.so[0]}–${b.so[1]}`; } else dem.textContent=`Số từ: ${r.n}`;
    ck.innerHTML=r.ck.map(([t,ok])=>`<li class="${ok?"ok":""}">${t}</li>`).join(""); };
  ta.oninput=()=>{ st[k]=ta.value; save(); veDem(); }; veDem();
  xem.onclick=()=>{ const s=ta.value.trim(); if(!s){ showTip("Em viết bài trước nhé!"); return; } const r=kiem(s), thieu=r.ck.filter(x=>!x[1]).map(x=>x[0]);
    const loi=(b.loi||[]).filter(([re])=>new RegExp(re,"i").test(s)).map(x=>x[1]); if(/\bi\b/.test(s)) loi.push("Chữ <b>I</b> (tôi) luôn viết hoa.");
    if(/\s,|,(?=[A-Za-z])/.test(s)) loi.push("Sau dấu phẩy có một dấu cách, trước dấu phẩy không có dấu cách.");
    st[k+"d"]=r.ck.filter(x=>x[1]).length+"/"+r.ck.length; save();
    fb.className="fb "+(loi.length||thieu.length?"no":"ok");
    fb.innerHTML=(loi.length||thieu.length)?"<b>Cô góp ý:</b><br>"+loi.map(x=>"• "+x).join("<br>")+(thieu.length?`<br>• Em còn thiếu: ${thieu.join(", ")}.`:"")+"<br>Em sửa xong bấm <b>Cô xem giúp</b> lần nữa nhé.":"🌟 Bài viết của em đủ ý, đúng yêu cầu. Giỏi lắm! Em đọc to bài của mình nhé."; };
  if(moMau&&b.mau) moMau.onclick=()=>{ const m=d.querySelector(".sub-card"); m.classList.remove("hide"); boc(m.querySelector(".mauvan")); };
  chep.onclick=()=>{ try{ navigator.clipboard.writeText(ta.value); showTip("Đã chép bài – em dán gửi cô nhé!"); }catch(e){ ta.select(); } };
  if(!moMau||!b.mau){} return d; };
R.khaosat=b=>{ const d=mk("div","ks"); const k="ks-"+(b.id||"x"); st[k]=st[k]||{}; const kq=mk("div","kq-ks hide");
  const veKq=()=>{ const a=Object.values(st[k]); if(a.length<b.cau.length) return; const n={}; a.forEach(x=>n[x]=(n[x]||0)+1); const best=Object.keys(n).sort((x,y)=>n[y]-n[x]); const top=n[best[0]]===n[best[1]]?"hoa":best[0];
    kq.classList.remove("hide"); kq.innerHTML=(b.kq[top]||b.kq.hoa||""); };
  b.cau.forEach((q,i)=>{ const r=mk("div","q",`<div><b>${i+1}.</b> <span class="qs">${fmt(E(q.h))}</span></div><div class="opts" style="display:flex;flex-direction:column;gap:6px;margin-top:6px"></div>`); boc(r.querySelector(".qs"));
    q.c.forEach((o,j)=>{ const L="AB"[j], bt=mk("button","opt"+(st[k][i]===L?" sel":""),`${L}. ${E(o)}`); bt.style.textAlign="left";
      bt.onclick=()=>{ st[k][i]=L; save(); r.querySelectorAll(".opt").forEach(x=>x.classList.toggle("sel",x===bt)); veKq(); }; r.querySelector(".opts").appendChild(bt); });
    d.appendChild(r); });
  d.appendChild(kq); veKq(); return d; };
R.vai=b=>{ const d=mk("div",""); const k="vai-"+(b.id||"x"); st[k]=st[k]||{};
  b.tinh_huong.forEach((x,i)=>{ const t=mk("div","tn"+(st[k][i]?" xong":""),`<h4 style="margin:0 0 6px">Tình huống ${i+1} ${st[k][i]?"✓":""}</h4><div class="sc">${x.t}</div><div class="row" style="margin-top:8px"><button class="btn">▶ Bắt đầu</button></div><div class="body"></div>`);
    const body=t.querySelector(".body");
    t.querySelector(".btn").onclick=async()=>{ body.innerHTML="";
      for(const [j,f] of (x.truoc||[]).entries()){ const l=(x.truoc_chu||[])[j]; body.insertAdjacentHTML("beforeend",`<div class="line playing"><div class="who c1">${E(l?l[0].replace("Co giao","Teacher"):"")}${l?":":""}</div><div class="say">${l?E(l[1]):"🔊"}</div></div>`); const ln=body.lastElementChild; boc(ln.querySelector(".say")); await play(f+".mp3"); ln.classList.remove("playing"); await sleep(200); }   // hiện lời bạn nói khi loa phát (Sếp dặn 20/10/2026)
      body.insertAdjacentHTML("beforeend",`<div class="line"><b style="color:#c4321a">Em nói:</b> <span class="mau" style="color:var(--mute);font-style:italic">………</span></div><div class="row"><button class="mini mic">🎤 Em nói</button><button class="mini">💡 Xem câu mẫu</button><button class="mini">Bỏ qua →</button><span class="kq" style="font-size:14px"></span></div>`);
      const [mic,goiy,bo]=body.querySelectorAll(".row button"), kq=body.querySelector(".kq"), mau=body.querySelector(".mau");
      goiy.onclick=()=>{ mau.textContent=x.em; mau.style.cssText="color:#123a7a;font-weight:600"; if(x.m) play(x.m+".mp3"); };
      const tiep=async()=>{ for(const [j,f] of (x.sau||[]).entries()){ const l=(x.sau_chu||[])[j]; if(l){ body.insertAdjacentHTML("beforeend",`<div class="line playing"><div class="who c1">${E(l[0].replace("Co giao","Teacher"))}:</div><div class="say">${E(l[1])}</div></div>`); boc(body.lastElementChild.querySelector(".say")); } await play(f+".mp3"); if(l) body.lastElementChild.classList.remove("playing"); await sleep(250); } st[k][i]=1; save(); t.classList.add("xong"); t.querySelector("h4").textContent=`Tình huống ${i+1} ✓`;
        body.insertAdjacentHTML("beforeend",`<div class="fb ok" style="display:block">✓ Xong! Câu mẫu: <b>${E(x.em)}</b> ${x.m?`<button class="mini" data-cau="${x.m}">🔊</button>`:""}</div>`); };
      mic.onclick=()=>{ BamTu.luyen(x.k,mic,kq); const ob=new MutationObserver(()=>{ if(kq.classList.contains("ok")){ ob.disconnect(); setTimeout(tiep,600); } }); ob.observe(kq,{attributes:true}); };
      bo.onclick=()=>{ if(mau.textContent==="………") mau.textContent=x.em; tiep(); }; };
    d.appendChild(t); }); return d; };
R.dongvai=b=>{ const d=mk("div",""); const ai=[]; b.luot.forEach(l=>{ if(!ai.includes(l[0])) ai.push(l[0]); });
  const roles=mk("div","roles"), sp=mk("div",""); d.append(roles,sp); let run=0; const SRx=window.SpeechRecognition||window.webkitSpeechRecognition;
  const ten=new RegExp("\\b("+ai.map(x=>x.toLowerCase().replace(/[^a-z]/g,"")).filter(Boolean).join("|")+")\\b","g");
  const norm=s=>s.toLowerCase().replace(ten," ").replace(/[^a-z' ]/g," ").split(/\s+/).filter(Boolean);
  ai.forEach((r,ri)=>{ const bt=mk("button","opt",`<span class="who c${ri%5}">${E(r)}</span>`); bt.onclick=async()=>{ roles.querySelectorAll(".opt").forEach(x=>x.classList.toggle("sel",x===bt)); const my=++run; sp.innerHTML="";
      for(let i=0;i<b.luot.length;i++){ if(my!==run) return; const [w,s]=b.luot[i], t=s.replace(/\{|\}|\[\[|\]\]/g,""); const l=mk("div","line",`<div class="who c${ai.indexOf(w)%5}">${E(w)}:</div><div class="say">${E(t)}</div>`); sp.appendChild(l); l.scrollIntoView({block:"center",behavior:"smooth"});
        if(w!==r){ l.classList.add("playing"); await play(`${b.tep}-${so(i+1)}.mp3`); l.classList.remove("playing"); await sleep(250); continue; }
        l.classList.add("playing"); await new Promise(done=>{ const box=mk("div","",`<div class="row"><button class="mini mic">🎤 Bấm rồi đọc</button><button class="mini">🔊 Nghe mẫu</button><button class="mini">Sang câu sau →</button></div><div style="font-size:14px" class="h"></div>`); l.after(box);
          const [mic,ex,nx]=box.querySelectorAll("button"), h=box.querySelector(".h"); ex.onclick=()=>play(`${b.tep}-${so(i+1)}.mp3`); nx.onclick=()=>{ box.remove(); done(); };
          if(!SRx){ mic.textContent="✓ Em đã đọc"; mic.onclick=()=>{ box.remove(); done(); }; return; }
          mic.onclick=()=>{ const rr=new SRx(); rr.lang="en-US"; rr.maxAlternatives=3; mic.disabled=true; mic.textContent="🎙 Đang nghe…";
            rr.onresult=e=>{ const alts=[...e.results[0]].map(a=>a.transcript), tt=norm(t), m=Math.max(...alts.map(a=>{ const hh=new Set(norm(a)); return tt.length?Math.round(100*tt.filter(x=>hh.has(x)).length/tt.length):100; }));
              h.innerHTML=`Máy nghe được: “${E(alts[0])}” – khớp <b>${m}%</b>`; if(m>=60){ h.style.color="var(--ok)"; setTimeout(()=>{ box.remove(); done(); },1200); } else { h.style.color="var(--bad)"; h.innerHTML+=" – em nghe mẫu rồi đọc lại nhé."; } };
            rr.onerror=()=>{ h.textContent="Máy chưa nghe rõ, em thử lại hoặc bấm Sang câu sau."; }; rr.onend=()=>{ mic.disabled=false; mic.textContent="🎤 Đọc lại"; }; try{ rr.start(); }catch(e){} }; });
        l.classList.remove("playing"); }
      if(my===run){ st["dv-"+b.tep]=1; save(); sp.insertAdjacentHTML("beforeend",`<div class="score">Em đã luyện xong vai ${E(r)}. Giỏi lắm!</div>`); } };
    roles.appendChild(bt); }); return d; };
R.bang=b=>{ const d=mk("div","bang wrap-tbl"); const ma=b.ma; let tong=0; b.hang.forEach(h=>h.forEach(c=>{ if(String(c).startsWith("=")) tong++; })); if(ma&&tong) DIEM.push({ma,ten:b.ten,tong});
  const k="bg-"+(b.id||ma||"x"); st[k]=st[k]||{};
  const tb=mk("table","tbl"); tb.innerHTML=`<tr>${b.cot.map(c=>`<th>${E(c)}</th>`).join("")}</tr>`+b.hang.map((h,r)=>`<tr>${h.map((c,ci)=>{ c=String(c); return c.startsWith("=")||c.startsWith("?")?`<td><input data-k="${r}-${ci}" data-d="${E(c.slice(1))}" value="${E(st[k][r+"-"+ci]||"")}" placeholder="${c.startsWith("?")?"…":""}"></td>`:`<td>${fmt(E(c))}</td>`; }).join("")}</tr>`).join("");
  d.appendChild(tb); tb.querySelectorAll("input").forEach(x=>x.oninput=()=>{ st[k][x.dataset.k]=x.value; save(); });
  if(tong){ const nut=hangNut(); d.appendChild(nut); const gi=mk("div",""); d.appendChild(gi);
    nut.children[0].onclick=()=>{ const ins=[...tb.querySelectorAll("input")].filter(x=>x.dataset.d&&!x.placeholder); if(ins.some(x=>!x.value.trim())){ showTip("Em điền hết các ô rồi mới chấm nhé!"); return; }
      let s=0,i=0; ins.forEach(x=>{ i++; const dap=x.dataset.d.split("|"), ok=dap.map(chuan).includes(chuan(x.value)); x.classList.add(ok?"right":"wrong"); if(ok) s++; else { SL(`${ma}-${i}`); x.insertAdjacentHTML("afterend",`<div class="dapan">→ ${E(dap[0])}</div>`); } });
      if(b.g){ const f=mk("div","fb ok"); f.style.cssText="display:block;background:#fff8e1;color:#5a4300"; f.innerHTML=giai(b.g)+" "; f.appendChild(nutGiai(b.g)); gi.appendChild(f); }
      st[ma]=Math.max(st[ma]||0,s); save(); nut.children[2].textContent=`Em đúng ${s}/${tong}`; nut.children[0].classList.add("hide"); }; }
  return d; };
R.nic=b=>{ const d=mk("div",""); st.nic=st.nic||{}; const t=mk("table","nic"); d.appendChild(t);
  b.muc.forEach(([en,vn,href,ten],i)=>{ const tr=mk("tr","",`<td><b>I can</b> ${E(en)}<br><span class="mute" style="font-size:14px">${E(vn)}</span><div class="gy"></div></td><td><div class="lv"><button data-l="1">✓</button><button data-l="2">✓✓</button><button data-l="3">✓✓✓</button></div></td>`);
    const gy=tr.querySelector(".gy"), upd=()=>{ tr.querySelectorAll("[data-l]").forEach(x=>x.classList.toggle("on",+x.dataset.l===st.nic[i])); gy.innerHTML=st.nic[i]===1&&href?`👉 Em nên ôn lại: <a href="${href}">${E(ten)}</a>`:""; };
    tr.querySelectorAll("[data-l]").forEach(x=>x.onclick=()=>{ st.nic[i]=+x.dataset.l; save(); upd(); }); upd(); t.appendChild(tr); });
  const n=window.SoLoi?SoLoi.soLoiConLai():0; d.appendChild(mk("div","memo",n?`📕 Sổ lỗi sai của em còn <b>${n}</b> câu cần sửa. <a href="${GOCW}on-tap/so-loi.html">Mở Sổ lỗi sai →</a>`:"📕 Sổ lỗi sai trống – giỏi lắm!")); return d; };
R.chonghe=b=>mk("div","",`<div class="cho"><div class="ic">🎧</div><b>Phần nghe đang được cô chuẩn bị.</b><br>${b.ghi||"Em làm các phần khác trước nhé, khi có bài nghe cô sẽ báo."}</div>${b.html||""}`);

/* ================= dựng trang ================= */
document.title=B.tieu_de_trang||document.title;
const hd=mk("header","",`<a href="${GOCW}index.html" style="float:right;color:#fff;text-decoration:none;font-size:14px">🏠 Trang chủ</a><div class="t1">${E(B.lop)} · GLOBAL SUCCESS · ${E(B.unit)}</div><div class="t2">${E(B.ten)}</div>`);
const nav=mk("nav","steps"); nav.id="steps"; const main=mk("main","");
const app=document.getElementById("app"); app.append(hd,nav,main);
const LAST=B.phan.length+1;
B.phan.forEach((p,pi)=>{ const n=pi+1, sec=mk("section","part"+(n>1?" hide":"")); sec.dataset.p=n; const card=mk("div","card"); sec.appendChild(card);
  card.appendChild(mk("h2","",E(p.tieu_de||p.ten)));
  if(LG.giang["p"+n]){ const g=mk("div","giang"); g.innerHTML=`<div class="gh"><span class="gt">👩‍🏫 Lời giảng của cô</span><button class="btn">▶ Nghe cô giảng</button><button class="btn ghost">Xem lời giảng</button></div><div class="gx">${LG.giang["p"+n]}</div>`;
    const [nghe,xem]=g.querySelectorAll("button"); let dang=false;
    nghe.onclick=async()=>{ if(dang){ player.pause(); dang=false; nghe.textContent="▶ Nghe cô giảng"; return; } dang=true; nghe.textContent="⏸ Dừng"; await play(`giang/p${n}.mp3`); dang=false; nghe.textContent="▶ Nghe cô giảng"; };
    xem.onclick=()=>{ g.classList.toggle("mo"); xem.textContent=g.classList.contains("mo")?"Ẩn lời giảng":"Xem lời giảng"; };
    g.querySelectorAll(".gx i").forEach(boc); card.appendChild(g); }
  (p.khoi||[]).forEach((b,bi)=>{ const wrap=(b.tieu||b.sgk||b.hd)?mk("div","sub-card"):mk("div","");
    if(b.tieu) wrap.appendChild(mk("h3","",b.tieu));
    if(b.sgk||b.hd) wrap.appendChild(mk("p","task",`${b.sgk?`<i>${E(b.sgk)}</i>`:""}${b.sgk&&b.hd?"<br>":""}${b.hd||""}`));
    if(!R[b.loai]){ wrap.appendChild(mk("div","loi","Thiếu loại khối: "+E(b.loai))); }
    else wrap.appendChild(R[b.loai](b,`k${n}-${bi}`));
    if(b.giai_nut) wrap.appendChild(mk("div","row",`<button class="btn" data-giai="${b.giai_nut}" style="margin-top:8px">👩‍🏫 Nghe cô giảng</button>`));
    card.appendChild(wrap); });
  sec.appendChild(mk("div","next",`<button class="btn" data-done="${n}">${n<B.phan.length?`Sang Phần ${n+1} →`:"Xem kết quả →"}</button>`));
  main.appendChild(sec); });
const kq=mk("section","part hide"); kq.dataset.p=LAST; kq.innerHTML=`<div class="card" style="text-align:center"><h2>Em đã học xong ${E(B.ten_ngan||B.ten)}!</h2><div class="big" id="total"></div></div><div class="card sum" id="sum"></div><div class="row" style="justify-content:center"><button class="btn ghost" id="restart">Học lại từ đầu</button><a class="btn" href="${GOCW}on-tap/index.html">🔥 Ôn tập mỗi ngày</a></div>`;
main.appendChild(kq);
// Mọi chữ tiếng Anh đều bấm được: 1 lần nghe từ, 2 lần xem họ từ (Sếp dặn 20/10/2026). boc() bỏ qua chữ đã bọc, nút bấm và phần tiếng Việt (.vn, .khong-boc).
main.querySelectorAll(".mute,.vi,.ipa").forEach(x=>x.classList.add("khong-boc"));
const bocHet=()=>main.querySelectorAll(".phai li,.phai-anh figcaption,.mrow > b,.doan,.cq .qs,.ls .seg,.bang td:first-child,.vd,.tn .sc,.sub-card li,.mauvan,main i").forEach(x=>boc(x));
bocHet(); new MutationObserver(()=>{ clearTimeout(window._bocT); window._bocT=setTimeout(bocHet,80); }).observe(main,{childList:true,subtree:true});
let cur=1;
const unlocked=p=>true;   // Sếp dặn: không cần làm xong vẫn được qua phần khác
function drawSteps(){ nav.innerHTML=""; [...B.phan.map((p,i)=>p.ten||`${i+1}`),"Kết quả"].forEach((t,i)=>{ const p=i+1, b=mk("button","",E(t)); if(p===cur) b.className="on"; else if(st.done[p]) b.className="done"; b.disabled=!unlocked(p); b.onclick=()=>go(p); nav.appendChild(b); }); }
function go(p){ cur=p; player.pause(); main.querySelectorAll(".part").forEach(s=>s.classList.toggle("hide",+s.dataset.p!==p)); drawSteps(); if(p===LAST) tong(); scrollTo(0,0); }
main.querySelectorAll("[data-done]").forEach(b=>b.onclick=()=>{ const p=+b.dataset.done; st.done[p]=true; save(); go(p+1); });
function tong(){ const rows=DIEM.filter(x=>x.ma), pct=rows.length?Math.round(rows.reduce((a,x)=>a+Math.min(st[x.ma]||0,x.tong)/x.tong,0)/rows.length*100):0;
  document.getElementById("total").textContent=pct+" điểm";
  document.getElementById("sum").innerHTML=rows.map(x=>`<div><span>${E(x.ten||x.ma)}</span><b>${st[x.ma]||0}/${x.tong}</b></div>`).join(""); }
document.getElementById("restart").onclick=()=>{ st={done:{}}; save(); location.reload(); };
go(1);
window.BaiTrang={go,st,play};
})();
