/* =====================================================================
   MAPA DE HOGWARTS · ARCANE
   Aparece só na página do fórum de Hogwarts (/f11), acima da lista de subfóruns.
   Para desligar: desative este código em Painel › Módulos › Gestão dos códigos Javascript.
   Ícones: game-icons.net (CC BY 3.0)
   ===================================================================== */
(function(){
"use strict";
if(window.__arcaneMapa)return;window.__arcaneMapa=true;

/* ---------- configurações ---------- */
var CONFIG={
  paginas:/^\/f11(p\d+)?(-|$)/,          // página onde o mapa aparece
  altura:"max(560px, min(88vh, 900px))", // altura do mapa dentro da página
  substituirLista:true,                  // true = o mapa fica no lugar da lista de subfóruns · false = mapa em cima e a lista continua embaixo
  forcar:!!window.ARCANE_MAPA_FORCAR,    // usado só no preview local
  base:"https://arcane.forumeiros.com"
};
if(!CONFIG.forcar&&!CONFIG.paginas.test(location.pathname))return;

function pronto(fn){if(document.readyState!=="loading")fn();else document.addEventListener("DOMContentLoaded",fn)}
function garanteLink(href,teste){if(!document.querySelector('link[href*="'+teste+'"]')){var l=document.createElement("link");l.rel="stylesheet";l.href=href;document.head.appendChild(l)}}

var FONTES="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&family=Poppins:wght@400;500;600&display=swap";
var ICONES="https://cdn.jsdelivr.net/gh/danielaaaa1/arcanerpg-assets@main/arcane/game-icons.css";

var CSS=`
:host{all:initial;display:block;position:relative;height:${CONFIG.altura};min-height:520px;margin:0;background:#080808;border:0;overflow:hidden;contain:layout paint}
:host(.full){position:fixed;inset:0;height:100vh;min-height:0;margin:0;border:0;z-index:2147483000}
.wrap{position:absolute;inset:0;overflow:hidden;color:#d1d1d1;font-family:Poppins,system-ui,sans-serif;font-size:14px;line-height:1.4;text-align:left;
  --p1:#0e0e0e;--p2:#0a0a0a;--line:#262626;--line2:#313131;--gold:#c4a459;--gold2:#e1c677;--ink:#d1d1d1;--muted:#8a8a8a}
*{box-sizing:border-box;border-radius:0}
button{font:inherit;color:inherit;margin:0}
.orn{background:linear-gradient(180deg,var(--p1),var(--p2));border:1px solid var(--line)}
#vp{position:absolute;inset:0;overflow:hidden;touch-action:none;cursor:grab;background:radial-gradient(ellipse at 58% 52%,#132416 0%,#0a110b 38%,#080808 75%)}
#vp.drag{cursor:grabbing}
#stage{position:absolute;left:0;top:0;width:1600px;height:1000px;transform-origin:0 0;transition:opacity .22s}
#stage.fade{opacity:0}
#bg svg{display:block;width:100%;height:100%}
#pins{position:absolute;inset:0;pointer-events:none}
/* ícones */
.pin{position:absolute;width:0;height:0}
.pin .b{pointer-events:auto;position:absolute;left:0;top:0;width:28px;height:28px;transform:translate(-50%,-50%) scale(var(--inv,1)) rotate(45deg);background:#0b0b0b;border:1.5px solid var(--gold);display:grid;place-items:center;cursor:pointer;box-shadow:0 0 0 3px #08080899,0 4px 10px #000c;transition:background .15s,box-shadow .15s,transform .15s}
.pin .b svg{width:14px;height:14px;fill:var(--gold2);transform:rotate(-45deg)}
.gi{display:block;font-size:17px;line-height:1;color:var(--gold2);transform:rotate(-45deg);font-style:normal}
.gi::before{display:block}
.pin .l{position:absolute;left:0;top:0;transform-origin:0 0;white-space:nowrap;font-family:Montserrat,sans-serif;font-size:11px;font-weight:700;letter-spacing:.04em;color:#fff;background:#080808e6;border:1px solid var(--line2);padding:3px 7px;pointer-events:none;opacity:0;transition:opacity .15s}
.pin.lv .l,.pin:hover .l,.pin.sel .l,.pin.hot .l{opacity:1}
.pin.lv .l,.pin.sel .l,.pin.hot .l{pointer-events:auto;cursor:pointer}
.pin .l:hover{border-color:var(--gold);color:var(--gold2)}
.pin .b::after{content:"";position:absolute;inset:-9px}
.pin.sel .b{background:var(--gold);border-color:var(--gold2)!important}
.pin.sel .b svg,.pin.sel .b .gi{fill:#14110b!important;color:#14110b!important}
.pin.dim .l{opacity:0!important}
.pin .b:hover,.pin.sel .b,.pin.hot .b{background:#1b2213;box-shadow:0 0 0 3px #080808,0 0 0 5px #c4a45966,0 0 18px #e1c67766}
.pin.hot .b,.pin.sel .b{transform:translate(-50%,-50%) scale(calc(var(--inv,1)*1.18)) rotate(45deg)}
.pin.hot,.pin.sel{z-index:3}
.pin.dim{opacity:.14}
.pin.dim .b{pointer-events:none}
.pin.pop .b{animation:pop .4s cubic-bezier(.2,1.5,.4,1) both;animation-delay:var(--d,0s)}
@keyframes pop{from{opacity:0;transform:translate(-50%,-50%) scale(0) rotate(45deg)}}
.pin.pulse .b{animation:pulse 1.1s ease-out 2}
@keyframes pulse{0%{box-shadow:0 0 0 3px #080808,0 0 0 4px #e1c677}100%{box-shadow:0 0 0 3px #080808,0 0 0 26px #e1c67700}}
/* cabeçalho */
.top{position:absolute;left:0;right:0;top:0;padding:16px 22px 12px;display:flex;gap:16px;align-items:center;z-index:5;background:linear-gradient(#080808,#080808e0 70%,#08080800);pointer-events:none}
.top>*{pointer-events:auto}
.nav{display:flex;align-items:center;gap:14px;min-width:0}
.back{width:40px;height:40px;cursor:pointer;font-size:20px;line-height:1;display:grid;place-items:center;flex:none;color:var(--gold2)}
.back:hover{border-color:var(--gold)}
.back[hidden]{display:none}
.crumbs{font-family:Montserrat,sans-serif;font-size:10.5px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:var(--muted);display:flex;align-items:center;flex-wrap:wrap}
.crumbs button{background:none;border:0;padding:0;cursor:pointer;font:inherit;letter-spacing:inherit;color:inherit}
.crumbs button:hover{color:var(--gold2)}
.crumbs .s{margin:0 9px;color:var(--gold)}
.vt{font-family:Montserrat,sans-serif;font-weight:700;font-size:24px;letter-spacing:.07em;text-transform:uppercase;margin-top:3px;color:var(--gold2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-bottom:6px;background:linear-gradient(90deg,var(--gold),transparent) left bottom/100% 1px no-repeat}
.search{position:relative;margin-left:auto;width:min(330px,38%)}
.search input{width:100%;border:1px solid var(--line2);background:#0c0c0c;color:var(--ink);padding:10px 14px 10px 38px;font:inherit;font-size:13.5px;outline:none;margin:0;height:auto}
.search input:focus{border-color:var(--gold)}
.search input::placeholder{color:var(--muted)}
.search>svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);width:14px;height:14px;fill:var(--gold)}
.results{position:absolute;top:calc(100% + 6px);left:0;right:0;max-height:56vh;overflow:auto;display:none;box-shadow:0 16px 50px #000;padding:6px}
.results.show{display:block}
.results button{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:none;border:0;border-left:2px solid transparent;font-size:13.5px;padding:8px 10px;cursor:pointer}
.results button:hover,.results button.act{background:#c4a45914;border-left-color:var(--gold)}
.results small{display:block;color:var(--muted);font-size:11.5px}
.results .none{padding:12px;color:var(--muted);font-size:13px}
.ri{width:22px;height:22px;border:1.5px solid var(--gold);display:grid;place-items:center;flex:none;background:#0b0b0b;transform:rotate(45deg);margin:0 4px}
.ri svg{width:11px;height:11px;fill:var(--gold2);transform:rotate(-45deg)}
.ri .gi{font-size:12px}
/* painel lateral */
.side{position:absolute;left:22px;top:92px;bottom:22px;width:310px;z-index:4;display:flex;flex-direction:column;box-shadow:0 20px 60px #000c;transition:transform .25s}
.side.closed{transform:translateX(calc(-100% - 30px))}
.tabs{display:grid;grid-template-columns:repeat(4,1fr) 38px;height:40px;border-bottom:1px solid var(--line)}
.tab{height:39px;background:none;border:0;border-right:1px solid var(--line);border-bottom:2px solid transparent;padding:2px 4px 0;font-family:Montserrat,sans-serif;font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap}
.tab:hover{color:var(--ink)}
.tab.on{color:var(--gold2);border-bottom-color:var(--gold);background:linear-gradient(0deg,#c4a45914,transparent)}
.tab b{font-family:Poppins,sans-serif;font-weight:500;font-size:10.5px;letter-spacing:0;color:var(--muted)}
.sh{padding:13px 18px 10px;font-size:12px;color:var(--muted);border-bottom:1px solid var(--line);line-height:1.45}
.sh strong{display:block;font-family:Montserrat,sans-serif;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:2px}
.ls{overflow:auto;flex:1;padding:4px 10px 16px;scrollbar-width:thin;scrollbar-color:#313131 transparent}
.gh{display:flex;align-items:center;gap:10px;padding:16px 8px 6px;font-family:Montserrat,sans-serif;font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--gold)}
.gh::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,#c4a45955,transparent)}
.gh .n{order:3;font-family:Poppins,sans-serif;letter-spacing:0;font-weight:500;color:var(--muted)}
.gh .sw{width:8px;height:8px;transform:rotate(45deg);flex:none}
.gh.click{cursor:pointer}.gh.click:hover{color:var(--gold2)}
.house{margin:12px 0 4px;border:1px solid var(--line);border-left:3px solid var(--hc)}
.house .hh{display:flex;align-items:center;gap:10px;padding:10px 12px;font-family:Montserrat,sans-serif;font-weight:700;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--hc);background:linear-gradient(90deg,var(--hb),transparent)}
.house .hh small{margin-left:auto;font-family:Poppins,sans-serif;font-weight:500;letter-spacing:0;text-transform:none;color:var(--muted);font-size:11px}
.it{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:none;border:0;border-left:2px solid transparent;padding:8px 10px 8px 8px;cursor:pointer;font-size:13.5px;transition:background .12s}
.it small{display:block;font-size:11px;color:var(--muted);line-height:1.3}
.it:hover,.it.hot{background:#c4a45912;border-left-color:#c4a45988}
.it.sel{background:#c4a45922;border-left-color:var(--gold)}
.it .go{margin-left:auto;color:var(--gold);font-size:13px;opacity:0;transition:opacity .12s;font-family:Montserrat,sans-serif}
.it:hover .go,.it.hot .go{opacity:1}
.it .open{margin-left:auto;flex:none;width:28px;height:28px;display:grid;place-items:center;border:1px solid var(--line2);color:var(--gold2);text-decoration:none;font-size:13px;opacity:.55;transition:opacity .12s,border-color .12s,background .12s}
.it:hover .open,.it.hot .open,.it.sel .open{opacity:1}
.it .open:hover{border-color:var(--gold);background:var(--gold);color:#14110b}
/* guia da primeira visita */
.intro{position:absolute;inset:0;z-index:20;background:#080808cc;display:grid;place-items:center;padding:20px;backdrop-filter:blur(2px)}
.intro[hidden]{display:none}
.intro .box{width:min(460px,100%);background:linear-gradient(180deg,#101010,#0a0a0a);border:1px solid var(--line2);border-top:2px solid var(--gold);padding:24px 26px 22px;box-shadow:0 30px 80px #000}
.intro h4{margin:0 0 4px;font-family:Montserrat,sans-serif;font-size:18px;letter-spacing:.08em;text-transform:uppercase;color:var(--gold2)}
.intro p{margin:0 0 16px;color:var(--muted);font-size:13px}
.intro ol{list-style:none;margin:0 0 20px;padding:0;display:grid;gap:12px}
.intro li{display:flex;gap:14px;align-items:flex-start;font-size:14px;line-height:1.45}
.intro li b{flex:none;width:26px;height:26px;display:grid;place-items:center;border:1.5px solid var(--gold);color:var(--gold2);font-family:Montserrat,sans-serif;font-size:12px}
.intro li span em{font-style:normal;color:var(--gold2)}
.intro button{width:100%;padding:12px;border:0;background:var(--gold);color:#14110b;font-family:Montserrat,sans-serif;font-weight:700;font-size:12px;letter-spacing:.16em;text-transform:uppercase;cursor:pointer}
.intro button:hover{background:var(--gold2)}
.sidetoggle{position:absolute;top:92px;left:22px;z-index:6;width:40px;height:40px;cursor:pointer;color:var(--gold2);font-size:16px;display:none}
.side.closed~.sidetoggle{display:grid;place-items:center}
.collapse{height:39px;background:none;border:0;color:var(--muted);cursor:pointer;font-size:15px}
.collapse:hover{color:var(--gold2);background:#ffffff08}
/* níveis */
.levels{position:absolute;top:92px;height:41px;z-index:4;display:flex;align-items:stretch;max-width:calc(100% - 32px);overflow-x:auto;scrollbar-width:none}
.levels:empty{display:none}
.levels .h{font-family:Montserrat,sans-serif;font-size:9.5px;font-weight:700;letter-spacing:.24em;color:var(--gold);display:flex;align-items:center;padding:2px 14px 0;border-right:1px solid var(--line);white-space:nowrap;background:#ffffff05}
.levels .h:not(:first-child){border-left:1px solid var(--line2);margin-left:-1px}
.levels button{height:39px;background:none;border:0;border-right:1px solid var(--line);border-bottom:2px solid transparent;padding:2px 15px 0;font-family:Montserrat,sans-serif;font-weight:700;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;display:flex;align-items:center;gap:8px;white-space:nowrap;color:var(--muted)}
.levels button:last-child{border-right:0}
.levels button .c{font-family:Poppins,sans-serif;font-weight:500;font-size:11px;color:var(--muted);letter-spacing:0}
.levels button .sw{width:7px;height:7px;transform:rotate(45deg);flex:none}
.levels button:hover{color:var(--ink);background:#ffffff06}
.levels button.on{color:var(--gold2);border-bottom-color:var(--gold);background:linear-gradient(0deg,#c4a4591c,transparent)}
.tools{position:absolute;right:22px;bottom:22px;display:flex;z-index:4}
.tools button{width:40px;height:40px;cursor:pointer;font-size:17px;color:var(--gold2);margin-left:-1px}
.tools button:hover{border-color:var(--gold);position:relative}
.tools button.txt{width:auto;padding:0 12px;font-family:Montserrat,sans-serif;font-size:10px;font-weight:700;letter-spacing:.14em}
.tools button.txt.on{color:#14110b;background:var(--gold);border-color:var(--gold)}
.credit{position:absolute;right:22px;bottom:68px;z-index:3;font-size:10px;color:#5d5d5d;text-align:right}
.credit a{color:inherit}
.hint{position:absolute;bottom:26px;transform:translateX(-50%);font-family:Montserrat,sans-serif;font-size:10.5px;font-weight:700;letter-spacing:.24em;color:var(--gold2);padding:10px 18px;z-index:3;pointer-events:none;white-space:nowrap}
.tip{position:fixed;z-index:2147483001;pointer-events:none;padding:8px 13px;font-family:Montserrat,sans-serif;font-weight:700;font-size:11.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--gold2);opacity:0;transform:translate(-50%,-135%);white-space:nowrap;border-color:var(--gold)!important}
.tip small{display:block;font-family:Poppins,sans-serif;font-weight:400;letter-spacing:0;text-transform:none;font-size:11.5px;color:var(--muted);margin-top:1px}
.tip.show{opacity:1}
/* cartão */
.card{position:fixed;z-index:2147483002;width:310px;padding:16px 18px 18px;box-shadow:0 18px 50px #000,0 0 0 1px #c4a45955,0 0 30px #c4a45926;display:none;border-top:2px solid var(--gold)!important}
.card.show{display:block;animation:cardin .18s ease-out}
@keyframes cardin{from{opacity:0;transform:translateY(6px)}}
.card .cr{font-family:Montserrat,sans-serif;font-size:9.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);line-height:1.6;padding-right:20px}
.card h3{font-family:Montserrat,sans-serif;font-weight:700;font-size:17px;margin:6px 0 4px;line-height:1.25;color:#fff}
.card .m{font-size:12.5px;color:var(--gold)}
.card a{display:flex;justify-content:space-between;align-items:center;margin-top:14px;font-family:Montserrat,sans-serif;font-weight:700;font-size:11px;letter-spacing:.16em;text-transform:uppercase;text-decoration:none;padding:11px 14px;background:var(--gold);color:#14110b}
.card a:hover{background:var(--gold2)}
.card .x{position:absolute;right:6px;top:4px;background:none;border:0;color:var(--muted);font-size:20px;cursor:pointer}
.card .x:hover{color:var(--gold2)}
/* svg */
.rg{cursor:pointer}
.rg .f,.rg .g{transition:fill .15s,stroke .15s,stroke-opacity .15s}
.rg:hover .f,.rg:focus .f,.rg.hot .f{fill:#1d2817}
.rg:hover .g,.rg:focus .g,.rg.hot .g{stroke:#e1c677;stroke-opacity:1}
.rg:focus{outline:none}
.rg.dimw{opacity:.3}
.rg.dimw:hover{opacity:.6}
.act .g{stroke:#e1c677;stroke-opacity:.95}
.tw.hot{fill:#c4a45930!important}
.tw.hot+.g{stroke:#e1c677!important;stroke-opacity:1!important}
/* telas estreitas (largura do mapa) */
.narrow .top{flex-wrap:wrap;padding:12px 14px}
.narrow .nav{width:100%}
.narrow .vt{font-size:18px}
.narrow .search{width:100%;margin-left:0}
.narrow .side{left:0;right:0;top:auto;bottom:0;width:auto;height:52%}
.narrow .side.closed{transform:translateY(calc(100% + 10px))}
.narrow .sidetoggle{top:auto;bottom:14px;left:14px;width:auto;padding:0 14px;font-family:Montserrat,sans-serif;font-size:10.5px;font-weight:700;letter-spacing:.14em}
.narrow .tools{right:14px;bottom:14px}
.narrow .hint,.narrow .credit{display:none}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
`;

var HTML=`
<div class="wrap" id="wrap">
<div id="vp"><div id="stage"><div id="bg"></div><div id="pins"></div></div></div>
<div class="top">
  <div class="nav"><button class="back orn" id="back" aria-label="Voltar" hidden>‹</button><div style="min-width:0"><div class="crumbs" id="crumbs"></div><div class="vt" id="vt"></div></div></div>
  <div class="search"><svg viewBox="0 0 16 16"><path d="M6.5 1a5.5 5.5 0 0 1 4.4 8.8l3.7 3.7-1.4 1.4-3.7-3.7A5.5 5.5 0 1 1 6.5 1zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"/></svg>
    <input id="q" type="search" placeholder="Buscar um local em Hogwarts…" autocomplete="off" aria-label="Buscar um local"><div class="results orn" id="res"></div></div>
</div>
<aside class="side orn" id="side"><div class="tabs" id="tabs"></div><div class="sh" id="sh"></div><div class="ls" id="ls"></div></aside>
<button class="sidetoggle orn" id="sidetoggle" aria-label="Mostrar lista">☰</button>
<div class="levels orn" id="levels"></div>
<div class="credit">Ícones: <a href="https://game-icons.net" target="_blank" rel="noopener">game-icons.net</a> · CC BY 3.0</div>
<div class="intro" id="intro" hidden><div class="box" role="dialog" aria-label="Como usar o mapa">
  <h4>Mapa de Hogwarts</h4><p>Todos os locais do fórum de Hogwarts, em um lugar só.</p>
  <ol>
   <li><b>1</b><span>Clique no <em>castelo</em> para entrar e depois escolha uma <em>ala</em>.</span></li>
   <li><b>2</b><span>Clique num <em>ícone</em> (ou no nome) e depois em <em>Abrir tópico</em>.</span></li>
   <li><b>3</b><span>Com pressa? Use a <em>busca</em> ou a <em>lista</em> ao lado. O botão <em>↗</em> abre o tópico direto.</span></li>
  </ol>
  <button id="introok">Entendi</button>
</div></div>
<div class="tools"><button class="orn" id="help" aria-label="Como usar" title="Como usar" style="font-family:Montserrat,sans-serif;font-weight:700;font-size:14px">?</button><button class="orn txt on" id="nmb" aria-pressed="true" title="Mostrar ou esconder os nomes">NOMES</button><button class="orn" id="zin" aria-label="Aproximar">+</button><button class="orn" id="zout" aria-label="Afastar">−</button><button class="orn" id="zfit" aria-label="Enquadrar" style="font-size:14px">⌂</button><button class="orn" id="full" aria-label="Tela cheia" title="Tela cheia" style="font-size:15px">⛶</button></div>
<div class="hint orn" id="hint"></div>
<div class="tip orn" id="tip"></div>
<div class="card orn" id="card"><button class="x" id="cx" aria-label="Fechar">×</button><div class="cr" id="ccr"></div><h3 id="cn"></h3><div class="m" id="cm"></div><a id="ca" target="_blank" rel="noopener"><span>Abrir tópico</span><span>↗</span></a></div>
</div>`;

pronto(function(){
  garanteLink(FONTES,"fonts.googleapis.com/css2?family=Montserrat");
  garanteLink(ICONES,"game-icons");
  var listas=[].slice.call(document.querySelectorAll("#main-content .forabg")).filter(function(b){return b.querySelector("ul.forums, .topiclist.forums")});
  var alvo=listas[0]||document.querySelector("#main-content .forabg")||document.querySelector("#main-content");
  var host=document.createElement("div");host.id="arcane-mapa-hogwarts";
  if(alvo&&alvo.id==="main-content")alvo.insertBefore(host,alvo.firstChild);
  else if(alvo)alvo.parentNode.insertBefore(host,alvo);
  else document.body.insertBefore(host,document.body.firstChild);
  if(CONFIG.substituirLista)listas.forEach(function(b){b.style.display="none"});
  var root=host.attachShadow({mode:"open"});
  root.innerHTML='<link rel="stylesheet" href="'+ICONES+'"><style>'+CSS+'</style>'+HTML;
  iniciar(root,host);
});

function iniciar(root,host){
const $=id=>root.getElementById(id);
const wrap=$("wrap");
const BASE=CONFIG.base;

/* ===== fóruns (estrutura de /f11) ===== */
const FORUMS={"/f11":["Hogwarts",null],"/f24":["Interior do Castelo","/f11"],"/f25":["Subsolo","/f24"],"/f26":["Masmorras","/f25"],"/f27":["Masmorras da Sonserina","/f26"],"/f29":["Porões","/f25"],"/f30":["Porão da Lufa-Lufa","/f29"],"/f31":["Anexos da Torre do Relógio","/f24"],"/f32":["Torre dos Professores","/f31"],"/f33":["Torre Hospitalar","/f31"],"/f34":["Torre da Grifinória","/f31"],"/f35":["Ala da Grande Escadaria","/f24"],"/f36":["Torre do Diretor","/f35"],"/f37":["Torre da Corvinal","/f35"],"/f38":["Anexos da Torre de Astronomia","/f24"],"/f39":["Torre de Defesa Contra as Artes das Trevas","/f38"],"/f40":["Torre de Astronomia","/f38"],"/f41":["Ala da Torre do Sino","/f24"],"/f42":["Anexos da Biblioteca","/f41"],"/f43":["Anexos da Torre do Sino","/f41"],"/f44":["Exterior do Castelo","/f11"],"/f45":["Campo de Quadribol","/f44"],"/f46":["Lago Negro","/f44"],"/f47":["Floresta Proibida","/f44"],"/f72":["Arredores","/f11"]};
const crumb=f=>{const a=[];let c=f;while(c){a.unshift(FORUMS[c][0]);c=FORUMS[c][1]}return a};

/* ===== tópicos: link, nome, fórum, tipo (a aula · c casa · l local · e exterior), casa, posição ===== */
const T=[
 ["/t87","Sala de Poções","/f26","a",0,[635,500]],["/t88","Compartimento de Poções","/f26","a",0,[622,548]],["/t84","Corredores das Masmorras","/f26","l",0,[700,522]],["/t86","Câmara de Detenções","/f26","l",0,[768,572]],["/t85","Salão de Festas Abandonado","/f26","l",0,[765,492]],
 ["/t89","Salão Comunal da Sonserina","/f27","c","sons",[655,604]],["/t90","Dormitórios Masculinos","/f27","c","sons",[615,630]],["/t91","Dormitórios Femininos","/f27","c","sons",[697,630]],
 ["/t101","Cozinhas do Castelo","/f29","l",0,[878,458]],
 ["/t102","Salão Comunal da Lufa-Lufa","/f30","c","lufa",[960,506]],["/t104","Dormitórios Masculinos","/f30","c","lufa",[925,542]],["/t103","Dormitórios Femininos","/f30","c","lufa",[995,542]],
 ["/t106","Torre do Relógio","/f31","l",0,[1015,345]],["/t105","Entrada da Torre do Relógio","/f31","l",0,[945,425]],
 ["/t107","Banheiro dos Monitores","/f32","l",0,[1032,430]],
 ["/t108","Ala Hospitalar","/f33","l",0,[922,385]],["/t109","Aposentos da Matrona","/f33","l",0,[968,402]],
 ["/t110","Salão Comunal da Grifinória","/f34","c","grif",[960,322]],["/t111","Dormitórios Femininos","/f34","c","grif",[936,300]],["/t112","Dormitórios Masculinos","/f34","c","grif",[984,300]],
 ["/t113","Grande Salão","/f35","l",0,[796,466]],["/t114","Saguão de Entrada","/f35","l",0,[820,562]],["/t117","Grande Escadaria","/f35","l",0,[858,470]],["/t115","Câmara de Recepção","/f35","l",0,[864,528]],["/t116","Aposentos do Zelador","/f35","l",0,[776,536]],["/t120","Corredor de Grunhilda de Gorsemoor","/f35","l",0,[790,410]],["/t121","Pátio Pavimentado","/f35","l",0,[820,610]],["/t118","Pátio do Viaduto","/f35","l",0,[820,388]],["/t119","Viaduto","/f35","l",0,[820,318]],
 ["/t125","Sala do Diretor","/f36","l",0,[850,415]],["/t123","Galeria de Armaduras","/f36","l",0,[862,388]],["/t122","Corredor das Tapeçarias","/f36","l",0,[784,496]],["/t124","Sala dos Troféus","/f36","l",0,[846,500]],
 ["/t126","Salão Comunal da Corvinal","/f37","c","corv",[700,382]],["/t127","Dormitórios Femininos","/f37","c","corv",[680,362]],["/t128","Dormitórios Masculinos","/f37","c","corv",[720,362]],
 ["/t129","Sala de Defesa Contra as Artes das Trevas","/f39","a",0,[935,585]],["/t130","Sala de Feitiços","/f39","a",0,[925,505]],["/t804","Sala de Runas Antigas","/f39","a",0,[972,548]],["/t131","Sala dos Professores","/f39","l",0,[1015,505]],
 ["/t132","Torre de Astronomia","/f40","a",0,[1005,615]],["/t133","Sala Precisa","/f40","l",0,[1020,565]],
 ["/t134","Saguão Central","/f41","l",0,[682,460]],["/t141","Sala de Transfiguração","/f41","a",0,[645,450]],["/t143","Pátio de Transfiguração","/f41","l",0,[640,512]],["/t135","Torre de Adivinhação","/f41","a",0,[625,395]],["/t778","Achados e Perdidos","/f41","l",0,[722,505]],
 ["/t136","Biblioteca","/f42","l",0,[700,425]],["/t137","Seção Restrita","/f42","l",0,[726,465]],
 ["/t138","Torre do Sino","/f43","l",0,[595,435]],["/t140","Sala de História da Magia","/f43","a",0,[600,490]],["/t139","Sala de Música","/f43","a",0,[676,522]],
 ["/t144","Jardins do Castelo","/f44","e",0,[830,700]],["/t145","Estufas","/f44","a",0,[500,640]],["/t146","Corujal","/f44","e",0,[470,360]],["/t147","Ponte Coberta","/f44","e",0,[1095,470]],["/t148","Círculo de Pedra","/f44","e",0,[1125,250]],
 ["/t149","Campo de Quadribol","/f45","e",0,[300,250]],["/t154","Vestiários","/f45","e",0,[400,322]],
 ["/t150","Margens do Lago Negro","/f46","e",0,[720,792]],["/t153","Casa dos Barcos","/f46","e",0,[925,762]],["/t825","Celeiro Abandonado","/f46","e",0,[1235,835]],
 ["/t151","Orla da Floresta Proibida","/f47","e",0,[1215,420]],["/t152","Cabana do Guarda-Caças","/f47","e",0,[1160,585]],
 ["/t244","Lago Florestal","/f72","e",0,[1470,222]],["/t243","A Clareira","/f72","e",0,[1415,462]],["/t242","Profundezas da Floresta Proibida","/f72","e",0,[1510,650]],
].map(([u,n,f,k,h,p])=>({u,n,f,k,h:h||null,p}));
const GROUND=["/f44","/f45","/f46","/f47","/f72"];
T.forEach(t=>t.out=GROUND.includes(t.f));

/* ícone (game-icons) de cada tópico */
const GI={"/t87":"cauldron","/t88":"potion-ball","/t84":"stone-path","/t86":"prisoner","/t85":"ghost","/t89":"snake","/t90":"bed","/t91":"bed","/t101":"cooking-pot","/t102":"paw-print","/t104":"bed","/t103":"bed",
 "/t106":"pocket-watch","/t105":"wooden-door","/t107":"bathtub","/t108":"hospital-cross","/t109":"first-aid-kit","/t110":"lion","/t111":"bed","/t112":"bed",
 "/t113":"meal","/t114":"medieval-gate","/t117":"3d-stairs","/t115":"door","/t116":"key","/t120":"candlebright","/t121":"fountain","/t118":"stone-wall","/t119":"arch-bridge",
 "/t125":"throne-king","/t123":"armor-vest","/t122":"knight-banner","/t124":"trophy-cup","/t126":"eagle-head","/t127":"bed","/t128":"bed",
 "/t129":"sword-altar","/t130":"magic-swirl","/t804":"rune-stone","/t131":"pointy-hat","/t132":"ringed-planet","/t133":"magic-portal",
 "/t134":"compass","/t141":"star-swirl","/t143":"stone-pile","/t135":"crystal-ball","/t778":"treasure-map","/t136":"bookshelf","/t137":"spell-book","/t138":"ringing-bell","/t140":"scroll-unfurled","/t139":"lyre",
 "/t144":"flower-pot","/t145":"greenhouse","/t146":"owl","/t147":"stone-bridge","/t148":"stone-pile","/t149":"witch-flight","/t154":"shower","/t150":"wave-crest","/t153":"boat-fishing","/t825":"barn","/t151":"pine-tree","/t152":"wood-cabin","/t244":"water-drop","/t243":"campfire","/t242":"spider-web"};
T.forEach(t=>t.gi=GI[t.u]);

/* torres: salas agrupadas em volta da torre [x, y, colunas] (0 = em círculo); alas abertas ficam espalhadas */
const ANCH={"/f32":[1032,430,1],"/f33":[925,396,2],"/f34":[960,316,0],"/f36":[852,415,0],"/f37":[783,368,0],"/f39":[945,540,2],"/f40":[1008,610,2],"/f43":[600,448,0]};
(function(){const S=22;for(const f in ANCH){const [ax,ay,cols]=ANCH[f];const ts=T.filter(t=>t.f===f),n=ts.length;
  ts.forEach((t,i)=>{if(n===1){t.p=[ax,ay];return}
    if(!cols){const r=n<=3?14:16,a=-Math.PI/2+i/n*Math.PI*2;t.p=[ax+Math.cos(a)*r,ay+Math.sin(a)*r];return}
    const rows=Math.ceil(n/cols),r=Math.floor(i/cols),inRow=r===rows-1?n-r*cols:cols,c=i%cols;
    t.p=[ax+(c-(inRow-1)/2)*S,ay+(r-(rows-1)/2)*S]})}})();

const HOUSE={grif:["Grifinória","#A83232"],sons:["Sonserina","#328034"],corv:["Corvinal","#335A9C"],lufa:["Lufa-Lufa","#C7AA36"]};
const FHOUSE={"/f27":"sons","/f30":"lufa","/f34":"grif","/f37":"corv"};
const ICON={a:'<path d="M1 3h5.2c.8 0 1.4.3 1.8.8.4-.5 1-.8 1.8-.8H15v10H9.8c-.8 0-1.3.4-1.8 1-.5-.6-1-1-1.8-1H1z"/>',c:'<path d="M8 1l6 2.2v4.9c0 3.4-2.5 6-6 6.9-3.5-.9-6-3.5-6-6.9V3.2z"/>',l:'<path d="M8 .8l2.1 4.9 5.1.5-3.9 3.4 1.2 5.1L8 12l-4.5 2.7 1.2-5.1L.8 6.2l5.1-.5z"/>',e:'<path d="M8 .5l5 7.5h-2.6l3.4 4.5H9v3H7v-3H2.2L5.6 8H3z"/>',w:'<path d="M2 15V6h2V3h2v3h1V2h2v4h1V3h2v3h2v9h-4v-4H6v4z"/>'};
const KIND={a:"Sala de aula",c:"Casa",l:"Local",e:"Exterior"};
const svgI=k=>`<svg viewBox="0 0 16 16">${ICON[k]}</svg>`;
const ringOf=t=>t.h?HOUSE[t.h][1]:null;
let useGI=true;
const icoHTML=(t,col)=>useGI&&t.gi?`<i class="gi game-icon game-icon-${t.gi}" ${col?`style="color:${col}"`:""}></i>`:(col?svgI(t.k).replace("<svg",`<svg style="fill:${col}"`):svgI(t.k));
const riHTML=t=>{const r=ringOf(t);return `<span class="ri" ${r?`style="border-color:${r}"`:""}>${icoHTML(t,r)}</span>`};

/* ===== alas ===== */
const SECTIONS={
 sino:{name:"Ala da Torre do Sino",main:"/f41",subs:["/f41","/f42","/f43"],layer:"castelo"},
 esc:{name:"Ala da Grande Escadaria",main:"/f35",subs:["/f35","/f36","/f37"],layer:"castelo"},
 rel:{name:"Anexos da Torre do Relógio",main:"/f31",subs:["/f31","/f33","/f32","/f34"],layer:"castelo"},
 ast:{name:"Anexos da Torre de Astronomia",main:"/f38",subs:["/f39","/f40"],layer:"castelo"},
 sub:{name:"Subsolo",main:"/f25",subs:["/f26","/f27","/f29","/f30"],layer:"subsolo"},
};
const secOf={};for(const id in SECTIONS)SECTIONS[id].subs.forEach(f=>secOf[f]=id);
const cnt=fs=>T.filter(t=>fs.includes(t.f)).length;
const where=t=>t.out?"Terrenos · "+FORUMS[t.f][0]:SECTIONS[secOf[t.f]].name+(SECTIONS[secOf[t.f]].main!==t.f?" · "+FORUMS[t.f][0]:"");

/* ===== desenho ===== */
const C={land:"#0d120d",land2:"#121812",water:"#0c1510",waterLine:"#2c4a31",forest:"#16261a",forestLine:"#244028",path:"#7B6E3D",wall:"#161a15",wallLine:"#6f6a58",label:"#e1c677"};
const lab=(x,y,t,s,o=1,w=700,col=C.label)=>`<text x="${x}" y="${y}" font-family="Montserrat,sans-serif" font-weight="${w}" font-size="${s}" fill="${col}" fill-opacity="${o}" text-anchor="middle" letter-spacing="${(s*.18).toFixed(1)}" style="paint-order:stroke;stroke:#080808;stroke-width:${(s*.22).toFixed(1)}px;stroke-linejoin:round;pointer-events:none">${t}</text>`;
let seed=9;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const oct=(x,y,r)=>{let d="";for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4;d+=(i?"L":"M")+(x+Math.cos(a)*r).toFixed(1)+","+(y+Math.sin(a)*r).toFixed(1)}return d+"Z"};
const WING={
 sino:["M580,400 H740 V540 H580 Z","M740,442 H760 V482 H740 Z"],
 esc:["M760,380 H880 V580 H760 Z","M812,288 H828 V380 H812 Z","M780,580 H860 V632 H780 Z"],
 rel:["M900,330 H1045 V452 H900 Z","M880,420 H900 V460 H880 Z"],
 ast:["M900,480 H1045 V600 H900 Z","M880,500 H900 V560 H880 Z"],
};
const TOW={sino:[[625,395,12,0,"/f41"],[595,435,16,0,"/f43"]],esc:[[783,368,24,"corv","/f37"],[850,415,14,0,"/f36"]],rel:[[960,315,26,"grif","/f34"],[1015,345,15,0,"/f31"],[928,392,10,0,"/f33"],[1032,430,10,0,"/f32"]],ast:[[935,588,12,0,"/f39"],[1005,615,20,0,"/f40"]]};
const SUBG=[["M590,470 H800 V600 L760,650 H590 Z","Masmorras",[695,486],0,"/f26"],["M592,588 H720 V646 H592 Z","Sonserina",[656,668],"sons","/f27"],["M840,420 H1025 V565 H840 Z","Porões",[932,440],0,"/f29"],["M900,488 H1022 V562 H900 Z","Lufa-Lufa",[961,582],"lufa","/f30"]];
const SECLAB={sino:[660,470],esc:[820,494],rel:[972,392],ast:[972,540]};
const CS=2.5,CX=98,CY=40,cp=([x,y])=>[CX+CS*(x-540),CY+CS*(y-280)];
const CT=`translate(${CX},${CY}) scale(${CS}) translate(-540,-280)`;
const NSS='vector-effect="non-scaling-stroke"';

/* divisórias internas com vão de porta */
function rooms(d){const m=d.match(/M(\d+),(\d+) H(\d+) V(\d+)/);if(!m)return"";const x1=+m[1],y1=+m[2],x2=+m[3],y2=+m[4];if(x2-x1<60)return"";let s="";
  const seg=(ax,ay,bx,by)=>{const L=Math.hypot(bx-ax,by-ay),g=7,at=.3+rnd()*.4;const mx=ax+(bx-ax)*at,my=ay+(by-ay)*at,ux=(bx-ax)/L*g/2,uy=(by-ay)/L*g/2;
    return `<line x1="${ax}" y1="${ay}" x2="${(mx-ux).toFixed(1)}" y2="${(my-uy).toFixed(1)}" ${NSS}/><line x1="${(mx+ux).toFixed(1)}" y1="${(my+uy).toFixed(1)}" x2="${bx}" y2="${by}" ${NSS}/>`};
  for(let i=0;i<5;i++){if(rnd()<.5){const x=Math.round(x1+16+rnd()*(x2-x1-32));s+=seg(x,y1,x,Math.round(y1+(y2-y1)*(.3+rnd()*.35)))}else{const y=Math.round(y1+16+rnd()*(y2-y1-32));s+=seg(x2,y,Math.round(x2-(x2-x1)*(.3+rnd()*.35)),y)}}
  return `<g stroke="#c4a459" stroke-opacity=".2" stroke-width="1.1" pointer-events="none">${s}</g>`}
/* parede de planta: sombra, piso, contorno escuro grosso e linha dourada fina */
function wallShape(d,fill,cls,col,extra=""){
  return `<path d="${d}" fill="#000" opacity=".55" transform="translate(1.2,2)" pointer-events="none"/>`+
   `<path class="f ${cls||""}" ${extra} d="${d}" fill="${fill}" stroke="#070707" stroke-width="7" ${NSS}/>`+
   `<path d="${d}" fill="url(#tile)" pointer-events="none"/>`+
   `<path class="g" d="${d}" fill="none" stroke="${col||"#c4a459"}" stroke-opacity=".55" stroke-width="1.3" ${NSS} pointer-events="none"/>`}
function towerShape(x,y,r,h,f){const col=h?HOUSE[h][1]:"#c4a459";
  return `<path d="${oct(x,y,r)}" fill="#000" opacity=".55" transform="translate(1.2,2)" pointer-events="none"/>`+
   `<path class="f tw" data-f="${f}" d="${oct(x,y,r)}" fill="${h?col+"33":"#161c15"}" stroke="#070707" stroke-width="7" ${NSS}/>`+
   `<path class="g" d="${oct(x,y,r)}" fill="none" stroke="${col}" stroke-opacity=".7" stroke-width="1.3" ${NSS} pointer-events="none"/>`+
   `<path d="${oct(x,y,r*.58)}" fill="none" stroke="${col}" stroke-opacity=".28" stroke-width="1" ${NSS} pointer-events="none"/>`+
   `<path d="M${x},${y-r*.2} L${x+r*.2},${y} L${x},${y+r*.2} L${x-r*.2},${y} Z" fill="${col}" fill-opacity=".55" pointer-events="none"/>`}
/* nome da ala: texto limpo e centralizado, com a quantidade embaixo */
function plaque(x,y,lines,s,sub){const lh=s*1.3,total=lines.length*lh+(sub?s*1.5:0),y0=y-total/2+s*.9;
  const st=`paint-order:stroke;stroke:#0a0d0a;stroke-width:${(s*.35).toFixed(2)}px;stroke-linejoin:round`;
  let o=`<g pointer-events="none">`;
  lines.forEach((l,i)=>o+=`<text x="${x}" y="${(y0+lh*i).toFixed(1)}" font-family="Montserrat,sans-serif" font-weight="700" font-size="${s}" fill="#e1c677" text-anchor="middle" letter-spacing="${(s*.14).toFixed(2)}" style="${st}">${l}</text>`);
  if(sub)o+=`<text x="${x}" y="${(y0+lh*(lines.length-1)+s*1.5).toFixed(1)}" font-family="Poppins,sans-serif" font-weight="500" font-size="${(s*.72).toFixed(2)}" fill="#8a8a8a" text-anchor="middle" letter-spacing="${(s*.06).toFixed(2)}" style="${st}">${sub}</text>`;
  return o+"</g>"}
const split2=t=>{const w=t.split(" ");if(t.length<14)return[t];const mid=Math.ceil(w.length/2);return[w.slice(0,mid).join(" "),w.slice(mid).join(" ")]};

function svgWrap(inner){return `<svg viewBox="0 0 1600 1000" xmlns="http://www.w3.org/2000/svg"><defs>
 <pattern id="wv" width="44" height="18" patternUnits="userSpaceOnUse"><path d="M2 9 q9 -6 18 0 t18 0" fill="none" stroke="${C.waterLine}" stroke-opacity=".6" stroke-width="1.3"/></pattern>
 <pattern id="ht" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="4" stroke="#c4a459" stroke-opacity=".16" stroke-width=".7"/></pattern>
 <pattern id="tile" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M6 0H0V6" fill="none" stroke="#c4a459" stroke-opacity=".07" stroke-width=".4"/></pattern>
 <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#c4a459" stroke-opacity=".045"/></pattern>
 <linearGradient id="wf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#172016"/><stop offset="1" stop-color="#0e120e"/></linearGradient>
 <radialGradient id="vg" cx="50%" cy="50%" r="70%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>
 <radialGradient id="glow"><stop offset="0" stop-color="#538353" stop-opacity=".22"/><stop offset="1" stop-color="#538353" stop-opacity="0"/></radialGradient>
</defs>${inner}<rect width="1600" height="1000" fill="url(#vg)" pointer-events="none"/><rect x=".5" y=".5" width="1599" height="999" fill="none" stroke="#313131"/></svg>`}
function rose(x,y,r){return `<g transform="translate(${x},${y})" opacity=".75"><path d="${oct(0,0,r)}" fill="none" stroke="#c4a459" stroke-opacity=".5"/><path d="M0,${-r*1.25} L${r*.15},0 L0,${r*1.25} L${-r*.15},0 Z" fill="#c4a459"/><path d="M${-r*1.25},0 L0,${-r*.12} L${r*1.25},0 L0,${r*.12} Z" fill="#c4a459" opacity=".5"/>${lab(0,-r*1.42,"N",r*.42)}</g>`}

function groundsSVG(){
  seed=9;let s=`<rect width="1600" height="1000" fill="${C.land}"/><rect width="1600" height="1000" fill="url(#grid)"/>`;
  for(let i=0;i<13;i++){const x=80+i*120,h=55+rnd()*45;s+=`<path d="M${x-70},150 L${x},${150-h} L${x+70},150 Z" fill="#131813" stroke="#2a3324" stroke-width="1.5"/>`}
  const lake="M180,760 C300,715 560,740 820,728 C1000,718 1200,750 1330,800 C1400,860 1330,960 1150,975 C900,995 520,990 260,960 C140,930 110,820 180,760 Z";
  s+=`<path d="${lake}" fill="${C.water}"/><path d="${lake}" fill="url(#wv)"/><path d="${lake}" fill="none" stroke="${C.waterLine}" stroke-width="2.5"/>`;
  const fo=[[1150,90],[1590,60],[1590,960],[1330,800],[1270,690],[1190,620],[1180,500],[1160,380],[1170,220]];
  const inP=(x,y)=>{let c=false;for(let i=0,j=fo.length-1;i<fo.length;j=i++){const[xi,yi]=fo[i],[xj,yj]=fo[j];if((yi>y)!=(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c}return c};
  s+=`<polygon points="${fo.map(p=>p.join(",")).join(" ")}" fill="#0b130c"/>`;
  for(let i=0;i<650;i++){const x=1140+rnd()*450,y=70+rnd()*890;if(inP(x,y))s+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(7+rnd()*7).toFixed(1)}" fill="${C.forest}" stroke="${C.forestLine}" stroke-width="1.2"/>`}
  s+=`<ellipse cx="1470" cy="215" rx="70" ry="38" fill="${C.water}" stroke="${C.waterLine}" stroke-width="2"/><ellipse cx="1470" cy="215" rx="70" ry="38" fill="url(#wv)"/>`;
  s+=`<ellipse cx="1415" cy="462" rx="54" ry="40" fill="${C.land2}" stroke="#3a4a34" stroke-dasharray="5 5"/>`;
  s+=`<path d="M1340,90 C1320,300 1350,520 1400,760" fill="none" stroke="${C.path}" stroke-opacity=".6" stroke-dasharray="10 8" stroke-width="2"/>`;
  for(let i=0;i<110;i++){const x=40+rnd()*1100,y=170+rnd()*560;if(x>520&&x<1110&&y>260&&y<680)continue;if(x>170&&x<430&&y>170&&y<340)continue;s+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(4+rnd()*4).toFixed(1)}" fill="${C.forest}" stroke="${C.forestLine}"/>`}
  ["M820,640 C820,690 830,700 830,720 C840,750 900,740 925,750","M820,300 C760,250 600,240 420,270","M600,560 C560,600 520,620 505,640","M600,420 C540,390 500,370 470,360","M1060,470 L1130,470 C1160,520 1160,560 1160,575","M1130,470 C1170,420 1200,420 1215,420","M820,300 C900,250 1050,240 1100,250","M400,320 C380,400 300,560 400,700 C500,760 620,770 720,780"].forEach(d=>s+=`<path d="${d}" fill="none" stroke="${C.path}" stroke-opacity=".75" stroke-dasharray="3 8" stroke-width="2.4" stroke-linecap="round"/>`);
  s+=`<ellipse cx="300" cy="250" rx="120" ry="72" fill="#13200f" stroke="#3d5a33" stroke-width="2.5"/><ellipse cx="300" cy="250" rx="100" ry="55" fill="none" stroke="#2d4426"/>`;
  [[205,250],[395,250]].forEach(([x,y])=>[-14,0,14].forEach(d=>s+=`<circle cx="${x}" cy="${y+d}" r="4" fill="none" stroke="#c4a459" stroke-opacity=".7" stroke-width="1.6"/>`));
  [[470,625],[505,655],[540,625]].forEach(([x,y])=>s+=`<rect x="${x-16}" y="${y-9}" width="32" height="18" fill="#17281a" stroke="#538353" stroke-width="1.6"/>`);
  s+=`<path d="${oct(470,360,14)}" fill="${C.wall}" stroke="${C.wallLine}" stroke-width="1.6"/>`;
  for(let i=0;i<10;i++){const a=i/10*Math.PI*2;s+=`<rect x="${(1125+Math.cos(a)*24-3).toFixed(1)}" y="${(250+Math.sin(a)*24-4).toFixed(1)}" width="6" height="8" fill="#6f6a58"/>`}
  s+=`<rect x="1146" y="574" width="26" height="20" fill="#221c12" stroke="#7B6E3D"/><rect x="910" y="742" width="30" height="16" fill="#221c12" stroke="#7B6E3D"/><rect x="1220" y="822" width="30" height="22" fill="#221c12" stroke="#7B6E3D"/><rect x="1040" y="463" width="95" height="14" fill="${C.wall}" stroke="${C.wallLine}"/>`;
  s+=`<ellipse cx="820" cy="460" rx="320" ry="240" fill="url(#glow)"/>`;
  let c="";Object.values(WING).flat().forEach(d=>c+=`<path class="f" d="${d}" fill="${C.wall}" stroke="${C.wallLine}" stroke-width="2"/>`);
  Object.values(TOW).flat().forEach(([x,y,r])=>c+=`<path class="f" d="${oct(x,y,r)}" fill="#1c211b" stroke="${C.wallLine}" stroke-width="2"/>`);
  s+=`<g class="rg" data-go="castelo" data-tip="Castelo de Hogwarts" data-sub="${cnt(Object.values(SECTIONS).flatMap(x=>x.subs))} locais · clique para entrar" tabindex="0" role="button" aria-label="Entrar no castelo"><rect x="560" y="270" width="500" height="380" fill="transparent"/>${c}</g>`;
  s+=lab(820,250,"CASTELO DE HOGWARTS",20)+lab(300,158,"CAMPO DE QUADRIBOL",15)+lab(770,880,"LAGO NEGRO",28,.8)+lab(1262,140,"FLORESTA PROIBIDA",19)+lab(1470,122,"ARREDORES",15)+lab(530,712,"TERRENOS",13,.75)+rose(110,880,40);
  return svgWrap(s);
}
function castleSVG(layer,act){
  seed=4;let g="";
  if(layer==="castelo"){
    for(const id of ["sino","esc","rel","ast"]){
      const S=SECTIONS[id],on=id===act;let inner="";
      WING[id].forEach((d,i)=>{inner+=wallShape(d,id==="esc"&&i===2?"url(#ht)":"url(#wf)");inner+=rooms(d)});
      TOW[id].forEach(([x,y,r,h,f])=>inner+=towerShape(x,y,r,h,f));
      g+=`<g class="rg ${act?(on?"act":"dimw"):""}" data-go="sec:${id}" data-id="${id}" data-tip="${S.name}" data-sub="${cnt(S.subs)} locais${S.subs.length>1?" · "+S.subs.filter(f=>f!==S.main).map(f=>FORUMS[f][0]).join(", "):""}" tabindex="0" role="button" aria-label="${S.name}">${inner}</g>`;
      if(!act){const [lx,ly]=SECLAB[id];g+=plaque(lx,ly,split2(S.name.toUpperCase()),id==="esc"?6.6:8.6,cnt(S.subs)+" LOCAIS")}
    }
  }else{
    Object.values(WING).flat().forEach(d=>g+=`<path d="${d}" fill="none" stroke="#c4a459" stroke-opacity=".14" stroke-dasharray="4 5" stroke-width="1.2" ${NSS}/>`);
    let inner="";SUBG.forEach(([d,n,p,h,f])=>{inner+=wallShape(d,h?HOUSE[h][1]+"26":"url(#wf)","tw",h?HOUSE[h][1]:null,`data-f="${f}"`);inner+=rooms(d)});
    g+=`<g class="rg ${act?"act":""}" data-go="sec:sub" data-id="sub" data-tip="Subsolo" data-sub="${cnt(SECTIONS.sub.subs)} locais · Masmorras e Porões" tabindex="0" role="button" aria-label="Subsolo">${inner}</g>`;
    if(!act)SUBG.forEach(([d,n,p,h,f])=>g+=plaque(p[0],p[1],[n.toUpperCase()],6.4,cnt([f])+(cnt([f])>1?" LOCAIS":" LOCAL")));
  }
  return svgWrap(`<rect width="1600" height="1000" fill="#0b0d0b"/><rect width="1600" height="1000" fill="url(#grid)"/><ellipse cx="800" cy="520" rx="640" ry="420" fill="url(#glow)"/><g transform="${CT}">${g}</g>`+rose(1490,890,34));
}

/* ===== estado ===== */
const vp=$("vp"),stage=$("stage"),bg=$("bg"),pinsEl=$("pins"),levels=$("levels"),tip=$("tip"),hint=$("hint"),ls=$("ls"),side=$("side");
let view={type:"grounds"},z=1,tx=0,ty=0,focusF=null,mode="here";
const SW=1600,SH=1000;
const W=()=>wrap.clientWidth,H=()=>wrap.clientHeight,narrow=()=>W()<=860;
const HR=()=>wrap.getBoundingClientRect();
const rel=r=>{const h=HR();return{left:r.left-h.left,right:r.right-h.left,top:r.top-h.top,bottom:r.bottom-h.top,width:r.width,height:r.height}};
const stagePos=t=>t.out?[t.p[0],t.p[1]]:cp(t.p);
const inView=t=>view.type==="grounds"?t.out:view.type==="sec"?secOf[t.f]===view.id:false;
const modeOk=t=>mode==="aulas"?t.k==="a":mode==="casas"?t.k==="c":true;

function makePin(t,i){
  const [x,y]=stagePos(t);const p=document.createElement("div");p.className="pin pop";p.style.left=x/SW*100+"%";p.style.top=y/SH*100+"%";p.style.setProperty("--d",(i*.03).toFixed(2)+"s");
  const ring=ringOf(t);
  p.innerHTML=`<div class="b" role="button" tabindex="0" aria-label="${t.n}" ${ring?`style="border-color:${ring}"`:""}>${icoHTML(t,ring)}</div><div class="l">${t.n}</div>`;
  t.lab=p.lastChild;t.lw=0;
  const b=p.firstChild;
  b.addEventListener("click",e=>{e.stopPropagation();if(!dragged)select(t)});
  b.addEventListener("dblclick",e=>{e.stopPropagation();window.open(BASE+t.u+"-","_blank","noopener")});
  b.addEventListener("keydown",e=>{if(e.key==="Enter")select(t)});
  t.lab.addEventListener("click",e=>{e.stopPropagation();if(!dragged)select(t)});
  t.lab.addEventListener("pointerdown",e=>e.stopPropagation());
  b.addEventListener("pointerenter",()=>hot(t,true));b.addEventListener("pointerleave",()=>hot(t,false));
  p.addEventListener("animationend",()=>p.classList.remove("pop"),{once:true});
  setTimeout(()=>p.classList.remove("pop"),1200+i*30);
  t.el=p;pinsEl.appendChild(p);
}
function hot(t,on){if(t.el){t.el.classList.toggle("hot",on);placeLabels()}if(t.li){t.li.classList.toggle("hot",on);if(on)t.li.scrollIntoView({block:"nearest"})}}
function dims(){T.forEach(t=>{if(t.el)t.el.classList.toggle("dim",(!!focusF&&t.f!==focusF)||!modeOk(t))});placeLabels()}

function render(v,opts={}){
  const prev=view;view=v;closeCard();tip.classList.remove("show");focusF=null;
  const layerOf=x=>x.type==="castle"?x.layer:x.type==="sec"?SECTIONS[x.id].layer:"g";
  const sameBg=layerOf(prev)===layerOf(v)&&v.type!=="grounds";
  const draw=()=>{pinsEl.innerHTML="";T.forEach(t=>t.el=null);
    bg.innerHTML=v.type==="grounds"?groundsSVG():castleSVG(layerOf(v),v.type==="sec"?v.id:null);
    T.filter(inView).forEach((t,i)=>makePin(t,i));
    wireRegions();chrome();buildList();dims()};
  if(sameBg||opts.instant){draw();fitView(!!opts.instant);if(opts.then)setTimeout(opts.then,opts.instant?0:500);return}
  const go=()=>{stage.classList.add("fade");setTimeout(()=>{draw();fitView(true);
      if(prev.type==="grounds"){const z0=z,x0=tx,y0=ty;z=z0*.8;tx=x0+SW*z0*.1;ty=y0+SH*z0*.1;apply();stage.classList.remove("fade");animTo(z0,x0,y0,500)}
      else stage.classList.remove("fade");
      if(opts.then)setTimeout(opts.then,540)},200)};
  if(prev.type==="grounds"&&v.type!=="grounds"){fitBox(560,270,500,380,false,360);setTimeout(go,320)}else go();
}
function wireRegions(){
  bg.querySelectorAll(".rg").forEach(g=>{
    const goto=()=>{const d=g.dataset.go;if(d==="castelo")render({type:"castle",layer:"castelo"});else{const id=d.slice(4);if(!(view.type==="sec"&&view.id===id))render({type:"sec",id})}};
    g.addEventListener("click",e=>{e.stopPropagation();if(!dragged)goto()});
    g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();goto()}});
    g.addEventListener("pointerenter",()=>{if(g.classList.contains("act"))return;tip.innerHTML=`${g.dataset.tip}<small>${g.dataset.sub}</small>`;tip.classList.add("show");const li=ls.querySelector(`[data-sec="${g.dataset.id||g.dataset.go}"]`);li&&li.classList.add("hot")});
    g.addEventListener("pointermove",e=>{tip.style.left=e.clientX+"px";tip.style.top=e.clientY+"px"});
    g.addEventListener("pointerleave",()=>{tip.classList.remove("show");ls.querySelectorAll(".it.hot").forEach(x=>x.classList.remove("hot"))});
  });
}
const hotArea=(f,on)=>bg.querySelectorAll(`.tw[data-f="${f}"]`).forEach(e=>e.classList.toggle("hot",on));

/* ===== cabeçalho, níveis, dica ===== */
function chrome(){
  const cr=$("crumbs"),vt=$("vt"),back=$("back");
  const parts=[["Hogwarts",()=>render({type:"grounds"})]];
  if(view.type!=="grounds")parts.push(["Castelo",()=>render({type:"castle",layer:view.type==="sec"?SECTIONS[view.id].layer:view.layer})]);
  if(view.type==="sec")parts.push([SECTIONS[view.id].name,()=>setFocus(null)]);
  cr.innerHTML="";parts.forEach(([n,fn],i)=>{if(i){const s=document.createElement("span");s.className="s";s.textContent="/";cr.appendChild(s)}const b=document.createElement("button");b.textContent=n;b.onclick=fn;cr.appendChild(b)});
  vt.textContent=view.type==="grounds"?"Terrenos de Hogwarts":view.type==="castle"?(view.layer==="subsolo"?"Castelo · Subsolo":"Castelo"):SECTIONS[view.id].name;
  back.hidden=view.type==="grounds";
  back.onclick=()=>{if(view.type==="sec")render({type:"castle",layer:SECTIONS[view.id].layer});else render({type:"grounds"})};
  levels.innerHTML="";
  const mk=(label,c,on,fn,sw,f)=>{const b=document.createElement("button");if(on)b.className="on";b.innerHTML=`${sw?`<span class="sw" style="background:${sw}"></span>`:""}<span>${label}</span><span class="c">${c}</span>`;b.onclick=fn;if(f!==undefined){b.dataset.f=f||"";if(f){b.onpointerenter=()=>hotArea(f,true);b.onpointerleave=()=>hotArea(f,false)}}levels.appendChild(b)};
  const nivel=layer=>{levels.insertAdjacentHTML("beforeend",`<div class="h">NÍVEL</div>`);
    mk("Castelo",cnt(["sino","esc","rel","ast"].flatMap(i=>SECTIONS[i].subs)),layer==="castelo",()=>render({type:"castle",layer:"castelo"}));
    mk("Subsolo",cnt(SECTIONS.sub.subs),layer==="subsolo",()=>render({type:"castle",layer:"subsolo"}))};
  if(view.type==="castle")nivel(view.layer);
  else if(view.type==="sec"){const S=SECTIONS[view.id];nivel(S.layer);
    levels.insertAdjacentHTML("beforeend",`<div class="h">ÁREAS</div>`);
    mk("Tudo",cnt(S.subs),true,()=>setFocus(null),null,null);
    S.subs.forEach(f=>{const c=cnt([f]);if(c)mk(FORUMS[f][0],c,false,()=>setFocus(f),FHOUSE[f]?HOUSE[FHOUSE[f]][1]:null,f)})}
  hint.textContent=view.type==="grounds"?"CLIQUE NO CASTELO PARA ENTRAR":view.type==="sec"?"CLIQUE NUM ÍCONE PARA VER O TÓPICO":"";
  hint.style.display=hint.textContent?"":"none";
  layoutUI();
}
function mapLeft(){if(narrow())return 16;return side.classList.contains("closed")?76:rel(side.getBoundingClientRect()).right+20}
function layoutUI(){wrap.classList.toggle("narrow",narrow());const l=mapLeft();levels.style.left=(narrow()?14:l)+"px";
  levels.style.top=(narrow()?rel(root.querySelector(".top").getBoundingClientRect()).bottom+4:92)+"px";
  hint.style.left=(l+(W()-l)/2)+"px";hint.style.visibility=W()-l<620?"hidden":"visible"}

/* ===== painel lateral com abas ===== */
const TABS=[["here","Aqui"],["aulas","Aulas"],["casas","Casas"],["todos","Todos"]];
const tabsEl=$("tabs");
function drawTabs(){tabsEl.innerHTML="";const counts={here:null,aulas:T.filter(t=>t.k==="a").length,casas:T.filter(t=>t.k==="c").length,todos:T.length};
  TABS.forEach(([id,n])=>{const b=document.createElement("button");b.className="tab"+(mode===id?" on":"");b.textContent=n;if(counts[id]!=null)b.title=counts[id]+" locais";b.onclick=()=>{mode=id;drawTabs();buildList();dims()};tabsEl.appendChild(b)});
  const c=document.createElement("button");c.className="collapse";c.title="Esconder lista";c.setAttribute("aria-label","Esconder lista");c.textContent="‹";c.onclick=()=>toggleSide(false);tabsEl.appendChild(c)}
function item(t,sub){const b=document.createElement("button");b.className="it"+(sel===t?" sel":"");
  b.innerHTML=`${riHTML(t)}<span>${t.n}${sub?`<small>${sub}</small>`:""}</span><a class="open" href="${BASE+t.u}-" target="_blank" rel="noopener" title="Abrir tópico" aria-label="Abrir o tópico ${t.n}">↗</a>`;
  b.querySelector(".open").addEventListener("click",e=>e.stopPropagation());
  b.onclick=()=>{if(inView(t))flyTo(t);else go(t);if(narrow())side.classList.add("closed")};
  b.onpointerenter=()=>{if(inView(t))hot(t,true)};b.onpointerleave=()=>{if(inView(t))hot(t,false)};
  if(inView(t))t.li=b;return b}
function navItem(icon,title,sub,fn,key){const b=document.createElement("button");b.className="it";if(key)b.dataset.sec=key;b.innerHTML=`<span class="ri">${useGI?'<i class="gi game-icon game-icon-castle"></i>':svgI(icon)}</span><span>${title}<small>${sub}</small></span><span class="go">›</span>`;b.onclick=fn;return b}
function gh(text,n,sw,f){const h=document.createElement("div");h.className="gh"+(f?" click":"");h.innerHTML=`${sw?`<span class="sw" style="background:${sw}"></span>`:""}<span>${text}</span><span class="n">${n}</span>`;
  if(f){h.onclick=()=>setFocus(focusF===f?null:f);h.onpointerenter=()=>hotArea(f,true);h.onpointerleave=()=>hotArea(f,false)}return h}
function buildList(){
  ls.innerHTML="";T.forEach(t=>t.li=null);const sh=$("sh");
  if(mode==="aulas"){
    sh.innerHTML=`<strong>Salas de aula</strong>Clique para ir até a sala.`;
    const groups={};T.filter(t=>t.k==="a").forEach(t=>{const g=t.out?"Terrenos":SECTIONS[secOf[t.f]].name;(groups[g]=groups[g]||[]).push(t)});
    Object.entries(groups).forEach(([g,ts])=>{ls.appendChild(gh(g,ts.length));ts.forEach(t=>ls.appendChild(item(t)))});
  }else if(mode==="casas"){
    sh.innerHTML=`<strong>Casas</strong>Salões comunais e dormitórios.`;
    Object.entries(HOUSE).forEach(([k,[n,col]])=>{const ts=T.filter(t=>t.h===k);const box=document.createElement("div");box.className="house";box.style.setProperty("--hc",col);box.style.setProperty("--hb",col+"2e");
      box.innerHTML=`<div class="hh">${n}<small>${FORUMS[ts[0].f][0]}</small></div>`;
      ts.forEach(t=>box.appendChild(item(t)));ls.appendChild(box)});
  }else if(mode==="todos"){
    sh.innerHTML=`<strong>Índice completo</strong>`;
    const order=[["Terrenos",GROUND],...Object.values(SECTIONS).map(S=>[S.name,S.subs])];
    order.forEach(([g,fs])=>{const ts=T.filter(t=>fs.includes(t.f));ls.appendChild(gh(g,ts.length));
      ts.forEach(t=>{const showSub=!t.out&&SECTIONS[secOf[t.f]].main!==t.f;ls.appendChild(item(t,showSub?FORUMS[t.f][0]:""))})});
  }else{
    if(view.type==="castle"){
      const ids=view.layer==="subsolo"?["sub"]:["sino","esc","rel","ast"];
      sh.innerHTML=`<strong>${view.layer==="subsolo"?"Subsolo":"Alas do castelo"}</strong>Escolha uma ala no mapa ou na lista.`;
      ids.forEach(id=>{const S=SECTIONS[id];const b=navItem("w",S.name,`${cnt(S.subs)} locais${S.subs.length>1?" · "+S.subs.filter(f=>f!==S.main).map(f=>FORUMS[f][0]).join(", "):""}`,()=>render({type:"sec",id}),id);
        b.onpointerenter=()=>bg.querySelector(`.rg[data-id="${id}"]`)?.classList.add("hot");b.onpointerleave=()=>bg.querySelector(`.rg[data-id="${id}"]`)?.classList.remove("hot");ls.appendChild(b)});
      ls.appendChild(gh("Outro nível",""));
      ls.appendChild(view.layer==="subsolo"?navItem("w","Castelo","As quatro alas",()=>render({type:"castle",layer:"castelo"})):navItem("w","Subsolo","Masmorras, porões, Sonserina e Lufa-Lufa",()=>render({type:"castle",layer:"subsolo"})));
      return;
    }
    const list=T.filter(inView);
    if(view.type==="grounds"){
      sh.innerHTML=`<strong>Terrenos</strong>${list.length} locais fora do castelo.`;
      const cb=navItem("w","Castelo de Hogwarts",`${cnt(Object.values(SECTIONS).flatMap(x=>x.subs))} locais · entrar`,()=>render({type:"castle",layer:"castelo"}),"castelo");
      cb.onpointerenter=()=>bg.querySelector('.rg[data-go="castelo"]')?.classList.add("hot");cb.onpointerleave=()=>bg.querySelector('.rg[data-go="castelo"]')?.classList.remove("hot");ls.appendChild(cb);
      GROUND.forEach(f=>{const ts=list.filter(t=>t.f===f);ls.appendChild(gh(FORUMS[f][0],ts.length));ts.forEach(t=>ls.appendChild(item(t)))});
    }else{
      const S=SECTIONS[view.id];sh.innerHTML=`<strong>${S.name}</strong>${list.length} locais. Clique no nome de uma área para focar nela.`;
      S.subs.forEach(f=>{const ts=list.filter(t=>t.f===f);if(!ts.length)return;ls.appendChild(gh(FORUMS[f][0],ts.length,FHOUSE[f]?HOUSE[FHOUSE[f]][1]:null,f));ts.forEach(t=>ls.appendChild(item(t)))});
    }
  }
}
function setFocus(f,instant){
  focusF=f;closeCard();
  levels.querySelectorAll("button").forEach(b=>{if(b.dataset.f!==undefined)b.classList.toggle("on",(b.dataset.f||null)===f)});
  bg.querySelectorAll(".tw").forEach(e=>e.classList.toggle("hot",!!f&&e.dataset.f===f));
  dims();
  if(f)boxAround(T.filter(t=>t.f===f).map(stagePos),instant);else fitView(instant);
}
function boxAround(pts,instant,pad=90,mark){const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);const x1=Math.min(...xs)-pad,x2=Math.max(...xs)+pad,y1=Math.min(...ys)-pad,y2=Math.max(...ys)+pad*1.25;fitBox(x1,y1,x2-x1,y2-y1,instant,480,mark)}
function fitView(instant){
  if(view.type==="sec"){const pts=T.filter(t=>secOf[t.f]===view.id).map(stagePos);
    if(view.id!=="sub")WING[view.id].forEach(d=>{const n=d.match(/[\d.]+/g).map(Number);for(let i=0;i<n.length-1;i+=2)pts.push(cp([n[i],n[i+1]]))});
    boxAround(pts,instant,70,true)}
  else if(view.type==="castle"){
    /* só a planta do castelo (com torres e nomes), não o mapa inteiro */
    const b=view.layer==="subsolo"?[[578,405],[1035,680]]:[[565,280],[1065,648]];
    const [x1,y1]=cp(b[0]),[x2,y2]=cp(b[1]);fitBox(x1,y1,x2-x1,y2-y1,instant,480,true)}
  else fitBox(0,0,SW,SH,instant,480,true);
}

