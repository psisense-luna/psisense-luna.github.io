/* Application interaction checks without a browser. Run check_site.py first. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'dom-fixture.json'),'utf8'));
let downloads=[],raf=[];
const context2d=new Proxy({}, {get:(obj,key)=>key==='createLinearGradient'?()=>({addColorStop(){}}):obj[key]??(()=>{}),set:(obj,key,v)=>{obj[key]=v;return true;}});
class Element {
  constructor(d,parent=null){this.tagName=d.tag;this.attributes={...d.attrs};this.parentElement=parent;this.children=(d.children||[]).map(x=>new Element(x,this));this._text=d.text||'';this.dataset={};for(const[k,v]of Object.entries(this.attributes))if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;this.style={};this.listeners={};this.hidden='hidden'in this.attributes;this._value=this.attributes.value;this.width=0;this.height=0;
    this.classList={contains:c=>(this.attributes.class||'').split(' ').includes(c),add:c=>{if(!this.classList.contains(c))this.attributes.class=((this.attributes.class||'')+' '+c).trim();},remove:c=>{this.attributes.class=(this.attributes.class||'').split(' ').filter(x=>x!==c).join(' ');},toggle:(c,force)=>{const add=force??!this.classList.contains(c);if(add)this.classList.add(c);else this.classList.remove(c);return add;}};
  }
  get id(){return this.attributes.id||'';}set id(v){this.attributes.id=v;}
  get className(){return this.attributes.class||'';}set className(v){this.attributes.class=v;}
  get value(){return this._value??(this.tagName==='select'?this.children.find(x=>x.tagName==='option')?.value??'':'');}set value(v){this._value=String(v);}
  get textContent(){return this._text+this.children.map(x=>x.textContent).join('');}set textContent(v){this._text=String(v);this.children=[];}
  get innerHTML(){return this._text+this.children.map(x=>x.tagName==='#text'?x.textContent:'<'+x.tagName+'>'+x.innerHTML+'</'+x.tagName+'>').join('');}set innerHTML(v){this.textContent=String(v).replace(/<[^>]+>/g,'');}
  setAttribute(k,v){this.attributes[k]=String(v);}getAttribute(k){return this.attributes[k]??null;}
  append(...nodes){for(const n of nodes){n.parentElement=this;this.children.push(n);}}replaceChildren(...nodes){this._text='';this.children=[];this.append(...nodes);}
  descendants(){return this.children.flatMap(c=>[c,...c.descendants()]);}
  matches(selector){if(selector.startsWith('#'))return this.id===selector.slice(1);if(selector.startsWith('.'))return this.classList.contains(selector.slice(1));const attr=selector.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);if(attr)return attr[1]in this.attributes&&(attr[2]===undefined||this.attributes[attr[1]]===attr[2]);const combo=selector.match(/^(\w+)\[([^=]+)="([^"]+)"\]$/);if(combo)return this.tagName===combo[1]&&this.attributes[combo[2]]===combo[3];return this.tagName===selector;}
  querySelectorAll(selector){const chain=selector.split(' ');return this.descendants().filter(el=>{if(!el.matches(chain.at(-1)))return false;let p=el.parentElement;for(let i=chain.length-2;i>=0;i--){while(p&&!p.matches(chain[i]))p=p.parentElement;if(!p)return false;p=p.parentElement;}return true;});}querySelector(s){return this.querySelectorAll(s)[0]||null;}
  addEventListener(k,fn){(this.listeners[k]??=[]).push(fn);}dispatch(k,extra={}){for(const fn of this.listeners[k]||[])fn({target:this,key:extra.key,preventDefault(){},...extra});}click(){if(this.tagName==='a'&&this.download)downloads.push({name:this.download,url:this.href});this.dispatch('click');}
  focus(){document.activeElement=this;}scrollIntoView(){}
  getBoundingClientRect(){let p=this;while(p){if(p.hidden)return{width:0,height:0,top:0,left:0};p=p.parentElement;}return{width:700,height:this.tagName==='canvas'?(this.id==='neural-field'?540:this.id==='eeg-chart'?240:125):400,top:100,left:0};}
  getContext(){return context2d;}
}
const document=new Element(fixture);document.documentElement=document.querySelector('html');document.documentElement.scrollHeight=6500;document.body=document.querySelector('body');document.hidden=false;document.getElementById=id=>document.descendants().find(n=>n.id===id)||null;document.createElement=tag=>new Element({tag,attrs:{},children:[]});document.createElementNS=(_,tag)=>document.createElement(tag);
const blobs=new Map();let urlCount=0;
const window={document,innerHeight:900,scrollY:0,devicePixelRatio:1,matchMedia:()=>({matches:false}),addEventListener(){}};
const sandbox={window,document,console,performance:{now:()=>0},requestAnimationFrame:cb=>raf.push(cb),setTimeout:()=>1,clearTimeout(){},Blob:class {constructor(p){this.text=p.join('');}},URL:{createObjectURL:blob=>{const u='blob:'+urlCount++;blobs.set(u,blob);return u;},revokeObjectURL(){}},globalThis:null};sandbox.globalThis=sandbox;
vm.createContext(sandbox);for(const file of ['signal-engine.js','evidence-data.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),sandbox,{filename:file});window.LunaSynthetic=sandbox.LunaSynthetic;
vm.runInContext(fs.readFileSync(path.join(root,'app.js'),'utf8'),sandbox,{filename:'app.js'});
const $=id=>document.getElementById(id);
function frames(n,from=100){for(let j=0;j<n;j++){const cb=raf.shift();assert.ok(cb);cb(from+j*100);}}
assert.equal($('focus-auc').textContent,'0,9531');assert.notEqual($('demo16').textContent,'—');
for(const [id,result]of [['study-coverage','0,9564'],['study-within','0,8162'],['study-global','0,7768'],['study-memory','0,7814'],['study-primary','0,9531']]){$(id).click();assert.equal($('focus-auc').textContent,result);assert.equal($('study-panel').getAttribute('aria-labelledby'),id);}
$('study-primary').dispatch('keydown',{key:'ArrowRight'});assert.equal($('focus-auc').textContent,'0,9564');
$('language').click();assert.equal(document.documentElement.lang,'en');assert.equal($('focus-auc').textContent,'0.9564');assert.equal($('language').textContent,'PT ↔');
$('labtab-spectrum').click();assert.equal($('lab-spectrum').hidden,false);assert.equal($('lab-signals').hidden,true);assert.equal($('band-readings').children.length,5);
$('artifact').value='disconnect';$('artifact').dispatch('change');frames(40);assert.equal($('demo16').textContent,'—');assert.equal($('quality-label').textContent,'Electrode disconnected');
$('lab-reset').click();assert.equal($('artifact').value,'none');assert.notEqual($('demo16').textContent,'—');
$('scenario').value='slow';$('scenario').dispatch('change');assert.equal($('slow-mix').value,'85');assert.equal($('amplitude').value,'48');
$('noise').value='30';$('noise').dispatch('input');assert.equal($('noise-output').textContent,'30%');
$('lab-play').click();assert.equal($('lab-play').textContent,'▶ Resume');const before=$('lab-clock').textContent;frames(30,5000);assert.equal($('lab-clock').textContent,before);
$('labtab-engine').click();assert.equal($('lab-engine').hidden,false);assert.equal($('labtab-engine').getAttribute('aria-selected'),'true');
$('labtab-events').click();$('annotation').value='<script>alert(1)</script>';$('annotation-form').dispatch('submit');assert.equal($('event-list').children[0].children[1].textContent,'<script>alert(1)</script>');assert.equal($('event-list').querySelector('script'),null);
$('export-session').click();assert.equal(downloads.length,1);const exported=JSON.parse(blobs.get(downloads[0].url).text);assert.equal(exported.scope,'synthetic_only');assert.equal(exported.protected_model_inference,false);assert.equal(exported.settings.preset,'slow');
$('menu-toggle').click();assert.equal($('menu-toggle').getAttribute('aria-expanded'),'true');document.querySelector('#navigation a').click();assert.equal($('menu-toggle').getAttribute('aria-expanded'),'false');
$('lab-fullscreen').click();assert.ok($('lab-shell').classList.contains('expanded'));$('lab-fullscreen').click();assert.ok(!$('lab-shell').classList.contains('expanded'));
$('language').click();assert.equal($('language').textContent,'EN ↔');assert.equal($('focus-auc').textContent,'0,9564');
console.log('PASS: actual app initialization, five evidence views, keyboard tabs, PT/EN, spectrum, disconnect/reset, presets/sliders, pause, engine/session tabs, safe annotations/export, mobile menu and fullscreen fallback.');
