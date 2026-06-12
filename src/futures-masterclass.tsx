import { useState, useEffect } from "react";

const C = {
  bg0:"#020B18",bg1:"#071422",bg2:"#0C1C30",bg3:"#11243C",
  bd:"#1A2C42",bd2:"#223450",
  gold:"#F0B429",goldL:"#FDD060",
  gr:"#00C896",rd:"#FF4560",bl:"#4498FF",pu:"#8E67FF",
  tx:"#D4E8FA",sub:"#5A7DA0",mut:"#1E3050",
};

// ── SVG HELPERS ──────────────────────────────────────────────────────────────
function SvgChart({ h=220, vw=500, label, children }) {
  return (
    <div style={{margin:"16px 0",borderRadius:12,overflow:"hidden",border:`1px solid ${C.bd}`,background:C.bg0,position:"relative"}}>
      {label&&<div style={{position:"absolute",top:8,left:12,fontSize:10,color:C.sub,fontFamily:"monospace",letterSpacing:".12em",textTransform:"uppercase",zIndex:2}}>{label}</div>}
      <svg width="100%" viewBox={`0 0 ${vw} ${h}`} style={{display:"block"}}>{children}</svg>
    </div>
  );
}
const GL=({h,w=500,step=40})=>Array.from({length:Math.floor(h/step)},(_,i)=>(
  <line key={i} x1={0} y1={(i+1)*step} x2={w} y2={(i+1)*step} stroke={C.mut} strokeWidth={0.5} strokeDasharray="3,3"/>
));
const Candle=({x,o,h,l,c,w=12})=>{
  const col=c<=o?C.gr:C.rd, by=Math.min(o,c), bh=Math.max(Math.abs(c-o),2);
  return(<g><line x1={x} y1={h} x2={x} y2={l} stroke={col} strokeWidth={1.5}/><rect x={x-w/2} y={by} width={w} height={bh} fill={col} rx={1}/></g>);
};
const Arrow=({x1,y1,x2,y2,color=C.gold})=>{
  const dx=x2-x1,dy=y2-y1,len=Math.sqrt(dx*dx+dy*dy),ux=dx/len,uy=dy/len;
  return(<g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5}/><polygon points={`${x2},${y2} ${x2-ux*10-uy*5},${y2-uy*10+ux*5} ${x2-ux*10+uy*5},${y2-uy*10-ux*5}`} fill={color}/></g>);
};

// ── DIAGRAMS ─────────────────────────────────────────────────────────────────
const D_SpotVsFutures=()=>(
  <SvgChart h={190} label="Spot vs Futures Contracts">
    <GL h={190}/>
    <rect x={15} y={25} width={210} height={150} rx={8} fill={C.bg2} stroke={C.bl} strokeWidth={1.5}/>
    <text x={120} y={48} textAnchor="middle" fill={C.bl} fontSize={13} fontWeight="bold" fontFamily="sans-serif">SPOT TRADING</text>
    {[["✓ You OWN the asset",C.gr],["✓ Buy BNB = hold BNB",C.gr],["✗ No leverage",C.rd],["✗ Only profit going UP",C.rd],["○ Max loss = capital",C.sub]].map(([t,col],i)=>(
      <text key={i} x={30} y={70+i*22} fill={col} fontSize={11} fontFamily="sans-serif">{t}</text>
    ))}
    <text x={250} y={108} textAnchor="middle" fill={C.gold} fontSize={26}>⟷</text>
    <rect x={270} y={25} width={210} height={150} rx={8} fill={C.bg2} stroke={C.gold} strokeWidth={1.5}/>
    <text x={375} y={48} textAnchor="middle" fill={C.gold} fontSize={13} fontWeight="bold" fontFamily="sans-serif">FUTURES CONTRACT</text>
    {[["✓ Contract, not asset",C.gr],["✓ Up to 125× leverage",C.gr],["✓ Long AND Short",C.gr],["⚡ Liquidation risk",C.rd],["⚡ Can lose > deposit",C.rd]].map(([t,col],i)=>(
      <text key={i} x={280} y={70+i*22} fill={col} fontSize={11} fontFamily="sans-serif">{t}</text>
    ))}
  </SvgChart>
);

const D_LongShort=()=>(
  <SvgChart h={200} label="Long vs Short">
    <GL h={200}/>
    <polyline points="30,160 80,140 130,120 190,90 250,65" fill="none" stroke={C.gr} strokeWidth={2.5}/>
    <Arrow x1={180} y1={100} x2={240} y2={70} color={C.gr}/>
    <rect x={40} y={175} width={175} height={18} rx={4} fill={`${C.gr}25`} stroke={`${C.gr}50`}/>
    <text x={128} y={188} textAnchor="middle" fill={C.gr} fontSize={11} fontWeight="bold" fontFamily="sans-serif">LONG → Profit when price rises ↑</text>
    <polyline points="270,65 320,90 370,120 430,145 475,165" fill="none" stroke={C.rd} strokeWidth={2.5}/>
    <Arrow x1={300} y1={80} x2={465} y2={158} color={C.rd}/>
    <rect x={280} y={175} width={185} height={18} rx={4} fill={`${C.rd}25`} stroke={`${C.rd}50`}/>
    <text x={372} y={188} textAnchor="middle" fill={C.rd} fontSize={11} fontWeight="bold" fontFamily="sans-serif">SHORT → Profit when price falls ↓</text>
    <line x1={250} y1={20} x2={250} y2={185} stroke={C.bd} strokeWidth={1} strokeDasharray="4,4"/>
  </SvgChart>
);

const D_Leverage=()=>(
  <SvgChart h={210} label="Leverage: The Double-Edged Sword">
    <GL h={210}/>
    {[{x:40,lv:"1×",profit:5,col:C.bl},{x:140,lv:"10×",profit:50,col:C.gold},{x:240,lv:"20×",profit:100,col:"#FF8C00"},{x:340,lv:"50×",profit:250,col:C.rd,liq:true}].map(({x,lv,profit,col,liq})=>{
      const h=Math.min(profit/3,90);
      return(
        <g key={x}>
          <rect x={x} y={185-h} width={70} height={h} rx={4} fill={`${col}30`} stroke={col} strokeWidth={1.5}/>
          {liq&&<rect x={x+5} y={120} width={60} height={22} rx={4} fill={`${C.rd}60`} stroke={C.rd}/>}
          {liq&&<text x={x+35} y={135} textAnchor="middle" fill={C.rd} fontSize={10} fontWeight="bold" fontFamily="sans-serif">LIQUIDATED</text>}
          <text x={x+35} y={185-h-6} textAnchor="middle" fill={col} fontSize={11} fontWeight="bold" fontFamily="sans-serif">+{profit}%</text>
          <text x={x+35} y={200} textAnchor="middle" fill={col} fontSize={14} fontWeight="bold" fontFamily="sans-serif">{lv}</text>
          <text x={x+35} y={212} textAnchor="middle" fill={C.sub} fontSize={9} fontFamily="sans-serif">on 5% move</text>
        </g>
      );
    })}
    <text x={250} y={18} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily="monospace">SAME 5% PRICE MOVE — VERY DIFFERENT OUTCOMES</text>
  </SvgChart>
);

const D_Liquidation=()=>(
  <SvgChart h={200} label="How Liquidation Happens">
    <GL h={200}/>
    <polyline points="30,80 80,70 130,85 180,60 230,75 270,120 310,155 350,175 390,190" fill="none" stroke={C.rd} strokeWidth={2.5}/>
    <circle cx={130} cy={85} r={6} fill={C.gold}/>
    <line x1={130} y1={85} x2={130} y2={40} stroke={C.gold} strokeDasharray="4,3" strokeWidth={1}/>
    <text x={130} y={35} textAnchor="middle" fill={C.gold} fontSize={11} fontWeight="bold" fontFamily="sans-serif">ENTRY (100× leverage)</text>
    <line x1={20} y1={175} x2={400} y2={175} stroke={C.rd} strokeWidth={2} strokeDasharray="6,3"/>
    <rect x={400} y={167} width={88} height={18} rx={3} fill={`${C.rd}30`} stroke={C.rd}/>
    <text x={444} y={179} textAnchor="middle" fill={C.rd} fontSize={11} fontWeight="bold" fontFamily="sans-serif">LIQUIDATION</text>
    <circle cx={388} cy={190} r={8} fill={C.rd}/>
    <text x={388} y={185} textAnchor="middle" fill={C.tx} fontSize={10}>💀</text>
    <text x={200} y={18} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily="monospace">1% move at 100× = instant liquidation</text>
  </SvgChart>
);

const D_FundingRate=()=>(
  <SvgChart h={210} label="Funding Rate Mechanism">
    <GL h={210}/>
    {[.08,.03,.06,-.02,-.05,-.01,.04,.07,.02,-.03,-.06,-.02,.05,.03,.08,.04].map((r,i)=>{
      const bull=r>=0,h=Math.abs(r)*800,y=bull?100-h:100;
      return(<rect key={i} x={30+i*28} y={y} width={20} height={h} rx={2} fill={bull?`${C.gr}70`:`${C.rd}70`} stroke={bull?C.gr:C.rd}/>);
    })}
    <line x1={20} y1={100} x2={490} y2={100} stroke={C.bd2} strokeWidth={2}/>
    <text x={500} y={104} fill={C.sub} fontSize={9} fontFamily="monospace">0%</text>
    <rect x={30} y={55} width={150} height={32} rx={4} fill={`${C.gr}20`} stroke={C.gr}/>
    <text x={105} y={68} textAnchor="middle" fill={C.gr} fontSize={10} fontWeight="bold" fontFamily="sans-serif">+Rate: Longs PAY shorts</text>
    <text x={105} y={82} textAnchor="middle" fill={C.sub} fontSize={9} fontFamily="sans-serif">Market is bullish/overbought</text>
    <rect x={30} y={125} width={150} height={32} rx={4} fill={`${C.rd}20`} stroke={C.rd}/>
    <text x={105} y={138} textAnchor="middle" fill={C.rd} fontSize={10} fontWeight="bold" fontFamily="sans-serif">-Rate: Shorts PAY longs</text>
    <text x={105} y={152} textAnchor="middle" fill={C.sub} fontSize={9} fontFamily="sans-serif">Market is bearish/oversold</text>
    <text x={350} y={175} textAnchor="middle" fill={C.gold} fontSize={11} fontWeight="bold" fontFamily="sans-serif">High +Rate = crowded longs = reversal risk</text>
    <text x={350} y={192} textAnchor="middle" fill={C.gold} fontSize={11} fontFamily="sans-serif">High -Rate = crowded shorts = short squeeze risk</text>
  </SvgChart>
);

const D_CandleAnatomy=()=>(
  <SvgChart h={230} label="Candlestick Anatomy — Every Part Explained">
    <GL h={230}/>
    <g transform="translate(80,0)">
      <line x1={0} y1={30} x2={0} y2={60} stroke={C.gr} strokeWidth={2}/>
      <rect x={-20} y={60} width={40} height={110} rx={3} fill={C.gr} opacity={0.9}/>
      <line x1={0} y1={170} x2={0} y2={200} stroke={C.gr} strokeWidth={2}/>
      <Arrow x1={65} y1={38} x2={8} y2={38} color={C.sub}/><text x={70} y={42} fill={C.tx} fontSize={12} fontWeight="bold" fontFamily="sans-serif">HIGH</text>
      <Arrow x1={65} y1={65} x2={12} y2={65} color={C.gold}/><text x={70} y={69} fill={C.gold} fontSize={12} fontWeight="bold" fontFamily="sans-serif">OPEN (bull)</text>
      <text x={65} y={115} fill={C.sub} fontSize={11} fontFamily="sans-serif">Body = range</text>
      <Arrow x1={65} y1={165} x2={12} y2={165} color={C.gr}/><text x={70} y={169} fill={C.gr} fontSize={12} fontWeight="bold" fontFamily="sans-serif">CLOSE (bull)</text>
      <Arrow x1={65} y1={196} x2={8} y2={196} color={C.sub}/><text x={70} y={200} fill={C.tx} fontSize={12} fontWeight="bold" fontFamily="sans-serif">LOW</text>
      <text x={-75} y={118} fill={C.gr} fontSize={13} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">BULL</text>
    </g>
    <g transform="translate(300,0)">
      <line x1={0} y1={30} x2={0} y2={55} stroke={C.rd} strokeWidth={2}/>
      <rect x={-20} y={55} width={40} height={110} rx={3} fill={C.rd} opacity={0.9}/>
      <line x1={0} y1={165} x2={0} y2={200} stroke={C.rd} strokeWidth={2}/>
      <Arrow x1={-65} y1={38} x2={-8} y2={38} color={C.sub}/><text x={-70} y={42} fill={C.tx} fontSize={12} fontWeight="bold" fontFamily="sans-serif" textAnchor="end">HIGH</text>
      <Arrow x1={-65} y1={60} x2={-12} y2={60} color={C.rd}/><text x={-70} y={64} fill={C.rd} fontSize={12} fontWeight="bold" fontFamily="sans-serif" textAnchor="end">OPEN (bear)</text>
      <Arrow x1={-65} y1={161} x2={-12} y2={161} color={C.gold}/><text x={-70} y={165} fill={C.gold} fontSize={12} fontWeight="bold" fontFamily="sans-serif" textAnchor="end">CLOSE (bear)</text>
      <Arrow x1={-65} y1={196} x2={-8} y2={196} color={C.sub}/><text x={-70} y={200} fill={C.tx} fontSize={12} fontWeight="bold" fontFamily="sans-serif" textAnchor="end">LOW</text>
      <text x={75} y={118} fill={C.rd} fontSize={13} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">BEAR</text>
    </g>
    <text x={250} y={225} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily="monospace">Green = buyers won | Red = sellers won</text>
  </SvgChart>
);

const D_CandlePatterns=()=>(
  <SvgChart h={195} vw={580} label="Essential Candlestick Patterns">
    <GL h={195} w={580}/>
    {[
      {x:30, name:"Doji",     note:"Indecision",  cols:[C.sub], cs:[{o:110,h:80,l:140,c:111}]},
      {x:110,name:"Hammer",   note:"Bull Reversal",cols:[C.gr], cs:[{o:88,h:83,l:135,c:85}]},
      {x:195,name:"Engulfing",note:"Strong Rev",  cols:[C.rd,C.gr],cs:[{o:95,h:90,l:105,c:100},{o:105,h:92,l:115,c:92}]},
      {x:305,name:"Shooting★",note:"Bear Reversal",cols:[C.rd],cs:[{o:115,h:70,l:120,c:118}]},
      {x:390,name:"3 Soldiers",note:"Trend Cont.", cols:[C.gr,C.gr,C.gr],cs:[{o:130,h:118,l:133,c:120},{o:120,h:106,l:123,c:108},{o:108,h:92,l:110,c:95}]},
    ].map(({x,name,note,cols,cs})=>(
      <g key={x}>
        {cs.map((c,i)=><Candle key={i} x={x+i*22} o={c.o} h={c.h} l={c.l} c={c.c} w={16}/>)}
        <text x={x+(cs.length-1)*11} y={165} textAnchor="middle" fill={C.gold} fontSize={10} fontWeight="bold" fontFamily="sans-serif">{name}</text>
        <text x={x+(cs.length-1)*11} y={178} textAnchor="middle" fill={C.sub} fontSize={9} fontFamily="sans-serif">{note}</text>
      </g>
    ))}
  </SvgChart>
);

const D_SupportResistance=()=>(
  <SvgChart h={215} label="Support & Resistance — Price Memory">
    <GL h={215}/>
    {[{x:30,o:135,h:130,l:145,c:132},{x:55,o:132,h:125,l:138,c:120},{x:80,o:120,h:112,l:126,c:108},{x:105,o:108,h:100,l:114,c:103},{x:130,o:103,h:95,l:108,c:98},{x:155,o:98,h:88,l:103,c:92},{x:180,o:92,h:85,l:97,c:88},{x:205,o:88,h:80,l:93,c:83},{x:230,o:83,h:75,l:88,c:78},{x:255,o:78,h:70,l:83,c:73},{x:280,o:73,h:65,l:78,c:68},{x:305,o:68,h:60,l:73,c:63}].map((d,i)=>(
      <Candle key={i} x={d.x} o={d.o} h={d.h} l={d.l} c={d.c} w={19}/>
    ))}
    <line x1={20} y1={165} x2={490} y2={165} stroke={C.gr} strokeWidth={2} strokeDasharray="8,4}"/>
    <rect x={390} y={156} width={88} height={18} rx={4} fill={`${C.gr}25`} stroke={C.gr}/>
    <text x={434} y={169} textAnchor="middle" fill={C.gr} fontSize={11} fontWeight="bold" fontFamily="sans-serif">SUPPORT</text>
    <line x1={20} y1={65} x2={490} y2={65} stroke={C.rd} strokeWidth={2} strokeDasharray="8,4}"/>
    <rect x={390} y={56} width={90} height={18} rx={4} fill={`${C.rd}25`} stroke={C.rd}/>
    <text x={435} y={69} textAnchor="middle" fill={C.rd} fontSize={11} fontWeight="bold" fontFamily="sans-serif">RESISTANCE</text>
    <rect x={20} y={67} width={470} height={96} fill={C.gold} opacity={0.03}/>
    <text x={250} y={118} textAnchor="middle" fill={C.gold} fontSize={10} fontFamily="monospace">VALUE AREA — RANGE</text>
    <text x={250} y={205} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily="monospace">Broken support → flips to resistance (and vice versa)</text>
  </SvgChart>
);

const D_Volume=()=>(
  <SvgChart h={220} label="Volume Analysis — Confirm the Move">
    <GL h={220}/>
    {[{x:35,o:160,h:155,l:165,c:158,v:20},{x:58,o:158,h:150,l:162,c:153,v:25},{x:81,o:153,h:145,l:157,c:148,v:30},{x:104,o:148,h:140,l:152,c:143,v:28},{x:127,o:143,h:133,l:147,c:135,v:55},{x:150,o:135,h:118,l:138,c:122,v:90},{x:173,o:122,h:110,l:125,c:113,v:85},{x:196,o:113,h:105,l:116,c:108,v:40},{x:219,o:108,h:100,l:112,c:103,v:35},{x:242,o:103,h:95,l:107,c:98,v:30},{x:265,o:98,h:88,l:102,c:92,v:25}].map((d,i)=>(
      <g key={i}>
        <Candle x={d.x} o={d.o} h={d.h} l={d.l} c={d.c} w={17}/>
        <rect x={d.x-8} y={215-d.v} width={17} height={d.v} rx={2} fill={d.c<=d.o?`${C.gr}60`:`${C.rd}60`}/>
      </g>
    ))}
    <line x1={20} y1={170} x2={490} y2={170} stroke={C.bd2} strokeWidth={1} strokeDasharray="3,3}"/>
    <text x={350} y={45} fill={C.gold} fontSize={11} fontWeight="bold" fontFamily="sans-serif">⚡ HIGH VOLUME = Real Move</text>
    <text x={350} y={62} fill={C.sub} fontSize={10} fontFamily="sans-serif">Low volume breakout = often fake</text>
    <rect x={127} y={105} width={60} height={20} rx={4} fill={`${C.gold}25`} stroke={C.gold}/>
    <text x={157} y={119} textAnchor="middle" fill={C.gold} fontSize={10} fontWeight="bold" fontFamily="sans-serif">Volume spike!</text>
  </SvgChart>
);