/* ===== câmera (zoom travado no enquadramento da vista) ===== */
let anim=null,baseZ=1,lastFit=[0,0,1600,1000];const MAXZ=3.5;
const shrink=()=>Math.max(.55,Math.min(1,z/baseZ));
function apply(){stage.style.transform=`translate(${tx}px,${ty}px) scale(${z})`;stage.style.setProperty("--inv",(shrink()/z).toFixed(4));placeLabels();positionCard()}
function area(){const w=W(),h=H(),n=narrow();const l=mapLeft();
  const lv=levels.childElementCount?rel(levels.getBoundingClientRect()).bottom:rel(root.querySelector(".top").getBoundingClientRect()).bottom;
  const t=Math.max(lv,n?0:76)+12;const b=n?(side.classList.contains("closed")?64:h*.52+12):58;const r=n?14:22;
  return{x:l,y:t,w:Math.max(160,w-l-r),h:Math.max(160,h-t-b)}}
function clampPan(){const A=area(),[x,y,w,h]=lastFit;const cx=A.x+A.w/2,cy=A.y+A.h/2;
  const l=tx+x*z,r=tx+(x+w)*z,t=ty+y*z,b=ty+(y+h)*z;
  if(r-l<=A.w){tx+=cx-(l+r)/2}else{if(l>A.x)tx-=l-A.x;if(r<A.x+A.w)tx+=A.x+A.w-r}
  if(b-t<=A.h){ty+=cy-(t+b)/2}else{if(t>A.y)ty-=t-A.y;if(b<A.y+A.h)ty+=A.y+A.h-b}}
