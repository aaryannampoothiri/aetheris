import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════ */
const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#04080f;
      --c:#00d4ff;
      --p:#7c6aff;
      --text:#c4d0e4;
      --muted:rgba(180,195,220,0.38);
      --border:rgba(255,255,255,0.065);
      --serif:'Playfair Display',Georgia,serif;
      --sans:'Jost',sans-serif;
    }
    html,body{background:var(--bg);color:var(--text);font-family:var(--sans);font-weight:300;overflow-x:hidden;min-height:100vh;-webkit-text-size-adjust:100%}
    ::-webkit-scrollbar{width:2px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:rgba(0,212,255,0.15);border-radius:2px}
    input,textarea,button,select{font-family:var(--sans);font-weight:300}
    input::placeholder,textarea::placeholder{color:rgba(180,195,220,0.22)}

    /* ── Keyframes ── */
    @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}}
    @keyframes revealTitle{0%{opacity:0;transform:translateY(50px) skewY(2deg)}100%{opacity:1;transform:none}}
    @keyframes slideL{from{opacity:0;transform:translateX(-56px)}to{opacity:1;transform:none}}
    @keyframes slideR{from{opacity:0;transform:translateX(56px)}to{opacity:1;transform:none}}
    @keyframes scaleIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes popIn{0%{opacity:0;transform:scale(0.84) translateY(10px)}60%{transform:scale(1.02)}100%{opacity:1;transform:none}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
    @keyframes wave{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    @keyframes pRing{0%,100%{transform:scale(1);opacity:.55}50%{transform:scale(1.3);opacity:.14}}
    @keyframes trailDraw{from{stroke-dashoffset:900}to{stroke-dashoffset:0}}
    @keyframes particleOut{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(0)}}
    @keyframes glowRed{0%,100%{box-shadow:0 0 8px rgba(239,68,68,.3)}50%{box-shadow:0 0 22px rgba(239,68,68,.6)}}
    @keyframes heroSub{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
    @keyframes orb1{0%{transform:translate(0,0)}33%{transform:translate(30px,-20px)}66%{transform:translate(-20px,15px)}100%{transform:translate(0,0)}}
    @keyframes orb2{0%{transform:translate(0,0)}33%{transform:translate(-25px,18px)}66%{transform:translate(20px,-12px)}100%{transform:translate(0,0)}}
    @keyframes pageOrb{0%{transform:translate(0,0) scale(1)}50%{transform:translate(12px,-8px) scale(1.04)}100%{transform:translate(0,0) scale(1)}}

    /* ── Nav ── */
    .navglass{
      background:rgba(4,8,15,0.45);
      backdrop-filter:blur(48px) saturate(200%) brightness(1.12);
      -webkit-backdrop-filter:blur(48px) saturate(200%) brightness(1.12);
      border:1px solid rgba(255,255,255,0.07);
      border-radius:100px;
      margin-top:14px;
      box-shadow:0 8px 40px rgba(0,0,0,0.55),0 1px 0 rgba(255,255,255,0.05),inset 0 1px 0 rgba(255,255,255,0.04),0 0 0 1px rgba(0,212,255,0.05);
    }

    /* ── Modal ── */
    .mback{position:fixed;inset:0;z-index:600;background:rgba(4,8,15,0.72);backdrop-filter:blur(18px);display:flex;align-items:center;justify-content:center;animation:fadeIn .22s ease}
    .mbox{background:rgba(7,12,26,0.98);border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:36px;width:min(460px,92vw);box-shadow:0 0 80px rgba(0,212,255,.04),0 40px 80px rgba(0,0,0,.75);animation:popIn .36s cubic-bezier(.23,1,.32,1)}

    /* ── Forms ── */
    .inp{width:100%;background:rgba(255,255,255,0.034);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:11px 14px;color:#d4dff0;font-size:13px;font-weight:300;outline:none;transition:border-color .2s,box-shadow .2s;resize:vertical}
    .inp:focus{border-color:rgba(0,212,255,.34);box-shadow:0 0 0 3px rgba(0,212,255,.048)}
    .lbl{font-size:10px;letter-spacing:3.5px;text-transform:uppercase;color:rgba(180,195,220,.3);font-weight:400;display:block;margin-bottom:7px}
    .tag{font-size:9px;letter-spacing:1px;padding:3px 9px;border-radius:100px;background:rgba(0,212,255,.048);border:1px solid rgba(0,212,255,.13);color:rgba(0,212,255,.6)}

    /* ── Buttons ── */
    .bp{background:linear-gradient(135deg,rgba(0,212,255,.13),rgba(0,212,255,.065));border:1px solid rgba(0,212,255,.28);border-radius:100px;padding:10px 26px;color:#00d4ff;font-size:12px;font-weight:400;cursor:pointer;transition:all .22s;white-space:nowrap;letter-spacing:.04em}
    .bp:hover{background:rgba(0,212,255,.17);box-shadow:0 0 22px rgba(0,212,255,.16)}
    .bg{background:none;border:1px solid rgba(255,255,255,.07);border-radius:100px;padding:10px 22px;color:rgba(180,195,220,.38);font-size:12px;font-weight:300;cursor:pointer;transition:all .22s;white-space:nowrap;letter-spacing:.04em}
    .bg:hover{border-color:rgba(255,255,255,.15);color:rgba(180,195,220,.7)}

    /* ── Utility ── */
    .hg{transition:filter .22s,transform .22s}
    .hg:hover{filter:drop-shadow(0 0 8px rgba(0,212,255,.6));transform:translateY(-1px)}
    .fu{animation:fadeUp .5s cubic-bezier(.23,1,.32,1) both}
    .fi{animation:fadeIn .4s ease both}
    .sl{animation:slideL .6s cubic-bezier(.23,1,.32,1) both}
    .sr{animation:slideR .6s cubic-bezier(.23,1,.32,1) both}
    .pi{animation:popIn .4s cubic-bezier(.23,1,.32,1) both}
    .si{animation:scaleIn .48s cubic-bezier(.23,1,.32,1) both}

    /* ── Page hero ── */
    .page-hero-title{
      font-family:var(--serif);
      font-size:clamp(64px,9vw,120px);
      font-weight:300;
      letter-spacing:-.03em;
      line-height:.92;
      color:#eef3fc;
      animation:revealTitle .75s cubic-bezier(.23,1,.32,1) both;
    }
    .page-hero-sub{
      font-size:14px;font-weight:300;
      color:rgba(180,195,220,.48);
      letter-spacing:.02em;line-height:1.8;
      animation:heroSub .6s cubic-bezier(.23,1,.32,1) .18s both;
    }


    @media(max-width:768px){
      /* Hero: stack text above sphere */
      .hero-grid > div:first-child{order:1}
      .hero-grid > div:last-child{order:0;display:flex;justify-content:center;padding-top:90px}
      /* Shrink hero title on mobile */
      .hero-grid h1{font-size:clamp(52px,14vw,80px)!important}
      /* Feature sections: text first, visual second */
      .feature-grid{flex-direction:column;text-align:center;gap:28px!important}
      .feature-grid > div:first-child{text-align:left}
      /* Reduce page hero min-height */
      .page-hero-title{font-size:clamp(40px,10vw,72px)!important}
      /* Calendar: smaller cells */
      .cc{min-height:52px!important;padding:4px!important}
      /* Task row: hide heat bar on very small */
    }
    @media(max-width:480px){
      .page-content{padding:0 14px 60px!important}
      .hero-grid{gap:16px!important}
    }
    /* ── Calendar cell ── */
    .cc:hover{background:rgba(255,255,255,0.013)!important}

    /* ── Mobile responsive ── */
    @media(max-width:768px){
      .nav-items{gap:0!important;flex-wrap:wrap;justify-content:center}
      .nav-btn{padding:6px 10px!important;font-size:11px!important}
      .page-content{padding:0 18px 60px!important}
      .hero-grid{grid-template-columns:1fr!important;gap:0!important;padding:0 20px!important}
      .feature-grid{grid-template-columns:1fr!important;gap:32px!important;padding:0 20px!important;height:auto!important;min-height:100vh}
      .wellness-grid{grid-template-columns:1fr!important;gap:32px!important}
      .stats-grid{grid-template-columns:1fr!important;gap:32px!important}
      .credits-row{flex-direction:column!important;align-items:flex-start!important;gap:20px!important}
      .credits-links{flex-wrap:wrap!important}
      .calendar-hint{display:none}
    }
    @media(max-width:480px){
      .nav-btn{padding:5px 8px!important;font-size:10px!important}
    }
  `}</style>
);

/* ═══════════════════════════════════════════════
   AMBIENT
═══════════════════════════════════════════════ */
function Ambient() {
  return (
    <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
      <div style={{position:"absolute",width:900,height:900,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,212,255,0.038) 0%,transparent 70%)",top:"-25%",left:"-15%",animation:"orb1 25s ease-in-out infinite"}}/>
      <div style={{position:"absolute",width:800,height:800,borderRadius:"50%",background:"radial-gradient(circle,rgba(124,106,255,0.044) 0%,transparent 70%)",bottom:"-10%",right:"-12%",animation:"orb2 30s ease-in-out infinite"}}/>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(0,212,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.012) 1px,transparent 1px)",backgroundSize:"110px 110px",maskImage:"radial-gradient(ellipse 70% 70% at 50% 50%,black 10%,transparent 100%)"}}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════ */
const NAV=[{id:"home",l:"Home"},{id:"calendar",l:"Calendar"},{id:"archive",l:"Archive"},{id:"tasks",l:"Tasks"},{id:"wellness",l:"Wellness"},{id:"stats",l:"Stats"},{id:"settings",l:"Settings"}];

function Nav({active,go}){
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>30);window.addEventListener("scroll",h,{passive:true});return()=>window.removeEventListener("scroll",h)},[]);
  return(
    <nav className="navglass" style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",zIndex:300,width:"auto",maxWidth:"calc(100% - 32px)",padding:"10px 6px 14px",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .4s ease"}}>
      <div className="nav-items" style={{display:"flex",gap:0,alignItems:"center",flexWrap:"wrap",justifyContent:"center"}}>
        {NAV.map(n=>{
          const on=active===n.id;
          return(
            <button key={n.id} onClick={()=>go(n.id)} className="nav-btn" style={{background:"none",border:"none",cursor:"pointer",padding:"6px 14px",color:on?"#00d4ff":"rgba(180,195,220,0.38)",fontSize:12,fontWeight:on?400:300,fontFamily:"var(--sans)",letterSpacing:on?".08em":".05em",position:"relative",transition:"color .25s ease"}}>
              {n.l}
              {on&&<span style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:14,height:1,borderRadius:1,background:"rgba(0,212,255,0.65)",boxShadow:"0 0 8px rgba(0,212,255,0.45)",display:"block"}}/>}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════
   PAGE HERO — full-screen for inner pages
═══════════════════════════════════════════════ */
function PageHero({title,sub}){
  return(
    <div style={{minHeight:"clamp(60vh,92vh,92vh)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",position:"relative",overflow:"hidden",paddingTop:80}}>
      {/* Background glow specific to page */}
      <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,212,255,0.055) 0%,transparent 70%)",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none",animation:"pageOrb 8s ease-in-out infinite"}}/>
      {/* Decorative thin ring */}
      <div style={{position:"absolute",width:320,height:320,borderRadius:"50%",border:"1px solid rgba(0,212,255,0.07)",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none",animation:"pRing 6s ease-in-out infinite"}}/>
      <div style={{position:"absolute",width:480,height:480,borderRadius:"50%",border:"1px solid rgba(124,106,255,0.04)",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none",animation:"pRing 9s ease-in-out infinite 1s"}}/>

      <div style={{position:"relative",zIndex:1}}>
        <h1 className="page-hero-title" style={{marginBottom:22}}>{title}</h1>
        {sub&&<p className="page-hero-sub" style={{maxWidth:440,margin:"0 auto 36px"}}>{sub}</p>}
        {/* Scroll cue */}
        <div style={{animation:"heroSub .6s cubic-bezier(.23,1,.32,1) .36s both",display:"flex",flexDirection:"column",alignItems:"center",gap:8,marginTop:8}}>
          <div style={{width:1,height:40,background:"linear-gradient(180deg,transparent,rgba(0,212,255,0.35),transparent)"}}/>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE SHELL
═══════════════════════════════════════════════ */
function Shell({children}){
  return(
    <div className="si" style={{position:"relative",zIndex:1}}>
      {children}
    </div>
  );
}

function Content({children}){
  return(
    <div className="page-content" style={{maxWidth:1040,margin:"0 auto",padding:"0 40px 100px"}}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MODAL
═══════════════════════════════════════════════ */
function Modal({title,onClose,children}){
  return(
    <div className="mback" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="mbox">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:26}}>
          <span style={{fontFamily:"var(--serif)",fontSize:21,fontWeight:400,color:"#e8f0fb",letterSpacing:"-.01em"}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:"rgba(180,195,220,.32)",fontSize:22,cursor:"pointer",lineHeight:1,padding:"0 4px"}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   1. HOME
═══════════════════════════════════════════════ */
const FEATURES=[
  {id:"calendar",title:"Calendar",sub:"Schedule events, plan your weeks. Every commitment has its place.",color:"#00d4ff"},
  {id:"archive", title:"Archive", sub:"Notes in masonry. Knowledge in 3D cards. Your second brain, alive.",color:"#7c6aff"},
  {id:"tasks",   title:"Tasks",   sub:"Urgency glows. Complete a task and watch it dissolve into particles.",color:"#00d4ff"},
  {id:"wellness",title:"Wellness",sub:"Hydration, guided breathing, breaks. Your rhythm, your pace.",color:"#7c6aff"},
  {id:"stats",   title:"Stats",   sub:"Focus sessions, heatmaps, velocity trails. See your work, truly.",color:"#00d4ff"},
];

/* Mini visuals */
function MiniCalVis(){
  const days=["M","T","W","T","F","S","S"];
  const evts=[{c:2,r:0,t:"Deep Work",cyan:true},{c:4,r:0,t:"Standup"},{c:1,r:1,t:"Focus"},{c:3,r:1,t:"1:1"},{c:5,r:2,t:"Review",cyan:true}];
  return(
    <div style={{padding:"18px",background:"rgba(255,255,255,0.018)",border:"1px solid rgba(255,255,255,0.055)",borderRadius:16}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:6}}>
        {days.map(d=><div key={d} style={{textAlign:"center",fontSize:8,letterSpacing:2,color:"rgba(180,195,220,.25)",padding:"3px 0"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
        {Array.from({length:28},(_,i)=>{
          const c=i%7,r=Math.floor(i/7);
          const ev=evts.find(e=>e.c===c&&e.r===r);
          const today=c===3&&r===1;
          return(
            <div key={i} style={{minHeight:34,padding:3,borderRadius:5,background:today?"rgba(0,212,255,0.025)":"transparent"}}>
              <div style={{fontSize:8,color:today?"rgba(0,212,255,.65)":"rgba(180,195,220,.28)",marginBottom:1,fontWeight:today?400:300}}>{i+1}</div>
              {ev&&<div style={{fontSize:7,padding:"1px 3px",borderRadius:4,background:ev.cyan?"rgba(0,212,255,0.09)":"rgba(124,106,255,0.1)",border:`1px solid ${ev.cyan?"rgba(0,212,255,.18)":"rgba(124,106,255,.2)"}`,color:ev.cyan?"rgba(0,212,255,.7)":"rgba(124,106,255,.8)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.t}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
function MiniArchiveVis(){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {[{t:"Your first note",b:"Start capturing ideas, insights and knowledge here."},
        {t:"Meeting notes",b:"Log important decisions and action items."},
        {t:"Reading highlights",b:"Save what matters from what you read."}
      ].map((n,i)=>(
        <div key={i} style={{padding:"12px 16px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12}}>
          <div style={{fontSize:11,fontWeight:400,color:"#d0daf0",marginBottom:4}}>{n.t}</div>
          <div style={{fontSize:10,fontWeight:300,color:"rgba(180,195,220,.42)",lineHeight:1.6}}>{n.b}</div>
        </div>
      ))}
      <div style={{display:"flex",gap:6}}>
        {["Q·A","Flip","Recall"].map(l=><div key={l} style={{flex:1,textAlign:"center",padding:"8px",background:"rgba(124,106,255,0.07)",border:"1px solid rgba(124,106,255,0.18)",borderRadius:9,fontSize:9,letterSpacing:1,color:"rgba(124,106,255,.75)"}}>{l}</div>)}
      </div>
    </div>
  );
}
function MiniTasksVis(){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:3}}>
      {[{t:"Your next milestone",h:1},{t:"This week's priority",h:.7},{t:"Ongoing project",h:.5},{t:"Someday / maybe",h:.25}].map((t,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"rgba(255,255,255,0.018)",borderRadius:9}}>
          <div style={{width:2,height:28,borderRadius:1,background:`linear-gradient(180deg,rgba(0,212,255,${t.h*.9}),transparent)`,boxShadow:`0 0 6px rgba(0,212,255,${t.h*.5})`,flexShrink:0}}/>
          <div style={{flex:1,fontSize:11,fontWeight:300,color:"rgba(180,195,220,.7)"}}>{t.t}</div>
          <div style={{width:32,height:1.5,borderRadius:1,background:"rgba(255,255,255,.04)",overflow:"hidden"}}>
            <div style={{width:`${t.h*100}%`,height:"100%",background:`rgba(0,212,255,${t.h*.8})`}}/>
          </div>
        </div>
      ))}
    </div>
  );
}
function MiniWellnessVis(){
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
      <div style={{padding:"14px",background:"rgba(255,255,255,0.018)",border:"1px solid rgba(255,255,255,0.048)",borderRadius:13,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
        <span className="lbl" style={{margin:0,fontSize:8}}>Hydration</span>
        <div style={{width:32,height:80,border:"1px solid rgba(0,212,255,0.17)",borderRadius:16,position:"relative",overflow:"hidden",background:"rgba(0,212,255,0.014)"}}>
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:"65%",background:"linear-gradient(180deg,rgba(0,212,255,.45),rgba(0,212,255,.12))",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-7,left:0,width:"200%",height:14,background:"rgba(0,212,255,.22)",borderRadius:"50%",animation:"wave 2s linear infinite"}}/>
          </div>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--serif)",fontSize:12,fontWeight:300,color:"#00d4ff"}}>0</div>
        </div>
      </div>
      <div style={{padding:"14px",background:"rgba(255,255,255,0.018)",border:"1px solid rgba(255,255,255,0.048)",borderRadius:13,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
        <span className="lbl" style={{margin:0,fontSize:8}}>Breath</span>
        <div style={{width:56,height:56,borderRadius:"50%",border:"1.5px solid rgba(124,106,255,0.45)",background:"radial-gradient(circle,rgba(124,106,255,0.09) 0%,transparent 70%)",display:"flex",alignItems:"center",justifyContent:"center",animation:"pRing 3s ease-in-out infinite"}}>
          <span style={{fontSize:8,color:"rgba(124,106,255,.7)",letterSpacing:.5}}>4·7·8</span>
        </div>
      </div>
      <div style={{gridColumn:"span 2",display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
        {[{l:"Sleep",v:"7h 23m"},{l:"Steps",v:"8,421"}].map(s=>(
          <div key={s.l} style={{padding:"10px 12px",background:"rgba(255,255,255,0.018)",border:"1px solid rgba(255,255,255,0.048)",borderRadius:10}}>
            <div className="lbl" style={{margin:"0 0 3px",fontSize:7}}>{s.l}</div>
            <div style={{fontFamily:"var(--serif)",fontSize:14,fontWeight:300,color:"rgba(0,212,255,.8)"}}>{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
function MiniStatsVis(){
  const h=Array.from({length:7*14},(_,i)=>Math.max(0,Math.min(1,Math.sin(i/5)*.4+Math.random()*.5+.1)));
  const t="M0,50 C35,46 38,18 72,20 C106,22 110,52 144,38 C178,24 182,8 216,8 C250,8 252,36 288,22 C324,8 328,0 362,4 C396,8 400,28 440,18";
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(14,1fr)",gap:1.5}}>
        {h.map((v,i)=><div key={i} style={{aspectRatio:"1",borderRadius:1.5,background:v>.62?`rgba(0,212,255,${v*.75})`:`rgba(124,106,255,${v*.5})`}}/>)}
      </div>
      <svg width="100%" height="60" viewBox="0 0 440 60" style={{overflow:"visible"}}>
        <defs>
          <filter id="gls"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <linearGradient id="tgm" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c6aff" stopOpacity=".2"/><stop offset="70%" stopColor="#00d4ff" stopOpacity=".9"/><stop offset="100%" stopColor="#00d4ff"/></linearGradient>
        </defs>
        <path d={t} fill="none" stroke="#00d4ff" strokeWidth="5" strokeOpacity=".065" filter="url(#gls)"/>
        <path d={t} fill="none" stroke="url(#tgm)" strokeWidth="1.5" strokeDasharray="700" style={{animation:"trailDraw 2.5s cubic-bezier(.23,1,.32,1) forwards"}}/>
        <circle cx="440" cy="18" r="3" fill="#00d4ff" filter="url(#gls)"/>
      </svg>
      <div style={{display:"flex",gap:8}}>
        <div style={{flex:2,textAlign:"center",padding:"10px",background:"rgba(0,212,255,0.05)",border:"1px solid rgba(0,212,255,0.13)",borderRadius:10}}>
          <div style={{fontFamily:"var(--serif)",fontSize:26,fontWeight:300,color:"rgba(0,212,255,.88)",lineHeight:1}}>87%</div>
          <span className="lbl" style={{margin:"4px 0 0",fontSize:7}}>Efficiency</span>
        </div>
        <div style={{flex:1,textAlign:"center",padding:"10px",background:"rgba(255,255,255,0.018)",border:"1px solid rgba(255,255,255,0.048)",borderRadius:10}}>
          <div style={{fontFamily:"var(--serif)",fontSize:20,fontWeight:300,color:"rgba(180,195,220,.65)",lineHeight:1}}>12d</div>
          <span className="lbl" style={{margin:"4px 0 0",fontSize:7}}>Streak</span>
        </div>
      </div>
    </div>
  );
}

const VISUALS={calendar:MiniCalVis,archive:MiniArchiveVis,tasks:MiniTasksVis,wellness:MiniWellnessVis,stats:MiniStatsVis};

function FeatureSection({f,go}){
  const ref=useRef(null);
  const [vis,setVis]=useState(false);
  const V=VISUALS[f.id];

  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true)},{threshold:0.35});
    obs.observe(el);return()=>obs.disconnect();
  },[]);

  return(
    <div ref={ref} className="feature-grid" style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",zIndex:1,padding:"60px 0"}}>
      <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:1,height:48,background:"linear-gradient(180deg,transparent,rgba(0,212,255,0.15),transparent)"}}/>
      <div className="feature-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center",width:"100%",maxWidth:880,padding:"0 24px"}}>
        {/* Left: text */}
        <div style={{overflow:"hidden"}}>
          {vis&&<>
            <div className="sl" style={{animationDelay:"0ms"}}>
              <div style={{fontSize:10,letterSpacing:"4px",color:f.color==="#00d4ff"?"rgba(0,212,255,0.45)":"rgba(124,106,255,0.5)",fontWeight:400,marginBottom:16,textTransform:"uppercase"}}>
                {String(FEATURES.indexOf(f)+1).padStart(2,"0")}
              </div>
              <h2 style={{fontFamily:"var(--serif)",fontSize:"clamp(40px,5.5vw,64px)",fontWeight:300,letterSpacing:"-.025em",lineHeight:1,color:"#eef3fc",marginBottom:18}}>
                {f.title}
              </h2>
            </div>
            <div className="sl" style={{animationDelay:"70ms"}}>
              <p style={{fontSize:14,fontWeight:300,color:"rgba(180,195,220,.5)",lineHeight:1.82,maxWidth:320,marginBottom:28,letterSpacing:".01em"}}>{f.sub}</p>
            </div>
            <div className="sl" style={{animationDelay:"140ms"}}>
              <button className="bp" onClick={()=>go(f.id)}>
                Open {f.title} →
              </button>
            </div>
          </>}
        </div>
        {/* Right: visual */}
        <div style={{overflow:"hidden"}}>
          {vis&&<div className="sr" style={{animationDelay:"50ms"}}><V/></div>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CREDITS FOOTER
═══════════════════════════════════════════════ */
function Credits(){
  const links=[
    {icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>, href:"https://www.linkedin.com/in/aaryannampoothiri", label:"LinkedIn"},
    {icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>, href:"https://github.com/aaryannampoothiri", label:"GitHub"},
    {icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>, href:"mailto:aaryannamboothiri@gmail.com", label:"Email"},
    {icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.72a16 16 0 0 0 8 8l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 18z"/></svg>, href:"tel:+918078404468", label:"+91 80784 04468"},
  ];
  return(
    <div style={{position:"relative",zIndex:1}}>
      {/* Top glow line */}
      <div style={{height:1,background:"linear-gradient(90deg,transparent 0%,rgba(0,212,255,0.18) 30%,rgba(124,106,255,0.14) 70%,transparent 100%)"}}/>

      <div style={{maxWidth:1040,margin:"0 auto",padding:"clamp(28px,5vw,52px) clamp(18px,4vw,40px) 40px"}}>
        {/* Quote */}
        <div style={{textAlign:"center",marginBottom:44}}>
          <p style={{
            fontFamily:"var(--serif)",fontStyle:"italic",
            fontSize:"clamp(15px,2vw,19px)",fontWeight:300,
            color:"rgba(180,195,220,0.28)",
            letterSpacing:".01em",lineHeight:1.6,
          }}>
            "Designed for those who move with intention."
          </p>
          <div style={{width:32,height:1,background:"linear-gradient(90deg,transparent,rgba(0,212,255,0.25),transparent)",margin:"18px auto 0"}}/>
        </div>

        {/* Main row */}
        <div className="credits-row" style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:24}}>
          {/* Identity */}
          <div>
            <div style={{fontSize:9,letterSpacing:"3.5px",color:"rgba(0,212,255,0.3)",textTransform:"uppercase",fontWeight:400,marginBottom:6}}>Developed by</div>
            <div style={{fontFamily:"var(--serif)",fontSize:20,fontWeight:400,color:"rgba(210,222,240,0.7)",letterSpacing:"-.01em"}}>Aaryan Nampoothiri</div>
          </div>

          {/* Links */}
          <div className="credits-links" style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            {links.map((l,i)=>(
              <a key={i} href={l.href} target={l.href.startsWith("http")?"_blank":"_self"} rel="noopener noreferrer"
                style={{
                  display:"flex",alignItems:"center",gap:8,
                  padding:"8px 14px",borderRadius:100,
                  border:"1px solid rgba(255,255,255,0.06)",
                  background:"rgba(255,255,255,0.02)",
                  color:"rgba(180,195,220,0.35)",
                  textDecoration:"none",fontSize:11,fontWeight:300,
                  letterSpacing:".03em",transition:"all .22s cubic-bezier(.23,1,.32,1)",
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(0,212,255,0.22)";e.currentTarget.style.color="rgba(0,212,255,0.72)";e.currentTarget.style.background="rgba(0,212,255,0.055)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.06)";e.currentTarget.style.color="rgba(180,195,220,0.35)";e.currentTarget.style.background="rgba(255,255,255,0.02)"}}>
                <span style={{opacity:.7,display:"flex",alignItems:"center"}}>{l.icon}</span>
                <span>{l.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom micro line */}
        <div style={{marginTop:32,paddingTop:20,borderTop:"1px solid rgba(255,255,255,0.038)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:9,letterSpacing:".08em",color:"rgba(180,195,220,.16)",fontWeight:300,textTransform:"uppercase"}}>Aetheris · {new Date().getFullYear()}</span>
          <span style={{fontSize:9,letterSpacing:".06em",color:"rgba(180,195,220,.14)",fontWeight:300}}>Built with intention</span>
        </div>
      </div>
    </div>
  );
}

function Home({go}){
  return(
    <div style={{position:"relative",zIndex:1}}>

      {/* ═══ HERO ═══ */}
      <div style={{position:"relative",height:"100vh",overflow:"hidden",background:"#04080f"}}>

        {/* Subtle ambient glow */}
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 70% at 50% 55%, rgba(0,180,220,0.07) 0%, transparent 65%), radial-gradient(ellipse 40% 50% at 58% 38%, rgba(100,85,220,0.05) 0%, transparent 60%)",pointerEvents:"none"}}/>

        {/* ── GIANT AETHERIS wordmark ── */}
        <div style={{
          position:"absolute",
          bottom:"-2%",left:0,right:0,
          textAlign:"center",
          fontFamily:"'Bebas Neue', var(--sans)",
          fontSize:"clamp(100px,16vw,210px)",
          fontWeight:400,
          letterSpacing:"0.14em",
          lineHeight:1,
          color:"transparent",
          WebkitTextStroke:"1.5px rgba(255,255,255,0.55)",
          userSelect:"none",pointerEvents:"none",
          animation:"heroSub 1.1s ease .1s both",
          textTransform:"uppercase",
          zIndex:2,
        }}>AETHERIS</div>

        {/* ── Robot image — CENTRED circle, strong white border ── */}
        <div style={{
          position:"absolute",
          top:0,left:0,right:0,bottom:0,
          display:"flex",alignItems:"center",justifyContent:"center",
          zIndex:6,
        }}>

          {/* Circle frame */}
          <div style={{
            position:"relative",
            width:"min(460px,68vw)",
            height:"min(460px,68vw)",
            borderRadius:"50%",
            border:"2px solid rgba(0,212,255,0.75)",
            boxShadow:"0 0 0 1px rgba(0,212,255,0.15), 0 0 28px rgba(0,212,255,0.18), inset 0 0 20px rgba(0,0,0,0.35)",
            overflow:"hidden",
            animation:"heroSub .9s cubic-bezier(.23,1,.32,1) .18s both",
          }}>

            <img
              src="data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAGtAasDASIAAhEBAxEB/8QAHQABAAIDAQEBAQAAAAAAAAAAAAUGAwQHCAIBCf/EAFcQAAEDAwICBwQFBwcIBwcFAAEAAgMEBREGIRIxBxMiQVFhcQgUgZEjMkKhsRVSYnLB0fAWM4KSouHjJENGU4WywvEXJjRkhKXDGCU1NmOTszdmc4Pi/8QAGgEBAQEBAQEBAAAAAAAAAAAAAAECAwQFBv/EACoRAQEAAgIDAAEBBwUAAAAAAAABAhEDIQQSMUFREyIjYXHB8AUUMoGh/9oADAMBAAIRAxEAPwDxkiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIi/QCTgDJQfiLsPRT7OXSXr+OKthtYs9rk3FZcMxhw8WM+s71wB5r0fpL2RejjTsMdRrK91l5nbu9gf1EJPhwt7X3oPCDQXHDQSfALO2hrXDLaOocPERE/sX9IYKDoj0fCItP6TtUT2DAkbA0vPq47n4lQV/1laqhrmRUFMxvdiMIP58vpKpn16aZvqwhYiCDgghevdYOp69jzFGxpxyDQuJ6qtTBVufNEHO5DIyPly+5By1FYq+zQOk4oXiLPceWfXw8sfFQ9VQ1FPkuYSzOA4bgoNVERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQERda6EugbWHSY5ldDH+S7GHYfX1DTh/iI2/aP3eaDkwBJwAST3K9aN6IukLVjWS2rTdWKZ24qKhvUx48QXYz8Mr230f9CPRt0c07J4rey6XNgBdWVoD3Z8Wjk34KxXfUDi5lNRR9p5DI2MHMk4AQeXtLeybequWKO9aggjmeR/k9HGZHY83HAHrheieiv2dejjo4LLzcKVtzuUfaZLWkSCI/otwBnzwulUDaTSVm62qe2WvlbxTP8T4DyC5H0ga8qKyd8ccjiXHhYxmSSe4AILxrHpLgoWOgt5Yxo2Dsbri+qdfVlZI4vqXOye9y39QQ6d0pbxdtcy1dXPx4dQUwcGMdt2SW4dI4ZAOC1oORxEghV2h1H0d6yo5IYtG11uhJMZnppHxVcHPEjWmSRryMZ4XDBwefJWTd053kkVm5akle48UpPxUTPfHE/Xd81D69t9w0prO4adr5hUinc19PVMGG1EL2h8b8dxLXDI7jkb81BisJPMpZrpuZS9xbDd5HH6616qOOuYRIASe9QMNVk7lSVJUYIKioC+6cnjzJAC9nkqpMJYHlvLxBGx9R3rsVLMyRvC8AgqL1FpWCvidNTN4Zee3eg5HUUEFXk0wENRuTETs79U+Pl8vBQ8sckUhjkYWuacEEK0Xi3VFFO6KZhaWnmtYe7V+Ka4PEUuMRVOPLAD/EchnmPQDAV1FsXCjnoap9PUMLXtPwPmPELXQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERARF172Y+iiXpG1eKu5RvZpu2ObJXSchKebYWnxPf4D4ILn7LXs/nVoh1nrWF8OnmO4qWlds6tI7z4M/Fexqm4UtuooqG3wRUtNCwMjjjaGtY0cgAFH19fFBBFR0cbIKWBgjijYMNY0DAACq96uXCHdpXSbfV9vD3lwL8/FbfRnBG6qqtTVpJhoz1VM1wwHSkZLvPAI+J8lz+4V755hFGOOSRwYxo7yTgBXLVVyjsWm6azxyg+7RcLiPtPO7j8SSmlRXSXrN88koMuPiuY6Du9LV9J9lluMzBRUtSKiXrCOEY2YT5Ne5jv6KrWutQl8r8yH5rmcmo5qK4e8xHi2LXNPJzTzCT6mU3LHYOnK+10ep6DTN+fUURp6GKOpldE5zTK3PG/AGTxPLnBwO/Es3QxSufda2vh66CwUkYbNdqqAxxtc4cPEM7kgHDGjJJK5nB006yoKZlDSXimqKOMYhhulJDU9QPBjpWFwHlnHgAFAXjpJ1TfKpk96vdTczF/MwNAbDGfFsbQ1jfUDK6XLGdxw/Z561XWPaG1BaLk1lXBG1lRNKwU8f244GM6tgPnhoJ8w7wXIIqo7bqIud0rrjU+8Vkji7ubnYLFDUOB5rne+3bHGYySLNBUb81KUdTy3VUgnzjdS9DPyGVGluoqjlvurFbZ8gA7hU2gl5ZKsdrl3G6Dc1JpmmvVIXBgbKBsVxjUdmqLbVvp6iMgA7HC9EWl/FgHcYWvrPSNPfLa57IwJmjLdt0HneiMFwibablI2N2MUlS44EZ/Ncfzfw+agK+knoauSlqYyyWNxa4FWPUlnqLdVvpqhjmlp2X1DENSUXuUhH5XpmfQPc7HvEYB7B8XDu8RtvhoQVNF9Pa5jyxww4HBC+UBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERBM6K03c9Xapt+nbREZKyumEbPBo73HwAGSfRf0P0rp61dHuiaHSdma3qadmZpcYdPKfrPd5k/IYC4v7FWhWWXTNV0hXKECruAdT27iG7IQe08frEY9G+a67ea/jlcS4nJQfNwr+EHfKqN5ry4OAdss9yrM532VYudSSSMrbKa0IG1WqWTy9qOka6fH6Q2b95B+Ci+k69lz5O3496ldBYgslzr/tSyNhafJoJP+8FzDpLrjxydrxUqxzPVt0dJO/Dsqnue6R+Scrcvc5kmdv3rRpvrKK2YqcP5tB+C2RRnGzfuW1QRggKVZA3h5KCtzUjgOS1JIywq1zUwI5KKrKXnsqIyGThO6laCbcZKh54yxyz0UuHDdKLnb5uW6strl3G6pNvm5bqz2qbPDumhf7NJuBlXizhsjQC0YwudWWb6pyugafkyWY700Kh0v6EZcbfJX0kQ65oycDmvOFbDUUFaHxl0U8D+JpGxBC9409LHVUxie0EOGF5y6fdBSWutfc6SL6J27gBsFBynU9Gy9Wn+VFDGRICI7jE3H0cmPrgc+F2M9++RsAFUFbNL3GK0XnFZGJbdVDqauIjILSefqDgjzCjdaWR1hvstIHtkgdiSCRpyHscMtPyI5+IQQqIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICnNA6cqtW6ztWnKMHra+pbESB9Vue074DJ+Cg16V9h/Swfc7zriqizHQxe50ZI/zrxl5Ho3A/pIPStayjs1mpLJbYxDR0MDKeFg7mtGAqhcKkkk5UpfKsvkdv6qr18x33ViVpXCo2O6rtdKS7OVIV8uc7qDqpMkrSL1p49V0fxyDnLNK/wCTuH/hXIdaUtfdrmy222lmqqypf1cMMTcue49w/edhzOy69ZiD0dUWP/q//keoDo9hY7U1/qYZGi6QWSoNva4j+cc5jC7B7+0G+khB2KzS3U25JrHoY1FZrXNXVFwtdRPTxddVU1LUh8tPHtl7mnHE0Z3cwuA5nbJXLurlpql0EzS2Rhw4Fdo0Dd+p1o2e6RSV76IT1t2rZvpJI6dsLw+N7u8vLyzhJJ4ngfawuS6rqWTX+V8fDngYHkci4NGfvVs6lZwytuq3rbJsMlTcTstVUoZsY3U/RzZaN1l0b7sFq06mIEHZbLXgtXxLghUVy4Q4J2UbESyTCn7gwFpUBUAtelE1bpuQyrTaptxuqPQS7hWa1zfV3SDolkm3aF0HTk31Fyuy1GC3dX7TtTu3dUdf0+8PAas+ttN09+sM9PLGHFzCBsofTNSCWb810K2hs0Aae9Qfzz6R9NT2C+VFHKwhoceH0WaliOrNAzUJDHXWxNMkJP1pacndvngnl5+S9Fe1FoQVFE660sX0jN3YHcvL2mLo7Tmqqa4OjEkIcY6iJ3KSN2zmnyIJUFSRWnpQsAsGq54oW4oqkCopHA5Do37gj4Hl3clVkBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQF756GbE3SfQlp63FnBUVVP79U7YJfL2hn0bwj4LxH0fWg3/XNjsobxe+18MJHk54B+7K946ouxtNQLfd2NgpoQI4K1gxC5rdmh/+rOMc+ye49yCLuUm5UBXP5hZqu41BuUsE0H0ReBC9gJyMDc+WSdx4LWrckHK1EqDrpNioWd+5W7fayGiiL53ADuHefRUC+axjp5HNaWMJ5NHaefh3Ko7hpN3XdH0bOZimlb83cX/EucahuFwsV2bdLXUGnqYS7heGhww4EOaWuBDgQSCCCDlTnQPqR17s96tsuMwOjnj2xs4ODh6jhHzUdrykyZRjxWav4cr1rrm8XC2T2r3e3UFNPKJaiK20TKVlRIOT5eHtSHvw44B3ABXO+I9Y4kkknJKtOp6ctndsqrOC1+QltqTGT43aaQgjdTVDOcDdVuF5UlRS4PNRpZopctG6+3v2UbTzZAGVsOlGOaow1juyVCV3MlStU/IURWEHKUfFJJwvCsNsmwRuqtG7Dwpq3S8lBe7PUYI3V50/VYc3dcytM+43V0slRhzd1odk0xV7t3XU9OVPG1gyuGaZq927rqmlaz6m6C2a0s8N4sU8EjA7iYR9y/n50s6dksepKukdGWt4yW7L+jlE9s9LwnfIXlr2t9IhpF3gi5fWICyOGXGNuqOiOKs7Trlp6XqZOZ4oHZLT5YPFv+qFzRdN6GaxkGr5rFUhjqS9QOo3secNLnfUz4doBc/vtBLa7zV26ZjmPp5XMIcMHY7INJERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQdO9lmmFV08aZDm8QindLjzaxxH34XsnUr2yzyhwDmuyCCMgheR/Y+A/6dLW447NNUuHqInL1jezmd3qrIKRU2SSicH2KpFGxoIFI9vHTn0bnLP6JA35FYH1E4p3Or6N1PK1pLuB3Gw/qnb7wFY5GklVDpPqvdbLHCDh0798Hubv+JC1Ombv8OQ9Il9mE7w5zo5ZCWsaPrNHkD+JVJt8NZXTltDR1NRKfrNpoHSuPmSASV+1Lai+Xt/VOB66Thjc47MjbnJPlgFx9F9y1lspne7UkMksIw108m7pBnOQ3uB549MqXurrpJU4vFjrhwmvtNdjIbLG+B5BHgQDjBXU7PeX6l0jFWVLg6uh+gq9sfSNHP+kCHfFUmx1hp2Nst6mFVp6Yhzg93/ZeIbVEP5jhkOIGA4AtcN8iS0iazTms67S1yazrHzSUs2Dt10RdhzfI4d8wmmcb3qq1rGjxI9wHoqBWs4Xldk1nQ/X25Lld5p+CR2yy2hWOwVtwPwQVqPAa5fcb0E3Tzct1smbPeoaGVbLZdlRtTSZUbVHdZXyea1J35JVGIntKQoJMEKNLt1s0j8EKC2WybBG6t1nqD2d1RLfJjCs1pnwRuqOpacq8Fu66hpat7TN1xOw1OHN3XStMVmCzdB3bTtUHxhuVXumqxR3rSdVEWBx6s42X7pesyGbq1XSNtZa5I3DIc0hQfzQuzJ7JqMSNyyWkqA4H0Kn+n6j49SUWpYmD3e+UbKtjgebiBx+mHZHwUp7QFmNs1nUgN4WyEkLBf4pr/wBAdsuTQ177FWupZifrNY/tM+GS/wC5QcpREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREHVfZPnEHTpZMnHWMqI/nC9eu7036d3qvEvQTcBbOmHS1W53C0XKKNx8nnhP+8vcepIiyqeMcirEqAIycLmnTYXsNI0H/MSEeuR+5dLkPCVQumOk6+00lYB/MvdG4+Tht94+9aR59tNM50FRFFkySUksUQHNzizl8QCPioTIfsdj6KffxROe1pMb2O2LebCDsfmt626br7+81FJHb5pCfpQ2tihfk8yWPc07+O457lNNbk+tGgrnVdGKONhklkibBEzmXHhwB8SrB0oVzqLpauNRDMHugu4aHNPN0WGv+bmO/rL4oqW36MuBuUlVQ198gI9xpKWVs8VNLjaaaRhLCWHdsbS4lwBdwgYdRaqpL6+OTic/qnA8ZdkudnJOe/fG6asnbE7y3HeNYUow7buXHdTQ8Ertl3jVkYkhEgH1mg/cuMavhw95x3rDag1AwSscbt1nrRh5GFqN2KDba5Zmy4C02uX3xIM7pMrFIV85Xy5yD5J3WendhwWsTussZ3CCdopOSsNtlwRuqtRu5Kdt8h2WhfLLPgt3XQtNVWHN3XKrPNgt3V60/UEObug7fpWr+ruui0EwkpeEnOy43parPY3XULFUcUTd1KPNHtd2YMq4a5rMbnJAXNeidsl00HrfTjGGVz6NtXFHn7THAE/BrnH4L0N7VNt960q+cDJZuvPXs5VBh6ThQ4BbcKOelLTyPHG5oHzIUHIDscFFv6hpRRX6vpBjENRIwY8A4rQQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREGza6uSgudLXRHElPMyVp82uBH4L+i90qIrpaaK7wODoa2mjnYR4PaHftX8317f9nvU0F96AqSSoeXTWJslLUYHE4MYOJpx39ggfBWCUmljkZ1kMjZGHk5rsg/EKKvMMVdb56OoHFHK0tPl4H1B3W1QW+nt1rip6J75KY8UsRd+a88Q/FadWSMrSPPeuLHV2i4SSGMuYD2+EcxyD2/AbqtNnicMgB/wwvQWoqOGthc2aMPA5eI9Fza7aJoJ5XPifJC494CK59WTSFnAwNjadjg5JCltCafOqNU2yz5bFTvmHWvxyaN3DPiQMBTcWhqZtS1k9ZM9pbkYaBnyyrVpilpdPXCknoogwQzskcebnYO+T37ZRF/1ZSMjh6tg7LRgegXGNY0+78Lv+rqdro3Obu07g+IXGdYUv18NysK49coy15yCM8shRbtnK319FJUy1D34ZACGh7tw3bkFCzWxjpC2GZziORLQMoItrl9hy+ZonwymN4wQvnKDJlfhK+Mr9ygErJEdwsS+2HBQSdG7cKaoH4IUBSnBUxRuwRuqLZa5cEbq6WKbtN3VAtr9wrdZZd27qjrWlqn6u66np2qzG3dcV0zPhzd11PTVQeFu6lGv040/veiqwYz9GV4/wCiipNu6XbHPnHDXMB/rBey+kc9fpSqYd8xn8F4ks7vduke3uG3BXN/3lBo9LlsZZuki+2xhy2nq3Rj4bKqrpftO07afpt1FwcpKkyf1jlc0QEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBdy9j3VzLRrufS9c8e4X6Lqg131RM3Jb8xkfELhq2rTXVFsulLcaR5ZPTStljcO5zTkfgg923ilrKK+NoYqaNtrZSYjc0bska4Dh9OEjHoVEV8eAVaqK50+p9JWrUtNgR3ClZKRn6riNx8DlQtfT5Y7I7ltKp1dIzfKhaiEvDnMGQNyt6riBne0xgnixuPRaUs7o6hsUAaWRjt+foiRGVcRMfGzPEw8QHj5LRrHFzONjJiwM60OjA7WPs+pU7WRtaBIzHC7u8CoCvaWgiONsskRM1O1zy0eBGfLJ+aNOo2SqN10ZRzPJdLC3qZMjfLeWfPhwqBq2lj6xwkcGtG7ie4d6waS1P8AydEtO2Nj7bNLG8u6zrHFhOHPb6cWe/IbhUPXmo3VF9uhp3PLKh7WMc47sazLSzy7WT6lSiJmhZcLhVNp6jELH8QY8748fNRl0gZTDijf22nuK+2Ypad8z3Fpxue9RvvUUrg6R5Dc7gjdZHxqMsfPDKBhz2Au+QUUpwxw1ZDZNmHZj+9qhCCDhB+L8yv3C/MIPxfbV843X01Bu0x5KWpTuFDUx3ClaU8lRYbe/cK1WaTBG6p9A7krNaHkOCo6Rp2bDmnK6hpufst3XIdPy7tXStOT9lu6lFl1jIHacqd/82V4qj//AFDpR/35v+8vYesKjGm6nJx9GfwXkCzRmp6S6FgHFxVzcY/WUEz7VIH/AEy3Ug88Z+ZXK11D2pnNPTdf4mnIimLPkSuXoCIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIg9geyRffyp0UVNlmcHSWuscGDO4Y/tD78ro1bBsdl5f8AZK1HFZ+kKa2VU7Y4LpTGJrXHDTK0gt+PMfFeqrjDVyRh1O6nAwch4d+IWpU05xqGmNM+aZo4iRsMKsNZ1QOTlx3J81ddTNubePNNQkePXuH/AAKiV0lYwuL44Bvya97v+FXZpy7VWorxS6rnd18zGwvLWwhx4OHO2W8jkYOfNWk3aGSjiqTI0u4eJnfnYkj5A/JV3XVX1ta2KaRrGlri4REE7YAyf6xx3ADx2r9VXtEssdFEI4RK5wa3P1S3hx57Z+ZU2qevd0p2gCJkcTwHRxBgH0ZIjeN/Xi8vVVWYunnfVSgtc93E8YyEY2SaQMAdM92Ghobni8FIVVlqoY4nVLjG0ubxhh4uFhOCfUbHCXsQVXM+peKeBnEM4aWg5KVVG+mjDZPrd/kutu0RQad651NJNUOc0AOl4dh5YA5qmXm0VFTKTEzs55nYKaFLE0zGljZCGnYha7gpe52iqpGl7mB7e8t3wo10RLOIJoYF+YX3g+CEKD4wv1vNfpX4g2IDyUpSHkomEqTpDyQTlCdwrLbHbhVihO4Vjth5Ki8WF+C1dDsE4a1u65pZX4LVeLNOA0ZKCR6RboINM1B4ubCF5+6FKF946ZrPEBkGra4/1l0jpku/U6ffCDu7YKueyrRkauumongcFnt1RVhx5cTIy4feAoOddNVyjvHSrqO6QyiWKqr5Zo3A5BY5xc37iFTlt3h8Ul1qnQjEXWu6seDc7fctRAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREH3DJJDKyaJ7o5GODmuacFpHIgr190CdJA1Ppumtd6q2/lrheyMu294DO/wDWxvjv3PcV4+V1sTHU1ht1RE50ckkkrg9jiHAtLeEgjcYyVYPWOrzwwA9+N1566SL1cor1LQQukjiDWubjYOBHP5gj4KS0v0u11bmz6jYaqWMHhrIwA8tH57eRPmMeikZaixahYerlpK5vPgIBc34HcKjkUpMr8TPLn7nHNYXOcTwtBaG9nfmurS2O1xQuhjoKdjHcwIxv8eaoGsbNFa6xhga9kMoy0ucSAd8jJ+HzUFg09QwC18MTQ2V4HFIB2ie7dbUjX1MLo5GATR7PaeR/uIW3o+3SttUM8rXNMjAcEfet25W52RVQNzKwYc0fbb3j18FqCw2iikk0jSGWTrYw0iN3EXODAdmu827t8wAe9Q10pIwzhYOz4hfFvvdbaqJ9PTmOSlmcXt425weRH3cvFYmXaGsbjhDJMdpmdnebf3IK9cKYBxDgCqzdrOOF01MBnvZ4rrNz0jaYtGUWodTXK40sFzkcKJlHRsmETWuc3rJcvBc044sADAIycnApOoLPNp+shdFUMrbNWMbJSVUbi5kjHHhDmk7jtAtc127SD3YJa0zMpbpzd7MhwxwuHMFYS1Wm/wBrEpdNAMSjmPzlWnxluxBHqpWmEhfmFkIX5jyWQZspCkduFoALap3YIQWCiduFYba7kqrRSdobqwW6UbboLraJN27q2UVUGR5zyVDts4GN1LyXDqqYuzjAQVTpju4nlZTB+cblWXS0L9LezPqG+cb4ai8VENFE9v1uEHrHfA8AafJ65ddXTX3VcdLEC8yShgHxV99pmuhtdNprQVFN2LPQh9WxjsD3ibhe4OHeQwRY8MuQcTO5yiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAr5bntdpi0BvNglz/WP7lQ1crBJmxwNdsGhwG/PtOP7QrBEWZxGqTk5AfIPgA4/sXzcJXMqXTQl0bs8TC3YtzvzHJbumKQyXeorCMsbnhJ55cf+axahgbDXOaxuGYBaPLCC3dHt2uNXUNhq6ySqieXxsD9zx9U4xjJ33k4B8VIP1pR0T6ZtxoHmOop2Txvi7WQ4kcjy5Hv7lWej2sFFeYS/Dmx1NNUcsfVId8uSydItG2iioaEbvtk9XbHOPPEU5c3P9GVnzQXq26y05VODPfxA7wnaWD5nb71OwVFHVs4qeoilHixwcPuXn7q8jYHHpus1O90MgkY9zJByc12CPTf4+iux2i5UETDJx/9lqD9Ic/zbj9ryB7/AD38VQr5BcaK5GnZMW1kQ4mA/VqGDvb+l4jv5+S1KPUV2LOrius4wMOZIQ8EH1ypqnlGpbcy2Vzw25w5NHUA44u/hJ7j/Hdu2LNo/WdvvlgpNP3iubarjb+MUU84e+mnjkfxPik4Q5zCHEuDgCMEh2A0FYNfRWJlDa7FYrg2sjppKmepdAXugY6XqMRxvc0cQHUucSBjL8AnfHL7lJM2UsqGGCpikdlwGCXZ7/PP8eNgsV3bXtEdQeGpYN/0h4rUvTn6ay23pGB2cjdQd6twnYSwASDf1VkLQdwsE8HE3fmo255LG+N5Y9pBHMFfGFarrbm1AyBh45FVuaJ8UhY9uHBZVhxusjNivzhX0Oag3qV+FM0NRgDdQER3C3aaQjG6C4UVXho3WPUFzdHQvaHYyMBRNPUhrfRRt5qH1UzaePJc44AHmgvfs9WumfqGs1bd4i+22SB1XMMfXLeTR5k4A8yuaa1vlXqTVNxvda8OqKyofLIW8suOTjy8PLC6R0i1zdGdHFt0NRuMdxuAbX3Vw/MI+hiP3vP9BceQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQFcrU1sdipHNBBcwknGN+J33cvvVNV4m+jsdtYXDIpGghvdl7z+3PxVg1dPztpbXW1Tml4ZJjA8gP3r81BPBUtp6ql6zq3gjEgAdt448186HHWx15expY8sHDjb7WQtzU8MbKKIxsaxrH8mjA3CCHtMnWVoicWgPb1YOPgP+aumvIn3i1XK4tgJqRcKSsc1uSf8rpQ9+36zGj4KiWk8FzhBxu/v9F026k1OmxJGMCosBdJg79ZS1zh/+Eu+ASDljnFjw3BOe4c1sMzgbuPof7/l5Ar5ucULLo5tNJ1tPxO6txGCW8xkeOFiiimG7Mgn+P2/ioNsMY8Z4iSOWHb/AI9/csodURtBjqSCNwSeEj0Pd6grWbLwcTJJO1nmM4/H5eCOuE0bsRtYQ043ychWCdqZRqGD6Uxi6xt3w5pFS0d+B9sff3eCrTi6mmDoi5r2nx5HyWwLrUZBEUQPcRnZb8klLepIQJGw3AtAeZBwsmdk53zseW/fv386JvTt5grmtgqHBk/LB24lNSwOa/iG4VAr7XVUb+KWGSIt+20ZGfUclOaZ1QIntorufozgMn8P1v3pU0mZ4WuPIKHu9r94jJY0dY36vmrq+3NewSxcL2OGWuadiFrPoCDyTQ5ZJG5jyx4IcDggr54Ver9p33phmgHDMB81TpoJIZXRStLXtOCClisUexWeN2CsYavobFZGz1xaw7qw9HNJRxVlXqy9ROktdob1rmZx18vJkQ83HHoMnuVbpaWauqoqWAZe92PIeZ8ln1le6eSipdPWl4NtoiXukG3vExGHSHyHJvlk96CJ1ReKu/36su1bM+WapmdI5zjyyeQ8ABgAdwAHcoxEQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBFKWbT1+vMoitNmr6555CCnc/wDAK/Wf2f8ApYubWPZpWamY7k6plZHj4E5+5By1F36i9lPpDlaHVdfZKXPMGdziPk1TFL7JN5c3NXrK2wnvDKd7v2hB5pG5wrvqM+6wQxAn6GniAaRy+jDiPMb5+K65L7Lj6SpjM2taeSMOBeGUTs48u0t/UnQHT17iaXWXVMwQGSW0nA5DcSDkO/G6sHALPXvtumJJ42NdI+rLRxfqBbFxrXV1sopHN4HPc4uA8mkft+9direg+SGgbRxXilmha3GHwHJPeeYwoG59EF4bHBHTV1IGQ5w0scBv8Sg5Rb8i6QEdzv2Lp3R+xtwjp6OZ56t9bWUJaT9mqpRGz+2x2P1lHHop1DBVNmEtJIGHOA9wP3tUtpbS2pbPVy1E1NE6NtVT1cQZO0njhk4wN8c8lBymZgiqoWjPeHDwOSPwwskNQyMg8HaB8vH0+PqrJrXTF5Zqe4yUlqq5qJtZL7tJHHkPiDzwHbxbjnuoMUUsMgNTTzxvJ5StIOfi31PwCmhh6uOfilALS4nOeQOefphYqunEbA8P57lpGCPVbsnCxvFw5GO9vPwGMd/f5rCI3zO4jxPIPfvwj9vomhoMYSe12Vfv5NWybotqr4ync2tglo2Nk4zyk67j25fYb8lTnws95gidxYc8cee/f18PxXTaF7pOhGvc7A6y6ULDjuAincfkCtQUWRzJ3CGtY/ETWt97a4B7RjcO37QHzH3KLkEFRI8QEysYObhgj+PmtyGmfWxzGlNPNVzbMDQ4OJecEZO31S75KwdFejrnN0h263V1GCP+0zREhwMUYc88W+MFsbx8VRH6P1TW2Gf3eaM1NATh0RO7PNp7vRdbsclo1FSmotVQyVzR9JFyfHn85vMeq5J0g2XWVPdKmtutprYaV8jjDiP6FrCTgNA7LR6KvWe81FsrY6qB8tPPGciWB5Y/Oe/ux5Y3U2O+/kp/G5jonNc3m3y8VDXrR8NyGTHwSdz281k070y6bmt0UWo6Gq97YMOnhiGHeeAdj6fdyUx/0sdHeAesuBPh7urscyuuhb1Rlz4YDUxgZzGN8eirM0LonuZI1zHt2IcMELtVb0zaJp4yaSgrql/c0sDR8yuSdIuuZtWVLRHb4KGmjOWNYBxn9Z3f6clLoQNVcHxxyU9M/h6wcMjhzI8M+CjERZBERAREQEREBERAREQEREBERAREQEREBERAREQERZ6Gkqa6sio6KnkqKiZwZHFG0uc5x5AAIMCtWgOjzWGu6z3fTVlqaxoOHz8PDFH6vO3w5r0B0XezVabLbotUdMd6obRSgCRlvmqWx7c/pHEj+qPmuzM6Xuh/TNuZabFeIvdYm8MbLfBJ1XwMbQ0/Mobce0d7JVVTxR1Wqav3mQjJpoZhDGPV5Bcf6oXSrR0Q2vT0QFt0tpUOadnymSV/9YhQuoumvRM7T7pSwzOOd3U2CfmFz259KsJmfJbY20xzsYhwH+zhE3HdH0V8p2cAtlqLOWIZZG4/tBYfd7gfr0VXD5wV+R8nH9q4Zb+mfUFPMOKoZWRDdzJtzj15/er5prpcsl2c2Grc6hqHHAa85aT4Aoq9G21RLXuuLnM72SxBzvTIK+Z6SmjOzT6FxIX5FXx1EAlilbIx3JzTkLHJMSOeVYza0K9oDSIWua7uIJUMW3MO/wC0kjwKsZBeMlqxuhB7lrRtXJJLgNieL4laznVLj24pW+bX5/FWh0A8F8PpxjYD5K6NqjI2QPLXzmPH+ujwD/S5FfMsDxglocD3t3BVnlo9875Wg+2taXOgLqd5Ocx8vi3kVNG0GKdr+7HwXzLa6edhZLDHI09zmghS0rXwZNVC3qxuZ4hsP1hzb+HmsrIWuaHxua9p3DmnIKaXaiXfo505cGkut0cEhyQ+E8BB8dtlUbt0WVVNTuFrqBNk5xJhr/g7GM7+AXbmxA8wvsU7SOSaTbyNqW1XK0VQirqSWmkB7JLdifI4wRy5eAV4ppCOhCZjWuJkvkcfZxnalk5Z/WXdbrY6K5Ur6atpYqiF4w5j2ggrnfSD0eVLtCyWXTUXZ/KArXQvk3P0ZYWtJ+B3PipYu3NtHMLq98sj5nCGTDRK4Eghu3LbGHLpnRdUNjrNX6jxk0tGyghd+nK5se3oOuXM9MRSWpksFwaaeoY93WRydlzSAOYO66Hp6antXRLb4TkVN4uUta8/oRt4Rn+nLJ/VUirnbdRNNO6lqWNdE4Yc1wy0jzBVb1B0daR1P1ksdKKCqduJKbYE/q8iouGrB5OBUvp24yQ3KBjX9mR4Y4epwtJtzLUnQpqKg6yS2yxV0TdwM8L8LnF0tlwtc5guFHNTSA4IkYQvcbY3GIOa3JA3HiFF6g0xZ7/ROhrqKGdrhsXN3Hoe5TRHiRF1LpZ6KqrTRfcrSJJ6Dm9hGXRfvC5asqIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiLJTwyTzNiibxPdyCBTwyTyiONuXE4XR9C3qTRLTWWJkcV4e0tNxlja98Oe6JrgQw/pHLtxjhxvH6dsVrhEZuN8pKPi3fI2KSpkaPBrImkZ8nOZnx7l1fSVP7PFtfFLqKu1ne3bcTPchTwE+PDG8yY8uL4Iza5Td7zV19Uay511TXVL3ZdPUzOkeT5vcSfvW/atPaiuYElFY7rVMdu10FJI8H4hpXrrQ+tfZ0gI/kzDZLfVsGGiroDTTH0fM0F3wJU1qLpCtrYXe6tgMZHZIIIx5ELbnXjuTROrWjt6Uumf06aRv4tWNlhvMPFDcNPXRjDs7EByB5Oxt/Gy7nqjX0T+LgDCTnYLnV71S6Vzi6QtJ+yChIqkNotlM5sFXRXJ2TkOc7qnnP2XAtPLcYDt/HvWKS3QdcKQ0vUYdnjJPET4EH6v4L8u97lqOIMkcGnng81EflSqbhrZS5rTsxxJaPQd3wUa1f1Wu037UelZQ6jq5pqUO+o7Lhjwx/A8l1rQPSfaL85tHWPZR1vItccB3p/HyXFLReI6lvU1AAfjdpPP0W1U2Gnrc1dtkc2VnayzZwPp+0LpMWPbV7erYGNcBjcFZjTjGwXAejHpOrrFVR2bUgMtMSGsm72+Y7vh+B5+hLfUU1dRx1dLKyaGQZY9pyCFNNytN8CxPhKmDED3LHJT5HJFQxhWN9NnuUuaY55L6bRk9xU2K++nc12QFoVFtLXulonCnkJyW/5t/q3uPmPjlW99ve4Z4Vo1FG5hwRjKorMM7DOKepjNNUfmuOz/Np7x/BwvrrZYK7qpowIHN7D/F3gVLVdFFUxGGpjEjM5HcWnxB7ioyUVNuYWVQNZQYA60jtx/rDw5bj4gc0GYPaJTE/DXZ2wcg/FZ+qBHIFYJCX0reB3vNG3tNA3czPn3r4pap0TQX8TojnBPNuPTY+KKr2v9A2bVdH/lkJiqYwTFURbPYcf2h5H7lxnpps2pLZVWt1up6sWu3W9lOJ4M8PFlz5HOaDtl73HfuwvTjCx7QRuCFqVtE2QEho3UXbx7Y9WXCJ7ffozUREgB7Bh37jyXXOjPF5vlNUQPD6eAde5/jj6o9c4+RVzvPR9pO6ud7/AGOmLnHLnRZicT4ktIyVL6V0xY9NUZpbNRtpo3Hid23Pc4+ZcSU0bT9MOEBYa8SUrmVMfEacfzrGjdo/OHos0Wy24wHsIO4KiNCWGkrWSW+qdBUtdGHZZu17SOYXmHpw6LqrTFdJd7XEZbVM4uOOcR8D5L0y21uiqQ2A9jPFGcbxHw82+S3blQMr6GWhrYWPEjS1zHYIP/NLF28BEEHBGCvxdP6T+jC5WK7TS2yhnmtjzxRPjaXGPPNjwNxj87ljmua1EEtPIY5o3McD3jCzZpWJERQEREBERAREQEREBERAREQEREBERARF9RsL3Y5DvPgg/Y43yHDR6nwW/SUz3vEFNE+WV3c1uSf7lNaW05VXep6mFhigYfpZSM8Pl5uPh81K6hraW0RvtFiY1jQSyeoJy97u8Z8By+4LUx/LGWerqKxU0csTuGplY6YHBZxcRb69w9F+ObxN4XRMAPr+9Z6SB0hGBz7z96xVLwX8Dfqj700nsxtkmhw2CaRje9oOR8lu2y/3S2t4KWqmhjzngjd2D6sO3ywtF23x5eaz0FOHNdJLk52AI5Kwqfh1TJUsInLWO73szj79wtWuuhPLLt+Z/Z4qBmYGyuDCWcJ2cCvsCTq+Lha4YIBbuP7vRFkbdVVzNYXPkyQTkN2x5LXjrcBzn8Th3BYGxvlHE954QPksT29nIGcKK2vfZHvyx3A8HLSDuFadLX2Vzg3jMVVFzx3+Y/cqRnfJOMd6z000wlbLCSJWHLSPwKTLRljK7xZrXbNdUr6MvipL4wF0eThlRt9x8ceu4UhoHUeoNAXoWW7Qzy0bn8L4XDdh23HnjHkQR5Ec401c5D7vcKOV8E0bg5rmHDmPHh6L0HTtp+k7RDLlStbDqe0FpLWuDTK4bgfqvwcZ5HI5Zz2mq82WVwdKtVbSXKhirqKZs0Eoy1w+8HwI8FuBuQvPundeV+mNWztq6UxUUrgKmkxwua4bF2DycPv5HxHfbbW0lxoYq2hnZPTyjiY9vf8AuPks5zVsjrx5XLGWzTPHECVtRQhozhYofrELalOIjjwKw2xcEkmera3hBwXOOAsEsDge02CXyyf2rbcQ2NjW/VDR+/K15XjJx6IIqqoonvPVNMbu9jj+CjaiAxuONiFOVPC9uCeXJaErA/i23Gx9VRWZ7dNTSGptnZJ+vTE4a7zb4Hy5ei2LPV0MjnkwFshy2SInHa8CFJyR5PJR1xtsdUesDjDUNGGSgfc4d4/gYVV9MbwnsgNb3NHIBZmu2UdT1kkMopbizq5fsP8AsvHiCt4jbI5IPmogbIMgLUfFwPDcjLvqjPNbgcQksbJmFj8jOCHDm0+IQ01443jmFuRDhW4yGlqIWM2p5gMdYT9HIfP80/csE0E0EvVSxua/wI5+ihp8ydobHB8QsMTXM5kndZ3MezHE0tzyyOa/OHZURt1ic0GXP0bvrHH1T3H07iue6t0lpTUrJ6e6W1lPXYLfeYQGSA9xzyd8c/euqhrXZDhkd48VzrpXtd1oaIXmyPj4YAeujkaXAx/DvH4egRjPf4eQ7jT+6XCopeLi6mV0efHBwtdbFxe+W4VEjxh75XOcPMla65OsEREBERAREQEREBERAREQEREBERAVl0jY6i610FLA0h0hzxluzGj6zz5DkPE/FQ9lo5a6vjgia4uc4AYbnc9/wGT8F6S6NdJ0+mLXJVXSnDrnUHenkOW0zG7Ma/8AOcNyW8gTvndo1jN1nK6nTXo9JXFunHUmnaaOBoaWNqqiVsUTT3vLnfWd5NDjnGyjbZ0RWCOCN181HWVMoABit9OGsH/9ku5z48AXTxbtQXksqIqV/V8IYyapPVsDRyDR+aO4NGFl/kXPjNdcQXd7Y2nHzXS9uMmlCh0HoSFrozDepARjidXRggf0YwtWXoq0NUZ91uN2pZHcuvLZWt+QBV9qdI0jC3q8yZ+sS/BG3h37qLnsU8DSY5JmEEjtcjvzwstyOc3joeutHBLNQy0VypRv9Cwh5H6vF+GVSnWWaOT3bqBE5u3BktcPg7fPlld3obnX2qccbiG+I5H1Ckb/AKbsmvaEyDhobuxuY6hgByRyDh9pvl3Z2wumOU+WMZ4W9yvMdZZZhLJwOcHZ3ZIwtcfTPP4ZUO9tTQyuEjCwE5LXDY+i6reLTdrVVust1omxysfw44ssk32IPcO8H57qOfTU9Q6WGqpPeYwC2Rj9pY+/Ow3x4/8ANdb48s3jXKeRceslAMsRjc5pDg7BI4d896/GwxyNByQ3ux3fA7qy3vR0tLR/lC1yCamBxI3PaiJ5Z8Qe4quOMxqRAxoDh2Qx7s7+q4Z8eWN7jvhyY5zcrZpLO2o7UD+s9DuPUcwpOk01UO+pE74BQdJVPimEzHua7uLefzVgpb1XloEs888WObXkOHljOCuTol7TaKqhc4vjcI3bkeav3RlqM6Z1TT1zj/kr/oapuecTjufUfW+C5kxzZ/pKeXi4d8jmCrHSPdwDj+t3+q6YsZ4yzVdE6fbLLT3qG+xOifT1P0LzGAMStyc7bYc0cQPmfBavRDrqbTtcKOtkc+2Tu7bdz1Z/OaPHy7x6BfVmo7pqLQ95hFU+cUvUvjhcMkCNmGtHh2WkDx4iueg8L8ZHD5nYeat+scf/AB9f0ez6aWOWNk0T2vje0Oa5pyCDyK2+IFi4b0G6zmje3TF0lBbv7q8u3afzfQ93n6rtTXeJWa6R+mTbgOxHJYJHHuwvyaVvHw8JPmO5YZJNjwkP/FRXzISTvhYYxmV4/QyfgR+9fMskm4ELifUBYutELXlzw6R+23Jo8FYNhsbSV8y07SOS1o6k5zus/WPLQcHcbINGuo4KqAwTs4mcx3EHxB7j5qGe6ptLgyocZ6QnDZe9n63h68vRWFzHuzssL4XYIIyDzBVVoseyRvGxwc0r6ytKpts1ETNbRlm3FT+A/R/d8lsUE8NZGHRnDh9Zp5hBtRP4fMHmFv0lzlgiLGAkZ7Ic7Ib5BR4aW9y+27oRsVlVLWOaZMYbyAWMN2X61qygIjC5p7ljkY2SN0cjQ5rhggjYrb4U4Qg8qdOvRRUWSom1BY43zW2RxdLGAS6Ann6t8D3cvBcXX9D54KeoifT1DBJFI0tc0tyCCvJHtBdGcmj7wbta4nustW8lpx/MvP2T5eCxlGo5OiIsqIiICIiAiIgIiICIiAiIgIisGgNPS6k1LTW9rXdVxB0xAzho/eg697Puh54I4b6YPeLlWDFDGwAmFhBDnHbZx7j9lu/Mjh7O6qsunctp4obvdGj+ecc00B8Gj7ZHjt5HuUW58dgtQsduxHL1Yjq5W7EAf5lp/NH2vE7chvUbzd/dR1UAD5T9y1Gatlz1Hea9xM9wmYz8yJ3Vt/s4z8cqObWTl2WVkpd5TH96oNQyvrn8VRUyBp+y04CwC1ujdxMllaR3teQqmnVKS9VcRAmInZ38f1vmp2lmhrqfrYT1jB9dh+sz1XIrbd66heI6tzqmDxP12/vVzs1yMEsVdRyBzSPg4eBRdJe72xjojIxocw8x4HzVZglqLPXNljc4Rh2fRdGb1UtPHWwDNNUDDmfmnvb/AB+xVfUttax74x2mYy12OYO4K0aSGqrHSa60i6ogia6408ZMY/1g72Hxz3eePNcopaSkuVprIKoup7rQQ9dBUYPFI1mxDh3ncA/Aro3RldX269+4yk8DzwjKy656OZpdV3K52t/CBS/lKnp2gkzPB+kjAHMHG48XgL2eJnu+tfO/1DCY4/tN6/z/ADbi1vmZ7z7y5zaeKUmObs9hmfFo2Lc7keGcdwVav1qgorwY62kJY054HEjbfsk948D3rsvRJo9l81bdLbeaB9O33V/HFwngikIjewO7wd8gc8ZV4vnRRatR2+C3yVTojT9b7hUBgLvd5MkQPOcnqZOXLY4Xq/2+XJg+fl5+HFyaePZw51wdHFTPile/sRsBOc8seuy7F0cez9rnUbGVlxhjsFA5uCa7PWvB+0IhuNvzi1Tns+1NL0b9OosWuLVSifi90ZVSR8Rp3u+pLG4/ZdnBPg7u3C9jXu72elk6yevpKZmdnSyNaHemV4eLinvfaPX5fl54ccvHZ3/2/n5049HdX0aanp6Wmq6m4UNUwvpanqDHJkHDoz3PIy3cbHiGwUZZ7jLLG19SzhO/EQ07+eO4r0J7XFVa9adHTbvpqb8oCyXAGarpzxR8LwY3MDhtkP6v5LiVuu9vueloKaWy2+nudKyV5roQI+sHG76N8bRwnbhw47jPhzcnHJbrp18XyM8+LH3m78qwaa1BddNV1xbRvZHJJSOaGSNy1zm9oHBG52c0ctzzHNVWUOLuENO47lHm7zx3CSUud15Ic153ZnO+w2Gd+4j0W4KkwSNY/h4nAO7B4ue43HgvPXtk1dt+1zT0c1NXxScLonZ4h3YP4/3L1LojUUWodN01xbI0zcPDO0DHC8c9vPn8V5VtkBqbhBTce00mODJAJ7ht48vkui9E2rqe26pmtQ+hoJsRdp2cvB2fnkNzjbbB8k11smU3p3x8uN9lrydW8gkb+I5rA+XJ5rIwgrLbHOxxPY2CxCne7626kY2grOxjfBBowUm4zy/Fb7IBgbLKxgWxFGg1fdx4BY5IIsYc52fARkqWZDnuX2aQOHJBXXQxBwIbKf6IH7VFXq1GaUVlsb1FY3d3E7syjwIA2Pmrk+hHgtWWjxkgKip22sZWNdHIww1Ee0kbtiCtl0RByst+s0lQ9tXSERVsY7Lu6Qfmn9h7lgs9dHXsfFKOqqYjwyRnYghUZmHK+yQ0dpjx4ZC/XRFjthstqie9zizjwAOWN/wQYIe2zOMHvBX31azyRyce8gIHiQsjI+LkoNFzMb/sWnqCyUGorFVWe5wiWmqWFjge7wI8wpiWEDbbKxRdl2PBVY8C9JOkq7RWrKqyVrSQx3FBJjaSM8nBVpey/ak0K3U2hjfKOEG42oGTYbvi+034c140XOzTQiIoCIiAiIgIiICIiAiIgL0L7PlnFl03NqGQOFXUHFOQMYO+Dny3PkeFcBoIPea6Cn3+keG/evWVJTCgtNBbWYayngblo/OcMk+uOEfBWDWudQIKdzhz5D1KgIYOJ5lkGXnvKlbvh9U2IcmDJHmsUbBjkrEYGRDwX0YxjcLaa0IWKojKimDhsFmsE7qaq91cfopc4Hg7+9bD2LRqWFkjZG7EHI9UHU9BTioZV2mR2OsZ1sX647v48VuXiAz2psmATA/qz+q7JH3g/NVvR1WYL7QVA5Oe3I9QrzcIAye6UY5Bj+H+ieIfcFocor+KhusFUw8JY8b/ABXZb5dHQaFpdRRN43Ujg15HMRy4b8g4tJ/VXJNVRAxOPeF0vSgF46G7xRPGeO2TAerWkj8AtcWdwzmU/Dlz8c5OPLC/mJ/RPudys0V8Y2MVVVEOukaO05zOwc/1Vz+g1RW1LbzR0zo4Kync6oow/ukL/qny4iCfQrn+htZX+w6E1A+ikbI621dOAyYlwMb5A0kAHbJcBnz8lAXO6VN0ZPcY3dTUVP0zury0BzZQTjf1X3svIxsfleLwspnZfm2/04Xil1pRjV1uhNNW2aeGnmdntOhlaSxzh3FkzJGD9ceIVNqtWX2y6lg1LE6Cr/KNH1kbalrnxgnsPa7hLS/hc14AcSMEZB2xa9M26C5uvNse9zpLpZav6PHZ66NraiJw8SHQnfzxjmTzW40rq7o1knbJk2m4gA52EM7Pv7cWf6ZXyvIt37Pt+HhjMbxfiN3UPSJq680QobheJm25g4Y6GmY2npWjuaIow1pA7sgnzX1oi0i7Xirp45+qY+hdODjO4wOHHmSPkqlZbcySKSonzJHG0kdrALsbb+CnNC3uWxXWKsbIdo5InYbk8Lm92fMDdccMt5T3+PTyYeuFnFNVgjlE0DJGOwZWZPxCkWt6p4a85IAwcjkdx9xVfMohkDWkcI+yO4eCkJS80tNUYPVvj4Af0mkjH9UNPzXL471IVFRgANOHA5B8CFJ26600bDOIs1U0gD5H42dncjHLOfxVVNSQOawirDA8EFzju0+Cm2vV616N9QNvmn4i6QPngAa/PNw+y75bfAq3ROXmDoO1VJbL0KeomxA/Z2fzSd/kd/gV6XheDgg7FQiUhdstuI5CjYnrcpnZPNFb0e624WrSjOHYUhT7hBtwMW2yPbksMC3YsEIMLos9ywyU2c7KQDQhaMIIKekBztlVPVllnINztbMV8LchmcCYD7JPj4H9i6FJED3LTqKcO7t1RQdM3aK90AmEb4ZWnhlhe3hcxwOCCO7fKzWud1XUPh4BG9jGOAz9YOBI/BfmqLVPba519trMEb1UQB7Y/OAHfjn5ei/KWOKrbHcrfI1p4TsX7OaTksz3EEktPIgkeComXyQloDG4232X5EA12BsFqwuc8ni3dlbsbfoS5xDS3nxHCCGMpoNUCWcNlje4jtDOOLHD8NnN+Ck7gIDU9bT7MeM4/NPgvyqqbPOzhlrqMytBaW9Y12R3gtzuFi4qVzOGmJPDj7LwPgXIsbTWR1FM+nma18cjSx7TyIIwQvAHS7piTSPSFdrK5hbEyYvgOOcbt24/D4L39SHcZXnP22dMZjtGrIGDYmkqCB3c2E/eFikrzCiIstCIiAiIgIiICIiAiIgs/RbR++64t0ZGQ2TjIx4L0bVW0VNe80tTNTZeSMPJwuDdBTQ7pFoWnvP7QvRNCM1hHfurEqqSx14le5tQyclxyZGgZ+SNqKyLaehLh+dE7P3f3rfLMOdt9s/isrGrSNBtxpOINkMsLvCSM/iNlsRywyj6KaN/6rgVsuhY8Ye1rh4EZWrUWqim+tC3PiO5B9PG606xmy+pLXLGP8nrZ2eTncQ+9a0zLjGCHvhm8MjB+5BadPkie3EHfrI/xC6hcHNN+r8/6uTP/wBsrj9ku7KOtpPyjQVUTInNLnMbxg4+S6DSahoLxXXWsopJC1sT3APjLTg9kc/VaFP1T/MvXRuht2dDVrXnsmmlHw4SuZammzA8krpXRyfcujGvqD2eGgmfv+q5SfUy+OLaLt5uFs1ZTkECWwtqCCdg+OaF4/3Qq5QODqeNmSW9ZPHv4dv9wV30WaaPTWt5pQQxljFOcHGBLMxgwfHYqsXia3e8wG30sVJTxRnstGOMhhDnuzntEnJX1vXuvhYZd3+v9kv0aP8A+vGnhtj3sR+oe8xEfJ5XNrJTmHTes7M7D3Q0Ecu/jBURtJ+TiuhdHThJr3TcbMNIraZ5bnu69pJ+4qlWhzJblryoaQY3WSveHDl2p4iPxXDyJ+69Pi3+Nf6T+6t3ue2N0/TWy3vL3MLWyPALeI83ZyNwT3KJhHDVOYTwgDn4dpaccj3TNjbJ2DJyW3OeC55OMcIK8Ny3X0ZjprVEgbUSY3A/uW57y4UFPEHdnL3Hx4jjO/hgN+9RdQ9753uJJy7vWSJ5FO3jB4esOD8N/wBnzWNt6bRkDgRxYPdnvWCRzmu4XAh2cEHuWISDO4aR4O5LCSOI4235BVYsNhq/c7pFIMnhw7H538ftXrDo+u/5T09A5zuKWACJx8QB2T8RheOKeV3YkacPZ3/x8F33oGvTjKaKSUnjZwDJ54HE37uIfBa+xi9V3OKTzW9TSdrCh4pNsrepZO0FlpPNcOFj/HZS1K0ugbI0eqhITxUpP5pBU1p+oAlEEuCx/L1QbLHbeCyWepbPG8NO7HkHdfFUzqpnsxt3eihNPTmn1DVUTzs4kt/EfiguC/QvhpWQIPktysb49lnxhfhGUEVWU4c07KlOsU9trZ32+paymm7XUOj4uB2d8b8vw9OXRJWZCh7pTbEgKinx0Es8pbUVdSQQezG/q9/6OD9626SyW6WJ4lo4ZZIyCHSN43Y9TlbfCWScQ5g5C2osRVbX8o3bEfolUfVvpoY4sRxMZjbDRhfVVTg9oAclmhb1VVwn6rtv3LZezOQQhEC0cD8earPTdp9mpuiq9W7g4pWwGaHyeztD8FbamPglKyBjJ6eSF4DmPYWuB7wQpofzMIIODzC/FP8ASLaTY9dXq1cPCKeska0fo8WR9xCgFzbEREBERAREQEREBEX3TxPnnjhjBL5HBrQO8koOj9BVqqTe5b2BiGlYAPEuc4Aei760iC6yeDZSPUZ2XPra2PSul6WKtjhpRG1sJEcheZM9rJ7IGOIcvFX1r3VNNTVeM8bBG7H5zBj7xwn4rUib2j6uIx1s0fg/I8wd/wBqMarP/JO71bY6yRkdI3h4T7w7hLh3HGCfuWtVWHqCQ6vp3O8g79yqITC/CFJOtVSR9H1cno7H44WrPSzw/wA7C9n6zdkGpKNlrRRddVNaRkA5K3JGZCz01MYm7t7bvD8EIntIRsjqJ7hL9SnjJGe9x5ffj5rNPJHS2iTDGtkneGEgYJa3c/eQvgA01JFbozmR5Ek3r3D9vyUZqCsDphAx4McLeBpHInvPzVFevj+ulZA07vcGhXrpOuztJdAVzkiIFRURR0kW+N3kNcR6N4j8FTdMUpump4W44mRO4j4LU9ri51Mtqs+maGJ8kcTveakNGSHEFsY/3vmFrCbrOdkjnVk1HdodOTW1lW4UleyM1bHNa4ydW8vbuRkYPgRyW5U1VM+hJcZGSGNoLHcu0Rn7gVW7DFI8xUrgePcOb3tHerJKIZauFxc3tSOw097Q0tz6DLj8l7uG5XG2vm88xxykiz9FTWt1425yPHBa6KSrdjvbDTyP/wB/hVB0/H7t0e60rS4592pKFjvzi+YFw+URV0ikdaej7VOom8MclWyOz0x/OMruOb5RREf01R7qJLd0YWy3vdia+3KStcO8Qwt6pgPq90jvguXkXX7sa8SS5ZZ/0ii0bc1UQHcclZbhJmsf+iAFtmnbS3OWMYAjJ7u7Ci35ke5/icryPob2wyOPAN98r7jBMBcc8xjbv7/2LAd2raibmjOMg5yVlprud2kLl+EeBzvyQAHG+/eMKqzwOOHcPPGw810HouuDrdeYB1wcWkElvLLTnHyyFQKFvFUBmMcRxyyrFp5xpa+GQADE4zjwJ/cVcXPL69fU8rXsa9rstcMj0W/TSdoKraUqDPYKKQnJ6oNPw2/Yp6nechKsWu2O44ns73MIWeilIc14O4wQtGwvzI3Pis1MS0Fh+ycfJRVwnc2roY6pvMDtftVVuTXU9/paxuwcQCfT+5TNjqwzigk3Y8bDzWC803EOHYhjuJpQT8b8gFZ2nZRtHJmFm/ctxjkGzzRfDSvsFB+ELTro+JpW6VimGWlBVKqPhlK+gBJSAci0lp/Efx5LcuUWDlatGB9Kw944h6j+4laGw7MlNHID2h3/AMfxstwdqNr9u0MlalIAY3N78kftH/Etij3jkZ+aeIfFQaNxZ3rDSO7lu1zMsPko6DsyFUeK/a0tQt3TBWTNGG1sLJ/U4wfwXI16Q9uOg4L5YbkGY6yCSJzvEggj9q83rnfrcERFAREQEREBERAUzoiKObVtsjla97DUNJazPEcdwxvn0UMpDTtY6336hrWv4DDO13FjON0HTumaTqbHAymiuMDDO08NQ9xGwOMcROF2v2Ypxf7dDcJgHxwRDsu3AmbtkeeMfd4LlvSVbnXjS80dFUVtfJFhweYwI8syCAcAHbPLJXQfYqZNFou5yyF3VurS2MHu2GfvWts6dg1FJkkuOVRLg/iqSPNXLU8nC948CVR3nrKv4qiTo4xwAkdy3oIxkAAcJ5tIyCsNM3EY27lu0jcuCD8OnLZVSCUU/UyjcOj2Hy5LXq9L1EBNTABU8P1W47/NWehbyUnDGC3CDkFc6ahD+tz71JnmNxnm79yq1ymLGlnMrv8AdbNQXOEsrKdj9tnYwR8Vzu+aAlp7xDUU/WVFId8BueE55HC0Nfo8oIrZb5LlWZb2TI8gZIaO4DvPkqXqyy1n8vvy3qySKK3w4uMsQkzx8LmtigPhxO4I/TicORV01VV3q3XW1WW3WyccbxI+aaNzIcgZGXYxwtA4j6DwK5vc7hd+kDWA05Zqp1VHUynNTwCNvA3IM7gOTGsJDRk/XcT2n4Hv8fjk4/b7b1HyPO5s7y+k6xk3ar9RJJVy1OoJayOquV3mlklkaws4Q6QkDh+yDw8fDvgcPeod87WRurGx4NSOopj38AyCfTY/NdM15oimhqLTprTBfLU1fFGJHO2EIOJJi7k1gwWjbJw8jkudMulLZNUNuEvFURW9jvybwtBjkkj7MbjncMB7fLJw3bBK78mN4ur+HDh5ceXvH/IlOkX6Vum+jy0TieWl7VXwbh1dM4BwOOfVtayPyw5RPSJZb9Nqllugs11joLexluoHTUkjA9jBgOy5oBLnlxzn7Q5q7+zLBpyLXlNqnW11jpmyOf7hHKxznVEmcPdsDgZOMn9JegOnPp20nbejar/kle6W4X25M92oGRA8UZfkGXBG3CM4zzdwr5udud9tPdhrjk45Zt4h1ZVWq43maut9KaKndDCxzXuc7MvAA85JJwXcWPIDYKFqY+olkp5MN4sNDt8DDmuXTNV9DGsLNoxupasUckLYmzVFOXnjhDyBv4kZbkZ8fBVCCrpDVR1Ej2NHGeCJ0nE+JzSN3AjO+BjyGFu8WUy1nNVvDmwyx/h3civ2a3CruENHgAzEhrnSNYCR3ZJx/wA/Rbj4ozQCONmT1Ydx4I4hk5GOXPvCsjnW+qglnLY3yMlL4mRsa1uXAZbw4OAMZDcDn8Ta9HaEt1fTvkuMgjNQXQMjifgAMxkgYG5IJ5YAB78rePi3K+uLOflzCe+fX8nFV+fBTut7I3TmqKu1MnbURxEFjgfsuAIB8wCFClzeQ+a8mWFwtxr24ZzPGZT5X1TOHvDCSAA7cnkrrX6dudopRWztiNK+RrWysfntY4uHBDXZwPzfBUhoGAzPCC7njOF23pJfZY9C2mjpKhj62OeN0rcjiGYjxZHPnw58+e678HHMsM7fw83kctwzwk/NdE6NKrr9Nt7XEGyHB8iAf2q3079+a530QvDtN4z+Yf7KvkD+0Fwr0xarHJ9IzfvW2XkV1Q3/AOo7HzUTZJMSt9Vvzyf+86gfp5UVLU0pDgQcEclItnMjQH7lQsLsgFb1O7YIJiF+AAFtxvyFGQO2W5E9BvsdssjStaN3msrXIM4K+X8l+ByOOQgjLgzLSounHDWRAjYu4T8dlN1oy1RBbmqjH6bfxVgyU7eGWQd4bxDzLTn8MrM0iOpDvsuyPgf78LDA/FeHdwJz6ErOwCRrosYfGS31CaHzVDYhRWOGT4qVeXOY5rh22j5hRcv84SqOCe27SdZo6zVgH81WFpPq0rySvZ/tgQ9f0TPnyCIauLh28TgrxgueX1qCIiiiIiAiIgIiICIiDsvRnqeC72uO13WrkbJSMDWwtcW9e3OATjc8IwMZxjOcr0t0S0dHTaSbLbqWKmgke5wZG3AJ43AnzOWrwTS1E1LUMqIJHRyMOWuacEFe/eh0SHoosdTNjrJaKOd+3e9xcf8AeK1Er81XMDPLg/aKqVKeKq+Km9SSkudnnuq/bXZqPiqizw46sLeowOJaEP1QFIUP1kTadogBhSkId2QxuXO5eA8Soyk5LYrpzFTcDHcL5IpY248Swkf7hQ22ZaiMUxlE0ccOd55HYDvTyWF9S+FjajeSBwyJqc8QPmW/uWa2mnqrFTyMDXM6gDBHLZV3Sc35Mor0+QFtvjqv8kb3bgZDfLK0qzxTUVzo3Q1cMNbTyNLZBwh7SDzDmnkqrV9FNqpm1dZpAstctY4Oqo43YE7AP5trjkxNJ58IUp1lNSsjuVymfRyyN4g2micSxvcXkAqz2ycOcwtkjmZJH1jJmcpB59y1hyZceXtjXPl4cOXH1zm3E7QyHRdsvmpOkilpYK+rcaZsHEx7HxNb2Yom90eAQB34JI8fPeoLg7WeqK3UFZD7pbI8MbFA0NIjbsyGMcuI7nwGSTtz9063sFo1JZJrZeaKKsppObJBnHgQeYI8RuvG/tB6JuGiJqKW2SSmzyPdHA5pOITseBw73HBPFzOPJejPyryYzGvHw+BhwZ3PG73/AOKHcL8Km6uqJg2GERNijgax3A2MDAibz5c98ZJJOMrb0jdqij1HFqj3SnrH0MzXw0s0w4QN8ANO5xt9UHBxsqewvqJA0F7Y+MkknOP71KRyxsPAwERhuMHmfJcMeTV29OfHMpf5uvdJvSzqDVumG2+ot1PboDKDIyOUvM7278LstbhreZxzJaFxOvhMbGxjskkljjsQOXPvCkuve+WIySkhmQ0HcNB54UOxrqq6EMbxMDy4ZHIeJ+C3zct5ru/XLx/Gx8eax6jetUEsUT5ZHOYTlrJBK1oGcjOc55j7lK2i8VVmfHGLlWR0pDuJ1JI3ja4nIcOIEEb8sjOSVWaqqPvLjFIS0bA4wSABj5clhlqnSTSTP4usfnicDjOea548np8d8uKZ9ZNq4U+ayR1PM+sZI8hjy3Ejz4loJ3+JWi4O7JwcY2z4dy/Q5jtwOHHmsjC5zQDh/CNuI8h5fM/NYt23JqMYd2PNTNHTEukrJq0yzZDGxOzxcPic8gMABRdJG19RHG57Wh2zjw5Df43+K3aGVr6xwazhaxga0ZJwM+aTpMu/j0N0SdnTo82s/BXqB24VH6LW8GnWDxa38CFc4juEqz4sVlf9K0ea3Z3n8q1G/wBv9gUXZHgTt9Vnnnb+VqkOcB9IeZUVPU7xjBK3oH+ag6epiwO2Pmt+Gqi2+kagnIH8luwu3ULTVUZ3HER5MJUjDM44Aik+LcfiglI3LMxyj2Sy90BPq5o/as7XVRI7MLR5vJ/Yg3muX7nZawbOWnhmj4vOM4/FadTc5aXgNRSvawbSubuG/pebUG/U7sUXjFS045Zd8gt90jZIg9jg5rhkEd603kNE0h+y3hHx/wCSsGgyXhqms/1zjGPXhJ/Yt5r8VnGOUsYd8cKt3uqNM+2uA3dXRgnyOcqeqXCKKKVxwI3ujJPhlUbFSTjrG/WHd4qNqADJkcjuFvGQ8K0ZctJ/R3Qcn9q6MO6Fa/yqInf2wvEa9xe1PgdClzz+fF/vheHVzy+tQREUUREQEREBERAREQfrGlzw0cycL+h2mozbtH2i0RBzWUlrY6Xs4GT2WDP9F+3ov5728htfTuc3iaJWkjPPcL1NVe0YyS3+5xaL6od7vynn/wBJWC7ajk3duoe1u+lz5rnVx6YTV5/6u8H/AI3P/prWpelfqDn8g8X/AIzH/AruI7pA7kpOhO4XCo+mvgI/6tZ/8d/hrag6d+qP/wAq5/2h/hpuJqvRNKdlvxQRVDoetGerla7n4nhP3OK87Re0R1f+h+f9pf4SzP8AaQf1Tmx6PDXkdlxuWQD3HHVb7puGq7VXUs1grjT2+qbI2odxMo3MLj5keAWprAXF9kbKYXsELg57GgcLRy7icfFcUh9o0uvNXUzaPMk0zA1r/wAp4MY8B9Eoii6c5KS/flWk0/OyJ2RUU0l0MjJQfWPb5LW4PUtPPT19tirI+0x8Q2Azg4wRjxWxpeGWhtdDTTtLXumlLI+9jHFxA+AIXmG1+0KKKeR9DpSenY456sXbLR84VK0HtNvhquOfRrqiV31nm6427gPodh4+Km4unqeuOaYHxauZdLlqgvOg73b6gDhkpHlriM8Dxu13wIB+C5zUe1P1zOH+QnD/ALW/wVX9Qe0GbraquhGkuoNRC6Pj/KPFw578dUMqzKJY8+sAjwHP6sABzWg7jP7eSztlzIH4GzeEDuws1J7xS1HXRTMPEzq5GOiBa9pbwkEeY8MEd2FibSkf5z+ypbEk/VkiDnkNaOJx5ADJK0q57qGlkpnQNElRwyNkPMMw7GCD353yO4ct1vQMMTuIPPIjbbmMLBX0Qqnh/GGEeDcqbLEBkr8JJUv+SP8AvH9j+9fn5I/7x/Y/vWWtItrdsr7ZxcQwpRlqDR/P5/of3r9bbOF2evz/AEP71YaaL3FsJPLxAW1Yow5jiN3Odj+Pmsz7dxNLeu/s/wB62LdTij4TxdYGvDsYxlXbNxr0RoWPqrJEPh/HzVljduFxy0dJ/uNEynFj4+Hv97xn+wt5nS7w/wCj2f8Axn/+Fdwkrt9k3masgl47hVOwMGZ2PmVxqg6bvdXtd/Jjjx3e/wCP/TXxF01lji46byS4uP8Al3if/wCNTcXVd5pnqSpn8l5+i6diz/RbP+0P8NbMXtAFn+ief9o/4SbhqvRMD1vwv2C84R+0UW/6H5/2l/hLOz2ky3/QzP8AtP8Awk3DVelI3bBbLHbLzS32mi3/AEJ/81/wVlb7UGB/8j/+a/4KbhqvS7HJMxssZY7n3HwXmse1Hj/Qb/zb/BX7/wC1J/8Asb/zb/BTcNV36mgNFVuia7hhe0u4O5rv0fI+HkvyseBSBoO8hySvPVd7TTaqLgdogtwcgi7bg/8A2Vru9pNzoomO0bksbwk/lTmfH+aVlhqu061iI0yaln1opmPB8MEKwvcKi3VDsbOcyUDyc0Lzfd/aLFwsstt/kaI+sG0n5TzjfPLqh+K2KL2lDT0LaZ2jOsxAyIu/KmM8PfjqlfaGq9DUfEadgccuAwT442XxW9kn9Ju/zXn6L2l+raB/IrP+1P8ACX5Ue0r1pB/kXjAx/wDFP8JPaGqsftbTiLocqoycGSohaP6y8ULtvTz0uS670zS2tlk/JscdQJHu9763jwDgY4G4XEli/VgiIooiIgIiIP/Z"
              alt="humanoid robot"
              style={{
                width:"100%",height:"100%",
                objectFit:"cover",
                objectPosition:"center top",
                display:"block",
              }}
            />
            {/* Bottom fade inside circle */}
            <div style={{position:"absolute",bottom:0,left:0,right:0,height:"28%",background:"linear-gradient(to top, #04080f 0%, transparent 100%)",zIndex:3,pointerEvents:"none"}}/>
          </div>
        </div>

                {/* Top fade */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:"16%",background:"linear-gradient(to bottom, #04080f 0%, transparent 100%)",pointerEvents:"none",zIndex:1}}/>
        {/* Bottom fade */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"22%",background:"linear-gradient(to top, #04080f 0%, transparent 100%)",pointerEvents:"none",zIndex:7}}/>

        {/* ── Top-left: "Bienvenue à Aetheris" ── */}
        <div style={{position:"absolute",top:"14%",left:"5%",zIndex:10}}>
          <div style={{animation:"revealTitle .8s cubic-bezier(.23,1,.32,1) .22s both"}}>
            <div style={{display:"flex",alignItems:"baseline",gap:12,flexWrap:"wrap"}}>
              <span style={{
                fontFamily:"var(--serif)",
                fontStyle:"italic",
                fontSize:"clamp(15px,2vw,21px)",
                fontWeight:300,
                color:"rgba(180,195,220,0.42)",
                letterSpacing:".04em",
                lineHeight:1,
              }}>Bienvenue à</span>
              <span style={{
                fontFamily:"var(--sans)",
                fontSize:"clamp(34px,5vw,64px)",
                fontWeight:500,
                letterSpacing:"-.03em",
                lineHeight:1,
                color:"#f0f4fc",
              }}>Aetheris</span>
            </div>
          </div>
        </div>

        {/* ── Bottom-right: description + CTA ── */}
        <div style={{position:"absolute",bottom:"16%",right:"5%",zIndex:10,maxWidth:260,textAlign:"right"}}>
          <div style={{animation:"heroSub .65s cubic-bezier(.23,1,.32,1) .6s both"}}>
            <p style={{
              fontSize:12,fontWeight:300,
              color:"rgba(180,195,220,.38)",
              lineHeight:1.8,letterSpacing:".01em",
              marginBottom:20,
            }}>
              A workspace for time, knowledge,<br/>tasks, and wellness.
            </p>
            <button
              onClick={()=>go("calendar")}
              style={{
                display:"inline-flex",alignItems:"center",gap:0,
                background:"rgba(238,243,252,0.94)",
                border:"none",borderRadius:100,
                padding:"0 6px 0 20px",
                color:"#04080f",fontSize:11,fontWeight:500,
                cursor:"pointer",letterSpacing:".1em",textTransform:"uppercase",
                height:44,
                transition:"all .25s cubic-bezier(.23,1,.32,1)",
                boxShadow:"0 0 28px rgba(0,212,255,0.2)",
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.04)";e.currentTarget.style.boxShadow="0 0 48px rgba(0,212,255,0.35)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 0 28px rgba(0,212,255,0.2)"}}
            >
              Get Started
              <span style={{
                display:"inline-flex",alignItems:"center",justifyContent:"center",
                width:32,height:32,borderRadius:"50%",
                background:"rgba(0,0,0,0.13)",marginLeft:10,
                fontSize:15,lineHeight:1,
              }}>→</span>
            </button>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{position:"absolute",bottom:"3%",left:"50%",transform:"translateX(-50%)",zIndex:8,animation:"heroSub .5s ease .95s both"}}>
          <div style={{width:1,height:28,background:"linear-gradient(180deg,transparent,rgba(0,212,255,0.28),transparent)",margin:"0 auto"}}/>
        </div>
      </div>

      {/* FEATURE SECTIONS */}
      {FEATURES.map(f=><FeatureSection key={f.id} f={f} go={go}/>)}

      {/* Footer quote */}
      <div style={{height:"20vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",zIndex:1}}>
        <p style={{fontFamily:"var(--serif)",fontStyle:"italic",fontSize:15,fontWeight:300,color:"rgba(180,195,220,.16)",letterSpacing:".01em"}}>
          Everything, in one place.
        </p>
      </div>

      <Credits/>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   2. CALENDAR
═══════════════════════════════════════════════ */
const INIT_EV={};

function Calendar(){
  const [evs,setEvs]=useState(INIT_EV);
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({title:"",time:"09:00",end:"10:00",type:"deep"});
  const [nid,setNid]=useState(100);
  const cells=[...Array(7).fill(null),...Array.from({length:31},(_,i)=>i+1)];

  const addEv=()=>{
    if(!form.title.trim())return;
    setEvs(p=>({...p,[modal.date]:[...(p[modal.date]||[]),{id:nid,...form}]}));
    setNid(n=>n+1);setModal(null);
  };
  const delEv=(date,id)=>{
    setEvs(p=>{const a=(p[date]||[]).filter(e=>e.id!==id);return{...p,[date]:a.length?a:undefined}});
    setModal(null);
  };

  return(
    <Shell>
      <PageHero title="Calendar" sub="Plan your days with clarity. Every event, every hour — beautifully arranged."/>
      <Content>
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:20}}>
          <span className="calendar-hint" style={{fontSize:9,letterSpacing:"3px",color:"rgba(0,212,255,0.3)",fontWeight:400,textTransform:"uppercase"}}>Click a date to add</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
            <div key={d} style={{textAlign:"center",padding:"0 0 8px",fontSize:8,letterSpacing:"3px",color:"rgba(180,195,220,.22)",borderBottom:"1px solid rgba(255,255,255,0.038)",fontWeight:400}}>{d}</div>
          ))}
          {cells.map((d,i)=>{
            const k=d?`2026-03-${String(d).padStart(2,"0")}`:null;
            const devs=k?evs[k]?.filter(Boolean)||[]:[];
            const today=d===19;
            return(
              <div key={i} className="cc" onClick={()=>d&&setModal({mode:"add",date:k})}
                style={{minHeight:88,padding:7,borderRight:"1px solid rgba(255,255,255,0.034)",borderBottom:"1px solid rgba(255,255,255,0.034)",cursor:d?"pointer":"default",background:today?"rgba(0,212,255,0.017)":"transparent",transition:"background .14s"}}>
                {d&&<>
                  <div style={{fontSize:12,fontWeight:today?400:300,color:today?"rgba(0,212,255,.7)":"rgba(180,195,220,.35)",marginBottom:4,filter:today?"drop-shadow(0 0 5px rgba(0,212,255,.5))":"none"}}>{d}</div>
                  {devs.map(ev=>(
                    <div key={ev.id} onClick={e=>{e.stopPropagation();setModal({mode:"view",date:k,event:ev})}}
                      style={{padding:"3px 5px",borderRadius:10,marginBottom:2,fontSize:8,lineHeight:1.4,background:ev.type==="deep"?"rgba(0,212,255,0.07)":"rgba(124,106,255,0.09)",border:`1px solid ${ev.type==="deep"?"rgba(0,212,255,.16)":"rgba(124,106,255,.2)"}`,color:ev.type==="deep"?"rgba(0,212,255,.72)":"rgba(124,106,255,.82)",cursor:"pointer",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",transition:"filter .14s"}}
                      onMouseEnter={e=>e.currentTarget.style.filter="brightness(1.4)"}
                      onMouseLeave={e=>e.currentTarget.style.filter="none"}>
                      {ev.title}
                    </div>
                  ))}
                </>}
              </div>
            );
          })}
        </div>
      </Content>

      {modal?.mode==="add"&&(
        <Modal title={`Add — ${modal.date}`} onClose={()=>setModal(null)}>
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            <div><span className="lbl">Title</span><input className="inp" placeholder="Event name…" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div><span className="lbl">Start</span><input type="time" className="inp" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))}/></div>
              <div><span className="lbl">End</span><input type="time" className="inp" value={form.end} onChange={e=>setForm(f=>({...f,end:e.target.value}))}/></div>
            </div>
            <div><span className="lbl">Type</span>
              <div style={{display:"flex",gap:8}}>
                {["deep","meet"].map(t=>(
                  <button key={t} onClick={()=>setForm(f=>({...f,type:t}))} style={{flex:1,padding:"9px",borderRadius:9,border:`1px solid ${form.type===t?(t==="deep"?"rgba(0,212,255,.32)":"rgba(124,106,255,.32)"):"rgba(255,255,255,.07)"}`,background:form.type===t?(t==="deep"?"rgba(0,212,255,.07)":"rgba(124,106,255,.08)"):"transparent",color:form.type===t?(t==="deep"?"#00d4ff":"rgba(124,106,255,.9)"):"rgba(180,195,220,.32)",fontSize:11,cursor:"pointer",letterSpacing:".06em",transition:"all .2s"}}>
                    {t==="deep"?"Deep Work":"Meeting"}
                  </button>
                ))}
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:6}}>
              <button className="bp" style={{flex:1}} onClick={addEv}>Add Event</button>
              <button className="bg" onClick={()=>setModal(null)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
      {modal?.mode==="view"&&modal.event&&(
        <Modal title={modal.event.title} onClose={()=>setModal(null)}>
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            <div style={{display:"flex",gap:7}}>
              <span className="tag" style={{color:modal.event.type==="deep"?"rgba(0,212,255,.7)":"rgba(124,106,255,.82)",borderColor:modal.event.type==="deep"?"rgba(0,212,255,.18)":"rgba(124,106,255,.22)"}}>{modal.event.type==="deep"?"Deep Work":"Meeting"}</span>
              <span className="tag" style={{color:"rgba(180,195,220,.35)",borderColor:"rgba(180,195,220,.1)"}}>{modal.event.time} → {modal.event.end}</span>
            </div>
            <p style={{fontSize:11,color:"rgba(180,195,220,.3)",letterSpacing:".05em"}}>{modal.date}</p>
            <div style={{display:"flex",gap:10,marginTop:4}}>
              <button onClick={()=>delEv(modal.date,modal.event.id)} style={{flex:1,padding:"10px",borderRadius:100,border:"1px solid rgba(239,68,68,.22)",background:"rgba(239,68,68,.05)",color:"rgba(239,68,68,.65)",fontSize:12,cursor:"pointer",transition:"all .2s",letterSpacing:".04em"}}>Delete</button>
              <button className="bg" onClick={()=>setModal(null)}>Close</button>
            </div>
          </div>
        </Modal>
      )}
    </Shell>
  );
}

/* ═══════════════════════════════════════════════
   3. ARCHIVE
═══════════════════════════════════════════════ */
const INIT_NOTES=[];
const INIT_CARDS=[];

function Card3D({card,onDelete}){
  const [flipped,setFlipped]=useState(false);
  return(
    <div style={{width:240,flexShrink:0}}>
      <div onClick={()=>setFlipped(f=>!f)} style={{height:144,perspective:1000,cursor:"pointer"}}>
        <div style={{width:"100%",height:"100%",position:"relative",transformStyle:"preserve-3d",transform:flipped?"rotateY(180deg)":"rotateY(0)",transition:"transform .58s cubic-bezier(.23,1,.32,1)"}}>
          <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",background:"rgba(0,212,255,0.03)",border:"1px solid rgba(0,212,255,0.11)",borderRadius:14,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:18,textAlign:"center",gap:8}}>
            <span className="lbl" style={{margin:0,fontSize:8}}>Question</span>
            <span style={{fontSize:11,fontWeight:300,lineHeight:1.55,color:"#d4dff0"}}>{card.q}</span>
            <span style={{fontSize:8,color:"rgba(180,195,220,.2)"}}>tap to reveal</span>
          </div>
          <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",transform:"rotateY(180deg)",background:"rgba(124,106,255,0.065)",border:"1px solid rgba(124,106,255,0.22)",borderRadius:14,boxShadow:"0 0 24px rgba(124,106,255,0.14),inset 0 0 18px rgba(124,106,255,0.03)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:18,textAlign:"center",gap:8}}>
            <span className="lbl" style={{margin:0,fontSize:8,color:"rgba(124,106,255,.65)"}}>Answer</span>
            <span style={{fontSize:11,fontWeight:300,lineHeight:1.6,color:"rgba(180,195,220,.8)"}}>{card.a}</span>
          </div>
        </div>
      </div>
      <button onClick={onDelete} style={{display:"block",width:"100%",marginTop:5,padding:"3px",background:"none",border:"none",color:"rgba(180,195,220,.16)",fontSize:11,cursor:"pointer",transition:"color .2s",letterSpacing:".04em"}} onMouseEnter={e=>e.currentTarget.style.color="rgba(239,68,68,.5)"} onMouseLeave={e=>e.currentTarget.style.color="rgba(180,195,220,.16)"}>delete</button>
    </div>
  );
}

function Archive(){
  const [notes,setNotes]=useState(INIT_NOTES);
  const [cards,setCards]=useState(INIT_CARDS);
  const [search,setSearch]=useState("");
  const [sf,setSf]=useState(false);
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({type:"note",title:"",body:"",q:"",a:"",tag:""});
  const [nid,setNid]=useState(200);
  const filtered=notes.filter(n=>!search||n.title.toLowerCase().includes(search.toLowerCase())||n.body.toLowerCase().includes(search.toLowerCase()));

  const add=()=>{
    if(form.type==="note"){if(!form.title.trim())return;setNotes(p=>[{id:nid,title:form.title,body:form.body,tags:form.tag.trim()?[form.tag.trim()]:[]},...p])}
    else{if(!form.q.trim())return;setCards(p=>[{id:nid,q:form.q,a:form.a},...p])}
    setNid(n=>n+1);setModal(null);
  };

  return(
    <Shell>
      <PageHero title="Archive" sub="Your second brain. Notes in masonry, knowledge in cards. Everything searchable."/>
      <Content>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
          <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(0,212,255,0.03)",border:`1px solid ${sf?"rgba(0,212,255,.3)":"rgba(0,212,255,.1)"}`,borderRadius:100,padding:"8px 14px",width:sf?190:130,transition:"all .3s cubic-bezier(.23,1,.32,1)",boxShadow:sf?"0 0 14px rgba(0,212,255,.07)":"none"}}>
            <span style={{color:"rgba(0,212,255,.4)",fontSize:11}}>⌕</span>
            <input placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} onFocus={()=>setSf(true)} onBlur={()=>setSf(false)} style={{background:"none",border:"none",outline:"none",color:"#c4d0e4",fontSize:12,fontWeight:300,width:"100%"}}/>
          </div>
          <button className="bp" onClick={()=>{setForm({type:"note",title:"",body:"",q:"",a:"",tag:""});setModal("add")}}>+ Add</button>
        </div>
        <span className="lbl">Notes</span>
        <div style={{columns:"3 240px",columnGap:18,marginBottom:52}}>
          {filtered.map((n,i)=>(
            <div key={n.id} className="fu" style={{animationDelay:`${i*28}ms`,breakInside:"avoid",marginBottom:16,padding:"16px 0",borderBottom:"1px solid rgba(255,255,255,0.046)"}}>
              <div style={{fontSize:13,fontWeight:400,color:"#d4dff0",marginBottom:6,letterSpacing:"-.01em"}}>{n.title}</div>
              <div style={{fontSize:11,lineHeight:1.74,color:"rgba(180,195,220,.46)",fontWeight:300}}>{n.body}</div>
              <div style={{display:"flex",gap:5,marginTop:9,flexWrap:"wrap",alignItems:"center"}}>
                {n.tags.map(t=><span key={t} className="tag">#{t}</span>)}
                <button onClick={()=>setNotes(p=>p.filter(x=>x.id!==n.id))} style={{marginLeft:"auto",background:"none",border:"none",color:"rgba(180,195,220,.16)",fontSize:10,cursor:"pointer",transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color="rgba(239,68,68,.5)"} onMouseLeave={e=>e.currentTarget.style.color="rgba(180,195,220,.16)"}>delete</button>
              </div>
            </div>
          ))}
          {!filtered.length&&<p style={{color:"rgba(180,195,220,.26)",fontSize:11,padding:"12px 0"}}>{search?"No notes match your search.":"No notes yet. Add your first."}</p>}
        </div>
        <span className="lbl">Flashcards — tap to flip</span>
        <div style={{display:"flex",gap:14,overflowX:"auto",paddingBottom:12,marginTop:8}}>
          {cards.map(c=><Card3D key={c.id} card={c} onDelete={()=>setCards(p=>p.filter(x=>x.id!==c.id))}/>)}
          {!cards.length&&<p style={{color:"rgba(180,195,220,.26)",fontSize:11,padding:"16px 0"}}>No flashcards yet. Add your first to begin active recall.</p>}
        </div>
      </Content>
      {modal==="add"&&(
        <Modal title="New entry" onClose={()=>setModal(null)}>
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            {["note","card"].map(t=>(
              <button key={t} onClick={()=>setForm(f=>({...f,type:t}))} style={{flex:1,padding:"9px",borderRadius:9,border:`1px solid ${form.type===t?"rgba(0,212,255,.3)":"rgba(255,255,255,.07)"}`,background:form.type===t?"rgba(0,212,255,.065)":"transparent",color:form.type===t?"#00d4ff":"rgba(180,195,220,.32)",fontSize:11,cursor:"pointer",letterSpacing:".05em",transition:"all .2s"}}>
                {t==="note"?"Note":"Flashcard"}
              </button>
            ))}
          </div>
          {form.type==="note"?(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div><span className="lbl">Title</span><input className="inp" placeholder="Note title…" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/></div>
              <div><span className="lbl">Content</span><textarea className="inp" rows={3} placeholder="Write your note…" value={form.body} onChange={e=>setForm(f=>({...f,body:e.target.value}))}/></div>
              <div><span className="lbl">Tag</span><input className="inp" placeholder="e.g. design" value={form.tag} onChange={e=>setForm(f=>({...f,tag:e.target.value}))}/></div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div><span className="lbl">Question</span><input className="inp" placeholder="Question…" value={form.q} onChange={e=>setForm(f=>({...f,q:e.target.value}))}/></div>
              <div><span className="lbl">Answer</span><textarea className="inp" rows={3} placeholder="Answer…" value={form.a} onChange={e=>setForm(f=>({...f,a:e.target.value}))}/></div>
            </div>
          )}
          <div style={{display:"flex",gap:10,marginTop:16}}>
            <button className="bp" style={{flex:1}} onClick={add}>Add {form.type==="note"?"Note":"Card"}</button>
            <button className="bg" onClick={()=>setModal(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </Shell>
  );
}

/* ═══════════════════════════════════════════════
   4. TASKS
═══════════════════════════════════════════════ */
const INIT_TASKS=[];

function TaskRow({task,onRemove}){
  const [dissolving,setDissolving]=useState(false);
  const [particles,setParticles]=useState([]);
  const hc=`rgba(0,212,255,${task.heat*.88})`;
  const complete=()=>{
    if(dissolving)return;
    setDissolving(true);
    setParticles(Array.from({length:10},(_,i)=>({id:i,tx:`${(Math.random()-.5)*84}px`,ty:`${-14-Math.random()*50}px`})));
    setTimeout(()=>onRemove(task.id),620);
  };
  return(
    <div style={{display:"flex",alignItems:"center",gap:13,padding:"15px 0",borderBottom:"1px solid rgba(255,255,255,0.036)",opacity:dissolving?0:1,transform:dissolving?"translateY(-8px) scale(0.98)":"none",transition:"opacity .5s ease,transform .5s ease",position:"relative"}}>
      {particles.map(p=><div key={p.id} style={{position:"absolute",left:`${30+Math.random()*130}px`,top:0,width:2.5,height:2.5,borderRadius:"50%",background:"#00d4ff",boxShadow:"0 0 4px #00d4ff","--tx":p.tx,"--ty":p.ty,animation:"particleOut .6s ease forwards",pointerEvents:"none"}}/>)}
      <div style={{width:2,height:36,borderRadius:1,background:`linear-gradient(180deg,${hc},transparent)`,boxShadow:`0 0 ${task.heat*14}px ${hc}`,flexShrink:0}}/>
      <button onClick={complete} style={{width:17,height:17,borderRadius:"50%",border:`1.5px solid ${hc}`,background:"transparent",cursor:"pointer",flexShrink:0,boxShadow:`0 0 ${task.heat*8}px ${hc}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}} className="hg">
        <span style={{fontSize:7,color:hc}}>✓</span>
      </button>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:300,color:"#d4dff0",marginBottom:2}}>{task.title}</div>
        <div style={{fontSize:9,color:"rgba(180,195,220,.28)",letterSpacing:".06em"}}>{task.deadline}</div>
      </div>
      <span className="tag" style={{color:hc,borderColor:`rgba(0,212,255,${task.heat*.3})`,background:`rgba(0,212,255,${task.heat*.044})`}}>{task.tag}</span>
      <div style={{width:36,height:1.5,borderRadius:1,background:"rgba(255,255,255,.04)",overflow:"hidden",flexShrink:0}}>
        <div style={{height:"100%",width:`${task.heat*100}%`,background:`linear-gradient(90deg,${hc},transparent)`,boxShadow:`0 0 4px ${hc}`}}/>
      </div>
      <button onClick={()=>onRemove(task.id)} style={{background:"none",border:"none",color:"rgba(180,195,220,.16)",fontSize:14,cursor:"pointer",transition:"color .2s",lineHeight:1}} onMouseEnter={e=>e.currentTarget.style.color="rgba(239,68,68,.5)"} onMouseLeave={e=>e.currentTarget.style.color="rgba(180,195,220,.16)"}>×</button>
    </div>
  );
}

