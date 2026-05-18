import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:"#04060D", deep:"#070B14", surface:"#0A0F1C", card:"#0E1525", card2:"#121A2E",
  border:"#1A2540", border2:"#243050",
  gold:"#C9A84C", gold2:"#F0CC6E", teal:"#0ECFB2", teal2:"#1DFFD8",
  blue:"#2D7DF7", purple:"#8B5CF6", green:"#22D47A", red:"#F04F6A",
  orange:"#F97316", text:"#EDF2FF", sub:"#8A9BC0", muted:"#4A5F80",
};
const FD = "'Playfair Display',Georgia,serif";
const FB = "'DM Sans',system-ui,sans-serif";
const FM = "'JetBrains Mono',monospace";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ASSETS = [
  {id:"BTC", name:"Bitcoin",       cat:"crypto", price:108420,holdings:0.45,avg:82000, icon:"₿",color:C.gold,  mcap:"$2.1T", vol:"$48.2B",desc:"The original digital store of value. Hard-capped at 21M coins."},
  {id:"ETH", name:"Ethereum",      cat:"crypto", price:4180, holdings:3.5, avg:3100,  icon:"Ξ",color:C.blue,  mcap:"$502B", vol:"$18.4B",desc:"Smart contract platform powering DeFi and NFTs worldwide."},
  {id:"SOL", name:"Solana",        cat:"crypto", price:312,  holdings:18,  avg:190,   icon:"◎",color:C.purple,mcap:"$147B", vol:"$6.1B", desc:"High-speed blockchain with sub-cent transaction fees."},
  {id:"NVDA",name:"NVIDIA",        cat:"stock",  price:1247, holdings:12,  avg:940,   icon:"N",color:C.green, mcap:"$3.07T",vol:"$22.1B",desc:"World leader in AI chips and GPU computing infrastructure."},
  {id:"AAPL",name:"Apple Inc.",    cat:"stock",  price:234,  holdings:30,  avg:185,   icon:"",color:C.sub,  mcap:"$3.56T",vol:"$8.7B", desc:"Consumer tech giant with ecosystem lock-in and $90B buybacks."},
  {id:"TSLA",name:"Tesla",         cat:"stock",  price:289,  holdings:15,  avg:310,   icon:"T",color:C.red,   mcap:"$923B", vol:"$14.3B",desc:"EV leader expanding into energy, robotics and autonomous driving."},
  {id:"MIA", name:"Miami RE Fund", cat:"re",     price:1050, holdings:5,   avg:900,   icon:"🏢",color:C.orange,mcap:"$840M",vol:"$2.1M", desc:"Fractional Miami real estate. Earns 7.2% annual rental yield."},
  {id:"XAU", name:"Gold",          cat:"commod", price:3420, holdings:2,   avg:3100,  icon:"Au",color:C.gold2,mcap:"$16.2T",vol:"$148B", desc:"5,000-year safe haven asset. Hedge against inflation and crisis."},
  {id:"BNB", name:"BNB",           cat:"crypto", price:718,  holdings:8,   avg:520,   icon:"B",color:"#F3BA2F",mcap:"$104B",vol:"$2.8B",desc:"Binance ecosystem token with utility for trading fee discounts."},
  {id:"MSFT",name:"Microsoft",     cat:"stock",  price:478,  holdings:10,  avg:390,   icon:"M",color:C.blue,  mcap:"$3.55T",vol:"$11.2B",desc:"Cloud and AI giant with Azure, Office 365, and OpenAI stake."},
];

const TRADERS = [
  {id:1,name:"Alex Rivera",  handle:"@alexr",   roi:"+284%",month:"+12.4%",risk:"Med", risk_c:C.orange,followers:48200,badge:"🏆",strategy:"Momentum & DeFi",   win:"74%",trades:1240,verified:true},
  {id:2,name:"Sarah Chen",   handle:"@schen_fi",roi:"+196%",month:"+8.1%", risk:"Low", risk_c:C.green, followers:31500,badge:"⭐",strategy:"Blue-chip Growth",  win:"81%",trades:892, verified:true},
  {id:3,name:"Marcus Webb",  handle:"@mwebb",   roi:"+431%",month:"+19.2%",risk:"High",risk_c:C.red,   followers:72100,badge:"🔥",strategy:"High-Beta Crypto",  win:"62%",trades:3102,verified:false},
  {id:4,name:"Diana Santos", handle:"@dsantos", roi:"+142%",month:"+5.8%", risk:"Low", risk_c:C.green, followers:19800,badge:"💎",strategy:"Dividend & RE",     win:"88%",trades:421, verified:true},
];

const INSIGHTS = [
  {type:"bull",icon:"🚀",asset:"SOL",title:"Solana breakout signal",     body:"Volume 3.4× above 30-day avg. RSI at 61 — room to run. Pattern historically precedes 15–25% move within 2 weeks."},
  {type:"warn",icon:"⚠️",asset:"BTC",title:"BTC nearing resistance",     body:"Testing $110K for the third time. RSI at 72 — overbought. Consider scaling 10–15% of position at this level."},
  {type:"info",icon:"📊",asset:"PORT",title:"Rebalance recommended",     body:"Crypto has drifted to 67% of total. Your target was 50%. Moving ~$12,400 to stocks restores balance."},
  {type:"bull",icon:"💡",asset:"NVDA",title:"NVDA earnings catalyst",    body:"Reports in 8 days. Options pricing a 9.2% move. IV rank 78. 94% analyst Buy consensus."},
  {type:"warn",icon:"🌡️",asset:"TSLA",title:"TSLA showing weakness",    body:"Down 3.1% on delivery miss. RSI 38. Watch $275 support — a close below signals further downside."},
  {type:"info",icon:"🏠",asset:"MIA", title:"RE distribution Friday",    body:"Miami RE Fund pays $31.50/unit rental yield. Projected 7.2% annual yield on current market value."},
];

const NEWS = [
  {id:1,tag:"CRYPTO",title:"BlackRock BTC ETF surpasses $100B AUM — fastest product milestone in Wall Street history",time:"8m",  s:"bull"},
  {id:2,tag:"STOCKS",title:"NVIDIA Blackwell Ultra chip demand exceeds supply 4×, CEO confirms record backlog",        time:"23m", s:"bull"},
  {id:3,tag:"MACRO", title:"Federal Reserve holds rates at 4.25–4.50%, signals one cut possible by Q4 2026",          time:"1h",  s:"neut"},
  {id:4,tag:"RE",    title:"Miami tokenized real estate values up 18% YoY as institutional buyers enter market",       time:"2h",  s:"bull"},
  {id:5,tag:"CRYPTO",title:"Solana DEX volume flips Ethereum for third consecutive week, sets TPS record at 4,800",   time:"3h",  s:"bull"},
  {id:6,tag:"STOCKS",title:"Tesla Q2 deliveries miss Wall Street estimates by 8%, shares decline 3% pre-market",       time:"4h",  s:"bear"},
  {id:7,tag:"CRYPTO",title:"Ethereum staking yield rises to 5.8% as validator queue fully clears",                    time:"5h",  s:"bull"},
  {id:8,tag:"MACRO", title:"US CPI prints 2.8% — below forecast. Risk assets rally broadly on rate cut optimism",     time:"6h",  s:"bull"},
];

const FAQ = [
  {q:"Is my data safe?",                    a:"MAMEA uses 256-bit AES encryption for all stored data. We never sell your data to third parties. All connections are secured via TLS 1.3. Paper trading mode means no real funds are ever at risk."},
  {q:"How do I upgrade my plan?",           a:"Go to the Plans tab and click any tier. In production, this connects to Stripe Checkout for secure billing. Annual plans save you 2 months free. You can cancel anytime — no lock-in."},
  {q:"Why are prices simulated?",           a:"MAMEA MVP uses high-quality simulated data so you can explore all features without needing exchange API keys. Production launch connects to CoinGecko Pro (crypto) and Polygon.io (stocks) for live data."},
  {q:"How does Copy Trading work?",         a:"Click 'Copy' on any trader to mirror their positions proportionally. Set your own max allocation to stay in control. You can stop copying at any time — all in one tap."},
  {q:"What are the fees?",                  a:"MAMEA is fully transparent. Subscription tiers are flat-rate. There are no hidden spreads, no withdrawal fees, and no payment for order flow. What you see is what you pay."},
  {q:"How do I contact support?",           a:"Use the live chat bubble (bottom right), email support@mameaapp.io, or join our Discord community. Elite plan members get a 1-hour response guarantee 24/7."},
  {q:"When does the mobile app launch?",    a:"iOS and Android apps are in TestFlight/Play beta. Full App Store launch is scheduled for Phase 2 (Month 4). Web app is fully functional on mobile browsers today."},
  {q:"Is copy trading available on Free?",  a:"Copy Trading requires Basic plan or above. Free users can preview trader profiles and performance stats. Upgrade to Basic ($9.99/mo) to start copying."},
];

const PLANS = [
  {id:"free",  name:"Free",  price:0,     color:C.muted,  tc:C.sub,    features:["5 assets tracked","Delayed prices (15 min)","Basic portfolio view","3 news/day","Preview copy traders"],locked:["AI Advisor","Tax reports","Real estate","Copy trading","Live prices"]},
  {id:"basic", name:"Basic", price:9.99,  color:C.teal,   tc:C.teal2,  features:["25 assets tracked","Live real-time prices","Full portfolio analytics","Unlimited news","5 AI insights/day","Basic tax summary","Copy up to 2 traders"],locked:["Real estate access","API access","Dedicated advisor"]},
  {id:"pro",   name:"Pro",   price:24.99, color:C.blue,   tc:"#6BA8FF", popular:true, features:["Unlimited assets","Advanced AI Advisor","Full tax reports (1099-DA)","Real estate fund access","Copy up to 5 traders","Whale & price alerts","Multi-exchange sync","Priority support (4hr)"],locked:[]},
  {id:"elite", name:"Elite", price:59.99, color:C.gold,   tc:C.gold2,  features:["Everything in Pro","Unlimited copy trading","Become a listed trader","Full API access","Dedicated advisor","1-hour support SLA 24/7","Early feature access","Annual tax advisor call"],locked:[]},
];

// ─── UTILS ────────────────────────────────────────────────────────────────────
const fmt  = (n,d=2)=>n.toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d});
const pct  = (a,b)=>((a-b)/b*100);
const genH = (base,vol,len=60)=>{let v=base*.82;return Array.from({length:len},(_,i)=>{v+=(Math.random()-.47)*vol*(.8+i*.01);v=Math.max(v,base*.6);return{x:i,y:v};});};