function fitBox(x,y,w,h,instant,ms=480,mark){const A=area();const nz=Math.min(A.w/w,A.h/h,3.2);if(mark){baseZ=nz;lastFit=[x,y,w,h]}
  animTo(nz,A.x+(A.w-w*nz)/2-x*nz,A.y+(A.h-h*nz)/2-y*nz,instant?0:ms)}
let animId=0;
function animTo(nz,nx,ny,ms){cancelAnimationFrame(anim);const id=++animId;if(!ms){z=nz;tx=nx;ty=ny;apply();return}const s=[z,tx,ty],t0=performance.now();
  const st=n=>{if(id!==animId)return;const p=Math.min(1,(n-t0)/ms),e=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;z=s[0]+(nz-s[0])*e;tx=s[1]+(nx-s[1])*e;ty=s[2]+(ny-s[2])*e;apply();if(p<1)anim=requestAnimationFrame(st)};anim=requestAnimationFrame(st);
  /* garantia: se o navegador pausar a animação, vai direto para o final */
  setTimeout(()=>{if(id===animId&&(z!==nz||tx!==nx||ty!==ny)){cancelAnimationFrame(anim);z=nz;tx=nx;ty=ny;apply()}},ms+200)}
function zoomAt(f,cx,cy){cancelAnimationFrame(anim);const nz=Math.max(baseZ,Math.min(baseZ*MAXZ,z*f));if(Math.abs(nz-z)<1e-6)return false;tx=cx-(cx-tx)*nz/z;ty=cy-(cy-ty)*nz/z;z=nz;clampPan();apply();return true}
/* roda do mouse: só segura a rolagem da página quando o zoom realmente muda */
vp.addEventListener("wheel",e=>{const h=HR();if(zoomAt(Math.exp(-e.deltaY*.0015),e.clientX-h.left,e.clientY-h.top))e.preventDefault()},{passive:false});
const ptrs=new Map();let pinch=null,moved=0,dragged=false;
vp.addEventListener("pointerdown",e=>{ptrs.set(e.pointerId,[e.clientX,e.clientY]);moved=0;dragged=false;cancelAnimationFrame(anim)});
vp.addEventListener("pointermove",e=>{if(!ptrs.has(e.pointerId))return;const pv=ptrs.get(e.pointerId);ptrs.set(e.pointerId,[e.clientX,e.clientY]);
  if(ptrs.size===2){const[a,b]=[...ptrs.values()];const d=Math.hypot(a[0]-b[0],a[1]-b[1]);const h=HR();if(pinch)zoomAt(d/pinch,(a[0]+b[0])/2-h.left,(a[1]+b[1])/2-h.top);pinch=d;dragged=true;return}
  const dx=e.clientX-pv[0],dy=e.clientY-pv[1];moved+=Math.abs(dx)+Math.abs(dy);if(moved>5){dragged=true;vp.classList.add("drag");tip.classList.remove("show");tx+=dx;ty+=dy;clampPan();apply()}});
