/* Trang PRACTICE – 20 dạng bài cho mỗi Unit (Sếp gửi 5 ảnh mẫu 26/10/2026). Khuôn dùng chung, viết một lần, mọi Unit dùng.
   Cần nạp trước: chung/hoc-tap.js (SoLoi – ghi câu sai vào Sổ lỗi) và practice.js của Unit (window.PRACTICE, do cong-cu/tao_practice.py dựng).
   Lưu: localStorage["<key>"] = {sao:{"1":3,…}, done:{"1":true,…}} – sao cao nhất mỗi dạng; done để trang chủ đếm "đã học".
   Chấm: Correct! / Incorrect – Answer: … kèm giải thích tiếng Việt (nhãn tiếng Anh theo Sếp dặn 20/10/2026). */
(function(){
const P=window.PRACTICE, KEY=P.key, app=document.getElementById("app");
const E=s=>String(s==null?"":s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const mk=(tag,cls,html)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };
const tron=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const sach=s=>String(s||"").replace(/<[^>]+>/g,"").replace(/&nbsp;/g," ").trim();
const DANG=[null,
 ["Xếp chữ cái thành từ","🔤"],["Phân loại","🗂️"],["Chọn từ khác loại","🧐"],["Giải ô chữ","🔲"],
 ["Nghe – viết chính tả","🎧"],["Nghe câu, chọn tranh","🖼️"],
 ["Phát âm khác (dạng đề thi)","👂"],["Trọng âm khác (dạng đề thi)","🎯"],["Luyện nói","🎤"],
 ["Trắc nghiệm ngữ pháp","✏️"],["Chia động từ","⌨️"],["Tìm lỗi sai","🔍"],["Viết lại câu","📝"],["Sắp xếp câu","🔡"],
 ["Điền từ vào đoạn văn","🧩"],["Đọc hiểu True / False","📖"],["Hoàn thành hội thoại","💬"],["Nối câu hỏi – câu trả lời","🔗"],
 ["Viết đoạn văn ngắn","✍️"],["Thử thách 60 giây","⏱️"]];
const MOTA={1:"Nhìn hình và nghĩa, bấm chữ cái ghép thành từ",2:"Xếp mỗi từ vào đúng nhóm",3:"Tìm 1 từ không cùng nhóm với 3 từ còn lại",4:"Giải hàng ngang để tìm từ khoá hàng dọc",
 5:"Nghe từ rồi gõ lại cho đúng",6:"Nghe cả câu rồi chọn bức tranh đúng",7:"Chọn từ có phần gạch chân đọc khác",8:"Chọn từ có trọng âm khác 3 từ còn lại",9:"Đọc to vào micro, máy nghe và chấm",
 10:"16 câu chọn đáp án, sai có giải thích",11:"Gõ đúng dạng của động từ trong ngoặc",12:"Bấm vào từ bị sai trong câu",13:"Đổi câu sang phủ định, câu hỏi…",14:"Bấm các từ để ghép thành câu đúng",
 15:"Chọn từ trong khung, điền vào chỗ trống",16:"Đọc đoạn văn ngắn, chọn True hoặc False",17:"Chọn câu phù hợp cho mỗi chỗ trống",18:"Ghép mỗi câu hỏi với câu trả lời đúng",
 19:"Viết 40–60 từ, có gợi ý và bài mẫu",20:"Chọn nghĩa đúng càng nhanh càng tốt"};
const NHOM=[["📘","Từ vựng",[1,2,3,4]],["🎧","Nghe",[5,6]],["🔊","Phát âm",[7,8,9]],["✏️","Ngữ pháp",[10,11,12,13,14]],["📖","Đọc – Giao tiếp",[15,16,17,18]],["✍️","Viết",[19]],["⏱️","Trò chơi",[20]]];

/* lưu sao */
let st={sao:{},done:{}}; try{ st=Object.assign(st,JSON.parse(localStorage.getItem(KEY)||"{}")); st.sao=st.sao||{}; st.done=st.done||{}; }catch(e){}
const luu=()=>{ try{ localStorage.setItem(KEY,JSON.stringify(st)); }catch(e){} };
const soSao=(d,t)=>{ const p=t?d/t:0; return p>=.9?3:p>=.7?2:p>=.5?1:0; };
const veSao=n=>"⭐".repeat(n)+'<span class="x">'+"⭐".repeat(3-n)+"</span>";
const ghiSai=id=>{ try{ window.SoLoi&&SoLoi.sai(KEY+":"+id); }catch(e){} };

/* giọng: tệp mp3 do công cụ dựng (P.am), thiếu thì máy tự đọc */
let cur=null;
function dung(){ try{ if(cur) cur.pause(); speechSynthesis.cancel(); }catch(e){} }
function doc(text,cham){ dung(); const k=sach(text).replace(/’/g,"'").toLowerCase().replace(/\s+/g," "); const f=(P.am||{})[k];
  if(f){ cur=new Audio(f); cur.playbackRate=cham?0.75:1; cur.play().catch(()=>{}); return; }
  try{ const u=new SpeechSynthesisUtterance(sach(text)); u.lang="en-GB"; u.rate=cham?0.7:0.9; const v=speechSynthesis.getVoices().find(x=>/en[-_]GB/i.test(x.lang))||speechSynthesis.getVoices().find(x=>/^en/i.test(x.lang)); if(v) u.voice=v; speechSynthesis.speak(u); }catch(e){} }
try{ speechSynthesis.getVoices(); }catch(e){}

/* so câu gõ: không phân biệt hoa thường, nháy cong, dấu phẩy, dấu cuối câu; nhận cả dạng viết tắt / viết đủ */
const TAT={"doesn't":"does not","don't":"do not","isn't":"is not","aren't":"are not","can't":"cannot","won't":"will not","it's":"it is","they're":"they are","i'm":"i am","he's":"he is","she's":"she is","what's":"what is","who's":"who is","we're":"we are","you're":"you are","that's":"that is","there's":"there is","i'll":"i will","didn't":"did not","wasn't":"was not","weren't":"were not","haven't":"have not","hasn't":"has not","hadn't":"had not","i've":"i have","we've":"we have","you've":"you have","they've":"they have","shouldn't":"should not","couldn't":"could not","we'll":"we will","you'll":"you will","they'll":"they will","he'll":"he will","she'll":"she will","it'll":"it will","mustn't":"must not","wouldn't":"would not","i'd":"i would"};
function chuan(s){ s=String(s||"").toLowerCase().replace(/[’‘`´]/g,"'").replace(/[“”]/g,'"').replace(/[.,!?;:"]/g," ").replace(/\s+/g," ").trim();
  return s.split(" ").map(w=>TAT[w]||w).join(" ").replace(/\bcan not\b/g,"cannot"); }
const khop=(s,ds)=>ds.some(d=>chuan(d)===chuan(s));

/* nhãn chấm */
/* bấm từ (chung/bam-tu.js): chỉ bọc vùng đọc – lời giải, đáp án, kết quả, bài đọc, bài mẫu (class "bt") – không bọc nút, chữ cái, ô chữ */
const VUNG_BAM=".fb,.giai,.chi-tiet,.mau,.bt";
const bocTu=el=>{ try{ if(el&&window.BamTu) BamTu.boc(el); }catch(e){} };
function theoDoiBam(r){ if(!window.BamTu||!window.MutationObserver) return;
  new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(nd=>{ if(nd.nodeType!==1||nd.classList.contains("tu")) return;
    if(nd.matches(VUNG_BAM)) bocTu(nd); else nd.querySelectorAll(VUNG_BAM).forEach(bocTu); }))).observe(r,{childList:true,subtree:true}); }
function fbHtml(ok,dap,giai){ return `<div class="fb ${ok?"ok":"no"}"><span class="kq">${ok?"✓ Correct!":"✗ Incorrect"}</span>${!ok&&dap!=null?` – Answer: <b${/<u>/.test(dap)?' class="khong-boc"':""}>${dap}</b>`:""}${giai?`<div class="giai">💡 ${giai}</div>`:""}</div>`; }

/* ---------- trang chủ Practice ---------- */
function veTrangChu(){
  dung(); document.title=`Unit ${P.unit} – Practice`;
  const nDone=Object.keys(st.done).filter(k=>+k>=1&&+k<=20).length, tongSao=Object.values(st.sao).reduce((a,b)=>a+(+b||0),0);
  app.innerHTML=`<header class="pt-top"><div class="tt"><div class="t1">${E(P.lop)} · UNIT ${E(P.unit)}: ${E((P.ten_unit||"").toUpperCase())}</div><div class="t2">Unit ${E(P.unit)} – Practice · Luyện tập 20 dạng bài</div></div><a class="pt-home" href="${E(P.trang_chu||"../../../index.html")}">🏠 Trang chủ</a></header>
  <main><p class="pt-intro">20 dạng bài chia theo kỹ năng. Mỗi dạng được tối đa 3 sao ⭐</p>
  <div class="pt-sum"><span>✅ Đã làm: <b>${nDone}</b>/20 dạng</span><span>⭐ Tổng sao: <b>${tongSao}</b>/60</span></div><div id="nh"></div></main>`;
  const nh=app.querySelector("#nh");
  NHOM.forEach(([ic,ten,ds])=>{ nh.appendChild(mk("div","pt-nhom",`<span>${ic}</span>${E(ten)}`)); const g=mk("div","pt-grid");
    ds.forEach(n=>{ const b=mk("button","pt-card",`<div class="pt-ic">${DANG[n][1]}</div><div class="pt-tx"><b>${n}. ${E(DANG[n][0])}</b><div class="ds">${E((P.mo_ta||{})[n]||MOTA[n])}</div></div><div class="pt-go"><span class="lb">Làm bài →</span><span class="sao" title="Sao cao nhất em đã đạt">${veSao(st.sao[n]||0)}</span></div>`);
      b.onclick=()=>{ location.hash="d"+n; }; g.appendChild(b); });
    nh.appendChild(g); });
}

/* ---------- khung một dạng bài ---------- */
let man=null;   // vùng làm bài hiện tại
function khung(n){
  dung(); document.title=`${n}. ${DANG[n][0]} – Unit ${P.unit} Practice`;
  app.innerHTML=`<header class="pt-top"><div class="tt"><div class="t1">UNIT ${E(P.unit)} – PRACTICE</div><div class="t2">${DANG[n][1]} ${n}. ${E(DANG[n][0])}</div></div><a class="pt-home" href="${E(P.trang_chu||"../../../index.html")}">🏠 Trang chủ</a></header>
  <main><div class="pt-bar"><button class="pt-back">← 20 dạng bài</button><span class="sao">Sao cao nhất: ${veSao(st.sao[n]||0)}</span></div>
  <div class="pt-prog"><div></div></div><div class="pt-dem"></div><div id="man"></div></main>`;
  app.querySelector(".pt-back").onclick=()=>{ location.hash=""; };
  man=app.querySelector("#man"); scrollTo(0,0); theoDoiBam(man);
}
const tienDo=(i,t,chu)=>{ const b=app.querySelector(".pt-prog div"); if(b) b.style.width=(t?Math.round(i/t*100):0)+"%"; const d=app.querySelector(".pt-dem"); if(d) d.textContent=chu||(t?`Câu ${Math.min(i+1,t)}/${t}`:""); };

/* kết thúc một dạng: điểm, sao, Làm lại */
function ketThuc(n,diem,tong,chiTiet,giu){
  const s=soSao(diem,tong); if(s>(st.sao[n]||0)) st.sao[n]=s; st.done[n]=true; luu(); tienDo(tong,tong,"Hoàn thành");
  const sh=app.querySelector(".pt-bar .sao"); if(sh) sh.innerHTML="Sao cao nhất: "+veSao(st.sao[n]||0);
  const khen=s===3?"Tuyệt vời! Em làm rất giỏi 🎉":s===2?"Giỏi lắm! Cố thêm chút nữa là được 3 sao nhé.":s===1?"Khá rồi! Em xem lại giải thích rồi làm lại nhé.":"Em đọc kỹ giải thích rồi làm lại để được sao nhé 💪";
  const c=mk("div","card kq-card",`<div style="font-weight:700;color:var(--mute)">KẾT QUẢ</div><div class="diem">${diem}/${tong}</div><div class="sao-to">${veSao(s)}</div><div class="loi-khen">${khen}</div>
    <div class="row"><button class="btn" data-a="lai">🔄 Làm lại</button><button class="btn ghost" data-a="ve">← 20 dạng bài</button>${n<20?`<button class="btn ghost" data-a="tiep">Dạng ${n+1} →</button>`:""}</div>${chiTiet?`<div class="chi-tiet">${chiTiet}</div>`:""}`);
  c.querySelector("[data-a=lai]").onclick=()=>moDang(n); c.querySelector("[data-a=ve]").onclick=()=>{ location.hash=""; };
  const t=c.querySelector("[data-a=tiep]"); if(t) t.onclick=()=>{ location.hash="d"+(n+1); };
  if(!giu) man.innerHTML=""; man.appendChild(c); setTimeout(()=>c.scrollIntoView({behavior:"smooth",block:"start"}),60);
}

/* chạy lần lượt từng câu (thứ tự xáo mỗi lần làm) */
function tungCau(n,ds,ve){
  const thuTu=tron(ds.map((x,i)=>i)); let i=0, dung_=0; const sai=[];
  const tiep=()=>{
    if(i>=thuTu.length){ ketThuc(n,dung_,thuTu.length,sai.length?"<b>Câu em làm chưa đúng:</b>"+sai.join(""):""); return; }
    tienDo(i,thuTu.length); man.innerHTML=""; const box=mk("div","card"); man.appendChild(box);
    const goc=thuTu[i]; let daXong=false;
    ve(ds[goc],box,(ok,ngay,tomTat)=>{ if(daXong) return; daXong=true;
      if(ok) dung_++; else { ghiSai(`${n}-${goc+1}`); if(tomTat) sai.push(`<div class="giai">${tomTat}</div>`); }
      if(ngay){ i++; tiep(); return; }
      const r=mk("div","right-row",`<button class="btn">${i+1<thuTu.length?"Câu tiếp →":"Xem kết quả →"}</button>`); box.appendChild(r);
      r.querySelector("button").onclick=()=>{ i++; tiep(); }; r.querySelector("button").focus({preventScroll:true});
      setTimeout(()=>r.scrollIntoView({behavior:"smooth",block:"nearest"}),50); }, goc);
  };
  tiep();
}

/* câu chọn phương án (dạng 3, 7, 8, 10) */
function cauChon(box,hoiHtml,c,d,giai,xong,opt){
  opt=opt||{}; box.insertAdjacentHTML("beforeend",hoiHtml);
  const ds=tron(c.map((x,i)=>i)), wrap=mk("div","opts"+(opt.g2?" g2":"")); box.appendChild(wrap); const btns=[];
  ds.forEach((ci,k)=>{ const b=mk("button","opt",`${opt.abc?`<span class="ab">${"ABCD"[k]}.</span> `:""}${c[ci]}`); btns.push([b,ci]); wrap.appendChild(b);
    b.onclick=()=>{ if(wrap.dataset.xong) return; wrap.dataset.xong=1; const ok=ci===d; b.classList.add(ok?"right":"wrong");
      btns.forEach(([bb,cc])=>{ if(cc===d) bb.classList.add("right"); });
      const dapTxt=(opt.abc?"ABCD"[ds.indexOf(d)]+". ":"")+c[d];
      box.insertAdjacentHTML("beforeend",fbHtml(ok,dapTxt,giai));
      if(opt.loa){ const r=mk("div","row"); r.style.marginTop="8px"; c.forEach(x=>{ const l=mk("button","loa nho","🔊 "+sach(x)); l.onclick=()=>doc(x); r.appendChild(l); }); box.appendChild(r); }
      xong(ok,false,`${opt.tom||sach(hoiHtml)} → <b>${sach(c[d])}</b>. ${giai}`); }; });
}

/* ô gõ (dạng 5, 11, 13) */
function cauGo(box,dapAn,giai,xong,tom,goiY){
  const w=mk("div","",`<input class="go" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="${E(goiY||"Gõ đáp án")}"><div class="right-row"><button class="btn">Kiểm tra</button></div>`);
  box.appendChild(w); const inp=w.querySelector("input"), kt=w.querySelector("button");
  const lam=()=>{ if(inp.readOnly||!inp.value.trim()) { inp.focus(); return; } inp.readOnly=true; kt.remove(); const ok=khop(inp.value,dapAn);
    inp.classList.add(ok?"right":"wrong"); box.insertAdjacentHTML("beforeend",fbHtml(ok,E(dapAn[0]),giai)); xong(ok,false,`${tom} → <b>${E(dapAn[0])}</b>. ${giai}`); };
  kt.onclick=lam; inp.onkeydown=e=>{ if(e.key==="Enter") lam(); }; setTimeout(()=>inp.focus({preventScroll:true}),120);
}

/* ===================== 20 DẠNG ===================== */
const D={};

/* 1. Xếp chữ cái thành từ */
D[1]=n=>tungCau(n,P.d1,(x,box,xong)=>{
  box.innerHTML=`${x.anh?`<img class="anh" src="${E(x.anh)}" alt="">`:""}<p class="hd">Nhìn hình và nghĩa, bấm các chữ cái để ghép thành từ tiếng Anh.</p><div class="hoi" style="text-align:center">${E(x.vi)}</div>`;
  const w=x.w.toLowerCase(); let ch=w.split(""), tr=tron(ch); for(let k=0;k<5&&tr.join("")===w&&w.length>1;k++) tr=tron(ch);
  const slots=mk("div","slots"), lets=mk("div","letters"); box.append(slots,lets);
  const dat=[]; const sl=ch.map(()=>{ const s=mk("div","slot"); slots.appendChild(s); return s; });
  const veO=()=>sl.forEach((s,k)=>{ s.textContent=dat[k]?dat[k][0]:""; s.classList.toggle("on",k===dat.length); });
  const btns=tr.map(c=>{ const b=mk("button","let",E(c)); lets.appendChild(b);
    b.onclick=()=>{ if(slots.dataset.xong) return; dat.push([c,b]); b.disabled=true; veO(); if(dat.length===ch.length) cham(); }; return b; });
  sl.forEach((s,k)=>s.onclick=()=>{ if(slots.dataset.xong||k>=dat.length) return; const [c,b]=dat.splice(k,1)[0]; b.disabled=false; veO(); });
  const xoa=mk("div","right-row",`<button class="btn ghost">⌫ Xoá chữ cuối</button>`); box.appendChild(xoa);
  xoa.querySelector("button").onclick=()=>{ if(slots.dataset.xong||!dat.length) return; const [c,b]=dat.pop(); b.disabled=false; veO(); };
  veO();
  function cham(){ slots.dataset.xong=1; xoa.remove(); const ok=dat.map(d=>d[0]).join("")===w; slots.classList.add(ok?"right":"wrong");
    btns.forEach(b=>b.disabled=true); doc(x.w);
    box.insertAdjacentHTML("beforeend",fbHtml(ok,E(x.w),x.g)); const l=mk("button","loa nho","🔊 Nghe lại"); l.onclick=()=>doc(x.w); box.appendChild(l);
    xong(ok,false,`${E(x.vi)} → <b>${E(x.w)}</b>. ${x.g}`); }
});

/* 2. Phân loại */
D[2]=n=>{
  const nhom=P.d2.nhom, tat=[]; nhom.forEach((g,gi)=>g.tu.forEach((t,ti)=>tat.push({w:t[0],g:t[1],nhom:gi,id:tat.length})));
  tienDo(0,1,`${tat.length} từ · ${nhom.length} nhóm`);
  const box=mk("div","card"); man.appendChild(box);
  box.innerHTML=`<p class="hd">Bấm một từ (từ đổi màu vàng), rồi bấm vào nhóm đúng của từ đó. Bấm lại từ trong nhóm để đưa ra ngoài.</p>`;
  const pool=mk("div","pool dinh"); box.appendChild(pool); const boxes=nhom.map((g,gi)=>{ const b=mk("div","nhom-box",`<h4>${E(g.ten)}</h4><div class="in"></div>`); b.dataset.g=gi; box.appendChild(b); return b; });
  const kt=mk("div","right-row",`<button class="btn" disabled>Kiểm tra</button>`); box.appendChild(kt); const btK=kt.querySelector("button");
  let chon=null; const viTri={};
  const chips=tron(tat).map(t=>{ const c=mk("button","chip",E(t.w)); c.onclick=e=>{ e.stopPropagation(); if(box.dataset.xong) return;
      if(viTri[t.id]!=null){ delete viTri[t.id]; pool.appendChild(c); c.classList.remove("sel"); chon=null; capNhat(); return; }
      chon=chon===t?null:t; chips.forEach(([cc])=>cc.classList.remove("sel")); if(chon) c.classList.add("sel"); boxes.forEach(b=>b.classList.toggle("cho",!!chon)); };
    pool.appendChild(c); return [c,t]; });
  boxes.forEach(b=>b.onclick=()=>{ if(!chon||box.dataset.xong) return; const c=chips.find(([cc,t])=>t===chon)[0]; viTri[chon.id]=+b.dataset.g; b.querySelector(".in").appendChild(c); c.classList.remove("sel"); chon=null; boxes.forEach(x=>x.classList.remove("cho")); capNhat(); });
  function capNhat(){ btK.disabled=Object.keys(viTri).length<tat.length; if(!pool.children.length) pool.innerHTML='<span class="vi">Đã xếp hết – bấm Kiểm tra.</span>'; else pool.querySelectorAll("span.vi").forEach(s=>s.remove()); }
  btK.onclick=()=>{ box.dataset.xong=1; kt.remove(); let d=0; const ct=[];
    chips.forEach(([c,t])=>{ const ok=viTri[t.id]===t.nhom; c.classList.add(ok?"right":"wrong"); if(ok) d++; else { ghiSai(`2-${t.id+1}`); ct.push(`<div class="giai">✗ <b>${E(t.w)}</b> → nhóm <b>${E(nhom[t.nhom].ten)}</b>. ${E(t.g)}</div>`); } });
    const tatCa=nhom.map(g=>`<div class="giai"><b>${E(g.ten)}</b><br>${g.tu.map(t=>`• ${E(t[1])}`).join("<br>")}</div>`).join("");
    ketThuc(n,d,tat.length,(ct.length?`<b>Từ em xếp chưa đúng:</b>${ct.join("")}`:"")+`<details style="margin-top:10px"><summary><b>Xem giải thích cả 3 nhóm</b></summary>${tatCa}</details>`,true); };
};

/* 3. Chọn từ khác loại */
D[3]=n=>tungCau(n,P.d3,(x,box,xong)=>cauChon(box,`<p class="hd">Chọn từ <b>khác loại</b> với 3 từ còn lại.</p>`,x.c,x.d,x.g,xong,{abc:true,tom:x.c.join(", ")}));

/* 4. Giải ô chữ */
D[4]=n=>{
  const O=P.d4, H=O.hang, maxK=Math.max(...H.map(h=>h.k)), cot=Math.max(...H.map(h=>maxK-h.k+h.w.length));
  tienDo(0,1,`${H.length} hàng ngang + 1 từ khoá`);
  const box=mk("div","card"); man.appendChild(box);
  box.innerHTML=`<p class="hd">Đọc gợi ý, gõ từ cho từng hàng ngang. Các chữ ở <b>cột vàng</b> ghép lại thành từ khoá hàng dọc.</p>`;
  const oc=mk("div","oc"); box.appendChild(oc);
  const rong=Math.min(38,Math.floor((Math.min(innerWidth,980)-44)/cot)-3); oc.style.setProperty("--c",Math.max(22,rong)+"px");
  const hang=H.map((h,i)=>{ const r=mk("div","oc-r",`<span class="oc-n">${i+1}</span>`); const off=maxK-h.k; const cells=[];
    for(let c=0;c<cot;c++){ const inW=c>=off&&c<off+h.w.length; const e=mk("div","oc-c"+(inW?"":" trong")+(c===maxK?" khoa":"")); r.appendChild(e); if(inW) cells.push(e); }
    oc.appendChild(r); return {r,cells}; });
  const qs=H.map((h,i)=>{ const q=mk("div","oc-q",`<div class="gq"><b>${i+1}.</b> ${E(h.goi)} <span class="vi">(${h.w.length} chữ)</span></div><input class="go" maxlength="${h.w.length}" autocomplete="off" autocapitalize="characters" spellcheck="false">`);
    box.appendChild(q); const inp=q.querySelector("input"); inp.oninput=()=>{ const v=inp.value.replace(/[^A-Za-z]/g,"").toUpperCase(); inp.value=v; hang[i].cells.forEach((c,k)=>c.textContent=v[k]||""); }; return {q,inp}; });
  const kq=mk("div","oc-q",`<div class="gq">🔑 <b>Từ khoá hàng dọc:</b> ${E(O.goi_khoa||"")} <span class="vi">(${O.khoa.length} chữ)</span></div><input class="go" maxlength="${O.khoa.length}" autocomplete="off" autocapitalize="characters" spellcheck="false">`);
  box.appendChild(kq); const ik=kq.querySelector("input"); ik.oninput=()=>{ ik.value=ik.value.replace(/[^A-Za-z]/g,"").toUpperCase(); };
  const kt=mk("div","right-row",`<button class="btn">Kiểm tra</button>`); box.appendChild(kt);
  kt.querySelector("button").onclick=()=>{
    if(qs.some(q=>!q.inp.value)||!ik.value){ if(!confirm("Em còn ô chưa điền. Vẫn kiểm tra chứ?")) return; }
    kt.remove(); let d=0; const ct=[];
    H.forEach((h,i)=>{ const ok=qs[i].inp.value.toUpperCase()===h.w.toUpperCase(); qs[i].inp.readOnly=true; qs[i].inp.classList.add(ok?"right":"wrong"); hang[i].r.classList.add(ok?"right":"wrong");
      if(ok) d++; else { ghiSai(`4-${i+1}`); hang[i].cells.forEach((c,k)=>c.textContent=h.w[k]); }
      qs[i].q.insertAdjacentHTML("beforeend",fbHtml(ok,E(h.w),h.g)); });
    const okK=ik.value.toUpperCase()===O.khoa.toUpperCase(); ik.readOnly=true; ik.classList.add(okK?"right":"wrong"); if(okK) d++; else ghiSai("4-khoa");
    kq.insertAdjacentHTML("beforeend",fbHtml(okK,E(O.khoa),O.g_khoa||""));
    ketThuc(n,d,H.length+1,"",true); };
};

/* 5. Nghe – viết chính tả */
D[5]=n=>tungCau(n,P.d5,(x,box,xong)=>{
  box.innerHTML=`<p class="hd">Bấm 🔊 nghe từ, rồi gõ lại từ em nghe được.</p><div class="row" style="justify-content:center;margin:8px 0 14px"><button class="loa">🔊 Nghe</button><button class="loa">🐢 Nghe chậm</button></div>`;
  const [l1,l2]=box.querySelectorAll(".loa"); l1.onclick=()=>doc(x.w); l2.onclick=()=>doc(x.w,true); setTimeout(()=>doc(x.w),300);
  cauGo(box,[x.w],`${E(x.w)} = ${E(x.vi)}. ${x.g}`,xong,"Từ em nghe","Gõ từ em nghe được");
});

/* 6. Nghe câu, chọn tranh */
D[6]=n=>tungCau(n,P.d6,(x,box,xong)=>{
  box.innerHTML=`<p class="hd">Bấm 🔊 nghe cả câu, rồi chọn bức tranh đúng.</p><div class="row" style="justify-content:center;margin:6px 0 12px"><button class="loa">🔊 Nghe câu</button><button class="loa">🐢 Nghe chậm</button></div>`;
  const [l1,l2]=box.querySelectorAll(".loa"); l1.onclick=()=>doc(x.s); l2.onclick=()=>doc(x.s,true); setTimeout(()=>doc(x.s),300);
  const g=mk("div","imgs"); box.appendChild(g); const ds=tron(x.c.map((a,i)=>i)); const bt=[];
  ds.forEach(ci=>{ const b=mk("button","img-opt",`<img src="${E(x.c[ci])}" alt="Tranh ${ci+1}">`); bt.push([b,ci]); g.appendChild(b);
    b.onclick=()=>{ if(g.dataset.xong) return; g.dataset.xong=1; const ok=ci===x.d; b.classList.add(ok?"right":"wrong"); bt.forEach(([bb,cc])=>{ if(cc===x.d) bb.classList.add("right"); });
      box.insertAdjacentHTML("beforeend",fbHtml(ok,"tranh viền xanh",`Câu nghe: <i>${E(x.s)}</i><br>${x.g}`)); xong(ok,false,`<i>${E(x.s)}</i> – ${x.g}`); }; });
});

/* 7. Phát âm khác  ·  8. Trọng âm khác (dạng đề thi, A–D) */
D[7]=n=>tungCau(n,P.d7,(x,box,xong)=>cauChon(box,`<p class="hd">Choose the word whose underlined part is pronounced differently from the others.<br><span class="vi">Chọn từ có phần gạch chân phát âm khác.</span></p>`,x.c,x.d,x.g,xong,{abc:true,loa:true,tom:x.c.join(", ")}));
D[8]=n=>tungCau(n,P.d8,(x,box,xong)=>cauChon(box,`<p class="hd">Choose the word that differs from the other three in the position of primary stress.<br><span class="vi">Chọn từ có trọng âm chính khác 3 từ còn lại.</span></p>`,x.c,x.d,x.g,xong,{abc:true,loa:true,tom:x.c.join(", ")}));

/* 9. Luyện nói: máy nghe (SpeechRecognition) và chấm; máy không nghe được thì ghi âm rồi phát lại để em tự so */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition; let hongSR=!SR;
const tuCua=s=>chuan(s).split(" ").filter(Boolean);
function phanTram(mau,nghe){ const a=tuCua(mau), b=tuCua(nghe); if(!a.length) return 0; const con=b.slice(); let k=0;
  a.forEach(w=>{ const j=con.indexOf(w); if(j>=0){ k++; con.splice(j,1); } }); return Math.round(k/a.length*100); }
D[9]=n=>tungCau(n,P.d9,(x,box,xong)=>{
  box.innerHTML=`<p class="hd">Bấm 🔊 nghe mẫu, rồi bấm 🎤 và đọc to. Máy nghe được ≥ 70% là đạt.</p><div class="noi">${E(x.s)}</div><div class="noi-vi">${E(x.vi||"")}</div>
   <div class="row" style="justify-content:center"><button class="loa">🔊 Nghe mẫu</button><button class="btn mic">🎤 Bấm rồi đọc</button></div><div class="nghe-duoc"></div><div class="kq9"></div>
   <div class="right-row"><button class="btn ghost bo">Bỏ qua →</button></div>`;
  const [loa]=box.querySelectorAll(".loa"), mic=box.querySelector(".mic"), nd=box.querySelector(".nghe-duoc"), kq=box.querySelector(".kq9"), bo=box.querySelector(".bo");
  loa.onclick=()=>doc(x.s); setTimeout(()=>doc(x.s),300); let lan=0;
  bo.onclick=()=>{ bo.parentElement.remove(); xong(false,true,`<i>${E(x.s)}</i> – ${x.g}`); };
  const dat=()=>{ bo.parentElement.remove(); mic.disabled=true; kq.innerHTML=fbHtml(true,null,x.g); xong(true,false); };
  mic.onclick=()=>{
    if(!hongSR){ dung(); const r=new SR(); r.lang="en-US"; r.maxAlternatives=5; r.interimResults=false; mic.disabled=true; mic.textContent="🎙 Em đọc đi…"; let co=false;
      r.onresult=e=>{ co=true; const alts=[...e.results[0]].map(a=>a.transcript); let best=0, bt=alts[0]||""; alts.forEach(a=>{ const p=phanTram(x.s,a); if(p>best){ best=p; bt=a; } });
        nd.innerHTML=`Máy nghe được: “${E(bt)}” – khớp <b>${best}%</b>`; lan++;
        if(best>=70) dat(); else kq.innerHTML=fbHtml(false,E(x.s),`Em nghe mẫu rồi đọc lại nhé. ${x.g}`); };
      r.onerror=e=>{ co=true; if(["not-allowed","service-not-allowed","network","audio-capture"].includes(e.error)){ hongSR=true; nd.textContent="Máy chưa nghe được bằng giọng nói – chuyển sang ghi âm để em tự so."; setTimeout(ghiAm,150); } else nd.textContent="Máy chưa nghe thấy tiếng em, em đọc to hơn nhé."; };
      r.onend=()=>{ if(!mic.isConnected||hongSR) return; if(!kq.querySelector(".fb.ok")){ mic.disabled=false; mic.textContent="🎤 Đọc lại"; } if(!co) nd.textContent="Máy chưa nghe thấy tiếng em, em đọc to hơn nhé."; };
      try{ r.start(); }catch(e){ hongSR=true; mic.disabled=false; mic.click(); }
      return; }
    ghiAm();
  };
  async function ghiAm(){ let s; mic.disabled=true; mic.textContent="🎙 Đang mở micro…";
    try{ s=await Promise.race([navigator.mediaDevices.getUserMedia({audio:true}),new Promise((_,j)=>setTimeout(()=>j(new Error("cho-lau")),10000))]); }catch(e){ mic.disabled=false; mic.textContent="🎤 Thử lại"; nd.innerHTML="Máy chưa cho dùng micro. Em bấm biểu tượng ổ khoá cạnh địa chỉ web → cho phép <b>Micro</b>. Hoặc em tự đọc to rồi tự chấm."; tuCham(); return; }
    const ch=[], rec=new MediaRecorder(s); rec.ondataavailable=e=>ch.push(e.data); const giay=Math.min(7000,1800+tuCua(x.s).length*550);
    rec.onstop=()=>{ s.getTracks().forEach(t=>t.stop()); const a=new Audio(URL.createObjectURL(new Blob(ch,{type:rec.mimeType}))); mic.disabled=false; mic.textContent="🎤 Ghi âm lại"; nd.textContent="Nghe giọng em, rồi nghe giọng mẫu để so nhé."; a.onended=()=>setTimeout(()=>doc(x.s),300); a.play(); tuCham(); };
    mic.disabled=true; mic.textContent="🎙 Đang ghi âm…"; nd.textContent="Em đọc to: “"+x.s+"”"; rec.start(); setTimeout(()=>rec.stop(),giay); }
  function tuCham(){ if(box.querySelector(".tu-cham")) return; const r=mk("div","row tu-cham",`<button class="btn">✓ Em đọc giống mẫu</button><button class="btn ghost">Em đọc lại</button>`); r.style.cssText="justify-content:center;margin-top:10px"; kq.before(r);
    const [y,lai]=r.querySelectorAll("button"); y.onclick=()=>{ r.remove(); dat(); }; lai.onclick=()=>{ r.remove(); mic.click(); }; }
});

/* 10. Trắc nghiệm ngữ pháp */
D[10]=n=>tungCau(n,P.d10,(x,box,xong)=>cauChon(box,`<p class="hd">Chọn đáp án đúng.</p><div class="hoi">${x.h.replace(/_{3,}/g,'<b style="color:var(--xanh)">_____</b>')}</div>`,x.c,x.d,x.g,xong,{abc:true,tom:x.h}));

/* 11. Chia động từ */
D[11]=n=>tungCau(n,P.d11,(x,box,xong)=>{ box.innerHTML=`<p class="hd">Gõ dạng đúng của động từ trong ngoặc.</p><div class="hoi">${E(x.h).replace(/_{3,}/g,'<b style="color:var(--xanh)">_____</b>')}</div>`; cauGo(box,x.d,x.g,xong,E(x.h)); });

/* 12. Tìm lỗi sai */
D[12]=n=>tungCau(n,P.d12,(x,box,xong)=>{
  box.innerHTML=`<p class="hd">Bấm vào <b>một từ bị sai</b> trong câu.</p>`; const r=mk("div","row"); r.style.gap="8px"; box.appendChild(r);
  const bt=x.t.map((t,i)=>{ const b=mk("button","tok",E(t)); r.appendChild(b); b.onclick=()=>{ if(r.dataset.xong) return; r.dataset.xong=1; const ok=i===x.sai; b.classList.add(ok?"right":"wrong"); bt[x.sai].classList.add("right");
      box.insertAdjacentHTML("beforeend",fbHtml(ok,`${E(x.t[x.sai])} → ${E(x.sua)}`,x.g)); xong(ok,false,`${E(x.t.join(" "))} → sửa <b>${E(x.t[x.sai])} → ${E(x.sua)}</b>. ${x.g}`); }; return b; });
});

/* 13. Viết lại câu */
D[13]=n=>tungCau(n,P.d13,(x,box,xong)=>{ box.innerHTML=`<p class="hd">${x.yc}.</p><div class="hoi">${x.h}</div>`; cauGo(box,x.d,x.g,xong,`${x.yc}: ${x.h}`,"Gõ câu của em"); });

/* 14. Sắp xếp câu */
D[14]=n=>tungCau(n,P.d14,(x,box,xong)=>{
  const m=x.d.trim().match(/^(.*?)([.?!])?$/), than=m[1], cuoi=m[2]||""; const tok=than.split(/\s+/);
  let ds=tron(tok.map((t,i)=>i)); for(let k=0;k<5&&ds.every((v,i)=>v===i)&&tok.length>1;k++) ds=tron(ds);
  box.innerHTML=`<p class="hd">Bấm lần lượt các từ để ghép thành câu đúng. Bấm từ ở dòng trên để bỏ ra.</p>`;
  const ans=mk("div","ans"), pool=mk("div","pool"); box.append(ans,pool); const cu=mk("span","cuoi",E(cuoi)); ans.appendChild(cu);
  const da=[]; const kt=mk("div","right-row",`<button class="btn" disabled>Kiểm tra</button>`); box.appendChild(kt); const btK=kt.querySelector("button");
  ds.forEach(i=>{ const b=mk("button","tok",E(tok[i])); pool.appendChild(b);
    b.onclick=()=>{ if(ans.dataset.xong) return; if(b.parentElement===pool){ ans.insertBefore(b,cu); da.push(i); } else { pool.appendChild(b); da.splice([...ans.querySelectorAll(".tok")].indexOf(b)===-1?da.indexOf(i):da.indexOf(i),1); }
      btK.disabled=da.length<tok.length; }; });
  btK.onclick=()=>{ ans.dataset.xong=1; kt.remove(); const cau=[...ans.querySelectorAll(".tok")].map(b=>b.textContent).join(" ")+cuoi;
    const chuan=s=>s.replace(/[’‘]/g,"'").replace(/[.?!,]+/g," ").replace(/\s+/g," ").trim().toLowerCase();   // thứ tự đúng khác: không phân biệt hoa thường, dấu câu (27/10/2026)
    const ok=[x.d,...(x.khac||[])].some(d=>chuan(d)===chuan(cau)); ans.classList.add(ok?"right":"wrong"); doc(x.d);
    box.insertAdjacentHTML("beforeend",fbHtml(ok,E(x.d),x.g)); xong(ok,false,`<b>${E(x.d)}</b> – ${x.g}`); };
});

/* điền chỗ trống dùng chung cho dạng 15 (từ trong khung) và 17 (câu hội thoại) */
function dienTrong(box,veTrong,lua,dap,giai,xong,dai){
  const pool=mk("div","pool"+(dai?" dai":" dinh")); const gaps=[]; veTrong(i=>{ const g=mk("button","gap",`<span class="so">(${i+1})</span><span class="v">……</span>`); g.dataset.i=i; gaps[i]=g; return g; });
  box.insertBefore(pool,box.firstChild.nextSibling);
  // câu dài (hội thoại): khung câu chọn hiện ngay dưới lượt lời đang điền, không che bài trên điện thoại
  const datPool=()=>{ if(!dai) return; const l=on>=0&&gaps[on]?gaps[on].closest(".ht-l"):null; if(l) l.after(pool); };
  let on=0; const da={}; const chips=tron(lua.map((t,i)=>i)).map(li=>{ const c=mk("button","chip"+(dai?" dai":""),E(lua[li])); c.dataset.li=li; pool.appendChild(c); return c; });
  const veOn=()=>{ gaps.forEach((g,i)=>g.classList.toggle("on",i===on)); datPool(); };
  const conTrong=()=>{ const k=gaps.findIndex((g,i)=>da[i]==null); return k; };
  gaps.forEach((g,i)=>g.onclick=()=>{ if(box.dataset.xong) return; if(da[i]!=null){ chips[chips.findIndex(c=>+c.dataset.li===da[i])].classList.remove("used"); delete da[i]; g.querySelector(".v").textContent="……"; } on=i; veOn(); capNhat(); });
  chips.forEach(c=>c.onclick=()=>{ if(box.dataset.xong||c.classList.contains("used")) return; if(on<0) on=conTrong(); if(on<0) return;
    if(da[on]!=null) chips.find(x=>+x.dataset.li===da[on]).classList.remove("used");
    da[on]=+c.dataset.li; c.classList.add("used"); gaps[on].querySelector(".v").textContent=lua[da[on]]; on=conTrong(); veOn(); capNhat(); });
  const kt=mk("div","right-row",`<button class="btn" disabled>Kiểm tra</button>`); box.appendChild(kt); const btK=kt.querySelector("button");
  const capNhat=()=>{ btK.disabled=Object.keys(da).length<gaps.length; }; veOn();
  btK.onclick=()=>{ box.dataset.xong=1; kt.remove(); pool.remove(); let d=0; const ct=[];
    gaps.forEach((g,i)=>{ const ok=lua[da[i]]===lua[dap[i]]; g.classList.remove("on"); g.classList.add(ok?"right":"wrong"); if(ok) d++; else { g.querySelector(".v").innerHTML=`<s>${E(lua[da[i]])}</s> → ${E(lua[dap[i]])}`; }
      ct.push(`<div class="giai">${ok?"✓":"✗"} <b>(${i+1}) ${E(lua[dap[i]])}</b> – ${giai[i]}</div>`); });
    xong(d,gaps.length,`<b>Giải thích từng chỗ trống:</b>${ct.join("")}`,gaps.map((g,i)=>lua[da[i]]!==lua[dap[i]]?i:-1).filter(i=>i>=0)); };
}

/* 15. Điền từ vào đoạn văn */
D[15]=n=>{ const O=P.d15; tienDo(0,1,`${O.dap.length} chỗ trống`);
  const box=mk("div","card"); man.appendChild(box); box.innerHTML=`<p class="hd">Bấm chỗ trống (đang tô vàng), rồi bấm từ trong khung để điền. Bấm lại chỗ đã điền để đổi. Khung có ${O.tu.length-O.dap.length} từ thừa.</p>`;
  const lua=O.tu.slice(), dap=O.dap.map(w=>lua.indexOf(w));
  dienTrong(box,taoGap=>{ const p=mk("div","doan"); if(O.tieu) box.appendChild(mk("h3","",E(O.tieu)));
    O.doan.split(/(\{\d+\})/).forEach(part=>{ const m=part.match(/^\{(\d+)\}$/); if(m) p.appendChild(taoGap(+m[1]-1)); else p.appendChild(document.createTextNode(part)); }); box.appendChild(p); bocTu(p); },
    lua,dap,O.giai,(d,t,ct,sai)=>{ sai.forEach(i=>ghiSai(`15-${i+1}`)); ketThuc(n,d,t,ct,true); });
};

/* 16. Đọc hiểu True / False */
D[16]=n=>{ const O=P.d16, Q=tron(O.cau.map((q,i)=>i)); tienDo(0,Q.length,`${Q.length} câu`);
  const box=mk("div","card"); man.appendChild(box);
  box.innerHTML=`<p class="hd">Đọc đoạn văn, rồi chọn <b>True</b> (đúng với bài) hoặc <b>False</b> (sai với bài) cho mỗi câu.</p>${O.tieu?`<h3 style="margin:4px 0 8px">${E(O.tieu)}</h3>`:""}${O.anh?`<img class="anh" src="${E(O.anh)}" alt="">`:""}${O.doan.map(p=>`<p class="para bt">${E(p)}</p>`).join("")}`;
  let xongSo=0, d=0;
  Q.forEach((qi,k)=>{ const q=O.cau[qi]; const c=mk("div","tf",`<div class="q bt"><b>${k+1}.</b> ${E(q.h)}</div><div class="opts"><button class="opt">True</button><button class="opt">False</button></div>`); box.appendChild(c);
    const [t,f]=c.querySelectorAll(".opt"); [t,f].forEach((b,j)=>b.onclick=()=>{ if(c.dataset.xong) return; c.dataset.xong=1; const chon=j===0, ok=chon===q.d; b.classList.add(ok?"right":"wrong"); (q.d?t:f).classList.add("right");
      c.insertAdjacentHTML("beforeend",fbHtml(ok,q.d?"True":"False",q.g)); if(ok) d++; else ghiSai(`16-${qi+1}`); xongSo++; tienDo(xongSo,Q.length,`Đã làm ${xongSo}/${Q.length}`);
      if(xongSo===Q.length) ketThuc(n,d,Q.length,"",true); }); });
};

/* 17. Hoàn thành hội thoại */
D[17]=n=>{ const O=P.d17; tienDo(0,1,`${O.dap.length} chỗ trống`);
  const box=mk("div","card"); man.appendChild(box); box.innerHTML=`<p class="hd">${E(O.tieu||"")} Bấm chỗ trống, rồi bấm câu phù hợp trong khung (có ${O.lua.length-O.dap.length} câu thừa).</p>`;
  const ten=[...new Set(O.luot.map(l=>l[0]))];
  dienTrong(box,taoGap=>{ const ht=mk("div","ht"); O.luot.forEach(([ai,cau])=>{ const l=mk("div","ht-l",`<span class="ai${ten.indexOf(ai)%2?" b":""}">${E(ai)}:</span>`); const nd=mk("span","noi-dung");
      cau.split(/(\{\d+\})/).forEach(part=>{ const m=part.match(/^\{(\d+)\}$/); if(m) nd.appendChild(taoGap(+m[1]-1)); else if(part) nd.appendChild(document.createTextNode(part)); }); l.appendChild(nd); ht.appendChild(l); }); box.appendChild(ht); },
    O.lua,O.dap,O.giai,(d,t,ct,sai)=>{ sai.forEach(i=>ghiSai(`17-${i+1}`)); bocTu(box.querySelector(".ht")); ketThuc(n,d,t,ct,true); },true);
};

/* 18. Nối câu hỏi – câu trả lời */
D[18]=n=>{ const Q=P.d18, qo=tron(Q.map((q,i)=>i)), ao=tron(Q.map((q,i)=>i)), L="ABCDEFGHIJ"; tienDo(0,1,`${Q.length} cặp`);
  const box=mk("div","card"); man.appendChild(box);
  box.innerHTML=`<p class="hd">Đọc các câu trả lời A–${L[Q.length-1]}. Với mỗi câu hỏi, bấm chữ cái của câu trả lời đúng.</p><h4 style="margin:6px 0">Câu trả lời</h4><ul class="ds-a">${ao.map((ai,k)=>`<li><b>${L[k]}.</b>${E(Q[ai].a)}</li>`).join("")}</ul><h4 style="margin:6px 0">Câu hỏi</h4>`;
  const chon={}; const rows=qo.map((qi,k)=>{ const r=mk("div","noi-q",`<div class="q"><b>${k+1}.</b> ${E(Q[qi].q)}</div><div class="abc">${ao.map((a,j)=>`<button data-j="${j}">${L[j]}</button>`).join("")}</div>`); box.appendChild(r);
    r.querySelectorAll(".abc button").forEach(b=>b.onclick=()=>{ if(box.dataset.xong) return; r.querySelectorAll(".abc button").forEach(x=>x.classList.remove("sel")); b.classList.add("sel"); chon[qi]=+b.dataset.j;
      let c=r.querySelector(".da-chon"); if(!c){ c=mk("div","vi da-chon"); c.style.marginTop="6px"; r.appendChild(c); } c.innerHTML=`→ ${L[chon[qi]]}. ${E(Q[ao[chon[qi]]].a)}`; btK.disabled=Object.keys(chon).length<Q.length; }); return r; });
  const kt=mk("div","right-row",`<button class="btn" disabled>Kiểm tra</button>`); box.appendChild(kt); const btK=kt.querySelector("button");
  btK.onclick=()=>{ box.dataset.xong=1; kt.remove(); let d=0;
    qo.forEach((qi,k)=>{ const dung=ao.indexOf(qi), ok=chon[qi]===dung, r=rows[k]; const bs=r.querySelectorAll(".abc button"); bs[chon[qi]].classList.add(ok?"right":"wrong"); bs[dung].classList.add("right");
      if(ok) d++; else ghiSai(`18-${qi+1}`); r.insertAdjacentHTML("beforeend",fbHtml(ok,`${L[dung]}. ${E(Q[qi].a)}`,Q[qi].g)); });
    ketThuc(n,d,Q.length,"",true); };
};

/* 19. Viết đoạn văn ngắn – máy góp ý theo 5 tiêu chí */
D[19]=n=>{ const O=P.d19; tienDo(0,1,`${O.min}–${O.max} từ`);
  const box=mk("div","card"); man.appendChild(box);
  const nhapCu=(()=>{ try{ return localStorage.getItem(KEY+":viet")||""; }catch(e){ return ""; } })();
  box.innerHTML=`<div class="hoi bt" style="font-size:19px">${E(O.de)}</div><p class="hd">${E(O.de_vi||"")}</p>
   <details class="goi" open><summary>💡 Gợi ý (trả lời các câu hỏi này)</summary><ul class="bt" style="margin:8px 0 0;padding-left:20px">${O.goi.map(g=>`<li>${E(g)}</li>`).join("")}</ul>
   <div style="margin-top:8px;font-size:15px"><b>Từ nên dùng:</b> ${O.tu_khoa.map(E).join(", ")}<br><b>Ngữ pháp Unit:</b> ${O.ngu_phap.map(E).join(", ")}</div></details>
   <textarea class="go" placeholder="Em viết đoạn văn ở đây…" spellcheck="false" autocapitalize="sentences"></textarea><div class="dem-tu">0 từ</div>
   <div class="right-row"><button class="btn ghost xm">📄 Xem bài mẫu</button><button class="btn cb">Chấm bài</button></div><div class="kq19"></div><div class="mau19"></div>`;
  const ta=box.querySelector("textarea"), dem=box.querySelector(".dem-tu"); ta.value=nhapCu;
  const soTu=s=>(s.match(/[A-Za-z0-9'’]+/g)||[]).length;
  const capNhat=()=>{ const k=soTu(ta.value); dem.innerHTML=`<b>${k}</b> từ (cần ${O.min}–${O.max})`; dem.style.color=k>=O.min&&k<=O.max?"var(--ok)":"var(--mute)"; try{ localStorage.setItem(KEY+":viet",ta.value); }catch(e){} };
  ta.oninput=capNhat; capNhat();
  const mau=box.querySelector(".mau19"); box.querySelector(".xm").onclick=()=>{ mau.innerHTML=`<h4 style="margin:12px 0 4px">Bài mẫu</h4>`+O.mau.map((m,i)=>`<div class="mau"><b>Bài ${i+1}</b> <span class="vi">(${soTu(m)} từ)</span><br>${E(m)}</div>`).join(""); mau.scrollIntoView({behavior:"smooth",block:"nearest"}); };
  box.querySelector(".cb").onclick=()=>{ const s=ta.value.trim(); if(soTu(s)<5){ ta.focus(); return; }
    const k=soTu(s), low=" "+s.toLowerCase().replace(/[’]/g,"'").replace(/[^a-z' ]/g," ").replace(/\s+/g," ")+" ";
    const coTu=O.tu_khoa.filter(w=>new RegExp("\\b"+w.toLowerCase().replace(/ /g,"\\s+")+"(s|es)?\\b").test(low));
    const lowNP=" "+s.replace(/\b[A-Z][\w']* and [A-Z][\w']*/g," ").toLowerCase().replace(/[’]/g,"'").replace(/[^a-z' ]/g," ").replace(/\s+/g," ")+" ";   // "Tom and Jerry" là tên, không tính là dùng "and"
    const coNP=O.ngu_phap.filter(w=>lowNP.includes(" "+w.toLowerCase()+" "));
    const cau=s.split(/(?<=[.!?])\s+/).filter(x=>x.trim()); const hoa=cau.every(c=>/^[^A-Za-z]*[A-Z]/.test(c.trim())); const cham=/[.!?]["”']?$/.test(s);
    const tc=[[k>=O.min&&k<=O.max,`Độ dài: <b>${k}</b> từ`,k<O.min?`Em viết thêm ${O.min-k} từ nữa (trả lời thêm câu gợi ý).`:k>O.max?`Bài dài quá ${k-O.max} từ, em bớt câu lặp ý nhé.`:"Đúng độ dài yêu cầu."],
      [coTu.length>=3,`Từ vựng chủ đề: ${coTu.length?coTu.map(E).join(", "):"chưa có"}`,coTu.length>=3?"Em dùng tốt từ vựng của Unit.":`Em dùng ít nhất 3 từ chủ đề (${(O.tu_khoa||[]).slice(0,3).map(E).join(", ")}…).`],
      [coNP.length>=1,`Ngữ pháp Unit: ${coNP.length?coNP.map(E).join(", "):"chưa có"}`,coNP.length?"Em đã dùng ngữ pháp của Unit.":`Em thử dùng ${O.ngu_phap.map(E).join(", ")} trong bài.`],
      [hoa,"Viết hoa đầu câu",hoa?"Câu nào cũng viết hoa chữ cái đầu.":"Có câu chưa viết hoa chữ cái đầu – em sửa lại nhé."],
      [cham,"Dấu chấm cuối câu",cham?"Có dấu chấm cuối bài.":"Cuối câu cuối cùng cần dấu chấm (.)"]];
    const d=tc.filter(t=>t[0]).length;
    box.querySelector(".kq19").innerHTML=`<div class="fb ${d>=4?"ok":"no"}"><span class="kq">${d===5?"✓ Correct! Bài viết đạt đủ 5 tiêu chí.":`Máy góp ý: đạt ${d}/5 tiêu chí`}</span><ul class="tc">${tc.map(t=>`<li>${t[0]?"✅":"❌"} ${t[1]} – <span>${t[2]}</span></li>`).join("")}</ul></div><div class="giai">💡 Máy chỉ chấm hình thức. Em đọc lại xem ý đã rõ chưa, so với bài mẫu, và nhờ cô xem thêm nhé.</div>`;
    box.querySelector(".xm").click(); if(d<3) ghiSai("19-1");
    ketThuc(n,d,5,"",true); };
};

/* 20. Thử thách 60 giây */
D[20]=n=>{ const W=P.d20; tienDo(0,1,"60 giây");
  const box=mk("div","card"); man.appendChild(box);
  box.innerHTML=`<div style="text-align:center"><div style="font-size:56px">⏱️</div><p class="hoi">Chọn nghĩa đúng của ${W.length} từ trong 60 giây!</p><p class="hd">Mỗi câu đúng được 1 điểm. Hết giờ thì dừng.</p><button class="btn vang">▶ Bắt đầu</button></div>`;
  box.querySelector("button").onclick=()=>{
    const thuTu=tron(W.map((w,i)=>i)); let i=0, d=0, con=60; const sai=[];
    box.innerHTML=`<div class="dongho">60</div><div class="tu-to"></div><div class="opts g2"></div><div class="nhay"></div>`;
    const dh=box.querySelector(".dongho"), tu=box.querySelector(".tu-to"), op=box.querySelector(".opts"), nh=box.querySelector(".nhay");
    const t=setInterval(()=>{ con--; dh.textContent=con; dh.classList.toggle("gap-het",con<=10); if(con<=0) het(); },1000);
    const ve=()=>{ if(i>=thuTu.length) return het(); tienDo(i,thuTu.length,`Câu ${i+1}/${thuTu.length}`); const w=W[thuTu[i]];
      const khac=tron(W.filter(x=>x!==w&&x.vi!==w.vi).map(x=>x.vi)).slice(0,3), ds=tron([w.vi,...khac]);
      tu.textContent=w.w; op.innerHTML=""; ds.forEach(v=>{ const b=mk("button","opt",E(v)); op.appendChild(b);
        b.onclick=()=>{ if(op.dataset.k) return; op.dataset.k=1; const ok=v===w.vi; b.classList.add(ok?"right":"wrong");
          if(ok){ d++; nh.innerHTML='<span style="color:var(--ok)">✓ Correct!</span>'; } else { nh.innerHTML=`<span style="color:var(--bad)">✗ Incorrect – Answer: ${E(w.vi)}</span>`; ghiSai(`20-${thuTu[i]+1}`); sai.push(`<div class="giai">✗ <b>${E(w.w)}</b> nghĩa là <b>${E(w.vi)}</b> (em chọn: ${E(v)}).</div>`); }
          setTimeout(()=>{ op.dataset.k=""; i++; ve(); },ok?350:900); }; }); };
    let daHet=false; function het(){ if(daHet) return; daHet=true; clearInterval(t); op.innerHTML=""; tu.textContent=con<=0?"⏰ Hết giờ!":"🏁 Xong!";
      const conLai=thuTu.slice(i).map(k=>W[k]); const ct=(sai.length?`<b>Từ em chọn chưa đúng:</b>${sai.join("")}`:"")+(conLai.length?`<b>Từ chưa kịp làm:</b><div class="giai">${conLai.map(w=>`${E(w.w)} = ${E(w.vi)}`).join("<br>")}</div>`:"");
      ketThuc(n,d,W.length,ct,true); }
    ve(); window.__dung20=()=>{ daHet=true; clearInterval(t); };
  };
};

/* ---------- điều hướng (#d5 → dạng 5; nút Back của điện thoại quay về danh sách) ---------- */
function moDang(n){ if(window.__dung20){ window.__dung20(); window.__dung20=null; } khung(n); D[n](n); }
function route(){ const m=location.hash.match(/^#d(\d+)$/); const n=m?+m[1]:0; if(n>=1&&n<=20&&D[n]) moDang(n); else { if(window.__dung20){ window.__dung20(); window.__dung20=null; } veTrangChu(); } }
addEventListener("hashchange",route); route();
})();
