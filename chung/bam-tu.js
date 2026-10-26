/* Bấm từ – dùng chung cho mọi bài của web tự học (Sếp dặn 19/10/2026, làm giống dự án 3).
   Bấm 1 lần vào từ: máy đọc từ, tô viền hồng, hiện từ + phiên âm + nút luyện đọc từ đó.
   Bấm 2 lần liền: thẻ họ từ (nghĩa, từ loại, đồng/trái nghĩa, họ từ, tiền tố – hậu tố, bất quy tắc, câu ví dụ có loa).
   Cần nạp trước: the-tu.js của bài (window.HOTU, DINHNGHIA, EXAUD, TUAUD).
   Trang gọi BamTu.boc(phần_tử) để biến mọi từ tiếng Anh trong phần tử thành từ bấm được. */
(function(){
const H=window.HOTU||{}, DN=window.DINHNGHIA||{}, EXA=window.EXAUD||{}, TA=new Set(window.TUAUD||[]);
const E=s=>String(s||'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
function goc(k){ if(H[k]) return k;
  for(const t of [k.replace(/'s$/,''),k.replace(/ies$/,'y'),k.replace(/es$/,''),k.replace(/s$/,''),k.replace(/ing$/,''),k.replace(/ing$/,'e'),k.replace(/ed$/,'')]) if(H[t]) return t;
  return null; }
let cur=null;
function stopAll(){ try{ if(cur) cur.pause(); speechSynthesis.cancel(); if(window.player) window.player.pause(); }catch(e){} }
function doc(w){ const k=w.toLowerCase(); stopAll();
  if(TA.has(k)){ cur=new Audio('audio/tu/'+k+'.mp3'); cur.play().catch(()=>{}); return; }
  if(((window.LOIGIANG||{}).cum||[]).includes(k)){ cur=new Audio('audio/cum/'+k.replace(/ /g,'-')+'.mp3'); cur.play().catch(()=>{}); return; }   // cụm từ: school bag, pencil case…
  try{ const u=new SpeechSynthesisUtterance(w); u.lang='en-GB'; const v=speechSynthesis.getVoices().find(x=>/^en/i.test(x.lang)); if(v)u.voice=v; speechSynthesis.speak(u);}catch(e){} }
function docCau(s){ stopAll(); const A=EXA[s];
  if(A){ cur=new Audio(A); cur.play().catch(()=>{}); return; }
  try{ const u=new SpeechSynthesisUtterance(s); u.lang='en-GB'; speechSynthesis.speak(u);}catch(e){} }

// âm tiết tiếng Việt không dấu hay gặp: trong đoạn tiếng Việt không bọc thành từ tiếng Anh (vd "sang", "tay", "em")
const AMVIET=new Set(["a", "ai", "am", "an", "anh", "ba", "bac", "ban", "bao", "bay", "be", "ben", "bi", "bo", "bon", "bu", "ca", "cai", "cam", "can", "cao", "cha", "chai", "chan", "chao", "che", "chi", "chia", "chim", "chin", "cho", "choi", "chu", "chua", "chung", "co", "coi", "con", "cu", "cua", "cung", "da", "dai", "dam", "dan", "dao", "dau", "day", "de", "den", "di", "dia", "dinh", "do", "doi", "don", "du", "dua", "dung", "em", "ga", "gai", "gan", "gao", "gay", "ghe", "gi", "gia", "giai", "giao", "gio", "gioi", "ha", "hai", "hang", "hanh", "hao", "hat", "hay", "he", "heo", "hi", "hien", "hieu", "hinh", "ho", "hoa", "hoai", "hoc", "hoi", "hom", "hon", "hong", "hu", "hung", "huong", "in", "ke", "kem", "keo", "khi", "kho", "khoa", "khong", "kia", "kien", "kim", "la", "lai", "lam", "lan", "lang", "lao", "lau", "le", "len", "lo", "loi", "lon", "long", "lu", "luc", "luon", "luong", "ma", "mai", "man", "mang", "mat", "mau", "may", "me", "mo", "moi", "mon", "mot", "mua", "muon", "na", "nam", "nao", "nay", "ne", "ngay", "nghe", "nghi", "ngo", "ngoc", "ngoi", "ngon", "nguoi", "nha", "nhanh", "nhat", "nhieu", "nho", "nhu", "nhung", "no", "noi", "nua", "o", "oi", "on", "ong", "pha", "phai", "phan", "pho", "phong", "phu", "qua", "quan", "que", "ra", "rang", "rat", "rau", "re", "ro", "roi", "rong", "ru", "sa", "sach", "sai", "san", "sang", "sao", "sap", "sau", "se", "sinh", "so", "soi", "song", "su", "suoi", "suy", "ta", "tai", "tam", "tan", "tao", "tap", "tay", "te", "tet", "thanh", "thay", "the", "thi", "thich", "tho", "thoi", "thu", "thuc", "thuong", "ti", "tien", "tim", "tinh", "to", "toi", "tom", "tra", "tran", "tre", "tren", "tro", "trong", "tu", "tuan", "tuoi", "tuong", "u", "va", "vai", "van", "vao", "vay", "ve", "vi", "viec", "viet", "vo", "voi", "vua", "vui", "xa", "xanh", "xe", "xem", "xin", "xong", "y", "yeu"]);
/* bọc từ */
function boc(root){
  const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>/[A-Za-z]/.test(n.nodeValue)&&!n.parentElement.closest('.tu,button,script,style,.vn,.khong-boc')?1:2});
  const ns=[]; while(tw.nextNode()) ns.push(tw.currentNode);
  ns.forEach(n=>{ const f=document.createDocumentFragment(); let last=0; const s=n.nodeValue;
    const viet=/[À-ỹĐđ]/.test(s);   // đoạn có chữ tiếng Việt: chỉ bọc từ tiếng Anh đã biết, không cắt mảnh chữ Việt (ngh, tr, em…)
    s.replace(/[A-Za-z][A-Za-z'’]*/g,(m,i)=>{ const tr=s[i-1]||'', sau=s[i+m.length]||'';
      if(/[^\x00-\x7F]/.test(tr+sau)&&/\p{L}/u.test(tr+sau)) return m;   // dính chữ có dấu → là chữ Việt
      if(viet){ const k=m.toLowerCase().replace(/’/g,"'"); if(AMVIET.has(k)||(!goc(k)&&!TA.has(k))) return m; }
      f.append(s.slice(last,i)); const sp=document.createElement('span'); sp.className='tu'; sp.textContent=m; f.append(sp); last=i+m.length; return m; });
    f.append(s.slice(last)); n.replaceWith(f); });
}

/* tô viền + ô nhỏ (bấm 1 lần) */
const hl=document.createElement('div'); hl.className='tu-hl';
const tip=document.createElement('div'); tip.className='tu-tip';
function boViec(){ hl.remove(); tip.remove(); document.querySelectorAll('.hotu').forEach(x=>x.remove()); }
function datCanh(box,el){ const r=el.getBoundingClientRect(), b=box.getBoundingClientRect();
  let x=r.left+r.width/2-b.width/2, y=r.bottom+10; if(y+b.height>innerHeight-8) y=Math.max(8,r.top-b.height-10);
  x=Math.max(8,Math.min(x,innerWidth-b.width-8)); box.style.left=x+'px'; box.style.top=y+'px'; }
function toVien(el){ const r=el.getBoundingClientRect(); Object.assign(hl.style,{left:r.left-3+'px',top:r.top-2+'px',width:r.width+6+'px',height:r.height+4+'px'}); document.body.appendChild(hl); }
function moTip(el){
  const w=el.textContent.replace(/’/g,"'"), k=w.toLowerCase(), g=goc(k), c=g?H[g]:null;
  tip.innerHTML=`<div class="tu-top"><b>${E(w)}</b>${c&&c.ipa?`<span>${E(c.ipa)}</span>`:''}</div>
   ${c&&c.vi?`<div class="tu-vi">${E(c.vi)}</div>`:''}
   <div class="tu-btns"><button data-a="nghe">🔊 Nghe lại</button><button data-a="noi">🎤 Luyện đọc</button></div>
   ${c?'<div class="tu-btns"><button data-a="ht">📖 Xem họ từ, ví dụ</button></div>':''}
   <div class="tu-kq"></div><div class="tu-goi">${c?'Bấm thêm lần nữa vào từ để xem họ từ':'Từ này cô đang soạn thêm nghĩa'}</div>`;
  document.body.appendChild(tip); datCanh(tip,el);
  tip.querySelector('[data-a=nghe]').onclick=()=>doc(w);
  tip.querySelector('[data-a=noi]').onclick=e=>luyen(w,e.currentTarget,tip.querySelector('.tu-kq'));
  const ht=tip.querySelector('[data-a=ht]'); if(ht) ht.onclick=()=>{ hl.remove(); tip.remove(); dangTu=null; hoTu(el); };
}

/* luyện đọc một từ: máy nghe và so; máy không nghe được thì ghi âm rồi phát lại */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition; let hongSR=!SR;
async function luyen(w,btn,kq){
  const k=w.toLowerCase().replace(/'s$/,'');
  if(!hongSR){
    const r=new SR(); r.lang='en-US'; r.maxAlternatives=5; btn.disabled=true; btn.textContent='🎙 Em đọc đi…'; kq.className='tu-kq'; kq.textContent='';
    let co=false;
    r.onresult=e=>{ co=true; const alts=[...e.results[0]].map(a=>a.transcript.toLowerCase());
      const dung=alts.some(a=>{ const n=' '+a.replace(/[^a-z' ]/g,' ').replace(/\s+/g,' ').trim()+' '; return n.includes(' '+k+' ')||n.includes(' '+k+'s ')||n.includes(' '+k.replace(/ /g,'')+' '); });   // từ hoặc cụm từ (school bag, schoolbag)
      kq.className='tu-kq '+(dung?'ok':'no'); kq.innerHTML=dung?'✓ Correct! Em đọc rất tốt.':`Máy nghe thành “${E(alts[0])}”. Em nghe lại rồi đọc lần nữa nhé.`; };
    r.onerror=e=>{ co=true; if(['not-allowed','service-not-allowed','network','audio-capture'].includes(e.error)){ hongSR=true; btn.disabled=false; btn.textContent='🎤 Luyện đọc'; luyen(w,btn,kq); }
      else { kq.className='tu-kq no'; kq.textContent='Máy chưa nghe thấy tiếng em, em đọc to hơn nhé.'; } };
    r.onend=()=>{ btn.disabled=false; if(!hongSR) btn.textContent='🎤 Đọc lại'; if(!co){ kq.className='tu-kq no'; kq.textContent='Máy chưa nghe thấy tiếng em, em đọc to hơn nhé.'; } };
    try{ r.start(); }catch(e){ hongSR=true; luyen(w,btn,kq); }
    return;
  }
  // ghi âm 2 giây rồi phát lại giọng em, sau đó phát giọng mẫu
  let st; try{ st=await navigator.mediaDevices.getUserMedia({audio:true}); }
  catch(e){ kq.className='tu-kq no'; kq.innerHTML='Máy chưa cho dùng micro. Em bấm biểu tượng ổ khoá cạnh địa chỉ web → cho phép <b>Micro</b>.'; return; }
  const ch=[], rec=new MediaRecorder(st); rec.ondataavailable=e=>ch.push(e.data);
  rec.onstop=()=>{ st.getTracks().forEach(t=>t.stop()); const a=new Audio(URL.createObjectURL(new Blob(ch,{type:rec.mimeType})));
    btn.disabled=false; btn.textContent='🎤 Đọc lại'; kq.className='tu-kq'; kq.textContent='Nghe giọng em, rồi nghe giọng mẫu để so nhé.';
    a.onended=()=>setTimeout(()=>doc(w),300); a.play(); };
  btn.disabled=true; btn.textContent='🎙 Đang ghi âm…'; kq.className='tu-kq'; kq.textContent='Em đọc to từ “'+w+'”'; rec.start(); setTimeout(()=>rec.stop(),2200);
}

/* thẻ họ từ (bấm 2 lần) – theo khung dự án 3 */
const POS={n:'Danh từ',v:'Động từ',adj:'Tính từ',adv:'Trạng từ',pron:'Đại từ',prep:'Giới từ',conj:'Liên từ',det:'Từ hạn định',num:'Số từ',aux:'Trợ động từ',int:'Thán từ',name:'Tên riêng'};
function hoTu(el){
  let k=el.textContent.toLowerCase().replace(/’/g,"'"); const g=goc(k); if(!g) return false; k=g; const c=H[k];
  boViec(); window.getSelection&&window.getSelection().removeAllRanges();
  const chip=(x,cls)=>'<button class="ht-chip '+cls+(x.me?' me':'')+'" data-w="'+E(x.w)+'"><b>'+E(x.w)+'</b>'+(x.vi?'<i>'+E(x.vi)+'</i>':'')+'</button>';
  const fam=(c.fam||[]).slice(), cols=['n','v','adj','adv'];
  if(cols.includes(c.pos)&&!fam.some(x=>x.w.toLowerCase()===k)) fam.unshift({w:k,t:c.pos,vi:c.vi,me:1});
  const famHtml=fam.length?'<div class="ht-sec"><div class="ht-h">Họ từ</div><div class="ht-grid">'+cols.map(t=>'<div class="ht-col t-'+t+'"><div class="ht-ct">'+POS[t]+' <span>('+t+')</span></div>'+(fam.filter(x=>x.t===t).map(x=>chip(x,'t-'+t)).join('')||'<em>—</em>')+'</div>').join('')+'</div></div>':'';
  const sec=(lab,cls,arr)=>arr&&arr.length?'<div class="ht-sec"><div class="ht-h '+cls+'">'+lab+'</div><div class="ht-row">'+arr.map(x=>chip(x,cls)).join('')+'</div></div>':'';
  const aff=(c.affix||[]).length?'<div class="ht-sec"><div class="ht-h aff">Tiền tố – Hậu tố</div>'+c.affix.map(x=>'<div class="ht-aff"><span class="ht-part">'+E(x.part)+'</span><button class="ht-chip aff" data-w="'+E(x.w)+'"><b>'+E(x.w)+'</b></button><span class="ht-note">'+E(x.note)+'</span></div>').join('')+'</div>':'';
  const IRL={pl:['Số ít','Số nhiều'],v:['V1 (nguyên mẫu)','V2 (quá khứ)','V3 (quá khứ phân từ)'],cmp:['Nguyên cấp','So sánh hơn','So sánh nhất']}, IRT={pl:'Danh từ số nhiều bất quy tắc',v:'Động từ bất quy tắc',cmp:'So sánh bất quy tắc'};
  const irr=(c.irr||[]).filter(x=>x&&x.f&&x.f.length);
  const irrHtml=irr.length?'<div class="ht-sec"><div class="ht-h irr">Bất quy tắc</div>'+irr.map(x=>{const L=IRL[x.k]||[];return '<div class="ht-irr"><div class="ht-irt">'+(IRT[x.k]||'')+(x.vi?' <i>– '+E(x.vi)+'</i>':'')+'</div><div class="ht-irf" style="grid-template-columns:repeat('+x.f.length+',1fr)">'+x.f.map((f,j)=>'<div><span>'+(L[j]||'')+'</span>'+(/^\(/.test(f)?'<em>'+E(f)+'</em>':'<button class="ht-chip irr" data-w="'+E(f.replace(/\s*\(.*?\)/g,'').split('/')[0].trim())+'"><b>'+E(f)+'</b></button>')+'</div>').join('')+'</div></div>'}).join('')+'</div>':'';
  const CW=new Set([k].concat((c.fam||[]).map(x=>x.w),(c.syn||[]).map(x=>x.w),(c.ant||[]).map(x=>x.w)).concat(...irr.map(x=>x.f.join('/').replace(/[()]/g,'/').split('/'))).map(s=>String(s||'').toLowerCase().trim()).filter(Boolean));
  const mk=s=>E(s).replace(/[A-Za-z][A-Za-z'’\-]*/g,w=>CW.has(w.toLowerCase())?'<mark class="ht-m" data-w="'+w+'">'+w+'</mark>':w);
  const loa='<svg viewBox="0 0 24 24" width="17" height="17"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#0c1a3a"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="#0c1a3a" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
  const exHtml=(c.ex||[]).length?'<div class="ht-sec"><div class="ht-h ex">Ví dụ</div>'+c.ex.map(x=>'<div class="ht-ex"><button class="ht-say" data-s="'+E(x.en)+'" title="Nghe câu">'+loa+'</button><div><div class="ht-en">'+mk(x.en)+'</div>'+(x.vi?'<div class="ht-exvi">'+E(x.vi)+'</div>':'')+'</div></div>').join('')+'</div>':'';
  const def=DN[k];
  const d=document.createElement('div'); d.className='hotu';
  d.innerHTML='<button class="ht-x" title="Đóng">×</button>'
   +'<div class="ht-top"><span class="ht-w">'+E(k)+'</span>'+(c.ipa?'<span class="ht-ipa">'+E(c.ipa)+'</span>':'')+(c.pos?'<span class="ht-pos t-'+E(c.pos)+'">'+(POS[c.pos]||E(c.pos))+'</span>':'')+'<button class="ht-say ht-sayw" data-w="'+E(k)+'" title="Nghe từ">'+loa+'</button></div>'
   +(c.vi?'<div class="ht-vi">'+E(c.vi)+'</div>':'')+(def?'<div class="ht-def">'+E(def)+'</div>':'')
   +irrHtml+sec('≈ Đồng nghĩa','syn',c.syn)+sec('≠ Trái nghĩa','ant',c.ant)+famHtml+aff+exHtml
   +(c.tip?'<div class="ht-tip"><b>Lưu ý</b> '+E(c.tip)+'</div>':'');
  document.body.appendChild(d); datCanh(d,el);
  d.addEventListener('click',ev=>{ ev.stopPropagation();
    const sb=ev.target.closest('[data-s]'); if(sb){ docCau(sb.dataset.s); return; }
    const bt=ev.target.closest('[data-w]'); if(bt){ doc(bt.dataset.w); return; }
    if(ev.target.closest('.ht-x')) d.remove(); });
  return true;
}

/* bấm */
document.addEventListener('click',e=>{
  const el=e.target.closest('.tu');
  if(!el){ if(!e.target.closest('.tu-tip,.hotu')) boViec(); return; }
  e.stopPropagation(); e.preventDefault();
  if(e.detail>=2||(el===dangTu&&tip.isConnected)){ if(goc(el.textContent.toLowerCase().replace(/’/g,"'"))){ hl.remove(); tip.remove(); dangTu=null; hoTu(el); } return; }   // bấm lần 2 = chạm lại đúng từ đó, nhanh hay chậm đều được
  document.querySelectorAll('.hotu').forEach(x=>x.remove());
  dangTu=el; doc(el.textContent.replace(/’/g,"'")); toVien(el); moTip(el);
},true);
document.addEventListener('keydown',e=>{ if(e.key==='Escape') boViec(); });
let dangTu=null;   // từ đang mở ô nhỏ: cuộn trang thì ô nhỏ đi theo từ, không tự tắt
addEventListener('scroll',()=>{ if(dangTu&&tip.isConnected){ toVien(dangTu); datCanh(tip,dangTu); } },{passive:true});

/* Tự bọc MỌI đoạn chữ tiếng Anh trên trang (Sếp dặn 20/10/2026: "mỗi câu mỗi từ tiếng anh đều phải có nhấn lần 1 đọc từ, nhấn lần 2 hiện ra họ từ").
   Chỉ bọc đoạn chữ không có dấu tiếng Việt, bỏ qua nút, ô gõ, đầu trang, thanh phần và phần đã bọc. */
const VIET=/[À-ɏḀ-ỿ]/;
function bocAnh(root){
  const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>/[A-Za-z]{2,}/.test(n.nodeValue)&&!VIET.test(n.nodeValue)&&!n.parentElement.closest('.tu,button,script,style,textarea,input,select,header,nav,.steps,.vn,.khong-boc,.tu-tip,.hotu,.tip,title,.tw,.kitem,.chip,.wbtn,.vw,.u,.pair,.pc2,.lplay,.pen,.opt,.gap,[data-w],[data-cum],[data-cau]')?1:2});
  const ns=[]; while(tw.nextNode()) ns.push(tw.currentNode);
  ns.forEach(n=>{ const f=document.createDocumentFragment(); let last=0; const s=n.nodeValue;
    s.replace(/[A-Za-z][A-Za-z'’]*/g,(m,i)=>{ f.append(s.slice(last,i)); const sp=document.createElement('span'); sp.className='tu'; sp.textContent=m; f.append(sp); last=i+m.length; });
    f.append(s.slice(last)); n.replaceWith(f); });
}
function chayBocAnh(){ const r=document.querySelector('main')||document.body; if(!r) return; bocAnh(r); let t; new MutationObserver(()=>{ clearTimeout(t); t=setTimeout(()=>bocAnh(r),120); }).observe(r,{childList:true,subtree:true}); }
if(document.readyState==='loading') addEventListener('DOMContentLoaded',chayBocAnh); else setTimeout(chayBocAnh,0);


/* Bôi chọn cụm từ / câu tiếng Anh → máy tự đọc (Sếp dặn 25/10/2026: "nhấn chọn một nhóm từ và nhóm từ đó sẽ tự động phát âm ra luôn").
   Chỉ đọc phần chữ tiếng Anh; chọn toàn chữ tiếng Việt thì không đọc. Không đọc trong ô gõ. */
let boiCu='', boiHen=null;
function gongAnh(){ try{ const vs=speechSynthesis.getVoices(); return vs.find(v=>/en[-_]GB/i.test(v.lang))||vs.find(v=>/^en/i.test(v.lang))||null; }catch(e){ return null; } }
function boiDoc(){
  const sel=window.getSelection&&window.getSelection(); if(!sel||sel.isCollapsed) { boiCu=''; return; }
  const a=sel.anchorNode&&(sel.anchorNode.nodeType===1?sel.anchorNode:sel.anchorNode.parentElement);
  if(a&&a.closest('input,textarea,[contenteditable=true],.hotu,.tu-tip')) return;
  let t=sel.toString().replace(/\s+/g,' ').trim(); if(!t||t===boiCu) return;
  // chỉ giữ chữ tiếng Anh: bỏ các từ có dấu tiếng Việt và phần sau dấu "–" giải nghĩa
  const tu=t.split(' ').filter(w=>!/[À-ɏḀ-ỿ]/.test(w));
  if(tu.length<1||tu.length<t.split(' ').length/2) return;   // phần lớn là tiếng Việt → không đọc
  const en=tu.join(' ').replace(/[^A-Za-z0-9'’,.!?\- ]/g,' ').replace(/\s+/g,' ').trim();
  if(!/[A-Za-z]{2,}/.test(en)) return;
  boiCu=t; stopAll();
  try{ const u=new SpeechSynthesisUtterance(en); u.lang='en-GB'; u.rate=0.9; const v=gongAnh(); if(v) u.voice=v; speechSynthesis.speak(u); }catch(e){}
}
document.addEventListener('selectionchange',()=>{ clearTimeout(boiHen); boiHen=setTimeout(boiDoc,700); });   // chờ em kéo chọn xong mới đọc
try{ speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged=()=>speechSynthesis.getVoices(); }catch(e){}
window.BamTu={boc,doc,luyen,dong:boViec,bocAnh};
})();