const up=e=>{ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=null;if(!ptrs.size)vp.classList.remove("drag")};
vp.addEventListener("pointerup",up);vp.addEventListener("pointercancel",up);
vp.addEventListener("click",()=>{if(!dragged)closeCard()});
const cz=()=>{const A=area();return[A.x+A.w/2,A.y+A.h/2]};
$("zin").onclick=()=>zoomAt(1.35,...cz());
$("zout").onclick=()=>zoomAt(1/1.35,...cz());
$("zfit").onclick=()=>{if(view.type==="sec"&&focusF)setFocus(focusF);else fitView()};
const refit=()=>{layoutUI();if(view.type==="sec"&&focusF)setFocus(focusF,true);else fitView(true)};
let rt=0;const refitSoon=()=>{clearTimeout(rt);rt=setTimeout(refit,60)};
if(window.ResizeObserver)new ResizeObserver(refitSoon).observe(host);else addEventListener("resize",refitSoon);
const toggleSide=open=>{side.classList.toggle("closed",!open);setTimeout(refit,260)};
$("sidetoggle").onclick=()=>toggleSide(true);
const setFull=on=>{host.classList.toggle("full",on);$("full").textContent=on?"✕":"⛶";$("full").title=on?"Sair da tela cheia":"Tela cheia";document.documentElement.style.overflow=on?"hidden":"";setTimeout(refit,30)};
$("full").onclick=()=>setFull(!host.classList.contains("full"));