const D_MarketStructure=()=>(
  <SvgChart h={235} label="Market Structure: BOS & CHoCH">
    <GL h={235}/>
    {[{x:30,y:185},{x:80,y:145},{x:130,y:160},{x:185,y:110},{x:240,y:125},{x:295,y:80}].map((p,i,arr)=>{
      if(i===arr.length-1)return null;
      const n=arr[i+1];return(<line key={i} x1={p.x} y1={p.y} x2={n.x} y2={n.y} stroke={n.y<p.y?C.gr:C.sub} strokeWidth={2.5}/>);
    })}
    {[{x:30,y:185,l:"LL"},{x:80,y:145,l:"LH"},{x:130,y:160,l:"HL"},{x:185,y:110,l:"HH"},{x:240,y:125,l:"HL"},{x:295,y:80,l:"HH"}].map((p,i)=>(
      <g key={i}><circle cx={p.x} cy={p.y} r={5} fill={i<2?C.rd:C.gr}/><text x={p.x} y={p.y>150?p.y+18:p.y-10} textAnchor="middle" fill={i<2?C.rd:C.gr} fontSize={10} fontWeight="bold" fontFamily="monospace">{p.l}</text></g>
    ))}
    <rect x={152} y={88} width={38} height={14} rx={3} fill={`${C.gold}30`} stroke={C.gold}/>
    <text x={171} y={99} textAnchor="middle" fill={C.gold} fontSize={9} fontWeight="bold" fontFamily="monospace">BOS</text>
    <g transform="translate(295,0)">
      {[{x:0,y:80},{x:40,y:100},{x:80,y:82},{x:120,y:118},{x:160,y:95},{x:200,y:135}].map((p,i,arr)=>{
        if(i===arr.length-1)return null;const n=arr[i+1];return(<line key={i} x1={p.x} y1={p.y} x2={n.x} y2={n.y} stroke={n.y<p.y?C.gr:C.rd} strokeWidth={2.5}/>);
      })}
      {[{x:0,y:80,l:"HH"},{x:40,y:100,l:"HL"},{x:80,y:82,l:"HH"},{x:120,y:118,l:"LL"},{x:160,y:95,l:"LH"},{x:200,y:135,l:"LL"}].map((p,i)=>(
        <g key={i}><circle cx={p.x} cy={p.y} r={5} fill={i<3?C.gr:C.rd}/><text x={p.x} y={p.y>110?p.y+18:p.y-10} textAnchor="middle" fill={i<3?C.gr:C.rd} fontSize={10} fontWeight="bold" fontFamily="monospace">{p.l}</text></g>
      ))}
      <rect x={95} y={158} width={60} height={16} rx={3} fill={`${C.rd}30`} stroke={C.rd}/>
      <text x={125} y={170} textAnchor="middle" fill={C.rd} fontSize={9} fontWeight="bold" fontFamily="monospace">CHoCH ↓</text>
    </g>
    <text x={160} y={222} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily="monospace">← BULLISH STRUCTURE ──────────── BEARISH SHIFT →</text>
  </SvgChart>
);

const D_Divergence=()=>(
  <SvgChart h={230} label="Regular Divergence — Reversal Warning">
    <GL h={230}/>
    <text x={20} y={18} fill={C.sub} fontSize={10} fontFamily="monospace">PRICE</text>
    {[{x:30,o:130,h:122,l:140,c:125},{x:55,o:125,h:115,l:130,c:118},{x:80,o:118,h:106,l:122,c:110},{x:105,o:110,h:98,l:115,c:102},{x:130,o:102,h:88,l:106,c:92},{x:155,o:92,h:78,l:96,c:82}].map((d,i)=>(
      <Candle key={i} x={d.x} o={d.o} h={d.h} l={d.l} c={d.c} w={19}/>
    ))}
    <polyline points="30,125 55,118 80,110 105,102 130,92 155,82" fill="none" stroke={C.rd} strokeWidth={1} strokeDasharray="3,2" opacity={0.5}/>
    <text x={170} y={82} fill={C.rd} fontSize={10} fontFamily="sans-serif">Price: Lower Low</text>
    <text x={20} y={155} fill={C.sub} fontSize={10} fontFamily="monospace">RSI</text>
    <rect x={20} y={160} width={480} height={58} rx={6} fill={C.bg2} stroke={C.bd}/>
    <polyline points="30,195 55,190 80,185 105,182 130,185 155,188" fill="none" stroke={C.bl} strokeWidth={2}/>
    <circle cx={30} cy={195} r={4} fill={C.rd}/>
    <circle cx={155} cy={188} r={4} fill={C.gr}/>
    <polyline points="30,195 155,188" fill="none" stroke={C.gr} strokeWidth={1.5} strokeDasharray="4,2"/>
    <text x={170} y={192} fill={C.gr} fontSize={10} fontFamily="sans-serif">RSI: Higher Low</text>
    <Arrow x1={230} y1={185} x2={280} y2={110} color={C.gold}/>
    <text x={290} y={107} fill={C.gold} fontSize={11} fontWeight="bold" fontFamily="sans-serif">Bullish Divergence!</text>
    <text x={295} y={122} fill={C.sub} fontSize={10} fontFamily="sans-serif">Price falls but RSI rising</text>
    <text x={295} y={136} fill={C.sub} fontSize={10} fontFamily="sans-serif">= losing bearish momentum</text>
    <text x={250} y={222} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily="monospace">Divergence = early warning before price reverses</text>
  </SvgChart>
);

const D_PremiumDiscount=()=>(
  <SvgChart h={225} label="Premium, Equilibrium & Discount">
    <GL h={225}/>
    <rect x={35} y={28} width={425} height={165} rx={4} fill="none" stroke={C.bd2} strokeWidth={1.5}/>
    <line x1={35} y1={28} x2={460} y2={28} stroke={C.rd} strokeWidth={2}/>
    <text x={468} y={32} fill={C.rd} fontSize={10} fontWeight="bold" fontFamily="monospace">HIGH</text>
    <line x1={35} y1={110} x2={460} y2={110} stroke={C.gold} strokeWidth={2} strokeDasharray="8,4"/>
    <text x={468} y={114} fill={C.gold} fontSize={10} fontWeight="bold" fontFamily="monospace">50% EQ</text>
    <line x1={35} y1={193} x2={460} y2={193} stroke={C.gr} strokeWidth={2}/>
    <text x={468} y={197} fill={C.gr} fontSize={10} fontWeight="bold" fontFamily="monospace">LOW</text>
    <rect x={37} y={30} width={421} height={78} rx={3} fill={`${C.rd}12`}/>
    <text x={247} y={67} textAnchor="middle" fill={C.rd} fontSize={16} fontWeight="bold" fontFamily="sans-serif">PREMIUM — Look for SHORTS</text>
    <text x={247} y={88} textAnchor="middle" fill={C.sub} fontSize={11} fontFamily="sans-serif">Price is expensive here — Smart Money SELLS</text>
    <rect x={90} y={103} width={155} height={16} rx={4} fill={`${C.gold}20`} stroke={C.gold}/>
    <text x={168} y={115} textAnchor="middle" fill={C.gold} fontSize={11} fontWeight="bold" fontFamily="sans-serif">EQUILIBRIUM — 50% (avoid)</text>
    <rect x={37} y={112} width={421} height={79} rx={3} fill={`${C.gr}12`}/>
    <text x={247} y={150} textAnchor="middle" fill={C.gr} fontSize={16} fontWeight="bold" fontFamily="sans-serif">DISCOUNT — Look for LONGS</text>
    <text x={247} y={170} textAnchor="middle" fill={C.sub} fontSize={11} fontFamily="sans-serif">Price is cheap here — Smart Money BUYS</text>
  </SvgChart>
);

const D_Liquidity=()=>(
  <SvgChart h={225} label="Liquidity — Where Stops Are Hiding">
    <GL h={225}/>
    {[{x:30,y:140},{x:70,y:110},{x:110,y:130},{x:150,y:110},{x:190,y:130},{x:230,y:108},{x:270,y:128},{x:310,y:90},{x:350,y:130},{x:390,y:90}].map((p,i,arr)=>{
      if(i===arr.length-1)return null;const n=arr[i+1];return(<line key={i} x1={p.x} y1={p.y} x2={n.x} y2={n.y} stroke={C.sub} strokeWidth={2}/>);
    })}
    <line x1={65} y1={107} x2={315} y2={107} stroke={C.rd} strokeWidth={1.5} strokeDasharray="5,3" opacity={0.8}/>
    {[70,150,230].map(x=><circle key={x} cx={x} cy={110} r={5} fill={C.rd}/>)}
    <rect x={315} y={100} width={115} height={14} rx={3} fill={`${C.rd}25`} stroke={C.rd}/>
    <text x={372} y={111} textAnchor="middle" fill={C.rd} fontSize={10} fontWeight="bold" fontFamily="sans-serif">BSL — Buy-Side Liq</text>
    <line x1={105} y1={133} x2={355} y2={133} stroke={C.gr} strokeWidth={1.5} strokeDasharray="5,3" opacity={0.8}/>
    {[110,190,270,350].map(x=><circle key={x} cx={x} cy={130} r={5} fill={C.gr}/>)}
    <rect x={355} y={126} width={120} height={14} rx={3} fill={`${C.gr}25`} stroke={C.gr}/>
    <text x={415} y={137} textAnchor="middle" fill={C.gr} fontSize={10} fontWeight="bold" fontFamily="sans-serif">SSL — Sell-Side Liq</text>
    <Arrow x1={313} y1={88} x2={392} y2={88} color={C.gold}/>
    <circle cx={392} cy={90} r={7} fill={C.gold}/>
    <text x={392} y={76} textAnchor="middle" fill={C.gold} fontSize={10} fontWeight="bold" fontFamily="sans-serif">SWEEP!</text>
    <text x={250} y={210} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily="monospace">Smart money sweeps liquidity → then makes the real move</text>
  </SvgChart>
);

const D_InstitutionalCandle=()=>(
  <SvgChart h={215} label="Displacement / Institutional Candles">
    <GL h={215}/>
    {[{x:30,o:165,h:162,l:170,c:163},{x:55,o:163,h:159,l:167,c:161},{x:80,o:161,h:157,l:164,c:159}].map((d,i)=>(
      <Candle key={i} x={d.x} o={d.o} h={d.h} l={d.l} c={d.c} w={18}/>
    ))}
    <Candle x={115} o={159} h={148} l={110} c={112} w={30}/>
    <rect x={100} y={148} width={30} height={11} rx={2} fill={`${C.gold}40`} stroke={C.gold}/>
    <text x={115} y={157} textAnchor="middle" fill={C.gold} fontSize={8} fontWeight="bold" fontFamily="sans-serif">OB</text>
    <rect x={60} y={88} width={120} height={16} rx={4} fill={`${C.gr}25`} stroke={C.gr}/>
    <text x={120} y={100} textAnchor="middle" fill={C.gr} fontSize={10} fontWeight="bold" fontFamily="sans-serif">DISPLACEMENT CANDLE 🚀</text>
    <text x={120} y={75} textAnchor="middle" fill={C.sub} fontSize={9} fontFamily="sans-serif">Large body, small wicks</text>
    <text x={120} y={64} textAnchor="middle" fill={C.sub} fontSize={9} fontFamily="sans-serif">= institutional order executed</text>
    {[{x:145,o:112,h:108,l:118,c:115},{x:170,o:115,h:108,l:118,c:112},{x:195,o:112,h:106,l:115,c:110}].map((d,i)=>(
      <Candle key={i} x={d.x} o={d.o} h={d.h} l={d.l} c={d.c} w={18}/>
    ))}
    <text x={300} y={50} fill={C.sub} fontSize={11} fontFamily="sans-serif">Signs of displacement:</text>
    {["• Large body (80%+ of candle)","• Small or no wicks","• High volume","• Creates FVG","• BOS on next candle"].map((t,i)=>(
      <text key={i} x={310} y={68+i*18} fill={C.sub} fontSize={10} fontFamily="sans-serif">{t}</text>
    ))}
    <rect x={295} y={38} width={185} height={115} rx={6} fill="none" stroke={C.bd2}/>
  </SvgChart>
);

const D_OrderBlock=()=>(
  <SvgChart h={235} label="Order Blocks — Institutional Footprints">
    <GL h={235}/>
    <text x={112} y={18} textAnchor="middle" fill={C.gr} fontSize={11} fontWeight="bold" fontFamily="sans-serif">BULLISH ORDER BLOCK</text>
    {[{x:32,o:185,h:182,l:190,c:187},{x:55,o:187,h:183,l:192,c:189}].map((d,i)=><Candle key={i} x={d.x} o={d.o} h={d.h} l={d.l} c={d.c} w={17}/>)}
    <rect x={68} y={164} width={25} height={22} fill={`${C.rd}60`} stroke={C.rd} strokeWidth={1.5} rx={2}/>
    <line x1={80} y1={157} x2={80} y2={164} stroke={C.rd} strokeWidth={1.5}/><line x1={80} y1={186} x2={80} y2={192} stroke={C.rd} strokeWidth={1.5}/>
    <rect x={68} y={164} width={182} height={22} fill={`${C.gr}15`} stroke={C.gr} strokeWidth={1.5} rx={2} strokeDasharray="4,2"/>
    <text x={158} y={178} textAnchor="middle" fill={C.gr} fontSize={10} fontWeight="bold" fontFamily="sans-serif">BULLISH OB ZONE</text>
    {[{x:104,o:188,h:184,l:145,c:148},{x:127,o:148,h:143,l:112,c:115},{x:150,o:115,h:110,l:90,c:93}].map((d,i)=><Candle key={i} x={d.x} o={d.o} h={d.h} l={d.l} c={d.c} w={17}/>)}
    {[{x:173,o:93,h:88,l:100,c:97},{x:196,o:97,h:90,l:102,c:94},{x:219,o:94,h:82,l:96,c:86}].map((d,i)=><Candle key={i} x={d.x} o={d.o} h={d.h} l={d.l} c={d.c} w={17}/>)}
    <Arrow x1={219} y1={172} x2={219} y2={195} color={C.gr}/><text x={219} y={210} textAnchor="middle" fill={C.gr} fontSize={10} fontFamily="sans-serif">Retest ✓</text>
    <g transform="translate(260,0)">
      <text x={112} y={18} textAnchor="middle" fill={C.rd} fontSize={11} fontWeight="bold" fontFamily="sans-serif">BEARISH ORDER BLOCK</text>
      {[{x:32,o:58,h:55,l:64,c:61},{x:55,o:61,h:57,l:67,c:64}].map((d,i)=><Candle key={i} x={d.x} o={d.o} h={d.h} l={d.l} c={d.c} w={17}/>)}
      <rect x={68} y={46} width={25} height={22} fill={`${C.gr}60`} stroke={C.gr} strokeWidth={1.5} rx={2}/>
      <line x1={80} y1={40} x2={80} y2={46} stroke={C.gr} strokeWidth={1.5}/><line x1={80} y1={68} x2={80} y2={74} stroke={C.gr} strokeWidth={1.5}/>
      <rect x={68} y={46} width={182} height={22} fill={`${C.rd}15`} stroke={C.rd} strokeWidth={1.5} rx={2} strokeDasharray="4,2"/>
      <text x={158} y={60} textAnchor="middle" fill={C.rd} fontSize={10} fontWeight="bold" fontFamily="sans-serif">BEARISH OB ZONE</text>
      {[{x:104,o:43,h:36,l:100,c:97},{x:127,o:97,h:92,l:125,c:122},{x:150,o:122,h:118,l:148,c:145}].map((d,i)=><Candle key={i} x={d.x} o={d.o} h={d.h} l={d.l} c={d.c} w={17}/>)}
      {[{x:173,o:145,h:138,l:150,c:142},{x:196,o:142,h:134,l:148,c:138},{x:219,o:138,h:130,l:144,c:135}].map((d,i)=><Candle key={i} x={d.x} o={d.o} h={d.h} l={d.l} c={d.c} w={17}/>)}
      <Arrow x1={219} y1={58} x2={219} y2={38} color={C.rd}/><text x={219} y={32} textAnchor="middle" fill={C.rd} fontSize={10} fontFamily="sans-serif">Retest ✓</text>
    </g>
  </SvgChart>
);

const D_FVG=()=>(
  <SvgChart h={215} label="Fair Value Gap (FVG / Imbalance)">
    <GL h={215}/>
    <g transform="translate(30,10)">
      <text x={140} y={15} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily="monospace">3-CANDLE SETUP</text>
      <Candle x={60} o={165} h={160} l={170} c={163} w={24}/>
      <Candle x={100} o={163} h={152} l={118} c={120} w={24}/>
      <Candle x={140} o={120} h={115} l={125} c={122} w={24}/>
      <rect x={72} y={118} width={56} height={42} fill={`${C.gold}20`} stroke={C.gold} strokeWidth={1.5} rx={2} strokeDasharray="5,3}"/>
      <text x={100} y={142} textAnchor="middle" fill={C.gold} fontSize={11} fontWeight="bold" fontFamily="sans-serif">FVG</text>
      <line x1={72} y1={160} x2={180} y2={160} stroke={C.bd2} strokeDasharray="3,3" strokeWidth={1}/><text x={185} y={163} fill={C.sub} fontSize={9} fontFamily="sans-serif">C1 Low</text>
      <line x1={128} y1={118} x2={220} y2={118} stroke={C.bd2} strokeDasharray="3,3" strokeWidth={1}/><text x={225} y={122} fill={C.sub} fontSize={9} fontFamily="sans-serif">C3 High</text>
      <text x={100} y={190} textAnchor="middle" fill={C.sub} fontSize={9} fontFamily="sans-serif">C1 Low to C3 High = the gap</text>
    </g>
    <g transform="translate(285,10)">
      <text x={100} y={15} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily="monospace">PRICE FILLS GAP</text>
      <rect x={25} y={80} width={185} height={42} fill={`${C.gold}15`} stroke={C.gold} strokeWidth={1.5} rx={3} strokeDasharray="5,3"/>
      <text x={117} y={104} textAnchor="middle" fill={C.gold} fontSize={11} fontWeight="bold" fontFamily="sans-serif">FVG ZONE</text>
      <polyline points="20,135 50,115 80,102 100,94 122,102 140,100 163,97" fill="none" stroke={C.gr} strokeWidth={2}/>
      <Arrow x1={163} y1={97} x2={210} y2={52} color={C.gr}/>
      <text x={197} y={46} fill={C.gr} fontSize={11} fontWeight="bold" fontFamily="sans-serif">Bounce!</text>
      <text x={117} y={178} textAnchor="middle" fill={C.sub} fontSize={9} fontFamily="sans-serif">Market returns to fill inefficiency,</text>
      <text x={117} y={190} textAnchor="middle" fill={C.sub} fontSize={9} fontFamily="sans-serif">then continues trend</text>
    </g>
  </SvgChart>
);

const D_Inducement=()=>(
  <SvgChart h={215} label="Inducement — The Trap Before the Move">
    <GL h={215}/>
    <text x={250} y={18} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily="monospace">SMART MONEY CREATES OBVIOUS TARGETS TO TRAP RETAIL</text>
    {[{x:30,y:140},{x:70,y:110},{x:110,y:125},{x:150,y:108},{x:190,y:125}].map((p,i,arr)=>{
      if(i===arr.length-1)return null;const n=arr[i+1];return(<line key={i} x1={p.x} y1={p.y} x2={n.x} y2={n.y} stroke={C.sub} strokeWidth={2}/>);
    })}
    <line x1={65} y1={107} x2={200} y2={107} stroke={C.rd} strokeWidth={1.5} strokeDasharray="4,3"/>
    <circle cx={70} cy={110} r={5} fill={C.rd}/><circle cx={150} cy={108} r={5} fill={C.rd}/>
    <rect x={115} y={90} width={110} height={14} rx={3} fill={`${C.rd}20`} stroke={C.rd}/>
    <text x={170} y={101} textAnchor="middle" fill={C.rd} fontSize={9} fontWeight="bold" fontFamily="sans-serif">INDUCEMENT (obvious level)</text>
    <polyline points="190,125 220,100 240,92 260,80" fill="none" stroke={C.rd} strokeWidth={2}/>
    <circle cx={260} cy={80} r={7} fill={C.rd}/>
    <text x={255} y={70} textAnchor="middle" fill={C.rd} fontSize={10} fontFamily="sans-serif">Sweep!</text>
    <text x={180} y={60} textAnchor="middle" fill={C.rd} fontSize={10} fontFamily="sans-serif">Retail sees breakout → enters long 🤦</text>
    <polyline points="260,80 280,95 310,115 350,140 400,165 450,185" fill="none" stroke={C.gr} strokeWidth={2.5}/>
    <Arrow x1={360} y1={145} x2={440} y2={180} color={C.gr}/>
    <text x={380} y={130} fill={C.gr} fontSize={11} fontWeight="bold" fontFamily="sans-serif">Real move → DOWN</text>
    <text x={250} y={208} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily="monospace">Don't chase obvious breaks → wait for the sweep & reversal</text>
  </SvgChart>
);