// ─── MICRO COMPONENTS ─────────────────────────────────────────────────────────
function Spark({data,color,w=100,h=36}){
  if(!data?.length)return null;
  const minY=Math.min(...data.map(d=>d.y)),maxY=Math.max(...data.map(d=>d.y)),rY=maxY-minY||1;
  const pts=data.map((d,i)=>[(i/(data.length-1))*w, h-((d.y-minY)/rY)*h*.9-h*.05]);
  const line=pts.map(([x,y],i)=>`${i===0?"M":"L"}${x},${y}`).join(" ");
  const fill=`${line} L${w},${h} L0,${h} Z`;
  const id=`s${color.replace(/\W/g,"")}${w}`;
  return(<svg width={w} height={h} style={{overflow:"visible",display:"block"}}>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={color} stopOpacity=".3"/>
      <stop offset="100%" stopColor={color} stopOpacity="0"/>
    </linearGradient></defs>
    <path d={fill} fill={`url(#${id})`}/>
    <path d={line} stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>);
}

function Donut({segs,size=130}){
  const cx=size/2,cy=size/2,r=size*.36,sw=size*.16;
  const tot=segs.reduce((s,g)=>s+g.v,0);let cum=-90;
  const arcs=segs.map(s=>{const ang=(s.v/tot)*359.9,a1=(cum*Math.PI)/180,a2=((cum+ang)*Math.PI)/180;
    const x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1),x2=cx+r*Math.cos(a2),y2=cy+r*Math.sin(a2);
    const d=`M${x1},${y1} A${r},${r} 0 ${ang>180?1:0} 1 ${x2},${y2}`;cum+=ang+.4;return{...s,d};});
  return(<svg width={size} height={size}>
    {arcs.map((a,i)=><path key={i} d={a.d} stroke={a.c} strokeWidth={sw} fill="none" strokeLinecap="butt" style={{filter:`drop-shadow(0 0 5px ${a.c}70)`}}/>)}
    <circle cx={cx} cy={cy} r={r-sw/2-2} fill={C.card} opacity=".7"/>
  </svg>);
}

function AnimNum({val,pre="",suf="",dec=0,color=C.text,size=28}){
  const[disp,setDisp]=useState(0);const startR=useRef(null);
  useEffect(()=>{startR.current=null;const from=disp;
    const t=(ts)=>{if(!startR.current)startR.current=ts;
      const p=Math.min((ts-startR.current)/900,1),e=1-Math.pow(1-p,3);
      setDisp(from+(val-from)*e);if(p<1)requestAnimationFrame(t);};
    requestAnimationFrame(t);
  },[val]);
  return<span style={{fontFamily:FM,fontSize:size,fontWeight:700,color,letterSpacing:"-0.5px"}}>{pre}{disp.toLocaleString("en-US",{minimumFractionDigits:dec,maximumFractionDigits:dec})}{suf}</span>;
}

function Badge({children,color=C.teal,sm}){
  return<span style={{display:"inline-flex",alignItems:"center",gap:3,padding:sm?"2px 7px":"3px 10px",
    borderRadius:100,background:`${color}18`,border:`1px solid ${color}40`,
    color,fontSize:sm?10:11,fontWeight:700,fontFamily:FB,letterSpacing:".3px",whiteSpace:"nowrap"}}>{children}</span>;
}

function Card({children,glow,style={}}){
  return<div style={{background:C.card,border:`1px solid ${glow?glow+"50":C.border}`,
    borderRadius:16,padding:18,boxShadow:glow?`0 0 28px ${glow}12`:"none",...style}}>{children}</div>;
}