/* nomes ligados por padrão, sem sobrepor */
let showNames=true;try{showNames=localStorage.getItem("arcane-nomes")!=="0"}catch(e){}
function placeLabels(){
  const k=shrink(),inv=k/z,far=z<baseZ*.82,placed=[],pins=T.filter(t=>t.el&&!t.el.classList.contains("dim"));
  const pos=t=>{const [x,y]=stagePos(t);return[tx+x*z,ty+y*z]};
  pins.forEach(t=>{const [sx,sy]=pos(t);placed.push([sx-17*k,sy-17*k,sx+17*k,sy+17*k])});
  const order=[...pins].sort((a,b)=>(b===sel)-(a===sel)||(b.el.classList.contains("hot"))-(a.el.classList.contains("hot")));
  const hit=r=>placed.some(o=>r[0]<o[2]&&r[2]>o[0]&&r[1]<o[3]&&r[3]>o[1]);
  order.forEach(t=>{const L=t.lab;if(!t.lw){t.lw=L.offsetWidth;t.lh=L.offsetHeight}
    const w=t.lw*k,h=t.lh*k,[sx,sy]=pos(t),g=20*k;
    const cand=[[-w/2,g],[-w/2,-g-h],[g,-h/2],[-g-w,-h/2]];
    let pick=null;for(const [dx,dy] of cand){const r=[sx+dx-3,sy+dy-3,sx+dx+w+3,sy+dy+h+3];if(!hit(r)){pick=[dx,dy,r];break}}
    const force=t===sel||t.el.classList.contains("hot");
    if(!pick&&force)pick=[cand[0][0],cand[0][1],null];
    if(far&&!force)pick=null;
    if(pick){L.style.transform=`scale(${inv}) translate(${pick[0]/k}px,${pick[1]/k}px)`;if(pick[2])placed.push(pick[2])}
    else L.style.transform=`scale(${inv}) translate(${cand[0][0]/k}px,${cand[0][1]/k}px)`;
    t.el.classList.toggle("lv",!!pick&&(showNames||force));
  });
}
function setNames(on){showNames=on;const b=$("nmb");b.classList.toggle("on",on);b.setAttribute("aria-pressed",on);try{localStorage.setItem("arcane-nomes",on?"1":"0")}catch(e){}placeLabels()}
$("nmb").onclick=()=>setNames(!showNames);$("nmb").classList.toggle("on",showNames);