const D_KillZones=()=>(
  <SvgChart h={200} vw={580} label="Kill Zones — When Smart Money Is Active">
    <GL h={200} w={580}/>
    <text x={290} y={17} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily="monospace">24H CLOCK — EST/EDT TIME</text>
    <line x1={25} y1={100} x2={560} y2={100} stroke={C.bd2} strokeWidth={2}/>
    {Array.from({length:25},(_,i)=>(
      <g key={i}><line x1={25+i*22} y1={95} x2={25+i*22} y2={105} stroke={C.bd2} strokeWidth={1}/>{i%4===0&&<text x={25+i*22} y={115} textAnchor="middle" fill={C.mut} fontSize={8} fontFamily="monospace">{i===0?"12A":i<12?`${i}A`:i===12?"12P":`${i-12}P`}</text>}</g>
    ))}
    <rect x={25} y={48} width={132} height={36} rx={5} fill={`${C.pu}30`} stroke={C.pu} strokeWidth={1.5}/>
    <text x={91} y={66} textAnchor="middle" fill={C.pu} fontSize={11} fontWeight="bold" fontFamily="sans-serif">🌏 ASIAN</text>
    <text x={91} y={78} textAnchor="middle" fill={C.pu} fontSize={9} fontFamily="sans-serif">6PM–12AM</text>
    <rect x={157} y={34} width={154} height={46} rx={5} fill={`${C.bl}30`} stroke={C.bl} strokeWidth={1.5}/>
    <text x={234} y={54} textAnchor="middle" fill={C.bl} fontSize={12} fontWeight="bold" fontFamily="sans-serif">🇬🇧 LONDON</text>
    <text x={234} y={70} textAnchor="middle" fill={C.bl} fontSize={9} fontFamily="sans-serif">2AM–5AM Kill Zone</text>
    <rect x={355} y={28} width={176} height={50} rx={5} fill={`${C.gold}30`} stroke={C.gold} strokeWidth={2}/>
    <text x={443} y={50} textAnchor="middle" fill={C.gold} fontSize={13} fontWeight="bold" fontFamily="sans-serif">🗽 NEW YORK</text>
    <text x={443} y={66} textAnchor="middle" fill={C.gold} fontSize={9} fontFamily="sans-serif">7AM–10AM EST (BEST!)</text>
    <text x={234} y={145} textAnchor="middle" fill={C.rd} fontSize={10} fontWeight="bold" fontFamily="sans-serif">⚡ London Judas: 2–3AM</text>
    <text x={443} y={145} textAnchor="middle" fill={C.rd} fontSize={10} fontWeight="bold" fontFamily="sans-serif">⚡ NY Judas: 7–8:30AM</text>
    <text x={290} y={175} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily="monospace">Outside Kill Zones = noise. Inside = institutional moves.</text>
  </SvgChart>
);

const D_JudasSwing=()=>(
  <SvgChart h={225} label="Judas Swing — The Market's Lie">
    <GL h={225}/>
    <text x={90} y={18} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily="monospace">PHASE 1: FAKE PUMP</text>
    <polyline points="30,130 60,120 80,108 100,92 115,78 120,88 114,102 100,118 80,130 62,135" fill="none" stroke={C.rd} strokeWidth={2}/>
    <line x1={30} y1={80} x2={130} y2={80} stroke={C.rd} strokeWidth={1} strokeDasharray="4,3" opacity={0.7}/>
    <text x={133} y={84} fill={C.rd} fontSize={9} fontFamily="sans-serif">BSL swept!</text>
    <circle cx={115} cy={78} r={6} fill={C.rd}/>
    <text x={115} y={68} textAnchor="middle" fill={C.rd} fontSize={9} fontFamily="sans-serif">TRAP 🪤</text>
    <text x={90} y={160} textAnchor="middle" fill={C.rd} fontSize={11} fontWeight="bold" fontFamily="sans-serif">Retail goes LONG 😭</text>
    <line x1={248} y1={15} x2={248} y2={215} stroke={C.bd2} strokeWidth={1} strokeDasharray="3,3"/>
    <text x={370} y={18} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily="monospace">PHASE 2: REAL MOVE</text>
    <polyline points="265,135 290,145 322,158 360,172 408,188 455,200" fill="none" stroke={C.gr} strokeWidth={2.5}/>
    <Arrow x1={380} y1={170} x2={445} y2={196} color={C.gr}/>
    <text x={340} y={218} textAnchor="middle" fill={C.gr} fontSize={11} fontWeight="bold" fontFamily="sans-serif">TRUE BEARISH DIRECTION</text>
    <rect x={262} y={125} width={58} height={22} rx={4} fill={`${C.gold}25`} stroke={C.gold}/>
    <text x={291} y={140} textAnchor="middle" fill={C.gold} fontSize={10} fontWeight="bold" fontFamily="sans-serif">ENTRY 🎯</text>
    <text x={380} y={145} textAnchor="middle" fill={C.gr} fontSize={11} fontWeight="bold" fontFamily="sans-serif">Smart Money SHORTS 💰</text>
  </SvgChart>
);

const D_OTE=()=>(
  <SvgChart h={235} label="OTE — Optimal Trade Entry (61.8–78.6%)">
    <GL h={235}/>
    <line x1={55} y1={185} x2={200} y2={50} stroke={C.gr} strokeWidth={2.5}/>
    {[{pct:0,y:50,l:"100% Swing High",col:C.sub},{pct:.382,y:103,l:"38.2%",col:C.sub},{pct:.5,y:118,l:"50% EQ",col:C.gold},{pct:.618,y:133,l:"61.8% ← OTE",col:C.gr},{pct:.786,y:152,l:"78.6% ← OTE",col:C.gr},{pct:1,y:185,l:"0% Swing Low",col:C.sub}].map(({y,l,col})=>(
      <g key={y}><line x1={55} y1={y} x2={330} y2={y} stroke={col} strokeWidth={col===C.gr?1.8:0.8} strokeDasharray="5,3" opacity={0.8}/><text x={335} y={y+4} fill={col} fontSize={10} fontFamily="monospace">{l}</text></g>
    ))}
    <rect x={56} y={133} width={274} height={19} fill={`${C.gr}20`} stroke={C.gr} strokeWidth={1} rx={2}/>
    <text x={193} y={146} textAnchor="middle" fill={C.gr} fontSize={10} fontWeight="bold" fontFamily="sans-serif">OTE ZONE — Optimal Long Entry</text>
    <polyline points="200,50 228,82 255,110 272,142 268,140" fill="none" stroke={C.rd} strokeWidth={2} strokeDasharray="4,2"/>
    <circle cx={268} cy={140} r={7} fill={C.gold}/>
    <Arrow x1={268} y1={140} x2={345} y2={80} color={C.gold}/>
    <text x={360} y={78} fill={C.gold} fontSize={12} fontWeight="bold" fontFamily="sans-serif">LONG 🎯</text>
    <text x={193} y={220} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily="monospace">Impulse up → retrace into 61.8–78.6% → enter long</text>
  </SvgChart>
);

const D_AMD=()=>(
  <SvgChart h={225} label="Power of 3 — AMD Model (Daily Cycle)">
    <GL h={225}/>
    <rect x={22} y={22} width={145} height={185} rx={6} fill={`${C.bl}10`} stroke={C.bl} strokeWidth={1.5}/>
    <text x={95} y={40} textAnchor="middle" fill={C.bl} fontSize={12} fontWeight="bold" fontFamily="sans-serif">ACCUMULATION</text>
    <text x={95} y={54} textAnchor="middle" fill={C.sub} fontSize={9} fontFamily="sans-serif">Asian Session</text>
    <polyline points="38,148 60,138 75,152 95,140 112,155 132,142 152,150" fill="none" stroke={C.bl} strokeWidth={2}/>
    <text x={95} y={192} textAnchor="middle" fill={C.sub} fontSize={9} fontFamily="sans-serif">Tight range. SM quietly</text>
    <text x={95} y={203} textAnchor="middle" fill={C.sub} fontSize={9} fontFamily="sans-serif">accumulates positions</text>
    <rect x={178} y={22} width={145} height={185} rx={6} fill={`${C.rd}10`} stroke={C.rd} strokeWidth={1.5}/>
    <text x={250} y={40} textAnchor="middle" fill={C.rd} fontSize={12} fontWeight="bold" fontFamily="sans-serif">MANIPULATION</text>
    <text x={250} y={54} textAnchor="middle" fill={C.rd} fontSize={9} fontFamily="sans-serif">London Kill Zone</text>
    <polyline points="183,148 200,135 218,118 232,98 240,82 238,97 230,112 218,128 206,140 194,150" fill="none" stroke={C.rd} strokeWidth={2}/>
    <text x={240} y={79} fill={C.rd} fontSize={9} fontFamily="sans-serif">Judas ↑</text>
    <text x={250} y={192} textAnchor="middle" fill={C.sub} fontSize={9} fontFamily="sans-serif">Fake pump, sweeps highs,</text>
    <text x={250} y={203} textAnchor="middle" fill={C.sub} fontSize={9} fontFamily="sans-serif">traps retail buyers</text>
    <rect x={334} y={22} width={152} height={185} rx={6} fill={`${C.gr}10`} stroke={C.gr} strokeWidth={1.5}/>
    <text x={410} y={40} textAnchor="middle" fill={C.gr} fontSize={12} fontWeight="bold" fontFamily="sans-serif">DISTRIBUTION</text>
    <text x={410} y={54} textAnchor="middle" fill={C.gr} fontSize={9} fontFamily="sans-serif">NY Kill Zone</text>
    <polyline points="338,152 358,140 380,125 402,108 422,88 442,70 466,52" fill="none" stroke={C.gr} strokeWidth={2.5}/>
    <Arrow x1={444} y1={68} x2={468} y2={50} color={C.gr}/>
    <text x={410} y={192} textAnchor="middle" fill={C.sub} fontSize={9} fontFamily="sans-serif">Real directional move!</text>
    <text x={410} y={203} textAnchor="middle" fill={C.sub} fontSize={9} fontFamily="sans-serif">This is where we profit</text>
  </SvgChart>
);

const D_SilverBullet=()=>(
  <SvgChart h={215} label="ICT Silver Bullet — 10AM–11AM NY Window">
    <GL h={215}/>
    <text x={250} y={18} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily="monospace">NY SESSION TIMELINE — OPTIMAL ENTRY WINDOW</text>
    <line x1={20} y1={100} x2={500} y2={100} stroke={C.bd2} strokeWidth={1.5}/>
    {["7A","8A","9A","10A","11A","12P","1P","2P","3P"].map((t,i)=>(
      <g key={t}><line x1={20+i*58} y1={95} x2={20+i*58} y2={105} stroke={C.bd2} strokeWidth={1}/><text x={20+i*58} y={116} textAnchor="middle" fill={C.mut} fontSize={9} fontFamily="monospace">{t}</text></g>
    ))}
    <rect x={194} y={48} width={116} height={44} rx={5} fill={`${C.gold}35`} stroke={C.gold} strokeWidth={2}/>
    <text x={252} y={67} textAnchor="middle" fill={C.gold} fontSize={14} fontWeight="bold" fontFamily="sans-serif">SILVER BULLET</text>
    <text x={252} y={83} textAnchor="middle" fill={C.gold} fontSize={9} fontFamily="sans-serif">10AM–11AM EST</text>
    <rect x={20} y={48} width={116} height={35} rx={5} fill={`${C.rd}20`} stroke={C.rd} strokeWidth={1}/>
    <text x={78} y={63} textAnchor="middle" fill={C.rd} fontSize={10} fontWeight="bold" fontFamily="sans-serif">NY Open + Judas</text>
    <text x={78} y={76} textAnchor="middle" fill={C.sub} fontSize={9} fontFamily="sans-serif">7AM–9:30AM</text>
    <rect x={368} y={48} width={120} height={35} rx={5} fill={`${C.bl}20`} stroke={C.bl} strokeWidth={1}/>
    <text x={428} y={63} textAnchor="middle" fill={C.bl} fontSize={10} fontWeight="bold" fontFamily="sans-serif">London Close</text>
    <text x={428} y={76} textAnchor="middle" fill={C.sub} fontSize={9} fontFamily="sans-serif">11AM–12PM</text>
    <text x={252} y={148} textAnchor="middle" fill={C.gold} fontSize={12} fontWeight="bold" fontFamily="sans-serif">Best FVG setups form in this exact window</text>
    <text x={252} y={165} textAnchor="middle" fill={C.sub} fontSize={11} fontFamily="sans-serif">After Judas sweeps, watch M1/M5 FVG → entry</text>
    <text x={252} y={185} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily="sans-serif">Stop below swing low. Target: previous session high/low</text>
  </SvgChart>
);

const D_MTF=()=>(
  <SvgChart h={225} vw={560} label="Top-Down Multi-Timeframe Analysis">
    <GL h={225} w={560}/>
    {[
      {x:10,w:160,tf:"DAILY (D1)",role:"BIAS",col:C.rd,note:"Bearish trend → Short only",cs:[{x:50,o:70,h:60,l:90,c:80},{x:80,o:80,h:68,l:95,c:90},{x:110,o:90,h:75,l:100,c:78},{x:140,o:78,h:65,l:85,c:70}]},
      {x:190,w:160,tf:"4H / H4",role:"STRUCTURE",col:C.gold,note:"Bearish OB identified",cs:[{x:50,o:65,h:58,l:80,c:75},{x:80,o:75,h:65,l:85,c:70},{x:110,o:70,h:60,l:75,c:62},{x:140,o:62,h:55,l:68,c:58}]},
      {x:370,w:165,tf:"M15 ENTRY",role:"TRIGGER",col:C.gr,note:"CHoCH → Entry short",cs:[{x:50,o:60,h:54,l:65,c:62},{x:80,o:62,h:56,l:64,c:58},{x:110,o:58,h:52,l:62,c:55},{x:140,o:55,h:48,l:57,c:50}]},
    ].map(({x,w,tf,role,col,note,cs})=>(
      <g key={x} transform={`translate(${x},0)`}>
        <rect x={0} y={18} width={w} height={190} rx={6} fill={C.bg2} stroke={col} strokeWidth={1.5}/>
        <rect x={0} y={18} width={w} height={28} rx={6} fill={`${col}20`}/>
        <text x={w/2} y={32} textAnchor="middle" fill={col} fontSize={11} fontWeight="bold" fontFamily="sans-serif">{tf}</text>
        <text x={w/2} y={42} textAnchor="middle" fill={col} fontSize={9} fontFamily="monospace">{role}</text>
        {cs.map((c,i)=><Candle key={i} x={c.x} o={c.o} h={c.h} l={c.l} c={c.c} w={22}/>)}
        <text x={w/2} y={178} textAnchor="middle" fill={C.sub} fontSize={9} fontFamily="sans-serif">{note}</text>
        {x!==370&&<Arrow x1={w+5} y1={112} x2={w+16} y2={112} color={C.bd2}/>}
      </g>
    ))}
    <text x={280} y={218} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily="monospace">D1 Bias → H4 Zone → M15 Entry Trigger</text>
  </SvgChart>
);

const D_RiskManagement=()=>(
  <SvgChart h={215} label="Position Sizing Formula">
    <GL h={215}/>
    <rect x={15} y={18} width={470} height={58} rx={8} fill={C.bg2} stroke={C.gold} strokeWidth={2}/>
    <text x={250} y={38} textAnchor="middle" fill={C.gold} fontSize={12} fontWeight="bold" fontFamily="monospace">POSITION SIZE = (Account × Risk%) ÷ SL Distance</text>
    <text x={250} y={60} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily="monospace">$1000 × 1% = $10 at risk ÷ $2 stop = 5 contracts</text>
    {[{label:"Account",value:"$1,000",col:C.tx},{label:"Risk %",value:"1%",col:C.gold},{label:"$ Risk",value:"$10",col:C.gold},{label:"Entry",value:"$320",col:C.bl},{label:"Stop",value:"$318",col:C.rd},{label:"SL Size",value:"$2",col:C.rd},{label:"Position",value:"5 ctrs",col:C.gr}].map(({label,value,col},i)=>(
      <g key={i} transform={`translate(${15+i*66},90)`}>
        <rect x={0} y={0} width={60} height={72} rx={5} fill={C.bg2} stroke={C.bd}/>
        <text x={30} y={18} textAnchor="middle" fill={C.sub} fontSize={9} fontFamily="sans-serif">{label}</text>
        <text x={30} y={50} textAnchor="middle" fill={col} fontSize={11} fontWeight="bold" fontFamily="monospace">{value}</text>
        {i>0&&<text x={-6} y={40} fill={C.gold} fontSize={14} fontFamily="sans-serif">{["→","=","@","-","÷","="][i-1]}</text>}
      </g>
    ))}
    <text x={250} y={200} textAnchor="middle" fill={C.gr} fontSize={12} fontWeight="bold" fontFamily="monospace">⚠ NEVER RISK MORE THAN 1–2% PER TRADE</text>
  </SvgChart>
);

const D_RRRatio=()=>(
  <SvgChart h={225} label="Risk:Reward — Why Math Wins">
    <GL h={225}/>
    <text x={250} y={18} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily="monospace">SAME $50 RISK — DIFFERENT OUTCOMES</text>
    {[{x:25,rr:"1:1",rew:50,col:C.sub,lbl:"Break even"},{x:140,rr:"1:2",rew:100,col:C.bl,lbl:"Profitable"},{x:258,rr:"1:3",rew:150,col:C.gold,lbl:"Pro Standard ✓"},{x:375,rr:"1:5",rew:200,col:C.gr,lbl:"Elite Setup 🏆"}].map(({x,rr,rew,col,lbl})=>{
      const riskH=50,rewH=Math.min(rew*0.7,145);
      return(
        <g key={x}>
          <rect x={x} y={185-riskH} width={65} height={riskH} rx={3} fill={`${C.rd}40`} stroke={C.rd}/>
          <rect x={x} y={185-riskH-rewH} width={65} height={rewH} rx={3} fill={`${col}40`} stroke={col}/>
          <text x={x+32} y={185-riskH-rewH-7} textAnchor="middle" fill={col} fontSize={10} fontWeight="bold" fontFamily="sans-serif">+${rew}</text>
          <text x={x+32} y={175-riskH/2+5} textAnchor="middle" fill={C.rd} fontSize={9} fontFamily="sans-serif">-$50</text>
          <text x={x+32} y={200} textAnchor="middle" fill={col} fontSize={13} fontWeight="bold" fontFamily="sans-serif">{rr}</text>
          <text x={x+32} y={214} textAnchor="middle" fill={C.sub} fontSize={8} fontFamily="sans-serif">{lbl}</text>
        </g>
      );
    })}
    <text x={250} y={112} textAnchor="middle" fill={C.gold} fontSize={11} fontFamily="monospace">1:3 R:R = profitable with only 26% win rate</text>
  </SvgChart>
);

