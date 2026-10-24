/* Học tập dùng chung (Sếp dặn 20/10/2026): Ôn tập mỗi ngày + Sổ lỗi sai – mục riêng, không chung vào phần SGK.
   - Bài học gọi SoLoi.ghi(id) khi em làm sai một câu có trong ngân hàng ôn (on-tap/ngan-hang.js).
   - Lịch ôn: câu đúng thì lâu ngày mới hỏi lại (1, 2, 4, 7, 14, 30 ngày), câu sai thì hỏi lại ngay hôm sau.
   - Sổ lỗi sai: câu sai được ghi vào sổ; làm đúng 2 lần ở 2 ngày khác nhau thì ra khỏi sổ.
   Lưu trên máy của em (localStorage). Khi có đăng nhập sẽ chuyển lên máy chủ để cô xem. */
(function(){
const K="wthta-hoc-tap-v1";
const KHOANG=[0,1,2,4,7,14,30];
function doc(){ try{ return JSON.parse(localStorage.getItem(K))||{}; }catch(e){ return {}; } }
function luu(d){ try{ localStorage.setItem(K,JSON.stringify(d)); }catch(e){} }
function ngay(cong){ const d=new Date(); d.setDate(d.getDate()+(cong||0)); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
const homNay=()=>ngay(0);
function ghi(id){   // em làm sai câu id
  const d=doc(); d.soloi=d.soloi||{}; d.srs=d.srs||{};
  const x=d.soloi[id]||{sai:0,dung:[],tu:homNay()}; x.sai++; x.dung=[]; x.sua=null; x.lan=homNay(); d.soloi[id]=x;
  d.srs[id]={hop:0,han:ngay(1)}; luu(d); }
function dung(id){  // em làm đúng câu id (trong ôn tập hoặc sổ lỗi) → trả về số ngày đã đúng nếu câu đang trong sổ
  const d=doc(); d.srs=d.srs||{}; const s=d.srs[id]||{hop:0}; s.hop=Math.min((s.hop||0)+1,KHOANG.length-1); s.han=ngay(KHOANG[s.hop]); d.srs[id]=s;
  let n=null; const x=(d.soloi||{})[id];
  if(x&&!x.sua){ if(!x.dung.includes(homNay())) x.dung.push(homNay()); n=x.dung.length; if(n>=2) x.sua=homNay(); }
  luu(d); return n; }
function sai(id){ ghi(id); }
function daHoc(baiKey){ try{ const s=JSON.parse(localStorage.getItem(baiKey)||"{}"); return s.done&&Object.keys(s.done).length>0; }catch(e){ return false; } }
function soLoiConLai(){ const d=doc(); return Object.values(d.soloi||{}).filter(x=>!x.sua).length; }
function chuoi(){ const d=doc(); const c=d.chuoi||{so:0,ngay:null}; if(c.ngay!==homNay()&&c.ngay!==ngay(-1)) return 0; return c.so; }
function xongHomNay(){ const d=doc(); const c=d.chuoi||{so:0,ngay:null};
  if(c.ngay===homNay()) return c.so; c.so=(c.ngay===ngay(-1))?c.so+1:1; c.ngay=homNay(); d.chuoi=c; luu(d); return c.so; }

/* vẽ một câu hỏi. goc = đường dẫn tới thư mục gốc dự án ("../"). xong(dungKhong) gọi khi em trả lời xong */
const player=new Audio();
function nghe(src){ try{ player.pause(); player.src=src; player.play().catch(()=>{}); }catch(e){} }
function veCau(x, el, goc, xong){
  el.innerHTML=`<div class="ch-loai">${x.loai} · <a href="${goc}${x.link}">${x.ten}</a></div>
   ${x.anh?`<img class="ch-anh" src="${goc}${x.anh}" alt="">`:""}
   <div class="ch-hoi">${x.hoi}</div>
   ${x.nghe?`<button class="ch-nghe">🔊 Nghe</button>`:""}
   <div class="ch-tl"></div><div class="ch-fb"></div>`;
  if(x.nghe){ const b=el.querySelector(".ch-nghe"); b.onclick=()=>nghe(goc+x.nghe); setTimeout(()=>nghe(goc+x.nghe),250); }
  const tl=el.querySelector(".ch-tl"), fb=el.querySelector(".ch-fb");
  const ketQua=ok=>{ fb.className="ch-fb "+(ok?"ok":"no");
    fb.innerHTML=(ok?"✓ Correct! ":"✗ Incorrect. ")+(x.kieu==="chon"&&!ok?`Đáp án đúng: <b>${x.chon[x.dap]}</b>. `:"")+(x.kieu==="go"&&!ok?`Đáp án đúng: <b>${x.dap[0]}</b>. `:"")+`<div class="ch-giai">👩‍🏫 ${x.giai}</div>`;
    if(x.giai_am){ const b=document.createElement("button"); b.className="ch-nghe"; b.textContent="👩‍🏫 Nghe cô giải"; b.onclick=()=>nghe(goc+x.giai_am); fb.appendChild(b); }
    xong(ok); };
  if(x.kieu==="chon"){ x.chon.forEach((o,i)=>{ const b=document.createElement("button"); b.className="ch-opt"; b.textContent=o;
      b.onclick=()=>{ if(tl.dataset.xong) return; tl.dataset.xong=1; const ok=i===x.dap; b.classList.add(ok?"right":"wrong"); tl.children[x.dap].classList.add("right"); ketQua(ok); }; tl.appendChild(b); }); }
  else { tl.innerHTML=`<input class="ch-in" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Gõ đáp án"><button class="ch-kt">Kiểm tra</button>`;
    const inp=tl.querySelector("input"), kt=tl.querySelector(".ch-kt");
    const lam=()=>{ if(tl.dataset.xong||!inp.value.trim()) return; tl.dataset.xong=1; inp.readOnly=true; const ok=x.dap.map(s=>s.toLowerCase()).includes(inp.value.trim().toLowerCase().replace(/\s+/g," ")); inp.classList.add(ok?"right":"wrong"); ketQua(ok); };
    kt.onclick=lam; inp.onkeydown=e=>{ if(e.key==="Enter") lam(); }; setTimeout(()=>inp.focus(),100); }
}
window.SoLoi={ghi,sai,dung,doc,luu,homNay,ngay,daHoc,soLoiConLai,chuoi,xongHomNay,veCau,nghe};
})();