function Tasks(){
  const [tasks,setTasks]=useState(INIT_TASKS);
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({title:"",deadline:"",tag:"",heat:.5});
  const [nid,setNid]=useState(300);
  const add=()=>{
    if(!form.title.trim())return;
    setTasks(p=>[{id:nid,title:form.title,deadline:form.deadline||"No deadline",tag:form.tag||"General",heat:parseFloat(form.heat)},...p].sort((a,b)=>b.heat-a.heat));
    setNid(n=>n+1);setModal(false);
  };
  return(
    <Shell>
      <PageHero title="Tasks" sub="Urgency-sorted, heat-driven. Every deadline glows with its proximity."/>
      <Content>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:56,height:1.5,background:"linear-gradient(90deg,rgba(0,212,255,.6),rgba(0,212,255,.06))",borderRadius:1}}/>
            <span style={{fontSize:9,letterSpacing:"3px",color:"rgba(0,212,255,.3)",fontWeight:400,textTransform:"uppercase"}}>Heat → Urgency</span>
          </div>
          <button className="bp" onClick={()=>{setForm({title:"",deadline:"",tag:"",heat:.5});setModal(true)}}>+ New Task</button>
        </div>
        {tasks.length===0?(
          <div style={{textAlign:"center",padding:"80px 0"}}>
            <p style={{fontFamily:"var(--serif)",fontSize:26,fontWeight:300,color:"rgba(180,195,220,.35)"}}>Nothing here yet.</p>
            <p style={{fontSize:12,fontWeight:300,color:"rgba(180,195,220,.22)",marginTop:10,letterSpacing:".02em"}}>Add your first task to get started.</p>
          </div>
        ):tasks.map((t,i)=>(
          <div key={t.id} className="fu" style={{animationDelay:`${i*30}ms`}}>
            <TaskRow task={t} onRemove={id=>setTasks(p=>p.filter(x=>x.id!==id))}/>
          </div>
        ))}
      </Content>
      {modal&&(
        <Modal title="New task" onClose={()=>setModal(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            <div><span className="lbl">Task</span><input className="inp" placeholder="Task description…" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div><span className="lbl">Deadline</span><input className="inp" placeholder="e.g. Today 18:00" value={form.deadline} onChange={e=>setForm(f=>({...f,deadline:e.target.value}))}/></div>
              <div><span className="lbl">Tag</span><input className="inp" placeholder="e.g. Work" value={form.tag} onChange={e=>setForm(f=>({...f,tag:e.target.value}))}/></div>
            </div>
            <div>
              <span className="lbl">Urgency: {Math.round(form.heat*100)}%</span>
              <input type="range" min=".05" max="1" step=".05" value={form.heat} onChange={e=>setForm(f=>({...f,heat:e.target.value}))} style={{width:"100%",accentColor:"#00d4ff"}}/>
            </div>
            <div style={{display:"flex",gap:10,marginTop:6}}>
              <button className="bp" style={{flex:1}} onClick={add}>Add Task</button>
              <button className="bg" onClick={()=>setModal(false)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </Shell>
  );
}

/* ═══════════════════════════════════════════════
   5. WELLNESS
═══════════════════════════════════════════════ */
function BreathRing({active,toggle,label}){
  const [scale,setScale]=useState(1);
  const [dur,setDur]=useState("0s");
  const tmr=useRef(null);
  useEffect(()=>{
    if(!active){setScale(1);setDur(".6s");clearTimeout(tmr.current);return}
    const seq=[{s:1.44,d:4000},{s:1.44,d:7000},{s:1,d:8000}];
    let i=0;
    const tick=()=>{const x=seq[i%3];setScale(x.s);setDur(`${x.d/1000}s`);i++;tmr.current=setTimeout(tick,x.d)};
    tick();return()=>clearTimeout(tmr.current);
  },[active]);

  return(
    <div onClick={toggle} style={{position:"relative",width:160,height:160,cursor:"pointer",userSelect:"none"}}>
      {[46,26,10].map((s,i)=>(
        <div key={i} style={{position:"absolute",inset:-s,borderRadius:"50%",border:`1px solid rgba(124,106,255,${.08-i*.018})`,animation:active?`pRing ${3.5+i}s ease-in-out infinite ${i*.6}s`:"none"}}/>
      ))}
      <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"1.5px solid rgba(124,106,255,0.44)",background:"radial-gradient(circle,rgba(124,106,255,0.09) 0%,transparent 70%)",boxShadow:"0 0 24px rgba(124,106,255,0.18),inset 0 0 20px rgba(124,106,255,0.03)",transform:`scale(${scale})`,transition:`transform ${dur} cubic-bezier(0.4,0,0.2,1)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
        <span style={{fontFamily:"var(--serif)",fontSize:14,fontWeight:400,color:"rgba(124,106,255,.82)",textAlign:"center",padding:"0 14px",lineHeight:1.3}}>{label}</span>
        <span style={{fontSize:8,letterSpacing:".15em",color:"rgba(180,195,220,.24)"}}>{active?"tap to stop":"tap to start"}</span>
      </div>
    </div>
  );
}

function Wellness(){
  const [hydration,setHydration]=useState(0);
  const [breaks,setBreaks]=useState([]);
  const [zenMode,setZenMode]=useState(false);
  const [bActive,setBActive]=useState(false);
  const [bLabel,setBLabel]=useState("Tap to Begin");
  const [breakModal,setBreakModal]=useState(false);
  const [bForm,setBForm]=useState({label:"Walk",duration:"10"});
  const [nid,setNid]=useState(400);
  const bref=useRef(null);

  useEffect(()=>{
    if(!bActive){setBLabel("Tap to Begin");clearTimeout(bref.current);return}
    const seq=[{l:"Inhale…",d:4000},{l:"Hold.",d:7000},{l:"Exhale…",d:8000}];
    let i=0;const tick=()=>{setBLabel(seq[i%3].l);bref.current=setTimeout(tick,seq[i%3].d);i++};
    tick();return()=>clearTimeout(bref.current);
  },[bActive]);

  const logBreak=()=>{
    setBreaks(p=>[{id:nid,label:bForm.label,duration:bForm.duration,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})},...p]);
    setNid(n=>n+1);setBreakModal(false);
  };

  return(
    <div style={{position:"relative"}}>
      {zenMode&&(
        <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(4,8,15,0.97)",backdropFilter:"blur(20px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:28,animation:"fadeIn .55s ease"}}>
          <p style={{fontFamily:"var(--sans)",fontSize:9,letterSpacing:"4px",color:"rgba(180,195,220,.3)",fontWeight:400,textTransform:"uppercase"}}>Zen Mode · 4–7–8 Breathing</p>
          <BreathRing active={bActive} toggle={()=>setBActive(a=>!a)} label={bLabel}/>
          <button onClick={()=>{setZenMode(false);setBActive(false)}} style={{background:"none",border:"1px solid rgba(255,255,255,.07)",borderRadius:100,padding:"9px 26px",color:"rgba(180,195,220,.32)",fontSize:12,cursor:"pointer",marginTop:18,transition:"all .2s",letterSpacing:".04em"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.13)";e.currentTarget.style.color="rgba(180,195,220,.6)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.07)";e.currentTarget.style.color="rgba(180,195,220,.32)"}}>Exit Zen Mode</button>
        </div>
      )}
      <Shell>
        <PageHero title="Wellness" sub="Stay in rhythm. Log your water, guide your breath, honour every break."/>
        <Content>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:32}}>
            <button onClick={()=>{setZenMode(true);setBActive(true)}} style={{background:"rgba(124,106,255,0.07)",border:"1px solid rgba(124,106,255,0.22)",borderRadius:100,padding:"10px 20px",color:"rgba(124,106,255,.78)",fontSize:12,cursor:"pointer",fontWeight:300,letterSpacing:".04em",transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(124,106,255,0.13)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(124,106,255,0.07)"}>Zen Mode</button>
          </div>
          <div className="wellness-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:52,alignItems:"start"}}>
            {/* Hydration */}
            <div className="fu">
              <span className="lbl">Hydration</span>
              <div style={{display:"flex",gap:16,alignItems:"flex-end",marginTop:8}}>
                <div style={{width:46,height:154,border:"1px solid rgba(0,212,255,0.14)",borderRadius:23,position:"relative",overflow:"hidden",background:"rgba(0,212,255,0.013)",flexShrink:0}}>
                  <div style={{position:"absolute",bottom:0,left:0,right:0,height:`${(hydration/8)*100}%`,background:"linear-gradient(180deg,rgba(0,212,255,.48),rgba(0,212,255,.13))",transition:"height .7s cubic-bezier(.23,1,.32,1)",overflow:"hidden"}}>
                    <div style={{position:"absolute",top:-8,left:0,width:"200%",height:16,background:"rgba(0,212,255,.22)",borderRadius:"50%",animation:"wave 2.2s linear infinite"}}/>
                  </div>
                  <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--serif)",fontSize:15,fontWeight:300,color:"#00d4ff",textShadow:"0 0 10px rgba(0,212,255,.5)"}}>{hydration}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  <p style={{fontSize:11,color:"rgba(180,195,220,.5)",fontWeight:300}}>{hydration}/8 glasses</p>
                  <p style={{fontSize:9,color:"rgba(180,195,220,.26)",fontWeight:300,marginBottom:5}}>Goal: 2L</p>
                  <button className="bp" style={{padding:"7px 12px",fontSize:11}} onClick={()=>setHydration(h=>Math.min(8,h+1))}>+ Glass</button>
                  <button className="bg" style={{padding:"7px 12px",fontSize:11}} onClick={()=>setHydration(h=>Math.max(0,h-1))}>– Glass</button>
                </div>
              </div>
            </div>
            {/* Breathing */}
            <div className="fu" style={{animationDelay:"65ms",display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
              <span className="lbl">Breathing · 4–7–8</span>
              <BreathRing active={bActive} toggle={()=>setBActive(a=>!a)} label={bLabel}/>
              <p style={{fontSize:10,fontWeight:300,color:"rgba(180,195,220,.28)",textAlign:"center",lineHeight:1.7}}>4s inhale · 7s hold · 8s exhale</p>
            </div>
            {/* Breaks */}
            <div className="fu" style={{animationDelay:"130ms"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
                <span className="lbl" style={{marginBottom:0}}>Breaks</span>
                <button className="bp" style={{padding:"5px 12px",fontSize:10}} onClick={()=>setBreakModal(true)}>+ Log</button>
              </div>
              {!breaks.length&&<p style={{fontSize:10,color:"rgba(180,195,220,.26)",fontWeight:300}}>No breaks logged.</p>}
              {breaks.map(b=>(
                <div key={b.id} style={{display:"flex",alignItems:"center",gap:9,padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.034)"}}>
                  <div style={{width:4,height:4,borderRadius:"50%",background:"rgba(124,106,255,.65)",boxShadow:"0 0 5px rgba(124,106,255,.45)",flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,fontWeight:300,color:"#d4dff0"}}>{b.label}</div>
                    <div style={{fontSize:8,color:"rgba(180,195,220,.26)",letterSpacing:".05em"}}>{b.duration}min · {b.time}</div>
                  </div>
                  <button onClick={()=>setBreaks(p=>p.filter(x=>x.id!==b.id))} style={{background:"none",border:"none",color:"rgba(180,195,220,.16)",fontSize:13,cursor:"pointer",transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color="rgba(239,68,68,.5)"} onMouseLeave={e=>e.currentTarget.style.color="rgba(180,195,220,.16)"}>×</button>
                </div>
              ))}
              <div style={{marginTop:18}}>
                <span className="lbl">Vitals</span>
                {[{l:"Sleep",v:"— h"},{l:"Steps",v:"—"},{l:"Focus",v:"— h"}].map(s=>(
                  <div key={s.l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,.034)"}}>
                    <span style={{fontSize:11,fontWeight:300,color:"rgba(180,195,220,.42)"}}>{s.l}</span>
                    <span style={{fontSize:11,fontWeight:300,color:"rgba(0,212,255,.62)"}}>{s.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Content>
      </Shell>
      {breakModal&&(
        <Modal title="Log a break" onClose={()=>setBreakModal(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div><span className="lbl">Activity</span>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:4}}>
                {["Walk","Stretch","Eyes Rest","Snack","Meditation","Nap"].map(l=>(
                  <button key={l} onClick={()=>setBForm(f=>({...f,label:l}))} style={{padding:"6px 12px",borderRadius:100,border:`1px solid ${bForm.label===l?"rgba(124,106,255,.34)":"rgba(255,255,255,.07)"}`,background:bForm.label===l?"rgba(124,106,255,.08)":"transparent",color:bForm.label===l?"rgba(124,106,255,.82)":"rgba(180,195,220,.35)",fontSize:11,cursor:"pointer",transition:"all .2s"}}>{l}</button>
                ))}
              </div>
            </div>
            <div><span className="lbl">Duration (min)</span><input type="number" className="inp" value={bForm.duration} onChange={e=>setBForm(f=>({...f,duration:e.target.value}))} min="1" max="120"/></div>
            <div style={{display:"flex",gap:10,marginTop:6}}>
              <button className="bp" style={{flex:1}} onClick={logBreak}>Log Break</button>
              <button className="bg" onClick={()=>setBreakModal(false)}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   6. STATS
═══════════════════════════════════════════════ */
function Stats(){
  const [focusActive,setFocusActive]=useState(false);
  const [secs,setSecs]=useState(0);
  const [sessions,setSessions]=useState([]);
  const tmr=useRef(null);
  const [nid,setNid]=useState(500);

  useEffect(()=>{
    if(focusActive)tmr.current=setInterval(()=>setSecs(s=>s+1),1000);
    else clearInterval(tmr.current);
    return()=>clearInterval(tmr.current);
  },[focusActive]);

  const fmt=s=>{const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sc=s%60;return h>0?`${h}:${String(m).padStart(2,"0")}:${String(sc).padStart(2,"0")}`:`${String(m).padStart(2,"0")}:${String(sc).padStart(2,"0")}`};
  const stop=()=>{
    if(secs>=3){const h=Math.floor(secs/3600),m=Math.floor((secs%3600)/60),sc=secs%60;const d=h>0?`${h}h ${m}m`:`${m}m ${sc}s`;setSessions(p=>[{id:nid,label:"Focus session",dur:d,date:"Today"},...p]);setNid(n=>n+1)}
    setFocusActive(false);setSecs(0);
  };

  const heat=Array.from({length:7*24},(_,i)=>Math.max(0,Math.min(1,Math.sin(i/7)*.4+Math.random()*.5+.1)));
  const alloc=[{l:"Deep Work",p:0,c:"rgba(0,212,255,.8)"},{l:"Meetings",p:0,c:"rgba(124,106,255,.8)"},{l:"Comms",p:0,c:"rgba(124,106,255,.55)"},{l:"Admin",p:0,c:"rgba(0,212,255,.4)"}];
  const trail="M0,72 C50,66 52,32 100,34 C148,36 152,76 200,60 C248,44 252,22 300,22 C348,22 352,56 400,40 C448,24 452,12 500,16 C548,20 552,42 600,32";

  return(
    <Shell>
      <PageHero title="Stats" sub="Your focus, visualised. Start a session, trace your velocity, read your patterns."/>
      <Content>
        <div className="fu" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:44,flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{fontFamily:"var(--serif)",fontSize:"clamp(56px,7vw,88px)",fontWeight:300,letterSpacing:"-.04em",lineHeight:.92,color:"rgba(0,212,255,.88)"}}>87<span style={{fontSize:".38em",opacity:.45}}>%</span></div>
            <span className="lbl">Efficiency Score</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            {focusActive&&(
              <div className="pi" style={{background:"rgba(0,212,255,0.034)",border:"1px solid rgba(0,212,255,0.14)",borderRadius:16,padding:"16px 26px",textAlign:"center"}}>
                <div style={{fontFamily:"var(--serif)",fontSize:30,fontWeight:300,color:"rgba(0,212,255,.88)",letterSpacing:".06em",lineHeight:1}}>{fmt(secs)}</div>
                <span className="lbl" style={{marginTop:5}}>Focus active</span>
              </div>
            )}
            {focusActive?(
              <button onClick={stop} style={{background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:100,padding:"10px 22px",color:"rgba(239,68,68,.78)",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:9,animation:"glowRed 2.2s infinite",fontWeight:300,letterSpacing:".04em"}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"#ef4444",boxShadow:"0 0 6px #ef4444",display:"inline-block",animation:"pulse 1s infinite"}}/>
                Stop · {fmt(secs)}
              </button>
            ):(
              <button className="bp" style={{display:"flex",alignItems:"center",gap:7}} onClick={()=>setFocusActive(true)}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"#00d4ff",boxShadow:"0 0 6px rgba(0,212,255,.6)",display:"inline-block"}}/>
                Start Focus
              </button>
            )}
          </div>
        </div>

        <div className="stats-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:44,marginBottom:44}}>
          <div className="fu" style={{animationDelay:"70ms"}}>
            <span className="lbl">Deep Work Heatmap · 7 Days</span>
            <div style={{display:"grid",gridTemplateColumns:"repeat(24,1fr)",gap:1.5,marginTop:8}}>
              {heat.map((h,i)=><div key={i} style={{aspectRatio:"1",borderRadius:1.5,background:h>.62?`rgba(0,212,255,${h*.76})`:`rgba(124,106,255,${h*.48})`,boxShadow:h>.8?`0 0 3px rgba(0,212,255,${h*.38})`:"none"}}/>)}
            </div>
          </div>
          <div className="fu" style={{animationDelay:"110ms"}}>
            <span className="lbl">Time Allocation</span>
            <div style={{marginTop:8}}>
              {alloc.map((a,i)=>(
                <div key={a.l} style={{marginBottom:13}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontSize:11,fontWeight:300,color:"rgba(180,195,220,.58)"}}>{a.l}</span>
                    <span style={{fontSize:10,fontWeight:300,color:a.c}}>{Math.round(a.p*100)}%</span>
                  </div>
                  <div style={{height:1.5,background:"rgba(255,255,255,.04)",borderRadius:1,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${a.p*100}%`,background:a.c,boxShadow:`0 0 5px ${a.c}`,transition:`width 1.2s cubic-bezier(.23,1,.32,1) ${i*90}ms`,borderRadius:1}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="fu" style={{animationDelay:"160ms",marginBottom:44}}>
          <span className="lbl">Focus Velocity · Long Exposure</span>
          <svg width="100%" height="84" viewBox="0 0 600 84" style={{overflow:"visible",marginTop:8}}>
            <defs>
              <filter id="gl5"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <linearGradient id="tg5" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c6aff" stopOpacity=".16"/><stop offset="65%" stopColor="#00d4ff" stopOpacity=".88"/><stop offset="100%" stopColor="#00d4ff"/></linearGradient>
            </defs>
            <path d={trail} fill="none" stroke="#00d4ff" strokeWidth="5" strokeOpacity=".06" filter="url(#gl5)"/>
            <path d={trail} fill="none" stroke="url(#tg5)" strokeWidth="1.5" strokeDasharray="900" style={{animation:"trailDraw 2.5s cubic-bezier(.23,1,.32,1) forwards"}}/>
            <circle cx="600" cy="32" r="3.5" fill="#00d4ff" filter="url(#gl5)"/>
            <circle cx="600" cy="32" r="8" fill="rgba(0,212,255,0.11)" filter="url(#gl5)"/>
          </svg>
        </div>

        <div className="fu" style={{animationDelay:"210ms"}}>
          <span className="lbl">Recent Sessions</span>
          {sessions.length===0&&<p style={{fontSize:11,fontWeight:300,color:"rgba(180,195,220,.26)",padding:"12px 0"}}>No sessions yet. Start focus mode to begin tracking.</p>}
          {sessions.map(s=>(
            <div key={s.id} style={{display:"flex",alignItems:"center",gap:13,padding:"11px 0",borderBottom:"1px solid rgba(255,255,255,.034)"}}>
              <div style={{width:4,height:4,borderRadius:"50%",background:"rgba(0,212,255,.65)",boxShadow:"0 0 5px rgba(0,212,255,.45)",flexShrink:0}}/>
              <span style={{fontSize:12,fontWeight:300,color:"#d4dff0",flex:1}}>{s.label}</span>
              <span style={{fontSize:10,fontWeight:300,color:"rgba(0,212,255,.6)"}}>{s.dur}</span>
              <span style={{fontSize:8,letterSpacing:".06em",color:"rgba(180,195,220,.24)",minWidth:55,textAlign:"right"}}>{s.date}</span>
              <button onClick={()=>setSessions(p=>p.filter(x=>x.id!==s.id))} style={{background:"none",border:"none",color:"rgba(180,195,220,.16)",fontSize:13,cursor:"pointer",transition:"color .2s"}} onMouseEnter={e=>e.currentTarget.style.color="rgba(239,68,68,.5)"} onMouseLeave={e=>e.currentTarget.style.color="rgba(180,195,220,.16)"}>×</button>
            </div>
          ))}
        </div>
      </Content>
    </Shell>
  );
}

/* ═══════════════════════════════════════════════
   7. SETTINGS
═══════════════════════════════════════════════ */
const SC={Visuals:[{k:"glow",l:"Ambient Glow Effects"},{k:"motion",l:"Motion Animations"},{k:"particles",l:"Particle Effects"},{k:"blur",l:"Glass Blur"},{k:"reduced",l:"Reduced Motion"}],Integrations:[{k:"gcal",l:"Google Calendar Sync"},{k:"notion",l:"Notion"},{k:"github",l:"GitHub Activity"},{k:"spotify",l:"Spotify"}],Profile:[{k:"digest",l:"Daily Digest Email"},{k:"autoFocus",l:"Auto-Start Focus"},{k:"public",l:"Public Profile"}]};
const SD={glow:true,motion:true,particles:true,blur:true,reduced:false,gcal:true,notion:false,github:true,spotify:false,digest:true,autoFocus:false,public:false};

function Toggle({on,tog}){
  return(
    <div onClick={tog} style={{width:36,height:20,borderRadius:10,cursor:"pointer",position:"relative",background:on?"linear-gradient(90deg,rgba(0,190,220,.8),rgba(0,212,255,.95))":"rgba(14,12,40,.9)",transition:"background .28s cubic-bezier(.23,1,.32,1)",boxShadow:on?"0 0 10px rgba(0,212,255,.3)":"none",flexShrink:0}}>
      <div style={{width:14,height:14,borderRadius:"50%",background:"white",position:"absolute",top:3,left:on?19:3,transition:"left .28s cubic-bezier(.23,1,.32,1)",boxShadow:on?"0 0 5px rgba(0,212,255,.3)":"0 1px 3px rgba(0,0,0,.3)"}}/>
    </div>
  );
}

function Settings(){
  const [v,setV]=useState(SD);
  const t=k=>setV(x=>({...x,[k]:!x[k]}));
  return(
    <Shell>
      <PageHero title="Settings" sub="Tailor your workspace. Every toggle, every preference — your Aetheris."/>
      <Content>
        <div className="fu" style={{display:"flex",alignItems:"center",gap:16,marginBottom:44,padding:"18px 0",borderBottom:"1px solid rgba(255,255,255,.046)"}}>
          <div style={{width:48,height:48,borderRadius:"50%",background:"linear-gradient(135deg,rgba(0,212,255,.14),rgba(124,106,255,.14))",border:"1px solid rgba(0,212,255,.14)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>◉</div>
          <div>
            <div style={{fontFamily:"var(--serif)",fontSize:17,fontWeight:400,color:"#e8f0fb",letterSpacing:"-.01em"}}>Alex Meridian</div>
            <div style={{fontSize:10,fontWeight:300,color:"rgba(180,195,220,.36)",marginTop:1}}>alex@aetheris.io · Pro</div>
          </div>
          <button className="bg" style={{marginLeft:"auto",fontSize:11,padding:"7px 16px"}}>Edit</button>
        </div>
        {Object.entries(SC).map(([sec,items],si)=>(
          <div key={sec} className="fu" style={{animationDelay:`${70+si*65}ms`,marginBottom:38}}>
            <span className="lbl">{sec}</span>
            {items.map((item,i)=>(
              <div key={item.k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:i<items.length-1?"1px solid rgba(255,255,255,.034)":"none"}}>
                <span style={{fontSize:12,fontWeight:300,color:"rgba(180,195,220,.68)"}}>{item.l}</span>
                <Toggle on={v[item.k]} tog={()=>t(item.k)}/>
              </div>
            ))}
          </div>
        ))}
        <div className="fu" style={{animationDelay:"280ms"}}>
          <span className="lbl" style={{color:"rgba(239,68,68,.36)"}}>Danger Zone</span>
          <div style={{display:"flex",gap:8}}>
            {["Reset All Data","Delete Account"].map(l=>(
              <button key={l} style={{background:"none",border:"1px solid rgba(239,68,68,.14)",borderRadius:100,padding:"8px 16px",color:"rgba(239,68,68,.42)",fontSize:11,cursor:"pointer",transition:"all .2s",fontWeight:300,letterSpacing:".03em"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(239,68,68,.28)";e.currentTarget.style.color="rgba(239,68,68,.68)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(239,68,68,.14)";e.currentTarget.style.color="rgba(239,68,68,.42)"}}>{l}</button>
            ))}
          </div>
        </div>
      </Content>
    </Shell>
  );
}

/* ═══════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════ */
const PAGES={home:Home,calendar:Calendar,archive:Archive,tasks:Tasks,wellness:Wellness,stats:Stats,settings:Settings};

export default function Aetheris(){
  const [active,setActive]=useState("home");
  const [rk,setRk]=useState(0);

  const go=useCallback(id=>{
    setActive(id);setRk(k=>k+1);
    window.scrollTo({top:0,behavior:"smooth"});
  },[]);

  const Comp=PAGES[active]||Home;

  return(
    <>
      <GS/>
      <div style={{background:"#04080f",minHeight:"100vh",position:"relative"}}>
        <Ambient/>
        <Nav active={active} go={go}/>
        <div key={rk} style={{animation:"scaleIn .46s cubic-bezier(.23,1,.32,1)"}}>
          <Comp go={go}/>
        </div>
      </div>
    </>
  );
}