const D_Drawdown=()=>(
  <SvgChart h={215} label="Drawdown Management — Survive to Thrive">
    <GL h={215}/>
    {[[0,100],[1,99],[2,101],[3,98],[4,96],[5,94],[6,97],[7,92],[8,95],[9,98],[10,96],[11,100],[12,103],[13,105],[14,108],[15,106],[16,110],[17,113],[18,112],[19,116]].map(([i,v])=>{
      const x=25+i*23,y=205-v;
      return i>0?<line key={i} x1={25+(i-1)*23} y1={205-[[0,100],[1,99],[2,101],[3,98],[4,96],[5,94],[6,97],[7,92],[8,95],[9,98],[10,96],[11,100],[12,103],[13,105],[14,108],[15,106],[16,110],[17,113],[18,112],[19,116]][i-1][1]} x2={x} y2={y} stroke={v>100?C.gr:C.rd} strokeWidth={2}/>:null;
    })}
    <line x1={20} y1={105} x2={480} y2={105} stroke={C.gold} strokeWidth={1.5} strokeDasharray="6,3}"/>
    <text x={485} y={109} fill={C.gold} fontSize={9} fontFamily="monospace">Start</text>
    <rect x={90} y={108} width={70} height={72} rx={3} fill={`${C.rd}15`} stroke={`${C.rd}40`} strokeDasharray="3,2"/>
    <text x={125} y={148} textAnchor="middle" fill={C.rd} fontSize={9} fontFamily="sans-serif">Drawdown</text>
    <text x={125} y={162} textAnchor="middle" fill={C.rd} fontSize={9} fontFamily="sans-serif">period</text>
    <text x={280} y={60} fill={C.gr} fontSize={11} fontWeight="bold" fontFamily="sans-serif">Recovery & Growth ↗</text>
    <text x={30} y={195} fill={C.sub} fontSize={10} fontFamily="monospace">Rules: Stop at -3% daily. -8% weekly. Reduce size after 3 losses.</text>
  </SvgChart>
);

const D_FullSetup=()=>(
  <SvgChart h={245} label="Complete SMC Trade — Step by Step">
    <GL h={245}/>
    <text x={20} y={16} fill={C.gold} fontSize={10} fontWeight="bold" fontFamily="monospace">① D1: Bearish  ② H4: Bearish OB  ③ M15: CHoCH → Short</text>
    <polyline points="25,60 75,50 125,65 170,45 215,60 225,75 245,92 275,110 310,130 330,108 342,118 360,130 380,118 402,135 432,148 460,158" fill="none" stroke={C.rd} strokeWidth={2}/>
    <line x1={170} y1={45} x2={295} y2={45} stroke={C.rd} strokeWidth={1} strokeDasharray="4,3}"/>
    <rect x={200} y={37} width={35} height={13} rx={3} fill={`${C.rd}25`} stroke={C.rd}/>
    <text x={217} y={47} textAnchor="middle" fill={C.rd} fontSize={8} fontWeight="bold" fontFamily="monospace">BOS</text>
    <rect x={155} y={42} width={58} height={18} fill={`${C.rd}20`} stroke={C.rd} strokeWidth={1.5} rx={2} strokeDasharray="4,2}"/>
    <text x={184} y={54} textAnchor="middle" fill={C.rd} fontSize={9} fontWeight="bold" fontFamily="sans-serif">Bearish OB</text>
    <rect x={265} y={105} width={90} height={22} fill={`${C.gold}20`} stroke={C.gold} strokeWidth={1} rx={2} strokeDasharray="3,2}"/>
    <text x={310} y={120} textAnchor="middle" fill={C.gold} fontSize={9} fontFamily="sans-serif">FVG</text>
    <polyline points="460,158 430,142 402,128 380,112 362,122 352,115" fill="none" stroke={C.sub} strokeWidth={1.5} strokeDasharray="4,2}"/>
    <circle cx={352} cy={115} r={9} fill={C.gold} opacity={0.9}/>
    <text x={352} y={119} textAnchor="middle" fill={C.bg0} fontSize={10} fontWeight="bold" fontFamily="sans-serif">E</text>
    <line x1={295} y1={90} x2={475} y2={90} stroke={C.rd} strokeWidth={1.5} strokeDasharray="5,3}"/>
    <text x={478} y={94} fill={C.rd} fontSize={9} fontFamily="monospace">SL</text>
    <line x1={295} y1={155} x2={475} y2={155} stroke={C.gr} strokeWidth={1} strokeDasharray="3,3}"/>
    <text x={478} y={159} fill={C.gr} fontSize={9} fontFamily="monospace">TP1</text>
    <line x1={295} y1={190} x2={475} y2={190} stroke={C.gr} strokeWidth={1.5} strokeDasharray="3,3}"/>
    <text x={478} y={194} fill={C.gr} fontSize={9} fontFamily="monospace">TP2</text>
    <rect x={295} y={90} width={5} height={65} fill={`${C.rd}40`}/>
    <rect x={295} y={155} width={5} height={95} fill={`${C.gr}40`}/>
    <text x={283} y={128} fill={C.rd} fontSize={9} fontFamily="monospace">R</text>
    <text x={283} y={180} fill={C.gr} fontSize={9} fontFamily="monospace">3R</text>
    <text x={200} y={232} textAnchor="middle" fill={C.sub} fontSize={10} fontFamily="monospace">D1 Bias → H4 OB+FVG → Liquidity Swept → M15 CHoCH → Enter → Manage</text>
  </SvgChart>
);

// ── STORAGE ───────────────────────────────────────────────────────────────────
const Store = {
  async load() {
    try {
      const d = localStorage.getItem('ftm-v3-progress');
      return d ? JSON.parse(d) : null;
    } catch { return null; }
  },
  async save(data) {
    try { localStorage.setItem('ftm-v3-progress', JSON.stringify(data)); } catch {}
  }
};

