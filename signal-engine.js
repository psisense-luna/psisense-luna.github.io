/* Public synthetic bench. No Legacy V7 / RI16 model, weights or inference. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LunaSynthetic = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const FS = 128, CAPACITY = FS * 64;
  const PRESETS = {
    awake: {slow: .12, amplitude: 24},
    slow: {slow: .85, amplitude: 48},
    burst: {slow: .8, amplitude: 55},
    recovery: {slow: .3, amplitude: 30}
  };
  class Engine {
    constructor(seed = 4026) { this.seed = seed; this.reset(); }
    reset() {
      this.eeg = [new Float64Array(CAPACITY), new Float64Array(CAPACITY)];
      this.ecg = new Float64Array(CAPACITY); this.count = 0; this.fraction = 0;
      this.randomState = this.seed; this.preset = 'awake'; this.slow = .12;
      this.amplitude = 24; this.noise = .08; this.artifact = 'none';
      this.events = []; this.history = []; this.nextHistory = 1;
    }
    random() { let s = this.randomState; s ^= s << 13; s ^= s >>> 17; s ^= s << 5; this.randomState = s >>> 0; return this.randomState / 4294967296; }
    get time() { return this.count / FS; }
    setPreset(name) {
      if (!PRESETS[name]) return false;
      this.preset = name; Object.assign(this, PRESETS[name]);
      this.mark('preset', name); return true;
    }
    mark(kind, text) { this.events.push({time:this.time,kind,text}); if(this.events.length>100) this.events.shift(); }
    advance(seconds) {
      this.fraction += Math.max(0, Math.min(64, seconds)) * FS;
      const n = Math.floor(this.fraction); this.fraction -= n;
      for (let i=0;i<n;i++) {
        const t=this.time, k=this.count%CAPACITY;
        const envelope=this.preset==='burst' && t%6>2 ? .055 : 1;
        for(let ch=0;ch<2;ch++) {
          const p=ch*.42;
          let v=this.amplitude*envelope*(this.slow*Math.sin(2*Math.PI*1.7*t+p) + (1-this.slow)*.6*Math.sin(2*Math.PI*10.5*t+p) + .2*Math.sin(2*Math.PI*5.6*t+p) + .12*Math.sin(2*Math.PI*22*t+p));
          v+=this.amplitude*this.noise*(this.random()-.5)*2;
          if(this.artifact==='motion') v+=90*Math.sin(2*Math.PI*.7*t)+40*Math.sin(2*Math.PI*24*t);
          if(this.artifact==='line') v+=35*Math.sin(2*Math.PI*50*t+p);
          if(this.artifact==='clip') v=Math.max(-200,Math.min(200,v*20));
          if(this.artifact==='disconnect') v=0;
          this.eeg[ch][k]=v;
        }
        const phase=(t*1.2)%1;
        this.ecg[k]=.08*Math.sin(2*Math.PI*1.2*t)+Math.exp(-(((phase-.2)/.022)**2))-.28*Math.exp(-(((phase-.24)/.025)**2))+.18*Math.exp(-(((phase-.48)/.07)**2));
        this.count++;
        if(this.time>=this.nextHistory) {
          const a=this.analyze();
          this.history.push({time:this.time,demo16:a.demo16,demo30:a.demo30,quality:a.quality,bands:a.bands});
          if(this.history.length>240) this.history.shift();
          this.nextHistory++;
        }
      }
    }
    samples(seconds=6, channel=0) {
      const n=Math.min(Math.round(seconds*FS),this.count,CAPACITY), out=new Float64Array(n), src=channel===2?this.ecg:this.eeg[channel];
      for(let j=0;j<n;j++) out[j]=src[(this.count-n+j)%CAPACITY];
      return out;
    }
    primitive(seconds) {
      const x=this.samples(seconds); if(x.length<seconds*FS) return null;
      let mean=0;for(const v of x) mean+=v;mean/=x.length;
      let ss=0,ds=0,max=0;for(let j=0;j<x.length;j++){ss+=(x[j]-mean)**2;max=Math.max(max,Math.abs(x[j]));if(j)ds+=(x[j]-x[j-1])**2;}
      const rms=Math.sqrt(ss/x.length),diff=Math.sqrt(ds/(x.length-1));
      if(rms<1e-6||max>=187.5) return null;
      return {rms,E:rms/(rms+25),V:diff/(rms+1e-9),C:1/(1+diff/(rms+1e-9))};
    }
    spectrum() {
      const x=this.samples(2), n=x.length, bins=[];
      if(n<FS*2) return {bins:[],bands:[0,0,0,0,0]};
      let mean=0;for(const v of x)mean+=v;mean/=n;
      for(let k=1;k<=100;k++) {
        let re=0,im=0;
        for(let j=0;j<n;j++) {const v=(x[j]-mean)*(.5-.5*Math.cos(2*Math.PI*j/(n-1))),phase=2*Math.PI*k*j/n;re+=v*Math.cos(phase);im-=v*Math.sin(phase);}
        bins.push({hz:k*FS/n,power:(re*re+im*im)/(n*n)});
      }
      const bands=[0,0,0,0,0];for(const b of bins){const k=b.hz<4?0:b.hz<8?1:b.hz<13?2:b.hz<30?3:4;bands[k]+=b.power;}
      const total=bands.reduce((a,b)=>a+b,0);return {bins,bands:bands.map(v=>total?v/total:0)};
    }
    analyze() {
      const short=this.samples(2), spec=this.spectrum();
      let max=0,ss=0;for(const v of short){max=Math.max(max,Math.abs(v));ss+=v*v;}
      const rms=short.length?Math.sqrt(ss/short.length):0;
      let quality=this.artifact==='disconnect'?'disconnected':short.length<FS*2?'warming':rms<.001?'disconnected':max>=187.5?'clipped':rms>65?'motion':spec.bands[4]>.25?'interference':'usable';
      const valid=quality==='usable';
      const p16=valid?this.primitive(16):null,p30=valid?this.primitive(30):null;
      const prior=this.history.map(v=>v.demo30).filter(v=>v!==null).slice(-20).sort((a,b)=>a-b), M=prior.length?prior[Math.floor(prior.length/2)]/100:.5;
      // The same public educational primitives described in the supplied monitor;
      // these equations are deliberately unrelated to protected clinical models.
      const demo16=p16?100*(.4*p16.C+.35*(1-p16.E)+.25*p16.V/(1+p16.V)):null;
      const demo30=p30?100*(.45*p30.C+.35*p30.E+.2*M):null;
      return {time:this.time,quality,valid,rms,max,demo16,demo30,bands:spec.bands,bins:spec.bins,lowAmplitude:rms>0&&rms<5,p16,p30,history:this.history.length};
    }
    export() {
      return {schema:'psisense.synthetic-bench.v1',scope:'synthetic_only',sample_rate_hz:FS,seconds:this.time,
        protected_model_inference:false,clinical_labels:false,notice:'Educational signal computation, not Legacy V7 or RI16 inference; no clinical AUC can be calculated from this session.',
        settings:{preset:this.preset,amplitude_uv:this.amplitude,slow_mix:this.slow,noise:this.noise,artifact:this.artifact},
        events:this.events.slice(),history:this.history.slice(),eeg_uv:[Array.from(this.samples(16,0)),Array.from(this.samples(16,1))],ecg_mv:Array.from(this.samples(16,2))};
    }
  }
  return {Engine,FS,PRESETS};
});