/* ===== cartão ===== */
let sel=null;const card=$("card");
function select(t){
  if(sel){sel.el&&sel.el.classList.remove("sel");sel.li&&sel.li.classList.remove("sel")}
  sel=t;t.el&&t.el.classList.add("sel");t.li&&t.li.classList.add("sel");
  $("ccr").textContent=crumb(t.f).join(" · ");
  $("cn").textContent=t.n;
  $("cm").textContent=KIND[t.k]+(t.h?" · "+HOUSE[t.h][0]:"");
  $("ca").href=BASE+t.u+"-";
  card.classList.add("show");placeLabels();positionCard();
}
function flyTo(t){if(t.el&&t.el.classList.contains("dim")&&focusF&&t.f!==focusF)setFocus(null,true);
  const [x,y]=stagePos(t);const A=area();const nz=Math.min(baseZ*MAXZ,Math.max(z,view.type==="grounds"?baseZ*1.6:baseZ*1.4));
  animTo(nz,A.x+A.w/2-x*nz,A.y+A.h/2-y*nz+50,450);select(t);if(t.el){t.el.classList.remove("pulse");void t.el.offsetWidth;t.el.classList.add("pulse")}}
function positionCard(){if(!sel||!sel.el||!card.classList.contains("show"))return;const r=sel.el.firstChild.getBoundingClientRect();const h=HR();const cw=card.offsetWidth,ch=card.offsetHeight;
  if(r.bottom<h.top||r.top>h.bottom){card.style.visibility="hidden";return}card.style.visibility="";
  const cx=r.left+r.width/2;let x=cx-cw/2,y=r.top-ch-16;if(y<Math.max(h.top+80,8))y=r.bottom+16;
  x=Math.max(h.left+10,Math.min(Math.min(h.right,innerWidth)-cw-10,x));card.style.left=x+"px";card.style.top=y+"px"}