// ── MULTI-QUESTION QUIZ ───────────────────────────────────────────────────────
function QuizSection({ quizzes }) {
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [done, setDone] = useState(false);

  const q = quizzes[qIdx];
  const sel = answers[qIdx] ?? null;
  const isRev = !!revealed[qIdx];
  const score = quizzes.reduce((s,qu,i)=> s+(answers[i]===qu.ans?1:0), 0);

  if (done) {
    const pct = Math.round(score/quizzes.length*100);
    const grade = pct===100?"🏆 Perfect!":pct>=66?"✅ Great!":pct>=33?"📚 Review needed":"❌ Study again";
    return (
      <div style={{background:C.bg2,border:`1px solid ${C.bd2}`,borderRadius:12,padding:24,textAlign:"center"}}>
        <div style={{fontSize:36,marginBottom:8}}>{pct===100?"🏆":pct>=66?"🎯":"📖"}</div>
        <div style={{color:C.gold,fontSize:22,fontWeight:900,fontFamily:"monospace"}}>{score}/{quizzes.length} Correct</div>
        <div style={{color:pct>=66?C.gr:C.rd,fontSize:14,fontWeight:600,marginTop:4}}>{grade}</div>
        <div style={{height:8,background:C.bg3,borderRadius:4,margin:"16px 0"}}>
          <div style={{height:8,width:`${pct}%`,background:pct>=66?C.gr:C.rd,borderRadius:4,transition:"width .6s"}}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
          {quizzes.map((qu,i)=>{
            const correct=answers[i]===qu.ans;
            return(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,textAlign:"left",padding:"8px 12px",borderRadius:8,background:correct?`${C.gr}15`:`${C.rd}15`,border:`1px solid ${correct?C.gr:C.rd}40`}}>
                <span style={{color:correct?C.gr:C.rd,fontSize:13,flexShrink:0}}>{correct?"✓":"✗"}</span>
                <div><div style={{color:C.sub,fontSize:11}}>{qu.q}</div>{!correct&&<div style={{color:C.gr,fontSize:11,marginTop:2}}>Answer: {qu.opts[qu.ans]}</div>}</div>
              </div>
            );
          })}
        </div>
        <button onClick={()=>{setQIdx(0);setAnswers({});setRevealed({});setDone(false);}}
          style={{background:`${C.gold}20`,color:C.gold,border:`1px solid ${C.gold}40`,borderRadius:8,padding:"8px 20px",fontWeight:700,cursor:"pointer",fontSize:13}}>
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div style={{background:C.bg2,border:`1px solid ${C.bd2}`,borderRadius:12,padding:20,marginTop:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:16}}>🎯</span>
          <span style={{color:C.gold,fontWeight:700,fontSize:12,fontFamily:"monospace",letterSpacing:".06em"}}>QUIZ — Q{qIdx+1} of {quizzes.length}</span>
        </div>
        <div style={{display:"flex",gap:5}}>
          {quizzes.map((_,i)=>(
            <div key={i} style={{width:20,height:6,borderRadius:3,background:i===qIdx?C.gold:revealed[i]!=null?(answers[i]===quizzes[i].ans?C.gr:C.rd):C.bg3,transition:"background .2s"}}/>
          ))}
        </div>
      </div>
      <p style={{color:C.tx,fontSize:14,fontWeight:600,marginBottom:14,lineHeight:1.5}}>{q.q}</p>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
        {q.opts.map((opt,i)=>{
          let bg=C.bg3,border=C.bd,col=C.sub;
          if(isRev){
            if(i===q.ans){bg=`${C.gr}20`;border=C.gr;col=C.gr;}
            else if(i===sel&&i!==q.ans){bg=`${C.rd}20`;border=C.rd;col=C.rd;}
          } else if(i===sel){bg=`${C.gold}15`;border=C.gold;col=C.gold;}
          return(
            <button key={i} onClick={()=>!isRev&&setAnswers(a=>({...a,[qIdx]:i}))}
              style={{background:bg,border:`1px solid ${border}`,borderRadius:8,padding:"10px 14px",color:col,textAlign:"left",fontSize:13,cursor:isRev?"default":"pointer",transition:"all .15s",fontFamily:"sans-serif"}}>
              <span style={{marginRight:8,fontFamily:"monospace",opacity:.7}}>{["A","B","C","D"][i]}.</span>{opt}
            </button>
          );
        })}
      </div>
      {!isRev?(
        <button disabled={sel===null} onClick={()=>setRevealed(r=>({...r,[qIdx]:true}))}
          style={{background:sel!==null?C.gold:"transparent",color:sel!==null?C.bg0:C.mut,border:`1px solid ${sel!==null?C.gold:C.bd}`,borderRadius:8,padding:"9px 22px",fontWeight:700,cursor:sel!==null?"pointer":"default",fontSize:13}}>
          Check Answer
        </button>
      ):(
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{padding:"9px 14px",borderRadius:8,background:answers[qIdx]===q.ans?`${C.gr}20`:`${C.rd}20`,border:`1px solid ${answers[qIdx]===q.ans?C.gr:C.rd}`,fontSize:13,color:answers[qIdx]===q.ans?C.gr:C.sub,flex:1}}>
            {answers[qIdx]===q.ans?"✓ Correct!":"✗ Correct answer: "+q.opts[q.ans]}
          </div>
          <button onClick={()=>qIdx<quizzes.length-1?setQIdx(q=>q+1):setDone(true)}
            style={{background:C.gold,color:C.bg0,border:"none",borderRadius:8,padding:"9px 18px",fontWeight:700,cursor:"pointer",fontSize:13,flexShrink:0}}>
            {qIdx<quizzes.length-1?"Next →":"Score"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── LESSON VIEW ───────────────────────────────────────────────────────────────
function LessonView({ lesson, mod, onNext, onPrev, hasNext, hasPrev, isCompleted, onComplete }) {
  const [showQuiz, setShowQuiz] = useState(false);
  const Visual = lesson.visual;

  function parse(text) {
    return text.split(/\*\*(.*?)\*\*/g).map((p,i)=>i%2===1
      ?<strong key={i} style={{color:C.gold,fontWeight:700}}>{p}</strong>
      :<span key={i}>{p}</span>
    );
  }

  return (
    <div style={{maxWidth:800,margin:"0 auto"}}>
      <div style={{marginBottom:22}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
          <span style={{background:`${mod.color}20`,color:mod.color,border:`1px solid ${mod.color}40`,borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:700}}>{mod.icon} {mod.title}</span>
          <span style={{color:C.sub,fontSize:12,fontFamily:"monospace"}}>⏱ {lesson.dur}</span>
          {isCompleted&&<span style={{background:`${C.gr}20`,color:C.gr,border:`1px solid ${C.gr}40`,borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:700}}>✓ Done</span>}
        </div>
        <h1 style={{color:C.tx,fontSize:22,fontWeight:800,margin:"0 0 8px",lineHeight:1.2}}>{lesson.title}</h1>
        <div style={{width:50,height:3,background:mod.color,borderRadius:2}}/>
      </div>
      {lesson.theory.map((p,i)=>(
        <p key={i} style={{color:C.tx,fontSize:14,lineHeight:1.78,marginBottom:13,opacity:.93}}>{parse(p)}</p>
      ))}
      <Visual/>
      <div style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:12,padding:18,marginBottom:18}}>
        <div style={{color:C.gold,fontWeight:700,fontSize:12,fontFamily:"monospace",marginBottom:12}}>⚡ KEY TAKEAWAYS</div>
        {lesson.points.map((pt,i)=>(
          <div key={i} style={{display:"flex",gap:10,marginBottom:8}}>
            <span style={{color:mod.color,fontSize:12,marginTop:2,flexShrink:0}}>◆</span>
            <span style={{color:C.sub,fontSize:13,lineHeight:1.5}}>{parse(pt)}</span>
          </div>
        ))}
      </div>
      {!showQuiz?(
        <button onClick={()=>setShowQuiz(true)} style={{background:`${mod.color}20`,color:mod.color,border:`1px solid ${mod.color}50`,borderRadius:10,padding:"12px 24px",fontWeight:700,cursor:"pointer",fontSize:13,width:"100%",marginBottom:18}}>
          🎯 Test Your Knowledge ({lesson.quiz.length} Questions)
        </button>
      ):(
        <QuizSection key={lesson.id+"-quiz"} quizzes={lesson.quiz}/>
      )}
      <div style={{display:"flex",justifyContent:"space-between",paddingTop:16,borderTop:`1px solid ${C.bd}`,marginTop:18}}>
        <button onClick={onPrev} disabled={!hasPrev} style={{background:"transparent",color:hasPrev?C.sub:C.mut,border:`1px solid ${hasPrev?C.bd:C.mut}`,borderRadius:8,padding:"8px 18px",cursor:hasPrev?"pointer":"default",fontSize:13}}>← Previous</button>
        <button onClick={()=>{onComplete();if(hasNext)onNext();}} style={{background:C.gold,color:C.bg0,border:"none",borderRadius:8,padding:"8px 24px",fontWeight:700,cursor:"pointer",fontSize:13}}>
          {hasNext?"Mark Done & Next →":"🏆 Complete!"}
        </button>
      </div>
    </div>
  );
}

// ── COURSE DATA ───────────────────────────────────────────────────────────────
const MODULES = [
  {
    id:1,title:"Futures 101",icon:"🎯",color:C.bl,
    lessons:[
      {id:"1.1",title:"What Are Futures?",dur:"7 min",
        theory:["A **futures contract** is an agreement to buy/sell an asset at a pre-agreed price. In crypto, we trade **perpetual futures** — contracts with no expiry date that continuously track the spot price through a mechanism called the funding rate.","You **never own the actual asset**. You're trading a derivative contract whose value mirrors the underlying price. This is crucial: you have no withdrawal rights, no staking rights — only P&L from price movement.","The key advantage: **leverage** (trade bigger than your deposit) and the ability to **short** (profit when price falls). These two features make futures far more powerful — and far more dangerous — than spot trading."],
        visual:D_SpotVsFutures,
        points:["Perpetual futures = no expiry, tracks spot via funding rate","You trade contracts, never own the actual asset","Can profit BOTH when price rises (long) or falls (short)","Popular exchanges: Binance Futures, Bybit, OKX","Liquidation is the main risk — understand it before trading"],
        quiz:[
          {q:"What do you actually own when trading a BNB perpetual futures contract?",opts:["BNB tokens in your wallet","A contract tracking BNB price","A share of Binance exchange","Physical BNB coins"],ans:1},
          {q:"What key feature makes futures more powerful than spot trading?",opts:["Lower fees","Leverage and ability to short","Better customer support","More cryptocurrencies available"],ans:1},
          {q:"Perpetual futures have no expiry. How do they stay close to spot price?",opts:["They don't — they drift freely","Through a funding rate mechanism","Exchange forces the price","Arbitrage bots automatically align them"],ans:1}
        ]},
      {id:"1.2",title:"Long & Short",dur:"6 min",
        theory:["**Going LONG** means buying a contract expecting price to rise. If BNB goes from $300→$350, you profit $50 per contract. Your loss is limited to your position size (unless using leverage).","**Going SHORT** means selling a contract expecting price to fall. If BNB drops $300→$250, you profit $50 per contract even though the asset price fell. This is unique to futures — spot traders can only profit going up.","Most retail traders are \"perma-bulls\" who only go long. **Professional traders have no directional bias** — they go long in uptrends, short in downtrends, and stay out when structure is unclear. Master both sides."],
        visual:D_LongShort,
        points:["Long = profit when price rises above your entry","Short = profit when price falls below your entry","Never have a permanent directional bias — trade both sides","Entry price minus exit price = P&L (multiplied by position size)","Futures allows you to profit in ALL market conditions"],
        quiz:[
          {q:"You SHORT BNB at $400, close at $350. What happened?",opts:["You lost $50 per contract","You profited $50 per contract","You broke even","You were liquidated"],ans:1},
          {q:"A 'perma-bull' trader only goes long. What's the main disadvantage?",opts:["They have higher fees","They miss half the market opportunities (all downtrends)","Their orders take longer to fill","Nothing — going long is safer"],ans:1},
          {q:"You enter a long at $500. BNB drops to $480. What is your P&L per contract?",opts:["+$20","-$20","$0","Depends on leverage"],ans:1}
        ]},
      {id:"1.3",title:"Leverage & Margin",dur:"9 min",
        theory:["**Leverage** multiplies your position size. 10× leverage means $100 controls a $1,000 position. A 1% price move becomes 10% profit or loss on your capital. This is the double-edged sword of futures.","**Initial Margin** is the deposit required to open a position. **Maintenance Margin** is the minimum to keep it open. When your margin falls below maintenance, liquidation begins. Always monitor your margin ratio.","**Isolated vs Cross Margin**: Isolated margin limits your risk to that position's deposit only. Cross margin shares your entire account balance as margin — one bad trade can drain everything. **Always use isolated margin** as a beginner."],
        visual:D_Leverage,
        points:["10× leverage: 1% move = 10% gain/loss on capital","Isolated margin = only that position's deposit at risk","Cross margin = entire account at risk (dangerous!)","Professional traders use 3–10× maximum","Your leverage determines your liquidation distance from entry"],
        quiz:[
          {q:"$500 account, 20× leverage, 5% adverse move. What happens?",opts:["You lose $25","You lose $250","You are liquidated (lose $500)","You lose $50"],ans:2},
          {q:"Which margin mode protects your other funds if one trade goes wrong?",opts:["Cross margin","Isolated margin","Portfolio margin","Hedge mode"],ans:1},
          {q:"What is the safest leverage level for a beginner futures trader?",opts:["25–50× for more profit potential","3–5× maximum","10–20× is standard","100× only for scalping"],ans:1}
        ]},
      {id:"1.4",title:"Liquidation",dur:"8 min",
        theory:["**Liquidation** is when the exchange force-closes your position because your margin is depleted. At 100× leverage, a mere 1% adverse move wipes your entire deposit — instantly, with no warning.","The **liquidation price** is calculated at entry. Higher leverage = liquidation price closer to entry. At 10× leverage on a long, roughly a 9% drop liquidates you. At 100×, just 0.9%.","**Preventing liquidation**: (1) Use low leverage (3–10×). (2) Set a stop loss above/below the liquidation price. (3) Never add to losing positions. (4) Use isolated margin mode. (5) Monitor your positions actively."],
        visual:D_Liquidation,
        points:["Liquidation = total loss of your margin deposit","100× leverage: ~1% adverse move = liquidation","Stop loss must be placed above (shorts) or below (longs) liq level","Never average down into losing futures positions","Monitor the 'Margin Ratio' on your exchange — below 100% = safe"],
        quiz:[
          {q:"At 50× leverage, approximately what price move will liquidate your long position?",opts:["50% move down","10% move down","2% move down","0.5% move down"],ans:2},
          {q:"What is the best practice to prevent liquidation?",opts:["Set stop loss and use low leverage (3–10×)","Add more margin when approaching liquidation","Use maximum leverage to maximize profit before liq hits","Only trade volatile pairs"],ans:0},
          {q:"What does 'Margin Ratio > 100%' mean on most exchanges?",opts:["Your position is profitable","Your position is at risk of liquidation","You have excess margin","Your leverage is too high"],ans:1}
        ]},
      {id:"1.5",title:"Order Types",dur:"7 min",
        theory:["**Market Order**: Executes immediately at current best price. Fast but may suffer slippage in volatile markets — you get the next available price, not necessarily what you see. Use for urgent exits only.","**Limit Order**: Specifies an exact price. Only fills at that price or better. No slippage, but may not fill if price doesn't reach your level. Use for planned entries at key zones — most professional entries are limit orders.","**Stop Market/Stop Limit**: Triggers when price hits a specified level. Used for stop losses and breakout entries. Always attach a stop order to every futures position the moment you enter."],
        visual:D_FundingRate,
        points:["Market order = instant fill, possible slippage","Limit order = exact price, no slippage, may not fill","Stop-market = emergency close, protects capital","Reduce-only orders can only reduce (not add to) a position","Always have an active stop loss on every open position"],
        quiz:[
          {q:"You want to enter a long at exactly $320 (not above). Which order type?",opts:["Market order","Limit buy at $320","Stop market","Post-only market"],ans:1},
          {q:"What is a 'reduce-only' order?",opts:["An order with reduced fees","An order that can only reduce your position size","A smaller position size","An order that reduces leverage"],ans:1},
          {q:"Market orders in fast/volatile conditions may result in:",opts:["Better prices than expected","Slippage — filling at a worse price than quoted","Cancellation of the order","Lower fees"],ans:1}
        ]},
      {id:"1.6",title:"Funding Rate",dur:"8 min",
        theory:["The **funding rate** is paid every 8 hours between long and short holders to keep perpetual futures prices aligned with spot. **Positive rate**: longs pay shorts (market is bullish/overleveraged long). **Negative rate**: shorts pay longs (market bearish/overleveraged short).","As a trader, funding rate is a **cost or income** depending on your position. High positive funding (+0.1% per 8h = +0.3%/day, +9%/month) means holding longs is expensive. This is why professionals close positions before high-funding periods.","**Funding rate as a signal**: Extremely positive funding (>0.1%) = market is overleveraged long, short squeeze potential exhausted, price may correct. Extremely negative funding = overleveraged short, potential for a short squeeze rally."],
        visual:D_FundingRate,
        points:["Funding paid every 8 hours (0:00, 8:00, 16:00 UTC)","High + funding = crowded longs = watch for reversal","High - funding = crowded shorts = watch for squeeze","Close positions before high funding if holding short-term","Use funding rate as a contrarian sentiment indicator"],
        quiz:[
          {q:"Funding rate is +0.08% every 8 hours. You hold a long position for 24 hours. How much funding do you pay?",opts:["0.08%","0.16%","0.24%","0.8%"],ans:2},
          {q:"Extremely high positive funding rate (+0.15%) is a signal that:",opts:["Price will definitely go up more","Market is overleveraged long — potential reversal ahead","Shorts are winning","You should add to your long"],ans:1},
          {q:"Negative funding rate means:",opts:["Longs pay shorts","Shorts pay longs","Nobody pays anything","Funding is paused"],ans:1}
        ]},
    ]
  },
  {
    id:2,title:"Reading Price",icon:"📊",color:C.pu,
    lessons:[
      {id:"2.1",title:"Candlestick Anatomy",dur:"8 min",
        theory:["Every candlestick tells a 4-part story: **Open** (where price started), **High** (highest reached), **Low** (lowest reached), **Close** (where price ended). These OHLC values are the foundation of all price action analysis.","**Bullish (green) candle**: Close is ABOVE open. Buyers dominated that period. **Bearish (red) candle**: Close is BELOW open. Sellers dominated. The **body** represents the battle between buyers and sellers within that timeframe.","The **wicks** (shadows) show where price explored but was **rejected**. A long upper wick = price tried to go higher but sellers pushed it back. A long lower wick = sellers tried to push lower but buyers defended. Wicks reveal hidden pressure."],
        visual:D_CandleAnatomy,
        points:["Body = distance between open and close (the 'decision')","Upper wick = selling pressure / rejection of higher prices","Lower wick = buying pressure / rejection of lower prices","Long body = strong conviction (one side dominated all period)","Small body (Doji) = balance between buyers and sellers"],
        quiz:[
          {q:"A candle with a very long lower wick and small body at the top signals:",opts:["Strong sustained selling pressure","Buyers rejected lower prices — potential bullish signal","Perfect equilibrium between buyers and sellers","Strong continued downtrend"],ans:1},
          {q:"What does the candle BODY represent?",opts:["The full price range for that period","The range between open and close prices","The high minus the low","Only the wicks"],ans:1},
          {q:"A very long bearish body with tiny wicks signals:",opts:["Indecision in the market","Sellers dominated completely from open to close","A reversal pattern","A support level forming"],ans:1}
        ]},
      {id:"2.2",title:"Candlestick Patterns",dur:"10 min",
        theory:["**Doji**: Open ≈ Close. Perfect indecision — neither buyer nor seller won. At the end of a trend, a Doji signals potential reversal. Context is everything — a Doji in the middle of a range is meaningless.","**Pin Bar (Hammer/Shooting Star)**: Small body, long wick pointing in the direction price rejected. **Bullish Hammer** (long lower wick) = buyers defended hard. **Bearish Shooting Star** (long upper wick) = sellers came in aggressively.","**Engulfing Candle**: A candle whose body completely engulfs the previous candle's body. **Bullish Engulfing** (large green candle swallows red) = strong reversal signal. Combined with a key level (OB, S/R), this is one of the highest-probability signals in price action."],
        visual:D_CandlePatterns,
        points:["Context always matters — patterns at key levels are meaningful","Engulfing candles are the strongest reversal signal","Pin bars need to be at significant price levels","Higher timeframe patterns override lower timeframe ones","3 white soldiers/3 black crows = powerful trend continuation"],
        quiz:[
          {q:"A Bullish Engulfing candle at a support level suggests:",opts:["Continuation of the downtrend","High probability reversal upward — strong buy signal","Indecision — wait for more confirmation","The support level is about to break"],ans:1},
          {q:"A Shooting Star candle has:",opts:["Long lower wick, small body at bottom","Long upper wick, small body at the top","Equal upper and lower wicks","No wicks at all"],ans:1},
          {q:"Which candlestick pattern shows the MOST conviction (one side dominating completely)?",opts:["Doji (open = close)","Large body candle with tiny/no wicks","Pin bar with long wick","Inside bar (small candle within previous)"],ans:1}
        ]},
      {id:"2.3",title:"Support & Resistance",dur:"9 min",
        theory:["**Support** is a price level where buyers are strong enough to prevent further decline — a floor. **Resistance** is a ceiling where sellers overcome buyers. These levels form because of **price memory**: participants who bought/sold at those levels remember them and act again when price returns.","**The Flip Principle**: When support is broken, it becomes resistance. When resistance is broken, it becomes support. This is one of the most reliable patterns in all of trading. Mark all significant levels on your chart.","**Round numbers** ($300, $350, $400 etc.) always act as major psychological S/R. Large institutions and retail traders place orders at round numbers. Never underestimate these levels — they're self-fulfilling prophecies."],
        visual:D_SupportResistance,
        points:["More price touches at a level = stronger S/R","Broken support → becomes resistance (S/R flip)","Round numbers are powerful psychological barriers","Give levels room — they're zones, not exact prices","Volume at S/R levels confirms their significance"],
        quiz:[
          {q:"BNB breaks through $300 support. On a retest of $300, you expect:",opts:["$300 to hold as support again","$300 to now act as resistance","$300 is no longer relevant","Guaranteed bounce from $300"],ans:1},
          {q:"Why are round numbers like $300 or $500 significant in crypto?",opts:["They are random price levels","Institutional and retail orders cluster at round numbers creating real supply/demand","Technical analysts love round numbers","Exchanges set special limits at round numbers"],ans:1},
          {q:"How many times should price touch a level before it's considered significant S/R?",opts:["Exactly once","At least 2–3 clear touches make it a valid level","It must be touched daily","Only once on the daily chart counts"],ans:1}
        ]},
      {id:"2.4",title:"Trend & Market Structure",dur:"10 min",
        theory:["**Uptrend** = series of **Higher Highs (HH)** and **Higher Lows (HL)**. Each rally makes a new high, each pullback holds above the previous low. ALWAYS bias long in uptrends — the trend is your friend.","**Downtrend** = series of **Lower Highs (LH)** and **Lower Lows (LL)**. Each bounce makes a lower high, each decline makes a new low. ALWAYS bias short in downtrends.","**Break of Structure (BOS)**: Price breaks the last significant swing in the direction of trend — continuation. **Change of Character (CHoCH)**: The FIRST BOS against the trend — the early warning of reversal. CHoCH on HTF = major signal; CHoCH on LTF = entry signal."],
        visual:D_MarketStructure,
        points:["HH + HL = bullish structure → bias LONG only","LH + LL = bearish structure → bias SHORT only","BOS = trend continues (trade with it)","CHoCH = first warning of trend reversal (don't fight it)","Structure analysis is more reliable than any indicator"],
        quiz:[
          {q:"Price makes HH → HL → HH → HL → then for the first time makes a LOWER Low. This is:",opts:["Another BOS confirming uptrend","CHoCH — first warning of potential reversal","A fake breakout — ignore it","A discount zone to buy"],ans:1},
          {q:"You're in a clear uptrend. Where should you ONLY be looking to enter?",opts:["Short at every high","Long on pullbacks to previous highs that become support","Short when RSI is overbought","Long and short equally"],ans:1},
          {q:"What is the difference between BOS and CHoCH?",opts:["They are the same thing","BOS confirms trend, CHoCH signals potential reversal against trend","BOS is on higher TF, CHoCH is on lower TF","CHoCH confirms trend, BOS signals reversal"],ans:1}
        ]},
      {id:"2.5",title:"Volume Analysis",dur:"8 min",
        theory:["**Volume** shows how many contracts were traded in each period. High volume = strong conviction, institutional participation. Low volume = weak move, likely to reverse. **Never trust a breakout without volume confirmation.**","Volume **spikes** at key levels confirm those levels. A high-volume rejection candle at resistance means real sellers showed up — not just a random bounce. This is institutional participation made visible.","**Declining volume in a trend** = warning sign. Uptrend with declining volume = buyers losing conviction, reversal coming. **Volume divergence**: price makes new high but volume is lower than previous high = distribution by smart money."],
        visual:D_Volume,
        points:["High volume + big candle = real institutional move","Low volume breakout = likely fake — wait for confirmation","Volume spike at S/R = confirms that level's importance","Rising price + falling volume = distribution warning","Volume profile shows 'value area' where most trading occurred"],
        quiz:[
          {q:"BNB breaks above resistance with very low volume. This breakout is likely:",opts:["Confirmed — all breakouts are valid","Fake — low volume = lack of conviction","Stronger because institutions are quiet","A definite entry signal"],ans:1},
          {q:"A huge volume spike on a bearish rejection candle at resistance signals:",opts:["Strong buying pressure","Real institutional selling — high probability reversal","Random noise — ignore it","Support is forming"],ans:1},
          {q:"Price makes a new higher high but volume on that move is lower than the previous higher high. This suggests:",opts:["Trend is accelerating","Distribution — smart money is quietly selling into the rally","Volume doesn't matter for trends","Buy more — the trend continues"],ans:1}
        ]},
      {id:"2.6",title:"Timeframes",dur:"8 min",
        theory:["Different timeframes serve different purposes. **Weekly/Daily**: Overall trend direction and major institutional zones. **4H/1H**: Intermediate structure and key OBs/FVGs. **15M/5M**: Entry trigger refinement. **1M**: Precision scalp entries.","The **golden rule**: Never trade against your higher timeframe bias. If D1 is bearish, only take SHORT entries on lower timeframes. Counter-trend trading is possible but requires 3× more skill and 3× more confluences.","**Timeframe alignment** amplifies probability dramatically. When D1, H4, and H1 all agree on direction, AND you have a quality LTF setup — that's an A+ trade. When they disagree, wait. Patience = profitability."],
        visual:D_MTF,
        points:["Always analyze from D1 down to M15 before every trade","Never trade against clear D1 trend direction","Higher TF structure always overrides lower TF signals","Timeframe = your stop loss size and trade duration","D1 OBs take weeks to form — they're extremely powerful"],
        quiz:[
          {q:"Your D1 shows a clear downtrend. On M15 you find a bullish engulfing at support. You should:",opts:["Enter long — M15 is your trading timeframe","Skip the trade — counter-trend on D1 = low probability","Enter with maximum size","Invert and go short instead"],ans:1},
          {q:"Which timeframe determines your overall directional BIAS for the day?",opts:["1 minute chart","15-minute chart","4-hour and Daily chart","The timeframe where the signal appears"],ans:2},
          {q:"Timeframe confluence means:",opts:["Using only one timeframe","All timeframes analyzed agree on direction — maximizes probability","Switching between timeframes randomly","Using the fastest timeframe available"],ans:1}
        ]},
      {id:"2.7",title:"Divergence",dur:"9 min",
        theory:["**Divergence** occurs when price and a momentum indicator (RSI, MACD) move in OPPOSITE directions. It signals that the current move is **losing momentum** — a reversal is building beneath the surface.","**Regular Bullish Divergence**: Price makes a Lower Low, but RSI makes a Higher Low. Selling momentum is weakening. Expect a bullish reversal. **Regular Bearish Divergence**: Price makes a Higher High, RSI makes a Lower High. Buying momentum is weakening — expect a drop.","**Hidden Divergence** (trend continuation): **Hidden Bullish**: Price makes HL (pullback in uptrend), RSI makes LL. This confirms uptrend continuation — add to longs. Use divergence as CONFIRMATION, never as your only signal. Combine with SMC levels for high probability."],
        visual:D_Divergence,
        points:["Divergence = price and RSI momentum moving opposite directions","Regular divergence = reversal signal","Hidden divergence = trend continuation signal","Use divergence as CONFIRMATION with SMC levels, not standalone","RSI 14 is standard; use on 1H or higher for reliability"],
        quiz:[
          {q:"Price makes Lower Low, RSI makes Higher Low. This is:",opts:["Regular Bearish Divergence","Regular Bullish Divergence — weakening sell momentum","Hidden Bullish Divergence","No divergence — price and RSI agree"],ans:1},
          {q:"How should you use divergence in your trading?",opts:["As the only signal you need","As confirmation with SMC zones — never standalone","Ignore it — indicators are useless","Only use it on the 1-minute chart"],ans:1},
          {q:"Hidden Bullish Divergence (price HL, RSI LL in an uptrend) suggests:",opts:["Reversal to the downside","Trend continuation upward — add to longs","Neutral — no clear signal","Sell immediately"],ans:1}
        ]},
    ]
  },
  {
    id:3,title:"Smart Money Concepts",icon:"🏦",color:C.gold,
    lessons:[
      {id:"3.1",title:"Who Is Smart Money?",dur:"9 min",
        theory:["**Smart Money** = Central banks, hedge funds, investment banks (Goldman, JPMorgan, Citadel), market makers, and large proprietary trading firms. They collectively control trillions in capital. Their order sizes are so massive they CANNOT enter/exit at a single price without moving the market.","Because of their size, institutions need to **engineer liquidity** — they create conditions where enough retail traders are on the wrong side so institutions can fill their orders. This is why markets do seemingly irrational things: sharp fakeouts, stop hunts, manipulation moves.","**SMC is about reading their footprints**: Order Blocks (where they placed orders), FVGs (where they moved price too fast), and Liquidity pools (where they're hunting). Trade WITH smart money, not against them."],
        visual:D_Liquidity,
        points:["Institutions control trillions — their size forces them to manipulate markets","Smart Money creates fake moves to generate the liquidity they need","Retail stops = institutional fill zones (your stop is their order)","OBs and FVGs are institutional footprints — trade from them","The market is a wealth transfer mechanism from retail to institutional"],
        quiz:[
          {q:"Why do large institutions need to manipulate price before making their real move?",opts:["To confuse retail traders for fun","Their massive order size requires liquidity (counter-party orders) to fill","Regulations require manipulation","They don't — this is a conspiracy theory"],ans:1},
          {q:"What is 'retail stop loss' to a large institution?",opts:["A risk management tool","Liquidity they need to fill their own large orders","Irrelevant to institutional trading","A reason to avoid those price levels"],ans:1},
          {q:"SMC analysis focuses on identifying which THREE key concepts?",opts:["RSI, MACD, Bollinger Bands","Order Blocks, Fair Value Gaps, and Liquidity pools","Support, Resistance, Trends","Fibonacci, Pivot Points, Volume"],ans:1}
        ]},
      {id:"3.2",title:"Market Structure — BOS & CHoCH",dur:"12 min",
        theory:["**Market structure** is the framework of swing highs and lows that defines trend direction. In SMC, we identify **Internal Structure** (lower timeframe swings for entries) and **External Structure** (higher timeframe major swings for bias).","**BOS (Break of Structure)**: When price breaks the last swing high (in uptrend) or swing low (in downtrend), it **confirms** trend continuation. After a bullish BOS, look for longs on the next pullback. After a bearish BOS, look for shorts on the next rally.","**CHoCH (Change of Character)**: The FIRST break against the prevailing trend. In an uptrend, the first time price breaks below a Higher Low = CHoCH. This is NOT yet a confirmed reversal — it's the first warning. Wait for confirmation before reversing your bias."],
        visual:D_MarketStructure,
        points:["Mark every significant swing high/low on your chart","BOS = confirmed trend continuation signal","CHoCH = first warning, begin looking for reversal setups","Internal CHoCH (LTF) = often your entry trigger","One CHoCH doesn't reverse the trend — needs follow-through"],
        quiz:[
          {q:"In a downtrend (LH+LL), price breaks ABOVE the last Lower High. This is a:",opts:["BOS confirming the downtrend","CHoCH — first signal of potential reversal","Irrelevant price movement","Order Block forming"],ans:1},
          {q:"After a bullish BOS on H4, where should you look to enter longs?",opts:["Immediately at the BOS level","On the next pullback to an OB or FVG in the discount zone","At the next resistance level","At a 50% retracement only"],ans:1},
          {q:"What is 'internal structure' in SMC?",opts:["The structure of major swing highs and lows on the Daily chart","Lower timeframe swings within a larger HTF swing (used for entries)","The order book structure","Support and resistance on the 1-minute chart"],ans:1}
        ]},
      {id:"3.3",title:"Premium & Discount Zones",dur:"9 min",
        theory:["Take any swing range (from swing low to swing high) and divide it at **50% (Equilibrium)**. Above 50% = **Premium** (overpriced). Below 50% = **Discount** (underpriced). Smart money BUYS in discount and SELLS in premium.","As a retail trader, this means: only go LONG from **Discount zones** (below 50%). Only go SHORT from **Premium zones** (above 50%). Never buy at the top of a range and never short the bottom — you're trading against institutions.","Apply this to EVERY timeframe and EVERY range. If D1 is in a discount and H4 shows a bullish OB in discount — that's double confirmation for a long. The more timeframes confirm the zone, the stronger the setup."],
        visual:D_PremiumDiscount,
        points:["Above 50% = Premium → only look for shorts","Below 50% = Discount → only look for longs","50% (EQ) = avoid entries here — no edge","Apply to every swing range on every timeframe","Best setups have OB/FVG confluence within premium/discount"],
        quiz:[
          {q:"BNB swings from $280 (low) to $360 (high). Where is the Equilibrium (50%)?",opts:["$300","$310","$320","$340"],ans:2},
          {q:"You find a perfect Bullish OB but it's located in the Premium zone. Should you trade it?",opts:["Yes — OBs override premium/discount rules","No — avoid longs in premium, wait for a discount zone OB","Yes but with reduced size","Only if RSI is oversold"],ans:1},
          {q:"Why does smart money buy in discount zones?",opts:["They follow technical analysis rules","To acquire assets at below-fair-value prices for maximum profit potential","Discounts have lower fees","It's where retail traders buy too"],ans:1}
        ]},
      {id:"3.4",title:"Liquidity — The Real Fuel",dur:"11 min",
        theory:["**Liquidity** in SMC context = clusters of stop orders waiting to be triggered. **Buy-Side Liquidity (BSL)** = stop losses of short sellers sitting ABOVE equal highs. **Sell-Side Liquidity (SSL)** = stop losses of long buyers sitting BELOW equal lows.","Institutions need these stop clusters to fill their own massive orders. Before a major move DOWN, smart money often pumps price above equal highs (triggering long stops = institutional sell orders fill). Then the real drop begins.","**Liquidity sweep vs breakout**: A genuine breakout closes convincingly above a level with high volume. A liquidity sweep rapidly wicks through the level and returns below it. Learning to distinguish these is the single most valuable skill in SMC."],
        visual:D_Liquidity,
        points:["Equal highs = BSL (buy-side liquidity, short stops above)","Equal lows = SSL (sell-side liquidity, long stops below)","Sweep = wick through level + immediate return (trap)","Real breakout = close through level + holds above it","After SSL swept → look for longs; after BSL swept → look for shorts"],
        quiz:[
          {q:"Price wicks above equal highs, then immediately reverses lower. This is most likely:",opts:["A genuine bullish breakout","A liquidity sweep — institutions grabbed BSL before going short","Random market noise","An order block forming"],ans:1},
          {q:"Equal lows (sell-side liquidity) are targeted because:",opts:["They are natural support levels","Long stop losses cluster just below them — institutional buy order fill zone","Technical analysts mark them as support","They represent equilibrium price"],ans:1},
          {q:"After sell-side liquidity (equal lows) is swept and price reverses UP strongly, what should you consider?",opts:["Enter short — the downtrend continues","Enter long — institutions swept SSL to fill buy orders","Wait 24 hours before deciding","Short and long simultaneously"],ans:1}
        ]},
      {id:"3.5",title:"Institutional Candles & Displacement",dur:"10 min",
        theory:["A **displacement candle** (also called an expansion candle) is a large-bodied candle with minimal wicks that moves price significantly in one direction. This is the **fingerprint of institutional order execution** — a massive order was placed and filled.","Displacement candles are critical for identifying **valid OBs and FVGs**. The candle immediately BEFORE the displacement is usually the Order Block. The gap created BY the displacement is usually the FVG.","**How to identify**: Large body (80%+ of full candle range), small wicks, usually closes near the high/low of its range, followed by a BOS. High volume on displacement candles confirms institutional participation."],
        visual:D_InstitutionalCandle,
        points:["Displacement = large body + small wicks = institutional order","The candle BEFORE displacement = Order Block","The GAP created by displacement = Fair Value Gap","Always look for BOS after a displacement to confirm validity","No displacement = weak move = low quality OB/FVG"],
        quiz:[
          {q:"What is the key visual characteristic of a displacement (institutional) candle?",opts:["Small body with very long wicks","Large body (80%+) with tiny or no wicks","Average size with equal wicks","Red color only"],ans:1},
          {q:"If a displacement candle creates a gap (FVG) and there's a BOS after it, the quality of the setup is:",opts:["Low — too obvious","High — displacement + BOS = valid institutional setup","Only good on the 1-minute chart","Invalid — need more indicators"],ans:1},
          {q:"Where is the Order Block relative to a displacement candle?",opts:["Three candles after the displacement","The last opposite-colored candle BEFORE the displacement","In the middle of the displacement","Has no relationship to displacement"],ans:1}
        ]},
    ]
  },
  {
    id:4,title:"SMC Key Concepts",icon:"💡",color:C.gr,
    lessons:[
      {id:"4.1",title:"Order Blocks",dur:"13 min",
        theory:["An **Order Block (OB)** is the last opposite-colored candle before a significant displacement move. A **Bullish OB** = the last BEARISH candle before a strong bullish displacement and BOS. This is where institutions placed large BUY orders — some unfilled orders remain there.","When price returns to the OB zone, those unfilled institutional orders activate, propelling price again. This is why OBs act as support/resistance — it's not magic, it's unfilled institutional orders at that exact level.","**Validity criteria**: (1) BOS must occur after the OB. (2) OB should be within a premium/discount zone. (3) Strong displacement (big candle) away from it. (4) First touch preferred — mitigated OBs lose strength. (5) Higher timeframe alignment."],
        visual:D_OrderBlock,
        points:["Bullish OB = last red candle before big green impulse + BOS","Bearish OB = last green candle before big red impulse + BOS","Must have BOS after it to be 'valid'","First touch (unmitigated) is strongest","50% of the OB body = optimal entry within the zone"],
        quiz:[
          {q:"What makes an Order Block 'valid' according to SMC rules?",opts:["It appears on the 1-minute chart","A Break of Structure (BOS) occurs AFTER it + strong displacement","It's on a round number","RSI confirms it"],ans:1},
          {q:"A 'mitigated' Order Block is one that has:",opts:["Never been touched","Been tested once before — loses significant strength","Had a BOS after it","Appeared on two timeframes"],ans:1},
          {q:"For a Bullish Order Block entry, your stop loss should be placed:",opts:["50 pips below your entry","Below the WICK of the OB candle (not just the body)","At the previous day's low","At equilibrium (50%)"],ans:1}
        ]},
      {id:"4.2",title:"Fair Value Gaps",dur:"11 min",
        theory:["A **Fair Value Gap (FVG)** is a 3-candle pattern where the middle candle displaces so violently that a gap exists between Candle 1's low and Candle 3's high (for bullish FVG). Price moved too fast — it skipped over efficient pricing, creating an imbalance.","Markets are constantly seeking **efficiency**. FVGs act as magnets — price will seek to return and fill them. The question is WHEN, not IF. On higher timeframes, FVGs can remain unfilled for days or weeks, but eventually price returns.","**Inverse FVG**: When price enters an FVG but instead of bouncing, breaks through it, the FVG flips. A bullish FVG that's broken becomes a bearish Inverse FVG (resistance). This tells you the setup has invalidated and trend has changed."],
        visual:D_FVG,
        points:["FVG = gap between C1 low and C3 high (bullish) or C1 high and C3 low (bearish)","Markets seek to fill FVGs — use them as price targets","FVG + OB confluence = highest quality setup (A+)","Inverse FVG = failed FVG that flips to opposite side","FVGs on H4/H1 most reliable for day/swing trading"],
        quiz:[
          {q:"In a Bullish FVG, the gap exists between which parts of the 3-candle pattern?",opts:["C1 open and C3 close","C1 low and C3 high","C2 high and C2 low","C1 close and C2 open"],ans:1},
          {q:"Price returns to a Bullish FVG zone and BREAKS through it (closes below). This becomes:",opts:["An even stronger support level","An Inverse FVG — now acts as resistance","An Order Block","Irrelevant — move on"],ans:1},
          {q:"Why do FVGs act as magnets for price?",opts:["Because they appear on all trading platforms","Markets seek pricing efficiency — FVGs represent inefficient areas that need to be 'filled'","Technical analysts all know about them","They're programmed into exchange algorithms"],ans:1}
        ]},
      {id:"4.3",title:"Breaker Blocks",dur:"10 min",
        theory:["A **Breaker Block** is an Order Block that **failed**. When price runs THROUGH a bullish OB (takes out the low of the OB), it becomes a **Bearish Breaker** — it now acts as resistance when price returns to it.","The logic: institutions who bought at that OB are now trapped in losing long positions. When price returns to that level, they EXIT their losing longs (= sell pressure), turning former support into resistance. The trapped traders become the supply.","**Trading Breaker Blocks**: After a bullish OB fails and price sweeps its low, wait for price to return to the breaker zone. Look for bearish confirmation (bearish engulfing, M15 CHoCH) and enter short with tight stop above the breaker."],
        visual:D_OrderBlock,
        points:["Failed Bullish OB = Bearish Breaker (now resistance)","Failed Bearish OB = Bullish Breaker (now support)","Trapped traders at the failed OB create the reversal pressure","Breaker + FVG confluence = extremely high probability setup","Mark breakers on your chart whenever an OB fails"],
        quiz:[
          {q:"A Bullish Order Block (last red candle before a big green move) gets completely run through. It becomes:",opts:["A stronger support level","A Bearish Breaker Block — now acts as resistance","Irrelevant — delete it from your chart","A new Fair Value Gap"],ans:1},
          {q:"Why do Breaker Blocks work? What creates the selling pressure at the former support?",opts:["Random technical analysis self-fulfilling prophecy","Trapped long traders who bought at the OB now exiting their losing positions","Exchange algorithms","Short sellers targeting obvious levels"],ans:1},
          {q:"What should you look for as confirmation before entering a short at a Bearish Breaker Block?",opts:["RSI above 70","Bearish engulfing or M15 CHoCH within the breaker zone","Price touching it once","A round number near the breaker"],ans:1}
        ]},
      {id:"4.4",title:"Inducement",dur:"10 min",
        theory:["**Inducement** is when smart money deliberately creates an obvious, easily-identifiable level (a 'trap') to lure retail traders in before making the real move in the opposite direction. It's the bait before the trap.","Example: In a downtrend, price forms an obvious higher high (appearing to reverse). Retail traders see a bullish CHoCH and enter longs. Then price sweeps back down through the previous low, liquidating all those retail longs — providing the sell-side liquidity institutions needed to continue their short.","**How to identify Inducement**: Look for levels that are 'too obvious' — too perfectly equal, too clearly visible, too obvious on the chart. If you and every retail trader can see the same level, smart money KNOWS it and will use it as a liquidity raid."],
        visual:D_Inducement,
        points:["Inducement = deliberately obvious level created to trap retail traders","The more obvious a level is, the more likely it's an inducement trap","After inducement is swept, the REAL move begins in the opposite direction","Don't chase obvious 'breakouts' — wait for the sweep and reversal","Inducement precedes the true liquidity sweep and directional move"],
        quiz:[
          {q:"What is the purpose of Inducement in smart money trading?",opts:["To signal the real direction to retail traders","To create an obvious level that traps retail traders before the real move","To confirm a genuine breakout","To mark a support/resistance level"],ans:1},
          {q:"You see an 'obvious' resistance level that everyone is watching. SMC suggests:",opts:["Short immediately — everyone agrees it's resistance","Be cautious — obvious levels are often inducement traps","Buy — the obvious resistance will break","Use it as your take profit level"],ans:1},
          {q:"After an inducement level is swept (price briefly breaks through it), you should look for:",opts:["Continue in the breakout direction","Reversal in the OPPOSITE direction — the real move","More inducement levels","A random entry"],ans:1}
        ]},
      {id:"4.5",title:"Full SMC Confluence",dur:"14 min",
        theory:["The highest probability SMC trades stack **5+ confluences**: (1) HTF bias confirmed, (2) Price in Premium/Discount, (3) Liquidity swept (BSL or SSL), (4) Unmitigated OB in zone, (5) FVG within or near OB, (6) LTF CHoCH, (7) OTE Fibonacci.","**Grade your setups before every entry**: A+ = 5+ confluences (large position, high confidence). A = 4 confluences. B = 3. Never take C setups (1–2 confluences). The number of confluences directly correlates with win rate.","**The most dangerous mistake**: Taking B and C setups because you're bored, impatient, or \"feel\" like the market is about to move. Professionals wait DAYS for A+ setups and size them up. This discipline is what separates 5% profitable traders from the 95%."],
        visual:D_FullSetup,
        points:["A+ setup = 5+ confluences at same level","Grade EVERY trade: A+, A, B, C — only take A and A+","Patience is the most profitable skill in trading","Missing a setup is free. Taking a bad setup costs money.","Document confluence checklist before EVERY entry"],
        quiz:[
          {q:"You find a Bullish OB but price is in Premium zone and D1 is bearish. Grade this setup:",opts:["A+ — strong OB signal","A — good enough to trade","B — proceed with reduced size","C — do not trade (conflicting signals)"],ans:3},
          {q:"What is the minimum number of confluences for a professional-grade (A) trade?",opts:["1 — any signal is enough","2 confluences","3–4 confluences","At least 5 confluences"],ans:2},
          {q:"Why is 'patience' considered the most profitable skill in trading?",opts:["Patient traders get better entry prices","Waiting for A+ setups dramatically increases win rate while reducing bad trades","Patient traders avoid paying funding fees","Exchanges reward patient traders with lower fees"],ans:1}
        ]},
    ]
  },
  {
    id:5,title:"ICT Methodology",icon:"🧠",color:C.pu,
    lessons:[
      {id:"5.1",title:"ICT Overview",dur:"10 min",
        theory:["**ICT (Inner Circle Trader)**, developed by Michael J. Huddleston, is a methodology based on how central banks and large financial institutions actually operate. It's institutional order flow analysis — not retail TA.","Core ICT philosophy: markets are **engineered delivery mechanisms** designed to transfer wealth from retail to institutional traders. Price is deliberately manipulated to engineer specific outcomes. Most 'random' moves are intentional liquidity raids.","Key ICT toolkit: **Kill Zones** (optimal trading windows), **Judas Swing** (engineered fake move), **OTE** (optimal entry retracement), **AMD/Power of 3** (daily delivery model), **Silver Bullet** (precision entry window), **PD Arrays** (price delivery arrays including OBs, FVGs, Breakers)."],
        visual:D_AMD,
        points:["ICT = institutional order flow analysis, not retail TA","Markets are engineered to trap retail — know the game","Trade ONLY during Kill Zone windows for highest probability","Every significant price move has a purpose (liquidity raid or delivery)","ICT and SMC are complementary — use both"],
        quiz:[
          {q:"ICT methodology is fundamentally based on:",opts:["Retail technical analysis (RSI, MACD, etc.)","How central banks and institutions actually operate in markets","Random walk theory","Fundamental cryptocurrency analysis"],ans:1},
          {q:"According to ICT, most 'random' price moves are actually:",opts:["Truly random events","Engineered liquidity raids to fill institutional orders","Caused by news events","Algorithm malfunctions"],ans:1},
          {q:"What does ICT's 'Power of Three' (AMD) describe?",opts:["Three types of order blocks","The daily delivery cycle: Accumulation, Manipulation, Distribution","Three key Fibonacci levels","Three Kill Zones per day"],ans:1}
        ]},
      {id:"5.2",title:"Kill Zones",dur:"11 min",
        theory:["**Kill Zones** are time windows when institutional traders are most active and price makes its significant moves. Trading outside Kill Zones means fighting noise and chop. Most losing trades happen outside Kill Zones.","**Asian KZ** (6PM–12AM EST): Range building, low volatility. Smart money quietly accumulates. Mark the highs and lows — these will be raided in the next session. **London KZ** (2AM–5AM EST): First major session. Often generates the Judas Swing that traps early traders.","**New York KZ** (7AM–10AM EST): **Highest volume, best setups**. The NY open is where institutions make their biggest moves. 7:00–8:30AM is the Judas Swing window. 8:30AM = major economic data (NFP, CPI) — explosive moves but high risk. **NY Close** (1PM–3PM): Profit-taking, positioning for next day."],
        visual:D_KillZones,
        points:["Best setups: London Open (2–5AM) & NY Open (7–10AM) EST","Asian session builds the range — mark its high/low","2:00–2:30AM = London starts raiding Asian range","7:00–8:30AM = NY Judas Swing (fake move before real)","Avoid trading 15 min before/after major news at 8:30AM EST"],
        quiz:[
          {q:"Which Kill Zone produces the MOST volume and highest quality setups?",opts:["Asian Kill Zone (6PM–12AM)","London Kill Zone (2–5AM)","New York Kill Zone (7–10AM EST)","Tokyo Kill Zone (midnight–2AM)"],ans:2},
          {q:"What is the significance of the Asian session's HIGH and LOW?",opts:["They are random price levels","They become the liquidity targets for London and NY to sweep","They define the daily trend","They are always support and resistance"],ans:1},
          {q:"Why should you avoid trading 15 minutes before 8:30AM EST?",opts:["Market is closed","Liquidity is too low","Major US economic data releases (NFP, CPI) cause erratic unpredictable moves","It's the London close"],ans:2}
        ]},
      {id:"5.3",title:"Judas Swing",dur:"12 min",
        theory:["The **Judas Swing** is the initial engineered fake move at London or NY open designed to trap retail traders in the wrong direction before the real move. Named after Judas Iscariot — the ultimate betrayal.","**Pattern**: At the open, price aggressively moves in one direction (sweeping the obvious liquidity level), triggering stops and trapping retail traders who chase the 'breakout'. Then, suddenly, price reverses sharply in the OPPOSITE direction — the TRUE institutional delivery.","**How to trade it**: (1) At Kill Zone time, identify the most obvious liquidity level (previous session high/low). (2) Wait for price to sweep it (wick through and return). (3) Look for CHoCH on M5/M15. (4) Enter in the opposite direction of the Judas move. (5) Target the other side of the session range."],
        visual:D_JudasSwing,
        points:["London Judas: sweeps Asian session high OR low at 2–3AM","NY Judas: sweeps London session high OR low at 7–8AM","Wait for the sweep FIRST — don't enter on the initial move","CHoCH on M15/M5 confirms Judas is over","Opposite side of session range = take profit target"],
        quiz:[
          {q:"At 7:30AM NY open, BNB spikes up 2%, sweeping yesterday's high, then stalls. ICT says:",opts:["Buy — confirmed breakout!","This may be the Judas Swing — wait for CHoCH before shorting","Short immediately on the spike","This is a fake signal — don't trade"],ans:1},
          {q:"The Judas Swing works because:",opts:["Technical analysis patterns repeat","Retail traders chase obvious moves into trapped positions, providing institutional fill","Market algorithms create it randomly","RSI gets oversold at key times"],ans:1},
          {q:"After the Judas Swing sweeps a level and CHoCH appears on M15, where is your target?",opts:["The level that was just swept","The opposite side of the session's range (the other liquidity pool)","Previous day's close","Fibonacci 61.8% level"],ans:1}
        ]},
      {id:"5.4",title:"OTE Fibonacci",dur:"10 min",
        theory:["**OTE (Optimal Trade Entry)** uses Fibonacci retracement to identify the highest probability entry zone after an impulse move. Specifically, the **61.8%–78.6%** retracement zone is where institutions re-enter with the trend on pullbacks.","**How to draw it**: After a clear impulse move WITH a BOS, draw Fibonacci from the swing low to swing high (for longs). The OTE zone = 61.8% to 78.6% level. This is where smart money adds to existing positions or initiates new ones.","The OTE works because: institutions can't fill all orders on the initial impulse. They let price pull back to 61.8–78.6%, where retail traders think the trend is reversing and sell/exit. Institutions buy this dip aggressively, launching the second leg higher."],
        visual:D_OTE,
        points:["OTE zone = 61.8% to 78.6% Fibonacci retracement","Draw Fib AFTER a clear impulse move with BOS","Enter on confirmation in the OTE zone (pin bar, engulfing, CHoCH)","Stop: below 100% level (swing low) with a few ticks buffer","OTE + OB/FVG at same level = A+ setup"],
        quiz:[
          {q:"For a bullish OTE setup, which Fibonacci zone represents the optimal entry?",opts:["23.6% to 38.2%","38.2% to 50%","61.8% to 78.6%","80% to 100%"],ans:2},
          {q:"You draw Fibonacci on an impulse move. Price retraces to 65% (within OTE zone). You need WHAT before entering?",opts:["Immediate entry — it's in the OTE zone","Confirmation (pin bar, bullish engulfing, or M5 CHoCH) within the zone","RSI must be oversold","Price must touch exactly 61.8%"],ans:1},
          {q:"Where is your stop loss on a bullish OTE long trade?",opts:["At the 50% (equilibrium) level","Just below the 100% level (swing low) with buffer","At 38.2% Fibonacci","At the entry price after 1 hour"],ans:1}
        ]},
      {id:"5.5",title:"Power of 3 — AMD",dur:"13 min",
        theory:["ICT's **Power of 3** describes three phases of every trading day (and often every session): **Accumulation → Manipulation → Distribution**. Understanding this cycle is the single most important insight for day trading.","**Accumulation** (Asian): Smart money quietly builds positions in a tight range. Both sides of the range have stops. No significant trend yet. **Manipulation** (London open): The Judas Swing — price sweeps one side of the Asian range, trapping retail and providing liquidity for the real move.","**Distribution** (NY session): The true directional delivery begins. Price moves strongly toward the session target (previous week high/low, major HTF level). This is when aligned traders make money while Judas-trapped retail traders are underwater."],
        visual:D_AMD,
        points:["Asian = accumulation (tight range, both sides have stops)","London = manipulation (Judas sweeps one side of Asian range)","NY = distribution (real move toward HTF target)","The DAILY candle itself tells this 3-phase story","Apply AMD to individual sessions AND to the daily/weekly cycle"],
        quiz:[
          {q:"In the AMD model, during which phase should you ideally ENTER your trade?",opts:["Accumulation — get in early","During the Manipulation (Judas Swing) — chase it","Early Distribution — after manipulation confirms and CHoCH appears","At the very end of Distribution"],ans:2},
          {q:"The AMD model states the Asian session is 'Accumulation'. What does this mean?",opts:["Asian traders accumulate losses","Smart money quietly builds positions in a tight range","High volatility price discovery","Asian market hours have the best setups"],ans:1},
          {q:"Applied to the weekly cycle, when does Distribution typically occur?",opts:["Monday (Asian session of the week)","Tuesday–Wednesday (after Monday manipulation)","Friday (end of week profit taking)","Weekend (24/7 crypto markets)"],ans:1}
        ]},
      {id:"5.6",title:"ICT Silver Bullet",dur:"11 min",
        theory:["The **ICT Silver Bullet** is a precision entry model that uses a specific 1-hour time window within the NY session: **10:00AM–11:00AM EST**. During this window, price often delivers a high-quality FVG setup after the Judas Swing has completed.","**Setup**: During the 10–11AM window, identify the current session's bias (established by the Judas Swing). Look for price to trade into a discount OB or create a bullish FVG (for longs). Enter on the retest of the FVG with tight stop.","**Why it works**: By 10AM, the Judas Swing is typically complete. The true direction is established. London close is approaching (11AM), causing position squaring. This creates precise, clean delivery moves within the 1-hour window. High win rate, tight stops = excellent R:R."],
        visual:D_SilverBullet,
        points:["Silver Bullet window: 10:00–11:00AM EST only","Only works AFTER the Judas Swing has been identified","Enter from FVG or OB within the 10–11AM window","Tight stop = M1 swing low/high within the setup","Target: session high/low or HTF OB"],
        quiz:[
          {q:"The ICT Silver Bullet entry window is:",opts:["7:00–8:30AM EST (NY open)","10:00–11:00AM EST","2:00–3:00AM EST (London open)","Any time during NY session"],ans:1},
          {q:"For the Silver Bullet to be valid, what must have already occurred?",opts:["Asian session must be closed","The Judas Swing must be identifiable and complete","RSI must be at 50","Price must be at a round number"],ans:1},
          {q:"Why does the 10–11AM EST window create clean setups?",opts:["Lowest volume of the day creates easy moves","Judas is complete + London close approaching creates directional delivery","US market opens at 10AM","Federal Reserve speaks at 10AM daily"],ans:1}
        ]},
    ]
  },
  {
    id:6,title:"Multi-TF Analysis",icon:"📐",color:C.rd,
    lessons:[
      {id:"6.1",title:"Top-Down Framework",dur:"11 min",
        theory:["**Top-Down Analysis** is mandatory. You MUST start from the highest timeframe and work DOWN before considering any trade. Skipping this step is the most common reason for losses — you're trading with context blindness.","**The Framework**: (1) **D1** — What is the overall trend? Major structural levels? Premium or discount? (2) **H4** — What is the current intermediate structure? Key OBs and FVGs? (3) **H1/M15** — What is the entry timeframe showing? Where's the LTF CHoCH?","The highest timeframe ALWAYS wins. A perfect M15 setup going against D1 bias is a **counter-trend trade** — lower probability, requires more confluences, smaller position size, tighter stop. Most beginners should avoid counter-trend trading entirely."],
        visual:D_MTF,
        points:["Always start analysis from D1 or W1, work down","Higher TF structure overrides lower TF signals, always","Counter-trend trades require 3× more confluences","Document your top-down analysis BEFORE every trade entry","Same analysis process every single day — no shortcuts"],
        quiz:[
          {q:"You see a perfect bearish setup on M15, but D1 is in a strong uptrend with HH+HL structure. What should you do?",opts:["Take the trade — M15 is your entry timeframe","Skip it — D1 trend overrides M15 setup","Take it but with half position size","Change your D1 analysis to match M15"],ans:1},
          {q:"In top-down analysis, which timeframe establishes your DIRECTIONAL BIAS?",opts:["1-minute chart","15-minute chart","Daily (D1) and 4-Hour (H4) charts","Whichever timeframe shows the clearest signal"],ans:2},
          {q:"What does 'context blindness' mean in trading?",opts:["Not watching multiple screens simultaneously","Trading without analyzing the higher timeframe context (bias, structure, zones)","Missing news events","Not using enough indicators"],ans:1}
        ]},
      {id:"6.2",title:"HTF Bias & Key Levels",dur:"10 min",
        theory:["**HTF Bias** = your directional filter for the entire session. From D1: bullish = HH+HL structure, bias LONG. Bearish = LH+LL, bias SHORT. Neutral = no clear structure, avoid trading or reduce size significantly.","**Mark these HTF key levels daily**: (1) Previous Day High (PDH) and Low (PDL). (2) Weekly Open (WO) — price's relationship to the weekly open determines weekly bias. (3) HTF Order Blocks (D1/H4). (4) Previous Week High/Low. These levels are institutional reference points.","**Premium/Discount on HTF**: If D1 is bullish but price is currently in a D1 Premium zone, wait for the pullback to a D1 Discount OB before entering longs. Don't buy at the top of the daily range just because D1 is bullish."],
        visual:D_PremiumDiscount,
        points:["Mark PDH/PDL every single day before trading","Weekly Open determines weekly bias direction","HTF OBs that formed weeks ago are still powerful levels","Wait for price to reach HTF discount before entering longs","Never buy at the top of an HTF range (premium zone)"],
        quiz:[
          {q:"What does PDH/PDL stand for, and why does it matter?",opts:["Past Daily History/Low — shows historical trends","Previous Day High/Low — key institutional reference levels (often swept before real move)","Predetermined High/Low — exchange-set levels","Price Difference Histogram — an indicator"],ans:1},
          {q:"The Daily chart is bullish (HH+HL) but price is currently in the daily PREMIUM zone. Best action:",opts:["Enter long immediately — D1 is bullish","Wait for price to pull back to D1 discount zone before entering long","Enter short — premium = sell","Trade M5 randomly ignoring D1"],ans:1},
          {q:"Price opens ABOVE the Weekly Open on Monday. This typically indicates:",opts:["Bearish weekly bias","Bullish weekly bias for the week","Neutral — ignore weekly open","Market will close lower by Friday"],ans:1}
        ]},
      {id:"6.3",title:"LTF Entry Precision",dur:"10 min",
        theory:["Once you have HTF context (bias confirmed, price at key zone), DROP to M15 or M5 to find your **entry trigger**. Do NOT enter just because price touched an H4 OB. Wait for LTF confirmation — this is the difference between a 1:2 and a 1:5+ R:R.","**LTF Entry Triggers** (in order of reliability): (1) CHoCH on M15/M5 at the HTF zone — strongest. (2) Bullish/Bearish engulfing candle at the zone. (3) Pin bar rejection within the zone. (4) LTF OB within the HTF OB. (5) FVG retest within the HTF zone.","**The math of precision**: H4 OB entry has a typical stop of 200 points. M15 CHoCH entry within the same H4 OB has a stop of 30–50 points. Same HTF target = same profit, but stop is 4–6× smaller. R:R improves from 1:2 to 1:8+."],
        visual:D_FullSetup,
        points:["Never enter just because price touches HTF zone — wait for LTF trigger","M15 CHoCH within HTF OB = highest quality entry","Smaller TF entry = tighter stop = massively better R:R","Missing the exact entry? Wait for the NEXT pullback","Document: H4 zone → M15 confirmation → Enter → SL below M15 OB"],
        quiz:[
          {q:"Price enters your H4 Bullish OB zone. The correct next step is:",opts:["Enter long immediately — H4 OB is confirmed","Drop to M15 and wait for LTF confirmation (CHoCH, engulfing)","Wait for RSI to confirm","Set a market order immediately"],ans:1},
          {q:"Why does entering on LTF confirmation dramatically improve R:R?",opts:["More confluences mean higher win rate","Smaller stop loss (LTF structure) with same large HTF target = better R:R ratio","Lower timeframe has more signals","You pay less in trading fees"],ans:1},
          {q:"You miss the M15 CHoCH entry. What should you do?",opts:["Enter at market price — close enough","Wait for the next pullback to the zone for another entry","Lower timeframe to find any signal","Revenge trade in the opposite direction"],ans:1}
        ]},
      {id:"6.4",title:"Confluence Stacking",dur:"10 min",
        theory:["**Confluence stacking** means combining multiple independent factors that all point to the same price level. Each additional confluence exponentially increases the probability of that level holding. A level with 6 confluences is not 2× stronger than one with 3 — it's 8–10× stronger.","**Stacking example**: (1) D1 bullish bias + (2) Price in D1 discount + (3) H4 Bullish OB in discount + (4) FVG within the OB + (5) SSL swept below the OB + (6) M15 CHoCH + (7) OTE at 65%. Seven confluences = highest probability setup. Maximum size.","**The confluence hierarchy**: HTF structural bias > H4 OB/FVG > Liquidity swept > Premium/Discount > OTE Fibonacci > LTF confirmation. If the top 3 align, you have a viable trade. If all 5+ align — size up, it's an A+ setup."],
        visual:D_FullSetup,
        points:["Each additional confluence MULTIPLIES probability (not just adds)","Top 3 confluences: HTF bias + OB/FVG + liquidity swept","7 confluences = maximum position size trade","Build a written checklist and score every setup before entry","Never enter at 2 or fewer confluences"],
        quiz:[
          {q:"Which three confluences are the MOST important (top tier) in the hierarchy?",opts:["RSI + MACD + Volume","HTF structural bias + OB/FVG presence + Liquidity swept","Support + Resistance + Round number","OTE + FVG + Kill Zone time"],ans:1},
          {q:"A setup has 7 confluences all pointing to the same level. Compared to a 3-confluence setup, your position size should be:",opts:["The same — always consistent sizing","Larger — high confluence = high probability = size up","Smaller — too obvious means likely trap","Random — ignore confluences for sizing"],ans:1},
          {q:"Confluence stacking works because:",opts:["More indicators = more signals = more trades","Multiple independent factors pointing to same level exponentially increases probability it's a real institutional level","Technical analysts agree more on multi-confluence levels","Exchanges program these levels"],ans:1}
        ]},
    ]
  },
  {
    id:7,title:"Risk Management",icon:"⚖️",color:"#FF8C00",
    lessons:[
      {id:"7.1",title:"Position Sizing",dur:"10 min",
        theory:["**Position sizing is the most important skill** in trading. Your entries and analysis barely matter if your sizing is wrong. One oversized trade can undo months of profitable small trades.","**Formula**: Position Size = (Account Balance × Risk%) ÷ Stop Loss Distance. Example: $2,000 account, 1% risk = $20 at risk. Stop = $4 from entry. Position = 5 contracts. **Always calculate BEFORE entering.**","**The 1-2% Rule**: Never risk more than 1–2% of your account per trade. With 1% risk: 100 consecutive losses to go broke (statistically impossible). With 10% risk: just 10 losses. Professional traders risk 0.5–1% per trade."],
        visual:D_RiskManagement,
        points:["Formula: (Account × Risk%) ÷ Stop Distance = Position Size","1% max risk per trade for beginners, 2% max for experienced","Calculate position size BEFORE entering — never guess","Bigger account = bigger absolute $, not bigger percentage risk","Consistent 1% risk = account grows without catastrophic drawdown"],
        quiz:[
          {q:"Account: $1,000. Risk: 1%. Stop loss: $5 from entry. What is your position size?",opts:["1 contract","2 contracts","5 contracts","10 contracts"],ans:1},
          {q:"Why is 1% risk per trade safer than 5% risk per trade?",opts:["Lower fees at 1% risk","With 1% risk, 100 losses to go broke vs 20 losses at 5% risk","1% risk = smaller positions = easier to manage","No difference — risk % doesn't matter if setup is good"],ans:1},
          {q:"You have a $5,000 account and want to risk 1.5%. Maximum dollar risk per trade is:",opts:["$5","$50","$75","$150"],ans:2}
        ]},
      {id:"7.2",title:"Stop Loss Placement",dur:"9 min",
        theory:["Your stop loss should be placed where your **trade thesis is invalidated** — not at a random dollar amount. 'I'll risk $30' is not stop placement. 'This OB is invalid if price closes below the wick' is.","**For SMC longs**: Stop goes 1–3 ticks below the WICK of the Bullish OB (not the body). For shorts: 1–3 ticks above the wick of the Bearish OB. This small buffer prevents getting stopped by normal spread/noise.","**Never, ever move your stop wider** to avoid a loss. If your stop is hit, your trade thesis was wrong. Accept the 1% loss and move on. Accounts don't blow up from a 1% loss — they blow up from one widened stop turning a 1% loss into a 20% loss."],
        visual:D_FullSetup,
        points:["Stop = where your trade idea is WRONG, not a dollar amount","Below OB wick for longs (not body) + 1–3 ticks buffer","NEVER move your stop wider to avoid a loss","Tighter stop = better R:R but higher chance of being stopped out","Stop should be a pre-planned level before entry, not emotional"],
        quiz:[
          {q:"You enter long from a Bullish OB. Your stop loss should go:",opts:["$20 below entry regardless of structure","Below the WICK of the OB candle with 1–3 tick buffer","At the 50% retracement level","Below the previous day's low"],ans:1},
          {q:"Your stop is 5 ticks away from being hit. The 'correct' action is:",opts:["Move the stop wider — the trade will work","Close the trade proactively to save money","Let the stop execute if hit — it was placed at invalidation level","Add to the position to lower your average"],ans:2},
          {q:"A tight stop loss (close to entry) means:",opts:["Lower probability of being stopped out","Better R:R but higher chance stop gets triggered by normal market noise","Larger position size for same risk amount (positive)","Both B and C are correct"],ans:3}
        ]},
      {id:"7.3",title:"Risk:Reward Mastery",dur:"10 min",
        theory:["**R:R ratio** is profit target size divided by stop loss size. 1:3 means you target 3× what you risk. At 1:3 R:R, you only need to be RIGHT 26% of the time to be profitable over many trades — the math is in your favor.","**Win rate required to break even**: 1:1 R:R requires 50%+ wins. 1:2 needs 34%+. 1:3 needs only 26%+. 1:5 needs only 17%+. This is why professionals NEVER take 1:1 trades — the math makes consistent profitability nearly impossible.","**Partial take profits**: Take 25–50% at 1:1 R:R, move stop to break-even. Let rest run to 1:3+. This locks in profit, eliminates risk, and captures large moves when they happen. Never let a 1:1 winner turn into a loss."],
        visual:D_RRRatio,
        points:["Minimum acceptable R:R: 1:2. Professional standard: 1:3","1:3 R:R = profitable even with only 26% win rate","Take 25–50% at 1:1, move stop to BE, let rest run","Never take 1:1 trades — unprofitable long-term","Calculate R:R before entry — if it's not 1:2+, don't take it"],
        quiz:[
          {q:"What win rate do you need to be profitable at 1:3 Risk:Reward?",opts:["50% win rate","34% win rate","26% win rate","10% win rate"],ans:2},
          {q:"At 1:1 R:R, to be consistently profitable you need:",opts:["Any win rate is profitable","Exactly 50% win rate to break even (not profitable after fees)","26% win rate is enough","Less than 40% win rate"],ans:1},
          {q:"You have a 1:5 R:R trade opportunity. Your minimum acceptable win rate to profit is:",opts:["50%","35%","20%","17%"],ans:3}
        ]},
      {id:"7.4",title:"Drawdown Management",dur:"10 min",
        theory:["**Drawdown** is the reduction from peak account value to current value. A 20% drawdown on a $10,000 account means you're at $8,000. To recover from a 20% drawdown, you need a 25% gain — asymmetrical recovery makes large drawdowns devastating.","**Daily and weekly loss limits are non-negotiable**: Stop trading at -3% daily loss. Stop for the WEEK at -8% weekly loss. Take a day off after 3 consecutive losing trades. These rules exist because: losses create emotional states that lead to revenge trading = account destruction.","**After a drawdown**: Reduce position size by 50% until you're profitable again. Don't try to 'make it back fast' — this is how small drawdowns become catastrophic account wipes. Consistency and slow recovery > fast reckless recovery."],
        visual:D_Drawdown,
        points:["20% drawdown requires 25% gain just to break even","Daily stop loss: -3% of account. Weekly: -8%","3 consecutive losses = stop trading for that session","Reduce position size by 50% after significant drawdown","Drawdown is inevitable — how you manage it determines your survival"],
        quiz:[
          {q:"You lose 50% of your account. What percentage gain do you need to return to starting value?",opts:["50%","75%","100%","150%"],ans:2},
          {q:"After hitting your daily loss limit of -3%, the correct action is:",opts:["Take one more trade to recover some losses","Look for higher probability setups","Stop trading for the day — no exceptions","Double next position size to recover faster"],ans:2},
          {q:"You've had 3 consecutive losses. The professional approach is:",opts:["Immediately look for the next trade to break the streak","Increase size on the next trade — you're 'due' for a win","Stop trading for the session, review trades, reset","Switch to a different trading pair"],ans:2}
        ]},
      {id:"7.5",title:"Trading Psychology",dur:"12 min",
        theory:["**90% of trading failure is psychological.** The edge from SMC/ICT is real. But emotions destroy it: **Fear** (missing trades, exits early), **Greed** (over-trading, oversizing), **Revenge** (taking impulsive trades after losses), **FOMO** (chasing entries).","**The professional mindset**: Each trade is one of the next 1,000. A single loss is statistically irrelevant. Following your rules IS success — not whether each individual trade wins. Process > outcome. Journal every trade with emotional notes.","**Breaking bad habits**: Gambling impulse → strict checklist requirement. FOMO → preset alerts for levels. Revenge trading → hard daily loss limit. Overtrading → maximum 2–3 trades per session limit. Systems beat emotions every time."],
        visual:D_RRRatio,
        points:["Journal every trade: entry reason, emotions, result","Max 2–3 trades per session (prevents overtrading)","After a big win: don't increase size immediately","After a big loss: STOP, don't seek revenge","Your job is to follow rules — the edge handles profitability"],
        quiz:[
          {q:"After 3 consecutive losses you feel an urge to take a 4th trade immediately to recover. This is called:",opts:["Smart recovery trading","Revenge trading — the most common account-destroying behavior","High-frequency scalping","Normal trading behavior"],ans:1},
          {q:"FOMO (Fear of Missing Out) in trading means:",opts:["Being afraid of losing money","Entering trades after the ideal entry has passed, chasing moves","Having too small a position size","Being overly patient"],ans:1},
          {q:"The professional mindset treats each trade as:",opts:["The most important trade of your life","One trade in a series of 1,000 — single results are statistically irrelevant","A guaranteed profit with SMC","An opportunity to recover previous losses"],ans:1}
        ]},
    ]
  },
  {
    id:8,title:"Pro Execution",icon:"🎯",color:C.gr,
    lessons:[
      {id:"8.1",title:"Full SMC Trade Checklist",dur:"13 min",
        theory:["Before entering ANY futures trade, complete this full checklist. No exceptions. Skipping steps because 'it looks good' is how disciplined plans turn into emotional gambling.","**Pre-Trade Checklist**: ☑ D1 bias (bull/bear/neutral) ☑ H4 structure and trend ☑ Price in Premium or Discount ☑ Liquidity swept ☑ Unmitigated OB identified ☑ FVG confluence present ☑ Kill Zone window (active?) ☑ M15 entry trigger (CHoCH/engulfing) ☑ Stop loss location ☑ R:R calculated (minimum 1:2) ☑ Position size calculated.","Only enter when ALL boxes are checked. 'I'll skip the checklist this one time' is always the trades that lose. Print the checklist. Put it next to your screen. Every single trade."],
        visual:D_FullSetup,
        points:["Print the checklist. Physically check each box before EVERY trade.","If you can't fill one box — the trade is NOT valid","'Looks good enough' is not a valid checklist answer","The checklist protects you from your own emotional impulses","Backtesting: run through 50 historical setups using the checklist"],
        quiz:[
          {q:"You complete 10 of 11 checklist items but can't identify a clear entry trigger. You should:",opts:["Enter anyway — 10/11 is excellent","Wait until a clear entry trigger appears","Lower to M1 to find any signal","Take 50% position now, add on trigger"],ans:1},
          {q:"The purpose of the pre-trade checklist is:",opts:["To slow you down and make you miss trades","To protect against emotional entries and ensure every trade has full confluence","To satisfy a requirement from your broker","To make trading more complicated"],ans:1},
          {q:"You've been watching a setup for 2 hours and just missed the ideal entry. You should:",opts:["Enter at market price — close enough","Chase the entry — the logic is still valid","Move on — wait for the NEXT setup at that level","Force a different entry on a lower timeframe"],ans:1}
        ]},
      {id:"8.2",title:"ICT Entry Model",dur:"12 min",
        theory:["The **ICT Entry Model** drill-down: (1) Identify H4 PD Array (OB/FVG/Breaker). (2) During Kill Zone, wait for price to reach the zone. (3) Drop to M5. (4) Identify liquidity sweep within the H4 zone. (5) Wait for M5 CHoCH. (6) Enter from M5 OB with tight stop.","**The key refinement**: Inside your H4 OB, there is ALWAYS a smaller M5/M15 OB. Enter from THAT smaller OB — not just 'somewhere in the H4 OB'. This reduces your stop by 70–80% while keeping the same HTF profit target. R:R goes from 1:2 to 1:8+.","Example: H4 OB is 50 points wide. Stop based on H4 = 50 points. Stop based on M5 OB within H4 OB = 8 points. Same TP target of 150 points = 1:3 R:R (H4 entry) vs 1:18 R:R (M5 entry). Precision is everything."],
        visual:D_FullSetup,
        points:["Find the M5/M15 OB WITHIN the H4 OB for ultra-precise entry","CHoCH on M5 is the trigger — not just price entering HTF zone","Stop below M5 OB wick (very tight = massive R:R)","Target: H4 swing level, previous high/low, or major HTF FVG","Practice this on charts daily — it takes 50+ examples to master"],
        quiz:[
          {q:"Why is entering from the M5 OB within an H4 OB better than entering anywhere in the H4 OB?",opts:["M5 has more signals","M5 OB gives a much tighter stop with same target = dramatically better R:R (1:2 → 1:8+)","H4 OBs are unreliable","M5 timeframe has higher volume"],ans:1},
          {q:"What must happen on M5 BEFORE you enter a long from within the H4 OB zone?",opts:["RSI must reach oversold","A CHoCH on M5 must form (bullish signal within the zone)","Price must touch the exact OB midpoint","Volume spike on M5"],ans:1},
          {q:"The ICT Entry Model is designed to achieve what primary goal?",opts:["Find more trading opportunities","Get the highest possible R:R through precision LTF entry","Trade only during news events","Simplify the analysis process"],ans:1}
        ]},
      {id:"8.3",title:"Trade Management",dur:"11 min",
        theory:["**Entering is the easy part. Managing the trade is where money is made or lost.** Poor management: close winners too early (fear), hold losers too long (hope). Professional management: systematic rules applied with zero emotion.","**Partial profit system**: At 1:1 R:R → close 25–50%, move stop to break-even. At 1:2 → close another 25%, move stop to lock in 1:1 profit. Let final portion run to full 1:3+ target or until structure breaks. This eliminates the possibility of a winner turning into a loser.","**When to exit early**: If a new, opposite-direction HTF signal forms BEFORE you reach TP. If a major news event approaches and you're in a vulnerable position. If your original trade thesis is invalidated by new structural information. Never exit early just because you're up and 'feel good' — let TP do its job."],
        visual:D_RRRatio,
        points:["Take 25–50% profit at 1:1 R:R — guaranteed partial profit","Move stop to break-even after 1:1 — eliminates all risk","Move stop to lock in 1:1 profit after 2:1 — only profit remains","Final portion runs to full HTF target or structure invalidation","Never trail stop prematurely — gives up large moves"],
        quiz:[
          {q:"You're at 1:1 profit. The professional move is:",opts:["Close the entire position — take the win","Take 25–50% profit and move stop to break-even","Hold everything for the full target without changes","Close 80% and trail the rest"],ans:1},
          {q:"Under what circumstances should you exit a trade EARLY (before TP)?",opts:["When you're up enough to feel comfortable","When an opposite HTF signal forms invalidating your thesis","Whenever you feel nervous","After holding for more than 4 hours"],ans:1},
          {q:"'Premature trailing' is the mistake of:",opts:["Moving the stop wider too early","Moving the stop to lock in profit too early, stopping you out of big winners","Setting a trailing stop at entry","Using trailing stops at all"],ans:1}
        ]},
      {id:"8.4",title:"Scalping Strategy",dur:"12 min",
        theory:["**Scalping** = very short-term trades on M1/M5, targeting 0.2–0.5% moves with tight stops. It requires exceptional discipline, fast execution, and near-perfect setups. NOT recommended for beginners — master swing trading first.","**ICT Scalp Model**: During NY or London Kill Zone, after Judas Swing completes, find M1 CHoCH toward true direction. Enter from M1 OB with 3–5 pip stop. Target: M5 FVG or equal high/low. Hold 5–30 minutes maximum.","**Scalping rules**: (1) ONLY during Kill Zone windows. (2) Only with confirmed HTF bias. (3) Tight stop — if stop is > 5 pips on M1, don't scalp. (4) Maximum 3 scalp trades per session. (5) Stop scalping after 2 losses in a row. Psychology is 3× harder in scalping — emotions compound with speed."],
        visual:D_KillZones,
        points:["Scalp only during Kill Zone windows — never outside","M1 CHoCH after Judas = highest quality scalp signal","Max 3 scalps per session, stop after 2 losses","Scalping amplifies psychology issues — master it last","Swing trading is more profitable for most traders — don't rush to scalp"],
        quiz:[
          {q:"When is it appropriate to scalp futures according to ICT methodology?",opts:["Anytime you see a good M1 setup","Only during Kill Zone windows with confirmed HTF bias","When you need to make quick money","Scalping is never appropriate"],ans:1},
          {q:"Why is scalping recommended LAST, not first, for new traders?",opts:["Scalping has lower profit potential","Psychology issues are amplified by speed — requires much more experience to handle","Scalping is only for professional firms","Fees are too high for scalping"],ans:1},
          {q:"The maximum number of scalp trades per session (ICT rules) is:",opts:["As many as you can execute","10 trades maximum","3 trades maximum, stop after 2 consecutive losses","1 trade — quality over quantity"],ans:2}
        ]},
      {id:"8.5",title:"Building Your Trading Plan",dur:"15 min",
        theory:["A **Trading Plan** is your operating manual. Every professional trader has one. Without it, you're gambling. It converts your strategy into a systematic, repeatable business process that removes emotional decision-making.","**Your Trading Plan must cover**: (1) Markets you trade (BNB/USDT perp? BTC? ETH? Max 2–3 pairs to start). (2) Trading sessions (Kill Zone windows ONLY). (3) Setup criteria (minimum confluences for each grade). (4) Position sizing formula. (5) Daily/weekly stop rules. (6) Trade review schedule (weekly).","**Review and iterate**: Every Saturday, review all trades from the week. What worked? What didn't? Are you following rules? Adjust RULES based on DATA, not emotions. 3 months of data = statistical significance. Build your edge through systematic refinement."],
        visual:D_FullSetup,
        points:["Written trading plan = non-negotiable for professional trading","Maximum 2–3 trading pairs — specialization beats generalization","Daily loss limit: -3%. Weekly: -8%. Monthly: -15%.","Weekly Saturday review: 1 hour minimum, every week","Backtest 6 months of history before trading any new rule live"],
        quiz:[
          {q:"You've hit your -3% daily loss limit. The correct action is:",opts:["Take 1 more trade to try to recover to -2%","Stop trading for today — rules are absolute","Reduce size and continue trading carefully","Switch to paper trading for the day"],ans:1},
          {q:"Why should beginners focus on maximum 2–3 trading pairs?",opts:["More pairs = more opportunity","Specialization in fewer pairs = deeper understanding = higher probability","Exchanges only allow 3 pairs","Risk management requires limited exposure"],ans:1},
          {q:"When should you adjust your trading plan rules?",opts:["After every losing day","After 3+ months of data shows a consistent pattern (statistical significance)","Never — set rules once and never change","After reading a new trading book"],ans:1}
        ]},
    ]
  },
];

// ── LOADING ───────────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{minHeight:"100vh",background:C.bg0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <div style={{fontSize:36}}>📈</div>
      <div style={{color:C.gold,fontSize:14,fontFamily:"monospace"}}>Loading your progress...</div>
    </div>
  );
}