function SLabel({text}){
  return<div style={{fontSize:10,fontWeight:700,color:C.muted,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>{text}</div>;
}

function Divider(){return<div style={{height:1,background:`linear-gradient(90deg,${C.teal}50,transparent)`,margin:"20px 0"}}/>;}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function MAMEA(){
  const[screen,   setScreen]   = useState("onboard");
  const[tab,      setTab]      = useState("dashboard");
  const[plan,     setPlan]     = useState("pro");
  const[prices,   setPrices]   = useState(()=>Object.fromEntries(ASSETS.map(a=>[a.id,a.price])));
  const[hists,    setHists]    = useState(()=>Object.fromEntries(ASSETS.map(a=>[a.id,genH(a.price,a.price*.035)])));
  const[copying,  setCopying]  = useState(new Set());
  const[aiIdx,    setAiIdx]    = useState(0);
  const[nFilter,  setNFilter]  = useState("ALL");
  const[notif,    setNotif]    = useState(null);
  const[tradeA,   setTradeA]   = useState(null);
  const[tradeAmt, setTradeAmt] = useState("");
  const[tradeSide,setTradeSide]= useState("buy");
  const[chatOpen, setChatOpen] = useState(false);
  const[chatMsgs, setChatMsgs] = useState([{from:"bot",text:"Hi! 👋 I'm MAMEA Support. Ask me anything about your portfolio, plans, or how features work — I'm here to help!",time:new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}]);
  const[chatInput,setChatInput]= useState("");
  const[faqOpen,  setFaqOpen]  = useState(null);
  const[statusBar,setStatusBar]= useState(true);
  const[serverLoad,setServerLoad]=useState(12);
  const[activeUsers,setActiveUsers]=useState(1247);
  const[detailA,  setDetailA]  = useState(null);
  const chatEnd = useRef(null);

  // ── live simulation ────────────────────────────────────────────────────────
  useEffect(()=>{
    const iv=setInterval(()=>{
      setPrices(p=>{const n={...p};ASSETS.forEach(a=>{const d=(Math.random()-.492)*a.price*.0018;n[a.id]=Math.max(n[a.id]+d,a.price*.7);});return n;});
      setHists(p=>{const n={...p};ASSETS.forEach(a=>{const h=p[a.id],last=h[h.length-1].y,delta=(Math.random()-.492)*last*.0018;n[a.id]=[...h.slice(-60),{x:h[h.length-1].x+1,y:Math.max(last+delta,a.price*.6)}];});return n;});
      setServerLoad(v=>Math.max(8,Math.min(35,v+(Math.random()-.48)*3)));
      setActiveUsers(v=>Math.max(900,v+Math.floor((Math.random()-.45)*12)));
    },1800);
    const iv2=setInterval(()=>setAiIdx(i=>(i+1)%INSIGHTS.length),6000);
    return()=>{clearInterval(iv);clearInterval(iv2);};
  },[]);

  useEffect(()=>{chatEnd.current?.scrollIntoView({behavior:"smooth"});},[chatMsgs]);

  const notify=(msg,color=C.teal)=>{setNotif({msg,color});setTimeout(()=>setNotif(null),3500);};

  // ── portfolio calcs ────────────────────────────────────────────────────────
  const port=ASSETS.map(a=>({...a,cur:prices[a.id],val:prices[a.id]*a.holdings,cost:a.avg*a.holdings,
    pnl:(prices[a.id]-a.avg)*a.holdings,pnlP:pct(prices[a.id],a.avg)}));
  const totVal =port.reduce((s,a)=>s+a.val,0);
  const totCost=port.reduce((s,a)=>s+a.cost,0);
  const totPnl =totVal-totCost;
  const totPct =pct(totVal,totCost);
  const dayPnl =totVal*.0248;
  const catC={crypto:C.purple,stock:C.blue,re:C.orange,commod:C.gold};
  const catL={crypto:"CRYPTO",stock:"STOCK",re:"REAL EST.",commod:"COMMOD."};
  const alloc=[
    {label:"Crypto",    c:C.purple, v:port.filter(a=>a.cat==="crypto").reduce((s,a)=>s+a.val,0)},
    {label:"Stocks",    c:C.blue,   v:port.filter(a=>a.cat==="stock" ).reduce((s,a)=>s+a.val,0)},
    {label:"Real Est.", c:C.orange, v:port.filter(a=>a.cat==="re"    ).reduce((s,a)=>s+a.val,0)},
    {label:"Commodity", c:C.gold,   v:port.filter(a=>a.cat==="commod").reduce((s,a)=>s+a.val,0)},
  ];

  // ── chat bot ───────────────────────────────────────────────────────────────
  const BOT_REPLIES={
    "plan":   "We have 4 plans: Free (forever), Basic ($9.99/mo), Pro ($24.99/mo), and Elite ($59.99/mo). Pro is the most popular — unlimited assets + AI + real estate access. Go to the Plans tab to compare!",
    "cancel": "You can cancel anytime from your account settings. No lock-in, no cancellation fees. Your data stays accessible for 30 days after cancellation.",
    "fee":    "MAMEA is 100% fee-transparent. Subscription is flat-rate. Zero hidden spreads, zero withdrawal fees, zero payment for order flow. What you see is what you pay.",
    "support":"You can reach us here in live chat (fastest), via email at support@mameaapp.io, or in our Discord community. Elite members get a 1-hour response guarantee 24/7.",
    "price":  "Prices in the MVP are high-quality simulations updating every 1.8 seconds. In production, we connect to CoinGecko Pro for crypto and Polygon.io for stocks — live to the millisecond.",
    "copy":   "Copy Trading is available on Basic plan and above. Click 'Copy' on any trader, set your allocation, and their trades mirror in your portfolio automatically. Stop anytime in one tap.",
    "safe":   "MAMEA uses 256-bit AES encryption and TLS 1.3 for all data. We are SOC 2 compliant and never sell your data. MVP is paper-trading only — no real funds at risk.",
    "tax":    "Pro and Elite plans include full automated tax reports (IRS Form 1099-DA). We calculate short-term vs long-term gains across all asset classes automatically.",
    "mobile": "The iOS and Android apps are in beta. Full App Store launch is Month 4. Today, the web app is fully mobile-responsive — open in Safari or Chrome on your phone.",
    "hello":  "Hey there! 👋 What can I help you with today? You can ask about plans, features, pricing, security, or anything else about MAMEA.",
    "hi":     "Hey! 👋 How can I help you today?",
  };
  // sendChat accepts optional directMsg param — eliminates setTimeout race condition on quick replies
  const sendChat=(directMsg)=>{
    const raw = typeof directMsg === "string" ? directMsg : chatInput;
    if(!raw.trim())return;
    const msg=raw.trim();
    const ts=new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
    setChatMsgs(m=>[...m,{from:"user",text:msg,time:ts}]);
    setChatInput("");
    setTimeout(()=>{
      const key=Object.keys(BOT_REPLIES).find(k=>msg.toLowerCase().includes(k));
      const reply=key?BOT_REPLIES[key]:"Great question! Let me connect you with a specialist. In the meantime, check our Help Center at help.mameaapp.io or email support@mameaapp.io — we respond within 4 hours.";
      setChatMsgs(m=>[...m,{from:"bot",text:reply,time:new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}]);
    },800);
  };

  // ── ONBOARDING ─────────────────────────────────────────────────────────────
  if(screen==="onboard") return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",padding:40,fontFamily:FB,position:"relative",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px;height:3px}::-webkit-scrollbar-track{background:${C.deep}}::-webkit-scrollbar-thumb{background:${C.border2};border-radius:2px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow{0%,100%{box-shadow:0 0 30px ${C.teal}30}50%{box-shadow:0 0 60px ${C.teal}60}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp2{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        button{font-family:'DM Sans',system-ui,sans-serif;cursor:pointer}input{font-family:'DM Sans',system-ui,sans-serif}
      `}</style>
      <div style={{position:"fixed",inset:0,pointerEvents:"none"}}>
        <div style={{position:"absolute",width:700,height:700,borderRadius:"50%",background:`radial-gradient(circle,${C.teal}14 0%,transparent 70%)`,top:"-20%",left:"-10%",animation:"float 9s ease-in-out infinite"}}/>
        <div style={{position:"absolute",width:500,height:500,borderRadius:"50%",background:`radial-gradient(circle,${C.gold}10 0%,transparent 70%)`,bottom:"-10%",right:"-5%",animation:"float 12s ease-in-out infinite reverse"}}/>
      </div>
      <div style={{position:"relative",textAlign:"center",maxWidth:600}}>
        <div style={{animation:"fadeUp .7s ease both"}}>
          <div style={{fontSize:64,fontFamily:FD,fontWeight:800,letterSpacing:"-2px",marginBottom:6,
            background:`linear-gradient(135deg,${C.gold2},${C.teal2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            MAMEA
          </div>
          <div style={{fontSize:13,color:C.muted,letterSpacing:4,textTransform:"uppercase",marginBottom:48}}>Financial Operating System</div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:40,textAlign:"left"}}>
          {[
            {icon:"📊",title:"All Assets in One Place",  desc:"Crypto, stocks, real estate & commodities — unified dashboard"},
            {icon:"🧠",title:"AI-Powered Insights",      desc:"Personalized signals updating every 30 seconds, just for you"},
            {icon:"👥",title:"1-Tap Copy Trading",       desc:"Mirror top traders automatically. Stop anytime. Zero friction."},
            {icon:"📋",title:"Auto Tax Reports",         desc:"IRS 1099-DA generated automatically. No spreadsheets needed."},
            {icon:"🔒",title:"Zero Hidden Fees",         desc:"Flat subscriptions. No spreads. No withdrawal fees. Ever."},
            {icon:"💬",title:"Real Human Support",       desc:"Live chat, email & Discord. Elite gets 1-hour response 24/7."},
          ].map((f,i)=>(
            <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"14px 16px",
              display:"flex",gap:10,alignItems:"flex-start",animation:`fadeUp ${.7+i*.08}s ease both`}}>
              <span style={{fontSize:20,lineHeight:1}}>{f.icon}</span>
              <div><div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{f.title}</div>
                <div style={{fontSize:11,color:C.muted,lineHeight:1.4}}>{f.desc}</div></div>
            </div>
          ))}
        </div>

        <button onClick={()=>setScreen("app")} style={{background:`linear-gradient(135deg,${C.teal},${C.blue})`,
          border:"none",color:"white",padding:"16px 60px",borderRadius:100,fontSize:16,fontWeight:800,
          letterSpacing:".5px",boxShadow:`0 0 40px ${C.teal}50`,animation:"glow 2s ease-in-out infinite",
          transition:"transform .15s"}}
          onMouseOver={e=>e.currentTarget.style.transform="scale(1.04)"}
          onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}>
          Enter MAMEA — Free →
        </button>
        <div style={{marginTop:12,fontSize:11,color:C.muted}}>No credit card · No lock-in · 14-day Pro trial included</div>
        <div style={{marginTop:20,display:"flex",justifyContent:"center",gap:20,fontSize:11,color:C.muted}}>
          {["256-bit encrypted","SOC 2 compliant","Paper trading only","Cancel anytime"].map(t=>(
            <span key={t}><span style={{color:C.green}}>✓</span> {t}</span>
          ))}
        </div>
      </div>
    </div>
  );

  // ── TABS ───────────────────────────────────────────────────────────────────
  const TABS=[
    {id:"dashboard",label:"Dashboard",icon:"⬡"},
    {id:"markets",  label:"Markets",  icon:"📈"},
    {id:"portfolio",label:"Portfolio",icon:"💼"},
    {id:"copy",     label:"Copy Trade",icon:"👥"},
    {id:"ai",       label:"AI Advisor",icon:"🧠"},
    {id:"news",     label:"News",     icon:"⚡"},
    {id:"status",   label:"System",   icon:"🖥️"},
    {id:"plans",    label:"Plans",    icon:"💎"},
    {id:"support",  label:"Support",  icon:"💬"},
  ];

  // ── ASSET DETAIL DRAWER ────────────────────────────────────────────────────
  const AssetDetail=({a,onClose})=>{
    const up=a.pnlP>=0;
    return(
    <div style={{position:"fixed",inset:0,background:"rgba(4,6,13,.8)",backdropFilter:"blur(14px)",
      display:"flex",alignItems:"center",justifyContent:"center",zIndex:900,padding:20}}>
      <div style={{background:C.card,border:`1px solid ${a.color}50`,borderRadius:20,padding:28,
        width:"100%",maxWidth:460,position:"relative",boxShadow:`0 0 40px ${a.color}20`}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:16,background:"none",
          border:"none",color:C.muted,fontSize:22,cursor:"pointer"}}>×</button>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
          <div style={{width:52,height:52,borderRadius:14,background:`${a.color}20`,border:`1px solid ${a.color}40`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:a.color,fontWeight:800}}>{a.icon}</div>
          <div>
            <div style={{fontSize:20,fontWeight:800,fontFamily:FD}}>{a.name}</div>
            <div style={{display:"flex",gap:6,marginTop:4}}><Badge color={catC[a.cat]} sm>{catL[a.cat]}</Badge><span style={{fontSize:12,color:C.muted}}>{a.id}</span></div>
          </div>
        </div>
        <div style={{fontSize:12,color:C.sub,lineHeight:1.6,marginBottom:18,padding:"12px 14px",background:C.surface,borderRadius:10}}>{a.desc}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:18}}>
          {[{l:"Current Price",v:`$${a.cur>=1000?fmt(a.cur,0):fmt(a.cur,2)}`,c:C.text},{l:"Your Holdings",v:`${a.holdings} ${a.id}`,c:C.sub},{l:"Position Value",v:`$${fmt(a.val,0)}`,c:C.teal},{l:"Avg Cost",v:`$${a.avg>=1000?fmt(a.avg,0):fmt(a.avg,2)}`,c:C.sub},{l:"Unrealized P&L",v:`${up?"+":"-"}$${fmt(Math.abs(a.pnl),0)}`,c:up?C.green:C.red},{l:"Market Cap",v:a.mcap,c:C.muted}].map((s,i)=>(
            <div key={i} style={{background:C.surface,borderRadius:10,padding:"10px 12px"}}>
              <div style={{fontSize:9,color:C.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>{s.l}</div>
              <div style={{fontSize:14,fontWeight:700,color:s.c,fontFamily:FM}}>{s.v}</div>
            </div>
          ))}
        </div>
        <div style={{width:"100%",overflow:"hidden"}}>
          <Spark data={hists[a.id]} color={up?C.green:C.red} w={400} h={70} filled/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:16}}>
          <button onClick={()=>{setDetailA(null);setTradeA(a);setTradeSide("buy");}} style={{padding:"12px",borderRadius:12,fontWeight:800,fontSize:14,background:`${C.green}25`,border:`1px solid ${C.green}50`,color:C.green}}>▲ Buy {a.id}</button>
          <button onClick={()=>{setDetailA(null);setTradeA(a);setTradeSide("sell");}} style={{padding:"12px",borderRadius:12,fontWeight:800,fontSize:14,background:`${C.red}25`,border:`1px solid ${C.red}50`,color:C.red}}>▼ Sell {a.id}</button>
        </div>
      </div>
    </div>);
  };

  // ── TRADE MODAL (fixed) ────────────────────────────────────────────────────
  const TradeModal=({a,onClose})=>{
    const[side,setSide]=useState(tradeSide);
    const[amt,setAmt]=useState("");
    const units=amt&&parseFloat(amt)>0?(parseFloat(amt)/prices[a.id]).toFixed(6):"—";
    const fee=(parseFloat(amt)||0)*0.001;
    return(
    <div style={{position:"fixed",inset:0,background:"rgba(4,6,13,.85)",backdropFilter:"blur(14px)",
      display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}>
      <div style={{background:C.card,border:`1px solid ${C.border2}`,borderRadius:20,padding:26,
        width:"100%",maxWidth:380,position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:16,background:"none",border:"none",color:C.muted,fontSize:22,cursor:"pointer"}}>×</button>

        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
          <div style={{width:44,height:44,borderRadius:12,background:`${a.color}20`,border:`1px solid ${a.color}40`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:a.color}}>{a.icon}</div>
          <div>
            <div style={{fontWeight:800,fontSize:17}}>{a.name} <span style={{color:C.muted,fontSize:13,fontWeight:400}}>({a.id})</span></div>
            <div style={{fontSize:12,color:C.teal,fontFamily:FM,fontWeight:700}}>${prices[a.id]>=1000?fmt(prices[a.id],0):fmt(prices[a.id],2)} · live</div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
          {["buy","sell"].map(s=>(
            <button key={s} onClick={()=>setSide(s)} style={{padding:"11px",borderRadius:10,fontWeight:700,fontSize:14,
              background:side===s?(s==="buy"?`${C.green}25`:`${C.red}25`):"transparent",
              border:`1px solid ${side===s?(s==="buy"?C.green:C.red):C.border}`,
              color:side===s?(s==="buy"?C.green:C.red):C.muted,transition:"all .15s"}}>
              {s==="buy"?"▲ Buy":"▼ Sell"}
            </button>
          ))}
        </div>

        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,color:C.muted,marginBottom:6,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>Amount (USD)</div>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:16}}>$</span>
            <input value={amt} onChange={e=>setAmt(e.target.value.replace(/[^0-9.]/g,""))} placeholder="0.00"
              style={{width:"100%",background:C.surface,border:`1px solid ${C.border2}`,borderRadius:12,
                padding:"12px 14px 12px 28px",color:C.text,fontSize:16,fontFamily:FM,fontWeight:700,outline:"none"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:11,color:C.muted}}>
            <span>≈ {units} {a.id}</span>
            <span>Fee: ${fee>0?fee.toFixed(2):"0.00"} (0.1%)</span>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:16}}>
          {[{l:"25%",v:"2500"},{l:"50%",v:"5000"},{l:"75%",v:"7500"},{l:"Max",v:"10000"}].map(q=>(
            <button key={q.l} onClick={()=>setAmt(q.v)}
              style={{padding:"7px",borderRadius:8,background:amt===q.v?`${C.teal}20`:C.surface,
                border:`1px solid ${amt===q.v?C.teal:C.border}`,color:amt===q.v?C.teal:C.muted,fontSize:11,fontWeight:700}}>
              {q.l}
            </button>
          ))}
        </div>

        <div style={{background:C.surface,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{color:C.muted}}>Order type</span><span style={{fontWeight:600}}>Market Order</span></div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{color:C.muted}}>Estimated fill</span><span style={{color:C.green,fontWeight:600}}>Instant</span></div>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.muted}}>Fee (0.1%)</span><span style={{fontWeight:600}}>${fee>0?fee.toFixed(2):"0.00"}</span></div>
        </div>

        <button onClick={()=>{
          // FIXED: proper validation — return early, never close on invalid
          if(!amt||parseFloat(amt)<=0){notify("Please enter a valid amount",C.red);return;}
          if(parseFloat(amt)<1){notify("Minimum order is $1.00",C.orange);return;}
          notify(`${side==="buy"?"✅ Bought":"✅ Sold"} ${units} ${a.id} · $${amt} order filled`,side==="buy"?C.green:C.teal);
          setTradeAmt("");onClose();
        }} style={{width:"100%",padding:"14px",borderRadius:12,fontWeight:800,fontSize:15,
          background:`linear-gradient(135deg,${side==="buy"?C.green:C.red},${side==="buy"?C.teal:C.orange})`,
          border:"none",color:"#000",transition:"opacity .15s"}}
          onMouseOver={e=>e.currentTarget.style.opacity=".88"}
          onMouseOut={e=>e.currentTarget.style.opacity="1"}>
          {side==="buy"?"▲ Place Buy Order":"▼ Place Sell Order"}
        </button>
        <div style={{textAlign:"center",marginTop:10,fontSize:11,color:C.muted}}>📄 Paper trading · No real funds · Safe to explore</div>
      </div>
    </div>);
  };

  // ── LIVE CHAT WIDGET ───────────────────────────────────────────────────────
  const ChatWidget=()=>(
    <div style={{position:"fixed",bottom:24,right:24,zIndex:800}}>
      {chatOpen&&(
        <div style={{position:"absolute",bottom:70,right:0,width:320,background:C.card,
          border:`1px solid ${C.teal}50`,borderRadius:18,overflow:"hidden",boxShadow:`0 8px 40px rgba(0,0,0,.5)`,
          animation:"slideUp2 .2s ease both"}}>
          <div style={{background:C.surface,padding:"14px 16px",borderBottom:`1px solid ${C.border}`,
            display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:10,background:`${C.teal}25`,display:"flex",
              alignItems:"center",justifyContent:"center",fontSize:16}}>⬡</div>
            <div>
              <div style={{fontWeight:700,fontSize:13}}>MAMEA Support</div>
              <div style={{fontSize:10,color:C.green,display:"flex",alignItems:"center",gap:4}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:C.green,animation:"pulse 1.5s infinite"}}/>
                Online · Avg reply &lt;2 min
              </div>
            </div>
            <button onClick={()=>setChatOpen(false)} style={{marginLeft:"auto",background:"none",border:"none",color:C.muted,fontSize:18,cursor:"pointer"}}>×</button>
          </div>

          <div style={{height:280,overflowY:"auto",padding:14,display:"flex",flexDirection:"column",gap:10}}>
            {chatMsgs.map((m,i)=>(
              <div key={i} style={{display:"flex",flexDirection:"column",alignItems:m.from==="user"?"flex-end":"flex-start"}}>
                <div style={{maxWidth:"80%",padding:"10px 13px",borderRadius:m.from==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",
                  background:m.from==="user"?`${C.teal}25`:C.surface,
                  border:`1px solid ${m.from==="user"?C.teal+"40":C.border}`,
                  fontSize:12,lineHeight:1.5,color:C.text}}>
                  {m.text}
                </div>
                <div style={{fontSize:9,color:C.muted,marginTop:2}}>{m.time}</div>
              </div>
            ))}
            <div ref={chatEnd}/>
          </div>

          <div style={{padding:"10px 12px",borderTop:`1px solid ${C.border}`,display:"flex",gap:8}}>
            <input value={chatInput} onChange={e=>setChatInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&sendChat()}
              placeholder="Ask anything..." style={{flex:1,background:C.surface,border:`1px solid ${C.border2}`,
                borderRadius:10,padding:"9px 12px",color:C.text,fontSize:12,outline:"none"}}/>
            <button onClick={sendChat} style={{background:`${C.teal}25`,border:`1px solid ${C.teal}50`,
              borderRadius:10,padding:"8px 12px",color:C.teal,fontWeight:700,fontSize:12}}>→</button>
          </div>

          <div style={{padding:"8px 14px 12px",display:"flex",gap:6,flexWrap:"wrap"}}>
            {["Plans & pricing","Copy trading","Cancel anytime","Talk to human"].map(q=>(
              <button key={q} onClick={()=>sendChat(q)}
                style={{fontSize:10,padding:"4px 9px",borderRadius:100,background:C.surface,
                  border:`1px solid ${C.border2}`,color:C.sub,cursor:"pointer"}}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <button onClick={()=>setChatOpen(o=>!o)}
        style={{width:52,height:52,borderRadius:16,background:`linear-gradient(135deg,${C.teal},${C.blue})`,
          border:"none",color:"white",fontSize:22,boxShadow:`0 4px 20px ${C.teal}50`,
          display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
        💬
        <div style={{position:"absolute",top:-4,right:-4,width:14,height:14,borderRadius:"50%",
          background:C.green,border:"2px solid "+C.bg,animation:"pulse 1.5s infinite"}}/>
      </button>
    </div>
  );

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  const Dashboard=()=>(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"1.7fr 1fr 1fr 1fr",gap:12}}>
        <Card glow={C.teal} style={{padding:22}}>
          <SLabel text="Total Portfolio Value"/>
          <AnimNum val={totVal} pre="$" dec={0} size={34}/>
          <div style={{marginTop:10,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <Badge color={totPct>=0?C.green:C.red}>{totPct>=0?"▲":"▼"} {Math.abs(totPct).toFixed(2)}%</Badge>
            <span style={{fontSize:11,color:C.muted}}>all-time return</span>
          </div>
          <div style={{marginTop:6,fontSize:13,fontWeight:700,color:totPnl>=0?C.green:C.red}}>
            {totPnl>=0?"+":"-"}${fmt(Math.abs(totPnl),0)} unrealized P&L
          </div>
        </Card>
        {[
          {label:"Today's Gain",  val:Math.abs(dayPnl),    pre:"+$", color:C.green, tag:`+${(dayPnl/totVal*100).toFixed(2)}%`},
          {label:"7-Day Return",  val:totVal*.0731,         pre:"+$", color:C.green, tag:"+7.31%"},
          {label:"Portfolio Beta",val:1.42,                 pre:"",   color:C.orange,tag:"vs 1.0 market",dec:2,suf:"β"},
        ].map((s,i)=>(
          <Card key={i}>
            <SLabel text={s.label}/>
            <AnimNum val={s.val} pre={s.pre} suf={s.suf||""} dec={s.dec||0} size={22} color={s.color}/>
            <div style={{marginTop:8}}>
              {s.tag.includes("%")?<Badge color={s.color}>{s.tag}</Badge>:<span style={{fontSize:11,color:C.muted}}>{s.tag}</span>}
            </div>
          </Card>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.8fr 1fr",gap:14}}>
        <Card>
          <SLabel text="Live Holdings — Click any row for details"/>
          {port.map(a=>{
            const up=a.pnlP>=0;
            return(
            <div key={a.id} onClick={()=>setDetailA(a)}
              style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:12,
                marginBottom:5,cursor:"pointer",transition:"all .15s",background:C.surface,border:`1px solid ${C.border}`}}
              onMouseOver={e=>{e.currentTarget.style.borderColor=C.border2;e.currentTarget.style.background=C.card2;}}
              onMouseOut={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface;}}>
              <div style={{width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",
                justifyContent:"center",fontSize:14,fontWeight:800,color:a.color,
                background:`${a.color}18`,border:`1px solid ${a.color}35`,flexShrink:0}}>{a.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                  <span style={{fontWeight:700,fontSize:13}}>{a.id}</span>
                  <Badge color={catC[a.cat]} sm>{catL[a.cat]}</Badge>
                </div>
                <div style={{fontSize:10,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.name}</div>
              </div>
              <Spark data={hists[a.id]} color={up?C.green:C.red} w={65} h={26}/>
              <div style={{textAlign:"right",flexShrink:0,minWidth:68}}>
                <div style={{fontWeight:700,fontSize:13,fontFamily:FM}}>${a.cur>=1000?fmt(a.cur,0):fmt(a.cur,2)}</div>
                <Badge color={up?C.green:C.red} sm>{up?"▲":"▼"}{Math.abs(a.pnlP).toFixed(2)}%</Badge>
              </div>
              <div style={{textAlign:"right",flexShrink:0,minWidth:72}}>
                <div style={{fontSize:12,fontWeight:600,fontFamily:FM}}>${fmt(a.val,0)}</div>
                <div style={{fontSize:10,color:C.muted}}>{a.holdings} {a.id}</div>
              </div>
              <button onClick={e=>{e.stopPropagation();setTradeA(a);setTradeSide("buy");}}
                style={{background:`${C.teal}20`,border:`1px solid ${C.teal}40`,color:C.teal,
                  borderRadius:8,padding:"5px 9px",fontSize:11,fontWeight:700,flexShrink:0}}>Trade</button>
            </div>);
          })}
        </Card>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card>
            <SLabel text="Allocation"/>
            <div style={{display:"flex",justifyContent:"center",marginBottom:12}}><Donut segs={alloc} size={130}/></div>
            {alloc.map((s,i)=>{const p=(s.v/totVal*100);return(
              <div key={i} style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <div style={{width:7,height:7,borderRadius:"50%",background:s.c,boxShadow:`0 0 5px ${s.c}`}}/>
                    <span style={{color:C.sub}}>{s.label}</span>
                  </div>
                  <span style={{fontWeight:700,fontFamily:FM}}>{p.toFixed(1)}%</span>
                </div>
                <div style={{height:4,borderRadius:2,background:C.border,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${p}%`,background:s.c,borderRadius:2}}/>
                </div>
              </div>
            );})}
          </Card>

          <Card glow={C.purple} style={{position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:`${C.purple}20`,filter:"blur(20px)"}}/>
            <div style={{fontSize:9,fontWeight:700,color:C.purple,letterSpacing:2,marginBottom:8}}>🧠 AI ADVISOR</div>
            <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6}}>
              <Badge color={INSIGHTS[aiIdx].type==="bull"?C.green:INSIGHTS[aiIdx].type==="warn"?C.orange:C.blue} sm>{INSIGHTS[aiIdx].asset}</Badge>
              <span style={{fontSize:11,fontWeight:700,color:C.text,lineHeight:1.4}}>{INSIGHTS[aiIdx].title}</span>
            </div>
            <div style={{fontSize:11,color:C.sub,lineHeight:1.55}}>{INSIGHTS[aiIdx].body}</div>
            <div style={{marginTop:10,display:"flex",gap:4}}>
              {INSIGHTS.map((_,i)=><div key={i} style={{height:3,flex:1,borderRadius:2,background:i===aiIdx?C.purple:C.border,transition:"background .3s"}}/>)}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <SLabel text="Market Pulse — Latest Headlines"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {NEWS.slice(0,4).map(n=>(
            <div key={n.id} style={{padding:"10px 12px",borderRadius:10,background:C.surface,
              border:`1px solid ${C.border}`,display:"flex",gap:8,alignItems:"flex-start",cursor:"pointer"}}
              onMouseOver={e=>e.currentTarget.style.borderColor=C.border2}
              onMouseOut={e=>e.currentTarget.style.borderColor=C.border}>
              <Badge color={n.s==="bull"?C.green:n.s==="bear"?C.red:C.muted} sm>{n.tag}</Badge>
              <div><div style={{fontSize:12,fontWeight:600,lineHeight:1.4}}>{n.title}</div>
                <div style={{fontSize:10,color:C.muted,marginTop:2}}>{n.time} ago</div></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  // ── MARKETS ────────────────────────────────────────────────────────────────
  const Markets=()=>(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        {[{l:"BTC Dominance",v:"56.2%",c:"+1.4%",color:C.gold},{l:"Total Crypto Cap",v:"$3.84T",c:"+2.8%",color:C.purple},{l:"Fear & Greed",v:"74 Greed",c:"▲ 8pts",color:C.green},{l:"S&P 500",v:"6,248",c:"+0.34%",color:C.blue}].map((m,i)=>(
          <Card key={i} glow={m.color}>
            <SLabel text={m.l}/>
            <div style={{fontSize:22,fontWeight:800,color:m.color,fontFamily:FM}}>{m.v}</div>
            <div style={{fontSize:12,color:C.green,marginTop:4,fontWeight:600}}>{m.c}</div>
          </Card>
        ))}
      </div>
      <Card>
        <SLabel text="All Markets — Tap any row for full details"/>
        {ASSETS.map(a=>{const p=prices[a.id],ch=pct(p,a.price);return(
          <div key={a.id} onClick={()=>setDetailA({...a,cur:p,val:p*a.holdings,cost:a.avg*a.holdings,pnl:(p-a.avg)*a.holdings,pnlP:pct(p,a.avg)})}
            style={{display:"flex",alignItems:"center",gap:12,padding:"12px 12px",borderRadius:12,
              marginBottom:5,background:C.surface,border:`1px solid ${C.border}`,cursor:"pointer",transition:"all .15s"}}
            onMouseOver={e=>{e.currentTarget.style.borderColor=C.border2;e.currentTarget.style.background=C.card2;}}
            onMouseOut={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.surface;}}>
            <div style={{width:38,height:38,borderRadius:11,display:"flex",alignItems:"center",
              justifyContent:"center",fontSize:15,fontWeight:800,color:a.color,
              background:`${a.color}18`,border:`1px solid ${a.color}35`,flexShrink:0}}>{a.icon}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}>
                <span style={{fontWeight:700,fontSize:14}}>{a.id}</span>
                <span style={{color:C.muted,fontSize:12}}>{a.name}</span>
                <Badge color={catC[a.cat]} sm>{catL[a.cat]}</Badge>
              </div>
              <div style={{fontSize:10,color:C.muted}}>Mcap {a.mcap} · Vol {a.vol}</div>
            </div>
            <Spark data={hists[a.id]} color={ch>=0?C.green:C.red} w={80} h={30}/>
            <div style={{textAlign:"right",minWidth:100}}>
              <div style={{fontWeight:700,fontSize:14,fontFamily:FM}}>${p>=1000?fmt(p,0):fmt(p,2)}</div>
              <Badge color={ch>=0?C.green:C.red} sm>{ch>=0?"▲":"▼"}{Math.abs(ch).toFixed(2)}%</Badge>
            </div>
            <button onClick={e=>{e.stopPropagation();setTradeA(a);setTradeSide("buy");}}
              style={{background:`${C.teal}20`,border:`1px solid ${C.teal}40`,color:C.teal,
                borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:700,flexShrink:0}}>Trade</button>
          </div>);})}
      </Card>
    </div>
  );

  // ── PORTFOLIO ──────────────────────────────────────────────────────────────
  const Portfolio=()=>(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        {[{l:"Total Invested",v:totCost,pre:"$",color:C.blue},{l:"Current Value",v:totVal,pre:"$",color:C.green},{l:"Total P&L",v:Math.abs(totPnl),pre:totPnl>=0?"+$":"-$",color:totPnl>=0?C.green:C.red}].map((s,i)=>(
          <Card key={i} glow={s.color}><SLabel text={s.l}/><AnimNum val={s.v} pre={s.pre} dec={0} size={26} color={s.color}/></Card>
        ))}
      </div>
      <Card>
        <SLabel text="All Positions — Click any row for details"/>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>
              {["Asset","Type","Qty","Avg Cost","Current","Value","P&L","P&L %","Action"].map(h=>(
                <th key={h} style={{padding:"8px 10px",textAlign:h==="Asset"?"left":"right",color:C.muted,fontWeight:600,fontSize:9,textTransform:"uppercase",letterSpacing:1}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{port.map(a=>(
              <tr key={a.id} style={{borderBottom:`1px solid ${C.border}50`,cursor:"pointer"}}
                onClick={()=>setDetailA(a)}
                onMouseOver={e=>e.currentTarget.style.background=C.surface}
                onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"11px 10px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:30,height:30,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:a.color,background:`${a.color}18`,border:`1px solid ${a.color}35`}}>{a.icon}</div>
                    <div><div style={{fontWeight:700}}>{a.id}</div><div style={{fontSize:10,color:C.muted}}>{a.name}</div></div>
                  </div>
                </td>
                <td style={{textAlign:"right"}}><Badge color={catC[a.cat]} sm>{catL[a.cat]}</Badge></td>
                <td style={{textAlign:"right",color:C.sub,fontFamily:FM}}>{a.holdings}</td>
                <td style={{textAlign:"right",fontFamily:FM}}>${a.avg>=1000?fmt(a.avg,0):fmt(a.avg,2)}</td>
                <td style={{textAlign:"right",fontWeight:600,fontFamily:FM}}>${a.cur>=1000?fmt(a.cur,0):fmt(a.cur,2)}</td>
                <td style={{textAlign:"right",fontWeight:700,fontFamily:FM}}>${fmt(a.val,0)}</td>
                <td style={{textAlign:"right",color:a.pnl>=0?C.green:C.red,fontWeight:700,fontFamily:FM}}>{a.pnl>=0?"+":"-"}${fmt(Math.abs(a.pnl),0)}</td>
                <td style={{textAlign:"right"}}><Badge color={a.pnlP>=0?C.green:C.red} sm>{a.pnlP>=0?"▲":"▼"}{Math.abs(a.pnlP).toFixed(1)}%</Badge></td>
                <td style={{textAlign:"right"}}>
                  <button onClick={e=>{e.stopPropagation();setTradeA(a);setTradeSide("buy");}}
                    style={{background:`${C.teal}20`,border:`1px solid ${C.teal}40`,color:C.teal,borderRadius:7,padding:"4px 10px",fontSize:11,fontWeight:700}}>Trade</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  // ── COPY TRADING ───────────────────────────────────────────────────────────
  const CopyTrade=()=>(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {plan==="free"&&(
        <div style={{background:`${C.orange}15`,border:`1px solid ${C.orange}50`,borderRadius:14,padding:"14px 18px",display:"flex",gap:12,alignItems:"center"}}>
          <span style={{fontSize:24}}>🔒</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:14,marginBottom:2}}>Copy Trading requires Basic plan or above</div>
            <div style={{fontSize:12,color:C.muted}}>You can preview trader profiles. Upgrade to start copying in one tap.</div>
          </div>
          <button onClick={()=>setTab("plans")} style={{background:`${C.teal}25`,border:`1px solid ${C.teal}50`,color:C.teal,padding:"8px 16px",borderRadius:10,fontSize:12,fontWeight:700,flexShrink:0}}>Upgrade →</button>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
        {[{l:"Traders Available",v:"847",color:C.teal},{l:"Avg Top-10 ROI",v:"+312%",color:C.green},{l:"Currently Copying",v:`${copying.size} traders`,color:C.purple}].map((s,i)=>(
          <Card key={i} glow={s.color}><SLabel text={s.l}/><div style={{fontSize:26,fontWeight:800,color:s.color,fontFamily:FM}}>{s.v}</div></Card>
        ))}
      </div>
      <Card>
        <SLabel text="Top Traders — Performance Verified"/>
        {TRADERS.map(t=>{const isCopying=copying.has(t.id);return(
          <div key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"16px 14px",borderRadius:14,
            marginBottom:8,background:isCopying?`${C.purple}10`:C.surface,
            border:`1px solid ${isCopying?C.purple+"50":C.border}`,transition:"all .2s"}}>
            <div style={{width:44,height:44,borderRadius:13,background:C.card2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{t.badge}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                <span style={{fontWeight:700,fontSize:15}}>{t.name}</span>
                {t.verified&&<span style={{color:C.blue,fontSize:13}}>✓</span>}
                <span style={{color:C.muted,fontSize:12}}>{t.handle}</span>
              </div>
              <div style={{fontSize:12,color:C.muted,marginBottom:2}}>{t.strategy}</div>
              <div style={{display:"flex",gap:10,fontSize:11,color:C.muted}}>
                <span>Win rate: <strong style={{color:C.green}}>{t.win}</strong></span>
                <span>Trades: <strong style={{color:C.text}}>{t.trades.toLocaleString()}</strong></span>
                <span>Followers: <strong style={{color:C.text}}>{t.followers.toLocaleString()}</strong></span>
              </div>
            </div>
            <div style={{textAlign:"center",minWidth:72}}>
              <div style={{fontSize:18,fontWeight:800,color:C.green,fontFamily:FM}}>{t.roi}</div>
              <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:1}}>All-time</div>
            </div>
            <div style={{textAlign:"center",minWidth:72}}>
              <div style={{fontSize:16,fontWeight:700,color:C.green,fontFamily:FM}}>{t.month}</div>
              <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:1}}>This month</div>
            </div>
            <Badge color={t.risk_c} sm>{t.risk} risk</Badge>
            <button disabled={plan==="free"}
              onClick={()=>{if(plan==="free"){notify("Upgrade to copy traders",C.orange);return;}setCopying(p=>{const n=new Set(p);n.has(t.id)?(n.delete(t.id),notify(`Stopped copying ${t.name}`,C.red)):(n.add(t.id),notify(`Now copying ${t.name}! 🚀`,C.green));return n;});}}
              style={{background:isCopying?`${C.red}20`:`${C.teal}20`,border:`1px solid ${isCopying?C.red:C.teal}50`,
                color:isCopying?C.red:C.teal,borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:700,
                minWidth:86,transition:"all .2s",opacity:plan==="free"?.5:1}}>
              {isCopying?"◼ Stop":"▶ Copy"}
            </button>
          </div>);})}
      </Card>
    </div>
  );

  // ── AI ADVISOR ─────────────────────────────────────────────────────────────
  const AIAdvisor=()=>(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card glow={C.purple} style={{padding:24}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
          <div style={{width:52,height:52,borderRadius:14,background:`${C.purple}25`,border:`1px solid ${C.purple}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>🧠</div>
          <div>
            <div style={{fontSize:22,fontWeight:800,fontFamily:FD,background:`linear-gradient(135deg,${C.teal2},${C.purple})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>MAMEA AI Advisor</div>
            <div style={{fontSize:12,color:C.muted}}>Personalized signals · Updated every 30s · Not financial advice</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {INSIGHTS.map((ins,i)=>(
            <div key={i} style={{padding:16,borderRadius:12,background:C.surface,
              border:`1px solid ${ins.type==="bull"?C.green:ins.type==="warn"?C.orange:C.blue}30`}}>
              <div style={{fontSize:22,marginBottom:8}}>{ins.icon}</div>
              <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6}}>
                <Badge color={catC[ASSETS.find(a=>a.id===ins.asset)?.cat||"crypto"]||C.blue} sm>{ins.asset}</Badge>
                <span style={{fontSize:11,fontWeight:700}}>{ins.title}</span>
              </div>
              <div style={{fontSize:12,color:C.sub,lineHeight:1.55}}>{ins.body}</div>
              <div style={{marginTop:8}}><Badge color={ins.type==="bull"?C.green:ins.type==="warn"?C.orange:C.blue} sm>{ins.type==="bull"?"BULLISH":ins.type==="warn"?"CAUTION":"INFO"}</Badge></div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[{title:"Risk Score",value:"6.4/10",desc:"Moderate-high. Crypto exposure drives volatility. Adding stable yield assets would reduce your beta.",icon:"⚖️",color:C.orange},{title:"Diversification",value:"B+",desc:"Good 4-class spread. Adding international equities would push to A rating.",icon:"🌐",color:C.blue},{title:"Rebalance Alert",value:"Crypto 67%",desc:"Crypto has drifted 17% above target. Selling ~$12,400 BTC would restore your 50% allocation.",icon:"🔄",color:C.gold},{title:"Tax Estimate",value:"~$18,400",desc:"Based on current unrealized gains. 60% long-term, 40% short-term capital gains rates apply.",icon:"📋",color:C.muted}].map((m,i)=>(
          <Card key={i} glow={m.color}>
            <div style={{fontSize:26,marginBottom:8}}>{m.icon}</div>
            <SLabel text={m.title}/>
            <div style={{fontSize:24,fontWeight:800,color:m.color,marginBottom:8,fontFamily:FM}}>{m.value}</div>
            <div style={{fontSize:12,color:C.muted,lineHeight:1.55}}>{m.desc}</div>
          </Card>
        ))}
      </div>
    </div>
  );

  // ── NEWS ───────────────────────────────────────────────────────────────────
  const NewsTab=()=>(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
        {["ALL","CRYPTO","STOCKS","MACRO","RE"].map(f=>(
          <button key={f} onClick={()=>setNFilter(f)} style={{padding:"7px 16px",borderRadius:100,fontSize:11,fontWeight:700,
            background:nFilter===f?`${C.teal}25`:"transparent",border:`1px solid ${nFilter===f?C.teal+"60":C.border}`,
            color:nFilter===f?C.teal:C.muted,cursor:"pointer",transition:"all .15s",letterSpacing:1}}>
            {f}
          </button>
        ))}
      </div>
      {(nFilter==="ALL"?NEWS:NEWS.filter(n=>n.tag===nFilter)).map(n=>(
        <Card key={n.id} style={{display:"flex",gap:14,alignItems:"center",cursor:"pointer",transition:"border-color .15s"}}
          onMouseOver={e=>e.currentTarget.style.borderColor=C.border2}
          onMouseOut={e=>e.currentTarget.style.borderColor=C.border}>
          <Badge color={n.s==="bull"?C.green:n.s==="bear"?C.red:C.muted}>{n.tag}</Badge>
          <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,marginBottom:3,lineHeight:1.4}}>{n.title}</div>
            <div style={{fontSize:11,color:C.muted}}>{n.time} ago</div></div>
          <div style={{fontSize:20,flexShrink:0}}>{n.s==="bull"?"📈":n.s==="bear"?"📉":"📊"}</div>
        </Card>
      ))}
    </div>
  );

  // ── SYSTEM STATUS ──────────────────────────────────────────────────────────
  const SystemStatus=()=>(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card glow={C.green} style={{padding:22}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <div style={{width:44,height:44,borderRadius:12,background:`${C.green}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>📡</div>
          <div>
            <div style={{fontSize:20,fontWeight:800}}>All Systems Operational</div>
            <div style={{fontSize:12,color:C.muted}}>Live infrastructure monitoring · Last checked {new Date().toLocaleTimeString()}</div>
          </div>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,padding:"6px 14px",
            borderRadius:100,background:`${C.green}18`,border:`1px solid ${C.green}40`,fontSize:12,color:C.green,fontWeight:700}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:C.green,animation:"pulse 1.5s infinite"}}/>
            LIVE
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {[
            {label:"API Latency",  value:"18ms",                                    status:C.green},
            {label:"Server Load",  value:`${serverLoad.toFixed(0)}%`,               status:serverLoad>80?C.red:serverLoad>60?C.orange:C.green},
            {label:"Active Users", value:activeUsers.toLocaleString(),              status:C.green},
            {label:"Uptime (30d)", value:"99.97%",                                  status:C.green},
          ].map((s,i)=>(
            <div key={i} style={{background:C.surface,borderRadius:12,padding:"14px",textAlign:"center"}}>
              <div style={{fontSize:22,fontWeight:800,color:s.status,fontFamily:FM}}>{s.value}</div>
              <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginTop:4}}>{s.label}</div>
              <div style={{width:6,height:6,borderRadius:"50%",background:s.status,margin:"8px auto 0",boxShadow:`0 0 6px ${s.status}`}}/>
            </div>
          ))}
        </div>
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card>
          <SLabel text="Traffic Management Procedures"/>
          {[
            {load:"0–40%",  action:"Normal operation. Auto-scaling inactive.",                     color:C.green},
            {load:"40–70%", action:"Pre-warm standby servers. Monitor cache hit rate.",             color:C.teal},
            {load:"70–85%", action:"Auto-scale triggers. Rate-limit non-critical API calls.",       color:C.orange},
            {load:"85–95%", action:"Circuit breakers activate. Queue heavy computations.",          color:C.orange},
            {load:"95%+",   action:"Emergency mode: serve cached data. Page on-call engineer.",     color:C.red},
          ].map((r,i)=>(
            <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 0",borderBottom:i<4?`1px solid ${C.border}50`:"none",fontSize:13}}>
              <span style={{fontWeight:700,color:r.color,fontFamily:FM,minWidth:70,flexShrink:0}}>{r.load}</span>
              <span style={{color:C.sub,lineHeight:1.5}}>{r.action}</span>
            </div>
          ))}
        </Card>

        <Card>
          <SLabel text="Incident Response Playbook"/>
          {[
            {title:"Price Data Outage",    action:"Switch to backup CoinGecko endpoint. Show 'Prices may be delayed' banner. ETA resolution: under 5 min."},
            {title:"High Traffic Spike",   action:"Cloudflare WAF rate limiting activates. CDN serves cached portfolio snapshots. Queue trade orders."},
            {title:"Database Slowdown",    action:"Read replicas absorb load. Write operations queue. Users see 'Processing...' state, not errors."},
            {title:"Payment System Issue", action:"Stripe webhook retry queue activates. No user loses subscription access during outage."},
            {title:"Security Alert",       action:"Auto-lock affected accounts. Force re-auth. Notify users via email within 15 minutes."},
          ].map((r,i)=>(
            <div key={i} style={{padding:"10px 0",borderBottom:i<4?`1px solid ${C.border}50`:"none",fontSize:13}}>
              <div style={{fontWeight:700,color:C.text,marginBottom:3}}>{r.title}</div>
              <div style={{color:C.sub,fontSize:11,lineHeight:1.5}}>{r.action}</div>
            </div>
          ))}
        </Card>
      </div>

      <Card>
        <SLabel text="Infrastructure Stack & Scaling Architecture"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginTop:4}}>
          {[
            {layer:"CDN Layer",      tool:"Cloudflare Pro",    detail:"Global edge caching, DDoS protection, rate limiting, SSL termination",          color:C.orange},
            {layer:"Frontend",       tool:"Vercel Edge",        detail:"Next.js SSR + React Native. Auto-deploys on push. 99.99% uptime SLA",           color:C.blue},
            {layer:"API Gateway",    tool:"AWS API Gateway",   detail:"Request routing, auth validation, throttling 10K req/sec per endpoint",          color:C.teal},
            {layer:"Backend",        tool:"Railway + Fastify",  detail:"Node.js auto-scales 1→50 instances. WebSocket clusters for live price streaming", color:C.purple},
            {layer:"Database",       tool:"Supabase Postgres",  detail:"Primary + 3 read replicas. Point-in-time recovery. Auto-backup every hour",     color:C.green},
            {layer:"Cache Layer",    tool:"Redis Cluster",      detail:"Price data TTL 100ms. Session data TTL 24hr. Reduces DB load by 80%",            color:C.red},
          ].map((s,i)=>(
            <div key={i} style={{background:C.surface,borderRadius:10,padding:"12px 14px",borderLeft:`3px solid ${s.color}`}}>
              <div style={{fontSize:9,fontWeight:700,color:s.color,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>{s.layer}</div>
              <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>{s.tool}</div>
              <div style={{fontSize:11,color:C.muted,lineHeight:1.5}}>{s.detail}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  // ── PLANS ──────────────────────────────────────────────────────────────────
  const Plans=()=>{
    const[billing,setBilling]=useState("monthly");
    const[checkoutPlan,setCheckoutPlan]=useState(null);
    const[cardNum,setCardNum]=useState("");
    const[cardExp,setCardExp]=useState("");
    const[cardCvc,setCardCvc]=useState("");
    const[cardName,setCardName]=useState("");
    const[processing,setProcessing]=useState(false);
    const[success,setSuccess]=useState(false);

    const annualDiscount=0.833; // 2 months free = ~16.7% off
    const price=(p)=>p.price===0?0:billing==="annual"?(p.price*annualDiscount*12).toFixed(2):p.price;
    const perMo=(p)=>p.price===0?0:billing==="annual"?(p.price*annualDiscount).toFixed(2):p.price;

    const handleCheckout=()=>{
      if(!cardName.trim()||cardNum.replace(/\s/g,"").length<16||cardExp.length<5||cardCvc.length<3){
        notify("Please fill in all payment details",C.red);return;
      }
      setProcessing(true);
      setTimeout(()=>{
        setProcessing(false);
        setSuccess(true);
        setPlan(checkoutPlan.id);
        setTimeout(()=>{setCheckoutPlan(null);setSuccess(false);notify(`✅ ${checkoutPlan.name} plan activated! Welcome aboard.`,C.green);},1800);
      },2200);
    };

    const fmtCard=(v)=>v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
    const fmtExp=(v)=>{const d=v.replace(/\D/g,"").slice(0,4);return d.length>2?d.slice(0,2)+"/"+d.slice(2):d;};

    return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>

      {/* Stripe Checkout Modal */}
      {checkoutPlan&&(
        <div style={{position:"fixed",inset:0,background:"rgba(4,6,13,.88)",backdropFilter:"blur(16px)",
          display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}>
          <div style={{background:C.card,border:`1px solid ${checkoutPlan.color}50`,borderRadius:22,
            padding:28,width:"100%",maxWidth:420,position:"relative",boxShadow:`0 0 50px ${checkoutPlan.color}20`}}>
            <button onClick={()=>{if(!processing){setCheckoutPlan(null);setSuccess(false);}}}
              style={{position:"absolute",top:14,right:16,background:"none",border:"none",color:C.muted,fontSize:22,cursor:"pointer"}}>×</button>

            {success?(
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:52,marginBottom:12}}>✅</div>
                <div style={{fontSize:20,fontWeight:800,color:C.green,marginBottom:6}}>Payment Successful!</div>
                <div style={{fontSize:13,color:C.muted}}>{checkoutPlan.name} plan is now active.</div>
              </div>
            ):(
              <>
                {/* Plan summary */}
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,padding:"14px 16px",
                  background:C.surface,borderRadius:14,border:`1px solid ${checkoutPlan.color}30`}}>
                  <div style={{width:42,height:42,borderRadius:12,background:`${checkoutPlan.color}25`,
                    border:`1px solid ${checkoutPlan.color}40`,display:"flex",alignItems:"center",
                    justifyContent:"center",fontSize:18,fontWeight:800,color:checkoutPlan.tc}}>💎</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:800,fontSize:15}}>MAMEA {checkoutPlan.name}</div>
                    <div style={{fontSize:12,color:C.muted}}>{billing==="annual"?"Billed annually":"Billed monthly"} · Cancel anytime</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:22,fontWeight:800,color:checkoutPlan.tc,fontFamily:FM}}>${price(checkoutPlan)}</div>
                    <div style={{fontSize:10,color:C.muted}}>{billing==="annual"?"/year":"/month"}</div>
                  </div>
                </div>

                {billing==="annual"&&(
                  <div style={{background:`${C.green}15`,border:`1px solid ${C.green}40`,borderRadius:10,
                    padding:"8px 14px",marginBottom:16,fontSize:12,color:C.green,fontWeight:600,display:"flex",gap:8}}>
                    🎉 You save ${(checkoutPlan.price*2).toFixed(2)}/year with annual billing!
                  </div>
                )}

                {/* Secure badge */}
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14,fontSize:11,color:C.muted}}>
                  <span style={{color:C.green}}>🔒</span>
                  <span>Secured by <strong style={{color:C.text}}>Stripe</strong> · 256-bit SSL · PCI DSS compliant</span>
                </div>

                {/* Card fields */}
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:C.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:6,fontWeight:700}}>Cardholder Name</div>
                  <input value={cardName} onChange={e=>setCardName(e.target.value)} placeholder="JR Smith"
                    style={{width:"100%",background:C.surface,border:`1px solid ${C.border2}`,borderRadius:10,
                      padding:"11px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:FB}}/>
                </div>
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:10,color:C.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:6,fontWeight:700}}>Card Number</div>
                  <div style={{position:"relative"}}>
                    <input value={cardNum} onChange={e=>setCardNum(fmtCard(e.target.value))} placeholder="1234 5678 9012 3456"
                      style={{width:"100%",background:C.surface,border:`1px solid ${C.border2}`,borderRadius:10,
                        padding:"11px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:FM,letterSpacing:"1px"}}/>
                    <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:18}}>
                      {cardNum.startsWith("4")?"💳":cardNum.startsWith("5")?"💳":cardNum.startsWith("3")?"💳":"💳"}
                    </span>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
                  <div>
                    <div style={{fontSize:10,color:C.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:6,fontWeight:700}}>Expiry</div>
                    <input value={cardExp} onChange={e=>setCardExp(fmtExp(e.target.value))} placeholder="MM/YY"
                      style={{width:"100%",background:C.surface,border:`1px solid ${C.border2}`,borderRadius:10,
                        padding:"11px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:FM}}/>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:C.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:6,fontWeight:700}}>CVC</div>
                    <input value={cardCvc} onChange={e=>setCardCvc(e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="•••"
                      type="password"
                      style={{width:"100%",background:C.surface,border:`1px solid ${C.border2}`,borderRadius:10,
                        padding:"11px 14px",color:C.text,fontSize:14,outline:"none",fontFamily:FM}}/>
                  </div>
                </div>

                <button onClick={handleCheckout} disabled={processing}
                  style={{width:"100%",padding:"14px",borderRadius:12,fontWeight:800,fontSize:15,
                    background:processing?C.surface:`linear-gradient(135deg,${checkoutPlan.color},${checkoutPlan.tc})`,
                    border:`1px solid ${checkoutPlan.color}`,
                    color:processing?C.muted:"#000",cursor:processing?"not-allowed":"pointer",
                    transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                  {processing?(
                    <><span style={{display:"inline-block",width:16,height:16,border:`2px solid ${C.muted}`,
                      borderTopColor:C.teal,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/> Processing...</>
                  ):`Activate ${checkoutPlan.name} · $${price(checkoutPlan)}`}
                </button>
                <div style={{textAlign:"center",marginTop:10,fontSize:11,color:C.muted}}>
                  No charges during 14-day trial · Cancel anytime · Instant access
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Card glow={C.gold} style={{textAlign:"center",padding:24}}>
        <div style={{fontSize:26,marginBottom:8}}>💎</div>
        <div style={{fontSize:22,fontWeight:800,fontFamily:FD,background:`linear-gradient(135deg,${C.gold2},${C.teal2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:6}}>Choose Your Plan</div>
        <div style={{color:C.muted,fontSize:13,marginBottom:16}}>Start free. Upgrade anytime. Cancel anytime. No hidden fees.</div>

        {/* Billing toggle */}
        <div style={{display:"inline-flex",alignItems:"center",gap:0,background:C.surface,border:`1px solid ${C.border2}`,borderRadius:100,padding:4,marginBottom:14}}>
          {["monthly","annual"].map(b=>(
            <button key={b} onClick={()=>setBilling(b)}
              style={{padding:"7px 20px",borderRadius:100,fontSize:12,fontWeight:700,border:"none",
                background:billing===b?`linear-gradient(135deg,${C.teal},${C.blue})`:"transparent",
                color:billing===b?"white":C.muted,cursor:"pointer",transition:"all .2s",textTransform:"capitalize"}}>
              {b}{b==="annual"&&<span style={{fontSize:10,marginLeft:5,color:billing==="annual"?"#fff":C.green,fontWeight:800}}>-17%</span>}
            </button>
          ))}
        </div>

        <div style={{display:"flex",justifyContent:"center"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"6px 16px",borderRadius:100,background:`${C.green}18`,border:`1px solid ${C.green}40`,fontSize:12,color:C.green,fontWeight:700}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:C.green,animation:"pulse 1.5s infinite"}}/>
            14-Day Pro Trial · No Credit Card Required
          </div>
        </div>
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {PLANS.map(p=>(
          <div key={p.id}
            style={{background:C.card,borderRadius:16,padding:"22px 18px",position:"relative",
              border:`2px solid ${plan===p.id?p.color:C.border}`,
              boxShadow:plan===p.id?`0 0 28px ${p.color}25`:"none",transition:"all .2s"}}>
            {p.popular&&<div style={{position:"absolute",top:-11,left:"50%",transform:"translateX(-50%)",background:p.color,color:"#000",fontSize:9,fontWeight:800,letterSpacing:2,padding:"3px 12px",borderRadius:100}}>MOST POPULAR</div>}
            <div style={{fontSize:10,fontWeight:700,color:C.muted,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>{p.name}</div>
            <div style={{fontSize:34,fontWeight:800,color:p.tc,fontFamily:FM,marginBottom:2}}>
              {p.price===0?"$0":`$${perMo(p)}`}
            </div>
            <div style={{fontSize:11,color:C.muted,marginBottom:billing==="annual"&&p.price>0?2:16}}>
              {p.price===0?"forever":"/month"}
            </div>
            {billing==="annual"&&p.price>0&&(
              <div style={{fontSize:10,color:C.green,fontWeight:700,marginBottom:14}}>
                ${price(p)}/year · 2 months free
              </div>
            )}
            {p.features.map((f,i)=><div key={i} style={{display:"flex",gap:7,marginBottom:7,fontSize:12,color:C.sub,alignItems:"flex-start"}}><span style={{color:C.green,fontWeight:800,flexShrink:0}}>✓</span><span>{f}</span></div>)}
            {p.locked.map((f,i)=><div key={i} style={{display:"flex",gap:7,marginBottom:7,fontSize:11,color:C.muted,alignItems:"flex-start"}}><span style={{flexShrink:0}}>—</span><span style={{textDecoration:"line-through"}}>{f}</span></div>)}
            <button
              onClick={()=>{
                if(p.price===0){setPlan("free");notify("Free plan selected ✓",C.muted);return;}
                if(plan===p.id){notify("You're already on this plan ✓",p.color);return;}
                setCheckoutPlan(p);
              }}
              style={{width:"100%",marginTop:16,padding:"11px",borderRadius:10,fontWeight:800,fontSize:13,
                background:plan===p.id?`linear-gradient(135deg,${p.color},${p.tc})`:`${p.color}20`,
                border:`1px solid ${p.color}50`,color:plan===p.id?"#000":p.tc,cursor:"pointer",transition:"all .2s"}}>
              {plan===p.id?"✓ Current Plan":p.price===0?"Start Free":"Subscribe →"}
            </button>
          </div>
        ))}
      </div>

      {/* Feature comparison note */}
      <Card style={{padding:18}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,textAlign:"center"}}>
          {[
            {icon:"🔒",label:"No hidden fees",     sub:"Flat-rate subscriptions only"},
            {icon:"↩️",label:"Cancel anytime",     sub:"No lock-in, no penalty"},
            {icon:"🎁",label:"14-day free trial",  sub:"Pro features, no card needed"},
            {icon:"⚡",label:"Instant activation", sub:"Access within 30 seconds"},
          ].map((f,i)=>(
            <div key={i} style={{padding:"10px 0"}}>
              <div style={{fontSize:22,marginBottom:4}}>{f.icon}</div>
              <div style={{fontSize:12,fontWeight:700,marginBottom:2}}>{f.label}</div>
              <div style={{fontSize:10,color:C.muted}}>{f.sub}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{textAlign:"center",padding:22}}>
        <div style={{fontSize:17,fontWeight:700,marginBottom:6}}>🏢 Enterprise & White-Label</div>
        <div style={{color:C.muted,fontSize:13,marginBottom:14}}>License MAMEA as your own branded platform for banks, credit unions, and fintech companies.</div>
        <button onClick={()=>notify("Enterprise inquiry sent! We'll contact you within 24hrs 🚀",C.gold)}
          style={{background:`${C.gold}20`,border:`1px solid ${C.gold}50`,color:C.gold2,padding:"10px 26px",borderRadius:100,fontSize:13,fontWeight:700,cursor:"pointer"}}>
          Contact Enterprise Sales →
        </button>
      </Card>
    </div>
  );};

  // ── SUPPORT ────────────────────────────────────────────────────────────────
  const Support=()=>(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {[
          {icon:"💬",title:"Live Chat",    desc:"Average response under 2 minutes",                     action:"Open Chat",   fn:()=>setChatOpen(true),  color:C.teal},
          {icon:"📧",title:"Email Us",     desc:"support@mameaapp.io · Reply within 4 hours",           action:"Copy Email",  fn:()=>notify("Email copied: support@mameaapp.io",C.blue), color:C.blue},
          {icon:"💬",title:"Discord",      desc:"Community + moderators active 24/7",                   action:"Join Server", fn:()=>notify("Discord invite: discord.gg/mameaapp",C.purple), color:C.purple},
        ].map((c,i)=>(
          <Card key={i} glow={c.color} style={{textAlign:"center",padding:22}}>
            <div style={{fontSize:30,marginBottom:8}}>{c.icon}</div>
            <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>{c.title}</div>
            <div style={{fontSize:12,color:C.muted,marginBottom:14}}>{c.desc}</div>
            <button onClick={c.fn} style={{background:`${c.color}25`,border:`1px solid ${c.color}50`,color:c.color,padding:"8px 18px",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer"}}>
              {c.action}
            </button>
          </Card>
        ))}
      </div>

      <Card>
        <SLabel text="Frequently Asked Questions — Tap to expand"/>
        {FAQ.map((item,i)=>(
          <div key={i} style={{borderBottom:i<FAQ.length-1?`1px solid ${C.border}50`:"none"}}>
            <button onClick={()=>setFaqOpen(faqOpen===i?null:i)}
              style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
                padding:"14px 0",background:"none",border:"none",color:C.text,fontSize:14,fontWeight:600,
                textAlign:"left",cursor:"pointer"}}>
              <span>{item.q}</span>
              <span style={{color:C.teal,fontSize:18,transition:"transform .2s",transform:faqOpen===i?"rotate(45deg)":"rotate(0)"}}>+</span>
            </button>
            {faqOpen===i&&(
              <div style={{fontSize:13,color:C.sub,lineHeight:1.7,paddingBottom:14,paddingRight:20,animation:"slideUp2 .2s ease both"}}>
                {item.a}
              </div>
            )}
          </div>
        ))}
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Card>
          <SLabel text="Response Time Guarantee"/>
          {[{plan:"Free",  time:"24 hours",  color:C.muted},{plan:"Basic", time:"8 hours",   color:C.teal},{plan:"Pro",   time:"4 hours",   color:C.blue},{plan:"Elite", time:"1 hour 24/7",color:C.gold}].map((r,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<3?`1px solid ${C.border}50`:"none",fontSize:13}}>
              <span style={{color:C.sub}}>{r.plan} Plan</span>
              <Badge color={r.color} sm>{r.time}</Badge>
            </div>
          ))}
        </Card>
        <Card>
          <SLabel text="What we never do (our commitments)"/>
          {["Sell your data to anyone","Hide fees in spreads or conversions","Close your account without notice","Make you wait days for a support reply","Lock you into annual contracts"].map((c,i)=>(
            <div key={i} style={{display:"flex",gap:8,padding:"8px 0",borderBottom:i<4?`1px solid ${C.border}50`:"none",fontSize:13}}>
              <span style={{color:C.green,fontWeight:800,flexShrink:0}}>✓</span>
              <span style={{color:C.sub}}>Never: {c}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );

  const CONTENT={dashboard:<Dashboard/>,markets:<Markets/>,portfolio:<Portfolio/>,copy:<CopyTrade/>,ai:<AIAdvisor/>,news:<NewsTab/>,status:<SystemStatus/>,plans:<Plans/>,support:<Support/>};

  // ── ROOT ───────────────────────────────────────────────────────────────────
  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:FB,position:"relative"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px;height:3px}::-webkit-scrollbar-track{background:${C.deep}}::-webkit-scrollbar-thumb{background:${C.border2};border-radius:2px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes slideUp2{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        button{font-family:'DM Sans',system-ui,sans-serif;cursor:pointer}
        input{outline:none}
      `}</style>

      {/* ambient */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",background:`radial-gradient(circle,${C.teal}10 0%,transparent 65%)`,top:"-15%",left:"-10%"}}/>
        <div style={{position:"absolute",width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${C.gold}08 0%,transparent 65%)`,bottom:"-10%",right:"-5%"}}/>
      </div>

      {/* toast */}
      {notif&&<div style={{position:"fixed",top:20,right:20,zIndex:2000,background:C.card,
        border:`1px solid ${notif.color}60`,borderRadius:12,padding:"11px 18px",fontSize:13,
        fontWeight:600,color:notif.color,boxShadow:`0 0 20px ${notif.color}30`,animation:"slideDown .3s ease both"}}>
        {notif.msg}
      </div>}

      {/* modals */}
      {detailA&&<AssetDetail a={detailA} onClose={()=>setDetailA(null)}/>}
      {tradeA&&<TradeModal a={tradeA} onClose={()=>{setTradeA(null);setTradeAmt("");}}/>}

      {/* header */}
      <header style={{position:"sticky",top:0,zIndex:100,background:`${C.deep}E8`,backdropFilter:"blur(24px)",
        borderBottom:`1px solid ${C.border}`,padding:"0 22px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{fontSize:24,fontFamily:FD,fontWeight:800,letterSpacing:"-0.5px",
            background:`linear-gradient(135deg,${C.gold2},${C.teal2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>MAMEA</div>
          <div style={{fontSize:9,color:C.muted,letterSpacing:3,textTransform:"uppercase",marginTop:1}}>Financial OS</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:100,
            background:`${C.green}18`,border:`1px solid ${C.green}40`,fontSize:10,fontWeight:700,color:C.green}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:C.green,animation:"pulse 1.5s infinite"}}/>
            LIVE · {activeUsers.toLocaleString()} users
          </div>
          <div style={{fontSize:11,color:C.muted,fontFamily:FM}}>{new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</div>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,fontWeight:700}}>JR</div>
              <div style={{fontSize:9,color:C.muted}}>{PLANS.find(p=>p.id===plan)?.name} Plan</div>
            </div>
            <div style={{width:32,height:32,borderRadius:9,background:`linear-gradient(135deg,${C.gold},${C.teal})`,
              display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,color:"#000"}}>JR</div>
          </div>
        </div>
      </header>

      {/* nav */}
      <nav style={{position:"sticky",top:60,zIndex:99,background:`${C.deep}D8`,backdropFilter:"blur(20px)",
        borderBottom:`1px solid ${C.border}`,padding:"0 22px",display:"flex",alignItems:"center",gap:1,overflowX:"auto"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",alignItems:"center",gap:5,
            padding:"13px 14px",background:"transparent",border:"none",cursor:"pointer",whiteSpace:"nowrap",
            borderBottom:`2px solid ${tab===t.id?C.teal:"transparent"}`,
            color:tab===t.id?C.teal:C.muted,fontSize:12,fontWeight:tab===t.id?700:500,transition:"all .15s",borderRadius:0,marginBottom:-1}}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",gap:7,padding:"8px 0",flexShrink:0}}>
          <button onClick={()=>setTab("plans")} style={{background:`${C.gold}20`,border:`1px solid ${C.gold}50`,
            color:C.gold2,padding:"6px 14px",borderRadius:9,fontSize:12,fontWeight:700}}>✦ Upgrade</button>
          <button onClick={()=>setTradeA(ASSETS[0])} style={{background:`linear-gradient(135deg,${C.teal},${C.blue})`,
            border:"none",color:"white",padding:"6px 14px",borderRadius:9,fontSize:12,fontWeight:700}}>+ Trade</button>
        </div>
      </nav>

      {/* main */}
      <main style={{maxWidth:1100,margin:"0 auto",padding:"22px 22px 80px",position:"relative",zIndex:5}}>
        <div key={tab} style={{animation:"slideUp2 .25s ease both"}}>{CONTENT[tab]}</div>
      </main>

      {/* chat */}
      <ChatWidget/>

      {/* footer */}
      <footer style={{borderTop:`1px solid ${C.border}`,padding:"14px 22px",display:"flex",justifyContent:"space-between",
        alignItems:"center",background:C.deep,position:"relative",zIndex:5}}>
        <div style={{fontSize:15,fontWeight:800,fontFamily:FD,background:`linear-gradient(135deg,${C.gold2},${C.teal2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>MAMEA</div>
        <div style={{fontSize:11,color:C.muted}}>© 2026 MAMEA Financial OS · Not financial advice · Paper trading only</div>
        <div style={{fontSize:11,color:C.muted}}>v2.0.0 · <span style={{color:C.green}}>All systems operational</span></div>
      </footer>
    </div>
  );
}