addEventListener("scroll",()=>{positionCard();tip.classList.remove("show")},{passive:true});
function closeCard(){card.classList.remove("show");if(sel){sel.el&&sel.el.classList.remove("sel");sel.li&&sel.li.classList.remove("sel");sel=null}}
$("cx").onclick=closeCard;
card.addEventListener("pointerdown",e=>e.stopPropagation());card.addEventListener("click",e=>e.stopPropagation());

/* ===== busca ===== */
const q=$("q"),res=$("res");
const norm=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
let hits=[],act=0;
function renderRes(){const v=norm(q.value.trim());if(!v){res.classList.remove("show");return}
  hits=T.filter(t=>norm(t.n+" "+crumb(t.f).join(" ")+" "+(t.h?HOUSE[t.h][0]:"")+" "+KIND[t.k]).includes(v)).slice(0,40);act=0;
  res.innerHTML=hits.length?hits.map((t,i)=>`<button data-i="${i}" class="${i?"":"act"}">${riHTML(t)}<span>${t.n}<small>${where(t)}</small></span></button>`).join(""):`<div class="none">Nenhum local encontrado.</div>`;
  res.classList.add("show")}
function go(t){res.classList.remove("show");q.blur();
  if(!modeOk(t)){mode="here";drawTabs()}
  const fin=()=>{buildList();dims();flyTo(t)};
  if(t.out){if(view.type!=="grounds")render({type:"grounds"},{then:fin});else fin()}
  else{const id=secOf[t.f];if(view.type==="sec"&&view.id===id){if(focusF&&focusF!==t.f)setFocus(null,true);fin()}else render({type:"sec",id},{then:fin})}}