// ── HOME SCREEN ───────────────────────────────────────────────────────────────
function HomeScreen({ completed, onStart, onGoTo }) {
  const total = MODULES.reduce((s,m)=>s+m.lessons.length,0);
  const pct = Math.round(completed.size/total*100);
  return (
    <div style={{minHeight:"100vh",background:C.bg0,color:C.tx,fontFamily:"'Inter',system-ui,sans-serif",overflowY:"auto"}}>
      <div style={{background:`linear-gradient(135deg,${C.bg1},#0A1A35)`,borderBottom:`1px solid ${C.bd}`,padding:"60px 32px 48px",textAlign:"center"}}>
        <div style={{fontSize:50,marginBottom:14}}>📈</div>
        <div style={{color:C.gold,fontSize:11,fontFamily:"monospace",letterSpacing:".2em",marginBottom:10,textTransform:"uppercase"}}>Complete Trading Course</div>
        <h1 style={{fontSize:36,fontWeight:900,margin:"0 0 14px",lineHeight:1.1,background:`linear-gradient(90deg,${C.gold},${C.goldL})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>NIHA-TRADING<br/>Masterclass</h1>
        <p style={{color:C.sub,fontSize:15,maxWidth:500,margin:"0 auto 26px",lineHeight:1.6}}>Zero to Professional — covering Futures basics, Smart Money Concepts, ICT methodology, Risk Management, and full trade execution.</p>
        <div style={{display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap",marginBottom:28}}>
          {[["9","Modules"],["48","Lessons"],["144","Quiz Questions"],["SMC+ICT","Method"]].map(([v,l])=>(
            <div key={l} style={{background:C.bg2,border:`1px solid ${C.bd}`,borderRadius:10,padding:"12px 18px",minWidth:90}}>
              <div style={{color:C.gold,fontSize:18,fontWeight:900,fontFamily:"monospace"}}>{v}</div>
              <div style={{color:C.sub,fontSize:10,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
        {pct>0&&(
          <div style={{maxWidth:400,margin:"0 auto 22px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{color:C.sub,fontSize:12}}>Overall Progress</span>
              <span style={{color:C.gold,fontSize:12,fontFamily:"monospace"}}>{pct}% — {completed.size}/{total} lessons</span>
            </div>
            <div style={{height:7,background:C.bg3,borderRadius:4}}>
              <div style={{height:7,width:`${pct}%`,background:`linear-gradient(90deg,${C.gold},${C.gr})`,borderRadius:4,transition:"width .4s"}}/>
            </div>
          </div>
        )}
        <button onClick={onStart} style={{background:C.gold,color:C.bg0,border:"none",borderRadius:12,padding:"14px 34px",fontSize:16,fontWeight:800,cursor:"pointer"}}>
          {pct===0?"🚀 Start Course":pct===100?"🏆 Review Course":"▶ Continue Learning"}
        </button>
      </div>
      <div style={{padding:"36px 32px",maxWidth:950,margin:"0 auto"}}>
        <h2 style={{color:C.tx,fontSize:17,fontWeight:700,marginBottom:20}}>Course Curriculum</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
          {MODULES.map((m,mi)=>{
            const done=m.lessons.filter(l=>completed.has(l.id)).length;
            const mp=Math.round(done/m.lessons.length*100);
            return(
              <div key={m.id} onClick={()=>onGoTo(mi,0)} style={{background:C.bg1,border:`1px solid ${C.bd}`,borderRadius:14,padding:18,cursor:"pointer",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:mp>0?m.color:C.bd}}/>
                <div style={{fontSize:24,marginBottom:6}}>{m.icon}</div>
                <div style={{color:m.color,fontSize:10,fontWeight:700,fontFamily:"monospace",letterSpacing:".06em",marginBottom:3}}>MODULE {m.id}</div>
                <div style={{color:C.tx,fontSize:14,fontWeight:700,marginBottom:6}}>{m.title}</div>
                <div style={{color:C.sub,fontSize:11,marginBottom:10}}>{m.lessons.length} lessons</div>
                <div style={{height:4,background:C.bg3,borderRadius:2}}>
                  <div style={{height:4,width:`${mp}%`,background:m.color,borderRadius:2}}/>
                </div>
                <div style={{color:C.sub,fontSize:10,marginTop:4,fontFamily:"monospace"}}>{done}/{m.lessons.length} done</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function FuturesMasterClass() {
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(new Set());
  const [modIdx, setModIdx] = useState(0);
  const [lesIdx, setLesIdx] = useState(0);
  const [showHome, setShowHome] = useState(true);
  const [sideOpen, setSideOpen] = useState(true);

  useEffect(()=>{
    (async()=>{
      try {
        const d = await Store.load();
        if(d){
          if(d.completed) setCompleted(new Set(d.completed));
          if(d.mi!=null) setModIdx(d.mi);
          if(d.li!=null) setLesIdx(d.li);
          if(d.home!=null) setShowHome(d.home);
        }
      } catch {}
      setLoading(false);
    })();
  },[]);

  async function save(nc, mi, li, home) {
    await Store.save({ completed:[...nc], mi, li, home });
  }

  function goTo(mi,li){
    setModIdx(mi);setLesIdx(li);setShowHome(false);
    save(completed,mi,li,false);
  }

  const allLessons = MODULES.flatMap(m=>m.lessons.map(l=>({l,m})));
  const flatIdx = allLessons.findIndex(x=>x.l.id===MODULES[modIdx].lessons[lesIdx].id);

  function goNext(){
    const mod=MODULES[modIdx];
    let mi=modIdx,li=lesIdx;
    if(li<mod.lessons.length-1){li++;}else if(mi<MODULES.length-1){mi++;li=0;}
    setModIdx(mi);setLesIdx(li);
    save(completed,mi,li,false);
  }
  function goPrev(){
    let mi=modIdx,li=lesIdx;
    if(li>0){li--;}else if(mi>0){mi--;li=MODULES[mi-1].lessons.length-1;}
    setModIdx(mi);setLesIdx(li);
    save(completed,mi,li,false);
  }
  async function markDone(){
    const key=MODULES[modIdx].lessons[lesIdx].id;
    const next=new Set([...completed,key]);
    setCompleted(next);
    await save(next,modIdx,lesIdx,false);
  }

  const total=MODULES.reduce((s,m)=>s+m.lessons.length,0);
  const pct=Math.round(completed.size/total*100);

  if(loading) return <LoadingScreen/>;

  if(showHome) return (
    <HomeScreen completed={completed} onStart={()=>{
      const first=allLessons.find(x=>!completed.has(x.l.id))||allLessons[0];
      const mi=MODULES.indexOf(first.m), li=first.m.lessons.indexOf(first.l);
      goTo(mi,li);
    }} onGoTo={goTo}/>
  );

  const mod=MODULES[modIdx];
  const lesson=mod.lessons[lesIdx];

  return(
    <div style={{display:"flex",height:"100vh",background:C.bg0,color:C.tx,fontFamily:"'Inter',system-ui,sans-serif",overflow:"hidden"}}>
      {sideOpen&&(
        <div style={{width:268,background:C.bg1,borderRight:`1px solid ${C.bd}`,display:"flex",flexDirection:"column",flexShrink:0,overflow:"hidden"}}>
          <div onClick={()=>{setShowHome(true);save(completed,modIdx,lesIdx,true);}} style={{padding:"12px 14px",borderBottom:`1px solid ${C.bd}`,cursor:"pointer"}}>
            <div style={{color:C.gold,fontSize:13,fontWeight:800}}>📈 NIHA-TRADING MASTERCLASS</div>
            <div style={{display:"flex",alignItems:"center",gap:5,marginTop:5}}>
              <div style={{flex:1,height:4,background:C.bg3,borderRadius:2}}><div style={{height:4,width:`${pct}%`,background:`linear-gradient(90deg,${C.gold},${C.gr})`,borderRadius:2}}/></div>
              <span style={{color:C.sub,fontSize:10,fontFamily:"monospace",flexShrink:0}}>{pct}%</span>
            </div>
          </div>
          <div style={{overflowY:"auto",flex:1,padding:"6px 0"}}>
            {MODULES.map((m,mi)=>(
              <div key={m.id}>
                <div style={{padding:"8px 14px 3px",color:m.color,fontSize:10,fontWeight:700,fontFamily:"monospace",letterSpacing:".06em",display:"flex",alignItems:"center",gap:4}}>
                  <span>{m.icon}</span><span>M{m.id}: {m.title.toUpperCase()}</span>
                </div>
                {m.lessons.map((l,li)=>{
                  const active=mi===modIdx&&li===lesIdx;
                  const done=completed.has(l.id);
                  return(
                    <div key={l.id} onClick={()=>goTo(mi,li)} style={{padding:"6px 14px 6px 26px",cursor:"pointer",display:"flex",alignItems:"center",gap:7,background:active?`${m.color}20`:"transparent",borderLeft:active?`2px solid ${m.color}`:"2px solid transparent",transition:"all .15s"}}>
                      <span style={{color:done?C.gr:active?m.color:C.mut,fontSize:11,flexShrink:0}}>{done?"✓":"○"}</span>
                      <div>
                        <div style={{color:active?C.tx:done?C.sub:C.sub,fontSize:12,fontWeight:active?600:400,lineHeight:1.3}}>{l.title}</div>
                        <div style={{color:C.mut,fontSize:10,fontFamily:"monospace"}}>{l.dur}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"9px 18px",borderBottom:`1px solid ${C.bd}`,display:"flex",alignItems:"center",gap:10,background:C.bg1,flexShrink:0}}>
          <button onClick={()=>setSideOpen(s=>!s)} style={{background:"transparent",border:`1px solid ${C.bd}`,color:C.sub,borderRadius:6,padding:"3px 9px",cursor:"pointer",fontSize:12}}>{sideOpen?"◀":"▶"}</button>
          <button onClick={()=>{setShowHome(true);save(completed,modIdx,lesIdx,true);}} style={{background:"transparent",border:"none",color:C.sub,cursor:"pointer",fontSize:12}}>⌂ Home</button>
          <div style={{color:C.bd,fontSize:14}}>│</div>
          <span style={{color:C.sub,fontSize:12}}>{mod.icon} {mod.title}</span>
          <span style={{color:C.bd}}>›</span>
          <span style={{color:C.tx,fontSize:12,fontWeight:600}}>{lesson.title}</span>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:7}}>
            <span style={{color:C.sub,fontSize:10,fontFamily:"monospace"}}>{flatIdx+1}/{total}</span>
            <div style={{width:72,height:4,background:C.bg3,borderRadius:2}}><div style={{height:4,width:`${(flatIdx+1)/total*100}%`,background:C.gold,borderRadius:2}}/></div>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"24px 28px"}}>
          {/* KEY BUG FIX: key prop forces full remount on every lesson change */}
          <LessonView
            key={`${modIdx}-${lesIdx}-${lesson.id}`}
            lesson={lesson} mod={mod}
            onNext={goNext} onPrev={goPrev}
            hasNext={flatIdx<allLessons.length-1}
            hasPrev={flatIdx>0}
            isCompleted={completed.has(lesson.id)}
            onComplete={markDone}
          />
        </div>
      </div>
    </div>
  );
}
