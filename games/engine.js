/* ===========================================================================
   Mini-game engine for the German learning workspace.
   Shared by all games in /games. A game supplies a config via GAME({...}).
   Features: 3 modes (Flashcards, Quiz, Browse) + Leitner spaced repetition
   persisted in localStorage (so progress grows across sessions).
   =========================================================================== */
(function(){
  const CSS = `
  :root{--ink:#1a1a2e;--muted:#5b6172;--line:#e6e9f2;--bg:#fff;--page:#eef0f7;--accent:#1f5fb0;
    --der:#1f5fb0;--die:#c0392b;--das:#1d7a46;--good:#1d7a46;--good-bg:#e7f5ec;--bad:#c0392b;--bad-bg:#fbeaea;--warm:#b8521a;}
  *{box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    color:var(--ink);background:var(--page);margin:0;line-height:1.6;-webkit-text-size-adjust:100%;}
  .wrap{max-width:680px;margin:0 auto;padding:20px 16px 70px;}
  .home{display:inline-block;margin-bottom:6px;font-size:.85rem;color:var(--accent);text-decoration:none;}
  .eyebrow{color:var(--warm);font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:.72rem;}
  h1{font-size:1.7rem;margin:.1em 0 .1em;}
  .sub{color:var(--muted);margin:.2em 0 14px;}
  .stats{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:var(--bg);border:1px solid var(--line);
    border-radius:12px;padding:10px 14px;margin-bottom:12px;font-size:.9rem;font-weight:600;}
  .stats .barwrap{flex:1;min-width:120px;height:9px;background:#e9ecf5;border-radius:6px;overflow:hidden;}
  .stats .bar{height:100%;background:linear-gradient(90deg,var(--accent),var(--das));width:0;transition:width .3s;}
  .stats a{color:var(--muted);font-size:.82rem;text-decoration:none;}
  .tabs{display:flex;gap:6px;margin-bottom:14px;}
  .tabs button{flex:1;font:inherit;font-weight:700;cursor:pointer;border:1.5px solid var(--line);background:#fff;
    color:var(--muted);padding:9px 6px;border-radius:10px;}
  .tabs button.on{background:var(--accent);color:#fff;border-color:var(--accent);}
  .panel{background:var(--bg);border:1px solid var(--line);border-radius:14px;padding:18px;box-shadow:0 2px 14px rgba(20,24,50,.04);}
  /* flashcard */
  .fc{min-height:170px;display:grid;place-items:center;text-align:center;cursor:pointer;
    border:1.5px dashed var(--line);border-radius:12px;padding:18px;user-select:none;}
  .fc .q{font-size:1.9rem;font-weight:800;}
  .fc .tap{color:var(--muted);font-size:.85rem;margin-top:8px;}
  .fc .en{font-size:1.15rem;color:var(--ink);} .fc .sub{color:var(--muted);font-size:.92rem;margin-top:6px;}
  .fc .ex{color:var(--muted);font-style:italic;font-size:.9rem;margin-top:6px;}
  .art{font-weight:800;padding:1px 10px;border-radius:8px;color:#fff;}
  .art.der{background:var(--der)} .art.die{background:var(--die)} .art.das{background:var(--das)}
  .fcbtns{display:flex;gap:8px;margin-top:12px;}
  .fcbtns button{flex:1;font:inherit;font-weight:700;cursor:pointer;border:1.5px solid var(--line);
    background:#fff;padding:11px;border-radius:10px;}
  .fcbtns .again{color:var(--bad);border-color:#f0c7c7;} .fcbtns .got{color:var(--good);border-color:#bfe3cd;}
  .counter{text-align:center;color:var(--muted);font-size:.85rem;margin-top:10px;}
  /* quiz */
  .q-prompt{font-size:1.5rem;font-weight:800;text-align:center;margin:6px 0 14px;}
  .opts{display:flex;flex-direction:column;gap:8px;}
  .opts.row{flex-direction:row;}
  .opts.row button{flex:1;}
  button.opt{font:inherit;cursor:pointer;border:1.5px solid var(--line);background:#fff;padding:12px;border-radius:10px;font-weight:700;}
  button.opt:hover{border-color:var(--accent);} button.opt:disabled{cursor:default;}
  button.opt.correct{background:var(--good-bg);border-color:var(--good);color:var(--good);}
  button.opt.wrong{background:var(--bad-bg);border-color:var(--bad);color:var(--bad);}
  button.opt.der{} /* gender colour hints applied inline */
  .fb{margin-top:10px;font-size:.92rem;padding:9px 11px;border-radius:8px;display:none;text-align:center;}
  .fb.show{display:block;} .fb.ok{background:var(--good-bg);color:#155e34;} .fb.no{background:var(--bad-bg);color:#922;}
  /* browse */
  .browse h3{margin:14px 0 6px;font-size:.95rem;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;}
  .row-item{display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px solid var(--line);font-size:.95rem;}
  .row-item .a{font-weight:700;white-space:nowrap;}
  .row-item .a.der{color:var(--der)} .row-item .a.die{color:var(--die)} .row-item .a.das{color:var(--das)}
  .legend{font-size:.82rem;color:var(--muted);margin:2px 0 12px;}
  .legend b.der{color:var(--der)} .legend b.die{color:var(--die)} .legend b.das{color:var(--das)}
  .note{background:#fffaf0;border-left:4px solid #e0a72e;padding:9px 13px;border-radius:6px;font-size:.9rem;margin-top:12px;}
  footer{margin-top:22px;color:var(--muted);font-size:.82rem;text-align:center;} footer a{color:var(--accent);}
  .gamenav{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin:22px 0 4px;padding-top:14px;
    border-top:1px solid var(--line);font-size:.9rem;font-weight:600;} .gamenav a{color:var(--accent);text-decoration:none;}
  `;

  function inject(){ const s=document.createElement('style'); s.textContent=CSS; document.head.appendChild(s); }
  const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
  const sample=(arr,n,exclude)=>shuffle(arr.filter(x=>x!==exclude)).slice(0,n);

  window.GAME=function(cfg){
    inject();
    // Some games store the prompt word in `id` (e.g. the gender game) and omit `q`.
    // Default q to id so nothing renders as "undefined".
    cfg.items.forEach(it=>{ if(it.q==null) it.q=it.id; });
    const KEY='deutschgame:'+cfg.id;
    let boxes={};
    try{ boxes=JSON.parse(localStorage.getItem(KEY)||'{}'); }catch(e){ boxes={}; }
    const box=id=>boxes[id]||1;                 // 1=new … 5=mastered
    const setBox=(id,v)=>{ boxes[id]=Math.max(1,Math.min(5,v)); save(); };
    function save(){ try{ localStorage.setItem(KEY,JSON.stringify(boxes)); }catch(e){} }
    const masteredCount=()=>cfg.items.filter(it=>box(it.id)>=4).length;

    // pick a session batch, struggling (low box) first
    function batch(n){
      const sorted=cfg.items.slice().sort((a,b)=>box(a.id)-box(b.id)||Math.random()-.5);
      return sorted.slice(0,Math.min(n,sorted.length));
    }

    // ---- rendering helpers per kind ----
    function backHTML(it){
      if(cfg.kind==='gender') return '<div><span class="art '+it.a+'">'+it.a+'</span> '+it.q+'</div>'+
        '<div class="en">'+it.en+'</div>'+(it.hint?'<div class="sub">'+it.hint+'</div>':'');
      if(cfg.kind==='case') return '<div class="en">+ '+it.a+'</div><div class="sub">'+it.en+'</div>'+
        (it.ex?'<div class="ex">'+it.ex+'</div>':'');
      return '<div class="en">'+it.a+'</div>'+(it.sub?'<div class="sub">'+it.sub+'</div>':''); // meaning
    }
    function options(it){
      if(cfg.kind==='gender') return ['der','die','das'];
      if(cfg.kind==='case') return ['Akkusativ','Dativ'];
      return shuffle([it.a].concat(sample(cfg.items.map(x=>x.a),3,it.a))); // meaning
    }

    // ---- build shell ----
    const app=document.getElementById('app');
    app.innerHTML=
      '<a class="home" href="index.html">← Spiele</a>'+
      '<div class="eyebrow">Spiel · '+(cfg.tag||'Vocabulary')+'</div>'+
      '<h1>'+cfg.title+'</h1><p class="sub">'+cfg.subtitle+'</p>'+
      '<div class="stats"><span>Mastered: <b id="mst">0</b> / '+cfg.items.length+'</span>'+
      '<div class="barwrap"><div class="bar" id="bar"></div></div>'+
      '<a href="#" id="reset">reset</a></div>'+
      '<div class="tabs"><button data-m="flash" class="on">🃏 Flashcards</button>'+
      '<button data-m="quiz">✍️ Quiz</button><button data-m="browse">📖 Browse</button></div>'+
      '<div class="panel" id="panel"></div>'+
      (cfg.footer||'');
    const panel=document.getElementById('panel');
    // Smooth progress: every correct answer advances a card's box, so the bar
    // moves on each answer instead of only when a card is fully mastered.
    function progressPct(){
      let s=0; cfg.items.forEach(it=>{ s+=Math.min(box(it.id)-1,3); });
      return cfg.items.length ? 100*s/(3*cfg.items.length) : 0;
    }
    function refreshStats(){
      document.getElementById('mst').textContent=masteredCount();
      document.getElementById('bar').style.width=progressPct().toFixed(1)+'%';
    }
    document.getElementById('reset').onclick=e=>{e.preventDefault();
      if(confirm('Reset progress for this game?')){boxes={};save();refreshStats();render('flash');setTab('flash');}};
    app.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{setTab(b.dataset.m);render(b.dataset.m);});
    function setTab(m){app.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.m===m));}

    // ---- FLASHCARDS ----
    function render(mode){
      refreshStats();
      if(mode==='flash') return renderFlash();
      if(mode==='quiz') return renderQuiz();
      return renderBrowse();
    }
    function renderFlash(){
      const cards=batch(cfg.batch||20); let i=0;
      function show(){
        if(i>=cards.length){ panel.innerHTML='<div style="text-align:center;padding:20px"><b>Round done!</b> '+
          masteredCount()+'/'+cfg.items.length+' mastered.<br><br><button class="opt" id="more">Another round →</button></div>';
          document.getElementById('more').onclick=()=>renderFlash(); return; }
        const it=cards[i];
        panel.innerHTML='<div class="fc" id="card"><div><div class="q">'+it.q+'</div>'+
          '<div class="tap">tap to reveal</div></div></div>'+
          '<div class="fcbtns" id="btns" style="visibility:hidden"><button class="again">❌ Again</button>'+
          '<button class="got">✅ Got it</button></div>'+
          '<div class="counter">Card '+(i+1)+' / '+cards.length+' · box '+box(it.id)+'/5</div>';
        const card=document.getElementById('card'), btns=document.getElementById('btns');
        card.onclick=()=>{ card.innerHTML=backHTML(it); btns.style.visibility='visible'; };
        btns.querySelector('.again').onclick=()=>{ setBox(it.id,1); i++; refreshStats(); show(); };
        btns.querySelector('.got').onclick=()=>{ setBox(it.id,box(it.id)+1); i++; refreshStats(); show(); };
      }
      show();
    }
    // ---- QUIZ ----
    function renderQuiz(){
      const cards=batch(cfg.batch||20); let i=0, correct=0;
      function show(){
        if(i>=cards.length){ panel.innerHTML='<div style="text-align:center;padding:20px"><b>'+correct+' / '+cards.length+
          '</b> this round.<br>'+masteredCount()+'/'+cfg.items.length+' mastered.<br><br>'+
          '<button class="opt" id="more">Another round →</button></div>';
          document.getElementById('more').onclick=()=>renderQuiz(); return; }
        const it=cards[i], opts=options(it), gender=cfg.kind==='gender';
        panel.innerHTML='<div class="q-prompt">'+(gender?'__ '+it.q:it.q)+'</div>'+
          '<div class="opts '+(opts.length<=3?'row':'')+'" id="opts"></div>'+
          '<div class="fb" id="fb"></div><div class="counter">Q '+(i+1)+' / '+cards.length+'</div>';
        const o=document.getElementById('opts'), fb=document.getElementById('fb'); let done=false;
        opts.forEach(opt=>{
          const b=document.createElement('button'); b.className='opt'; b.textContent=opt;
          if(gender){ b.style.borderColor='var(--'+opt+')'; b.style.color='var(--'+opt+')'; }
          b.onclick=()=>{
            if(done)return; done=true;
            [...o.children].forEach(c=>c.disabled=true);
            if(opt===it.a){ b.classList.add('correct'); correct++; setBox(it.id,box(it.id)+1);
              fb.className='fb show ok'; fb.innerHTML=feedback(it,true); }
            else{ b.classList.add('wrong'); setBox(it.id,1);
              [...o.children].forEach(c=>{ if(c.textContent===it.a) c.classList.add('correct'); });
              fb.className='fb show no'; fb.innerHTML=feedback(it,false); }
            refreshStats();
            setTimeout(()=>{ i++; show(); }, opt===it.a?700:1900);
          };
          o.appendChild(b);
        });
      }
      function feedback(it,ok){
        if(cfg.kind==='gender') return (ok?'✓ ':'✗ ')+'<span class="art '+it.a+'">'+it.a+'</span> '+it.q+
          ' — '+it.en+(it.hint?' · '+it.hint:'');
        if(cfg.kind==='case') return (ok?'✓ ':'✗ ')+it.q+' + <b>'+it.a+'</b> — '+it.en;
        return (ok?'✓ ':'✗ ')+'<b>'+it.q+'</b> = '+it.a+(it.sub?' · '+it.sub:'');
      }
      show();
    }
    // ---- BROWSE ----
    function renderBrowse(){
      let html='';
      if(cfg.kind==='gender') html+='<div class="legend"><b class="der">der</b> = masc · '+
        '<b class="die">die</b> = fem · <b class="das">das</b> = neut</div>';
      const groups={};
      cfg.items.forEach(it=>{ const g=it.group||'All'; (groups[g]=groups[g]||[]).push(it); });
      Object.keys(groups).forEach(g=>{
        html+='<div class="browse">'+(Object.keys(groups).length>1?'<h3>'+g+'</h3>':'');
        groups[g].forEach(it=>{
          let left,right;
          if(cfg.kind==='gender'){ left='<span class="a '+it.a+'">'+it.a+' '+it.q+'</span>'; right=it.en+(it.hint?' · '+it.hint:''); }
          else if(cfg.kind==='case'){ left='<span class="a">'+it.q+'</span>'; right='+ '+it.a+' — '+it.en; }
          else { left='<span class="a">'+it.q+'</span>'; right=it.a+(it.sub?' · '+it.sub:''); }
          html+='<div class="row-item">'+left+'<span style="color:var(--muted);text-align:right">'+right+'</span></div>';
        });
        html+='</div>';
      });
      if(cfg.browseNote) html+='<div class="note">'+cfg.browseNote+'</div>';
      panel.innerHTML=html;
    }

    refreshStats(); render('flash');
  };
})();