q.addEventListener("input",renderRes);q.addEventListener("focus",renderRes);
q.addEventListener("keydown",e=>{if(!hits.length)return;if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();act=(act+(e.key==="ArrowDown"?1:hits.length-1))%hits.length;res.querySelectorAll("button").forEach((b,i)=>b.classList.toggle("act",i===act));res.children[act].scrollIntoView({block:"nearest"})}if(e.key==="Enter"){e.preventDefault();go(hits[act])}});
res.addEventListener("click",e=>{const b=e.target.closest("button");if(b)go(hits[+b.dataset.i])});
root.addEventListener("pointerdown",e=>{if(!e.target.closest||!e.target.closest(".search"))res.classList.remove("show")});
document.addEventListener("pointerdown",e=>{if(e.target!==host){res.classList.remove("show");if(!host.contains(e.target))closeCard()}});
root.addEventListener("keydown",e=>{if(e.target===q&&e.key!=="Escape")return;if(e.key==="Escape"){if(!$("intro").hidden)$("introok").click();else if(card.classList.contains("show"))closeCard();else if(res.classList.contains("show"))res.classList.remove("show");else if(host.classList.contains("full"))setFull(false);else if(view.type!=="grounds")$("back").click()}});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&host.classList.contains("full"))setFull(false)});

/* se a fonte de ícones não carregar, usa ícones simples */
if(document.fonts&&document.fonts.load){Promise.race([document.fonts.load('16px "game-icons"',""),new Promise(r=>setTimeout(()=>r([]),4000))]).then(f=>{if(!f||!f.length){useGI=false;render(view,{instant:true})}else{T.forEach(t=>t.lw=0);placeLabels()}})}

/* guia da primeira visita (aparece uma vez; o botão ? mostra de novo) */
const intro=$("intro");
const showIntro=on=>{intro.hidden=!on;if(on)$("introok").focus()};
$("introok").onclick=()=>{showIntro(false);try{localStorage.setItem("arcane-mapa-intro","1")}catch(e){}};
$("help").onclick=()=>showIntro(true);
intro.addEventListener("click",e=>{if(e.target===intro)$("introok").click()});
try{if(!localStorage.getItem("arcane-mapa-intro"))showIntro(true)}catch(e){showIntro(true)}

if(narrow())side.classList.add("closed");
drawTabs();
layoutUI();
render({type:"grounds"},{instant:true});
}
})();
