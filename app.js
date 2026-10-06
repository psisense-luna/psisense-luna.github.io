"use strict";
(() => {
  const $ = (id) => document.getElementById(id);
  const nodes = Array.from(document.querySelectorAll('[data-i18n]'));
  const en = Object.fromEntries(nodes.map(n => [n.dataset.i18n, n.innerHTML]));
  const pt = {
    'skip':'Ir para o conteúdo',
    'nav.tech':'Tecnologia', 'nav.evidence':'Evidências', 'nav.contact':'Vamos colaborar ↗',
    'hero.label':'NEUROFISIOLOGIA, COM CONTEXTO', 'hero.title':'Além de um<br>único instante.',
    'hero.body':'A atividade cerebral tem uma história.<br>O PsiSense Luna coloca essa história em foco.',
    'hero.explore':'Explore as evidências ↗', 'hero.how':'Conheça a arquitetura ↓',
    'hero.version':'TCR-H · Legacy V7 · Plataforma de pesquisa', 'hero.by':'PESQUISA INDEPENDENTE DE', 'hero.scroll':'Role para explorar',
    'scene.a':'Sinal neurofisiológico', 'scene.b':'Descritores TCR-H', 'scene.c':'Memória causal',
    'scene.caption':'UM SINAL. UMA HISTÓRIA. OUTRA PERSPECTIVA.',
    'tech.label':'01 / A TECNOLOGIA', 'tech.version':'Arquitetura atual · Legacy V7',
    'tech.title':'O sinal importa.<br>O que veio antes também.',
    'tech.body':'A TCR-H extrai descritores neurofisiológicos do EEG e do ECG. Uma memória causal em múltiplas escalas contextualiza cada época usando o histórico disponível do mesmo caso.',
    'tech.sub':'O pipeline de referência usa dois canais de EEG a 128 Hz, ECG e épocas de 30 segundos. Cinco modelos específicos por domínio são treinados e congelados.',
    'arch.1':'Adquirir e descrever', 'arch.1b':'Extrair uma visão estruturada dos sinais pelos componentes da TCR-H.',
    'arch.2':'Contextualizar causalmente', 'arch.2b':'Comparar a época atual com observações anteriores em diferentes escalas de tempo.',
    'arch.3':'Estimar e apresentar', 'arch.3b':'Usar modelos congelados e uma atualização de estado para produzir um escore contínuo de pesquisa.',
    'memory.label':'CONTEXTO TEMPORAL, VISÍVEL', 'memory.title':'Cada época<br>tem um antes.',
    'memory.body':'Percorra um sinal para ver seu passado se tornar contexto. A área sombreada acompanha o instante escolhido. As amostras futuras ficam fora do cálculo.',
    'memory.note':'Ilustração conceitual · sinal sintético, sem predição do modelo',
    'memory.input':'Histórico do sinal', 'memory.slider':'Selecione a época atual', 'memory.play':'Reproduzir',
    'memory.past':'Sinal observado', 'memory.mean':'Média apenas do passado',
    'evidence.label':'02 / AS EVIDÊNCIAS', 'evidence.date':'Retrato da pesquisa · setembro de 2026',
    'evidence.title':'Resultados que<br>você pode examinar.',
    'evidence.body':'Épocas alinhadas. Comparações por paciente. Métricas diferentes, apresentadas separadamente.',
    'stats.cases':'casos adicionais avaliados na V8', 'stats.epochs':'observações época × domínio', 'stats.domains':'domínios farmacológicos',
    'tabs.within':'AUC por caso · V8', 'tabs.global':'AUC global · V8', 'tabs.memory':'Controle de memória · V7',
    'evidence.download':'Baixar dados ↓', 'evidence.table':'Resultados TCR e BIS por domínio',
    'table.domain':'Domínio', 'table.cases':'Casos', 'table.hint':'Selecione um domínio para examinar a comparação.',
    'detail.delta':'Diferença de AUC',
    'evidence.note':'A V8 usa o modelo Legacy V7 congelado em casos adicionais da mesma fonte VitalDB. O alvo é exposição farmacológica alta versus baixa dentro do caso. São resultados retrospectivos de pesquisa.',
    'method.title':'Leia o protocolo de avaliação <span>+</span>',
    'method.1':'Comparação alinhada',
    'method.1b':'TCR e BIS são comparados nas mesmas épocas selecionadas. Na V8, o BIS observado é orientado como 100 − BIS. As contagens por domínio se sobrepõem e não devem ser somadas como pacientes únicos.',
    'method.2':'Duas visões da AUC',
    'method.2b':'A AUC global reúne épocas de diferentes casos. A AUC por caso avalia a discriminação separadamente em cada caso e atribui o mesmo peso a cada um.',
    'method.3':'Features causais, rótulos retrospectivos',
    'method.3b':'O histórico é construído em ordem cronológica. A inferência não recebe dose, BIS ou rótulos. Os rótulos alto/baixo usam a distribuição de exposição do caso completo (q25/q75).',
    'method.4':'Escopo das conclusões',
    'method.4b':'Os intervalos de confiança reamostram pacientes. O desenvolvimento exploratório anterior e as múltiplas comparações não estão incluídos nesses intervalos. Validação prospectiva e em fontes independentes são próximas etapas.',
    'engineering.label':'03 / REPRODUTIBILIDADE POR PROJETO', 'engineering.note':'Uma referência de pesquisa para a próxima etapa',
    'engineering.title':'Preservar a ciência.<br>Avançar a experiência.',
    'engineering.body':'O replay Legacy V7 reproduz os escores salvos, mantendo os modelos fixos e o histórico do sinal explícito.',
    'parity.cases':'casos na auditoria de paridade V7', 'parity.epochs':'épocas comparadas',
    'parity.error':'Maior diferença no escore bruto', 'parity.note':'Paridade de replay de predições. A verificação completa do sinal bruto até o monitor é uma etapa separada.',
    'release.title':'Congelado em uso. Versionado na pesquisa.',
    'release.body':'Legacy multiscale V7 é a referência atual. CaseAdaptive permanece um ramo exploratório após a comparação corrigida. Atualizações futuras são avaliadas como versões distintas do modelo.',
    'collab.label':'04 / A PRÓXIMA CONVERSA', 'collab.title':'Construir a próxima<br>perspectiva. Juntos.',
    'collab.body':'Para equipes de pesquisa e parceiros de neurotecnologia que exploram interpretação de sinais, processamento local e integração.',
    'collab.cta':'Comece uma conversa ↗', 'collab.1':'Avaliação científica', 'collab.1b':'Datasets independentes, protocolos fixos e reprodutibilidade.',
    'collab.2':'Exploração de integração', 'collab.2b':'Perfis de EEG/ECG, execução local e uma apresentação complementar.',
    'collab.3':'Colaboração OEM', 'collab.3b':'Uma via de avaliação para codesenvolvimento e licenciamento.',
    'collab.footer':'Pacote atual: replay de pesquisa · Conceitos de implantação: local / embarcado / on-premises',
    'footer.copy':'Pesquisa independente · Samuel Santos Oliveira da Silva<br>Evidências: Legacy V7 / V8 · Documentação revisada em setembro–outubro de 2026',
    'footer.data':'Dados das evidências ↗', 'footer.photo':'Paisagem: Luca Micheli / Unsplash · Imagem fornecida pelo pesquisador'
  };
  let language = 'en';
  try { language = localStorage.getItem('psisense-language') === 'pt' ? 'pt' : 'en'; } catch (_) {}
  let evidence = null, metric = 'within', domain = 'propofol_ce';
  const names = {des_exp:'Desflurane', propofol_ce:'Propofol', remi20_ce:'Remifentanil · 20', remi50_ce:'Remifentanil · 50', sevo_exp:'Sevoflurane'};
  const namesPT = {...names, des_exp:'Desflurano', sevo_exp:'Sevoflurano'};
  const t = (english, portuguese) => language === 'pt' ? portuguese : english;
  const number = (x, digits = 4) => x.toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US', {minimumFractionDigits:digits, maximumFractionDigits:digits});
  const signed = x => (x > 0 ? '+' : '') + number(x);
  function setLanguage(next) {
    language = next;
    document.documentElement.lang = next === 'pt' ? 'pt-BR' : 'en';
    nodes.forEach(n => { n.innerHTML = next === 'pt' ? (pt[n.dataset.i18n] || en[n.dataset.i18n]) : en[n.dataset.i18n]; });
    $('language').innerHTML = (next === 'pt' ? 'EN' : 'PT') + ' <span aria-hidden="true">↔</span>';
    $('language').setAttribute('aria-label', t('Switch to Portuguese','Mudar para inglês'));
    $('menu-toggle').setAttribute('aria-label', t('Open navigation','Abrir navegação'));
    $('memory-chart').setAttribute('aria-label',t('Synthetic signal and causal history','Sinal sintético e histórico causal'));
    $('epoch-slider').setAttribute('aria-valuetext', $('demo-time').textContent);
    try { localStorage.setItem('psisense-language', next); } catch (_) {}
    renderBenchmark(); updatePlayLabel();
  }
  $('language').addEventListener('click', () => setLanguage(language === 'en' ? 'pt' : 'en'));
  function closeMenu() { $('mobile-menu').hidden = true; $('menu-toggle').setAttribute('aria-expanded','false'); }
  $('menu-toggle').addEventListener('click', () => { const open = $('mobile-menu').hidden; $('mobile-menu').hidden = !open; $('menu-toggle').setAttribute('aria-expanded', String(open)); });
  $('mobile-menu').querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  const onScroll = () => $('header').classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  function interpretation(row) {
    if (row.domain === 'remi50_ce') return t('Small cohort. Results vary by metric; an independent, larger evaluation is needed.', 'Coorte pequena. Os resultados variam por métrica; é necessária uma avaliação independente maior.');
    if (metric === 'memory' && row.domain === 'des_exp') return t('Positive point estimate, but the confidence interval includes zero. The memory comparator is a research control.', 'Estimativa pontual positiva, mas o intervalo inclui zero. O comparador com memória é um controle de pesquisa.');
    if (metric === 'within' && row.domain === 'des_exp') return t('Observed BIS has the higher mean within-case AUC here. The direction differs from global AUC.', 'O BIS observado tem maior AUC média por caso neste domínio. A direção é diferente da AUC global.');
    if (metric === 'global' && row.domain === 'des_exp') return t('TCR has the higher pooled AUC here; observed BIS has the higher within-case AUC. Both views matter.', 'A TCR tem maior AUC global aqui; o BIS observado tem maior AUC por caso. As duas visões importam.');
    return metric === 'memory' ? t('Higher TCR AUC under this matched protocol, compared with a BIS-based causal-memory research model.', 'Maior AUC da TCR neste protocolo alinhado, frente a um modelo de pesquisa com memória causal baseada no BIS.') : t('Higher TCR AUC under this matched protocol. This result concerns within-case pharmacological exposure.', 'Maior AUC da TCR neste protocolo alinhado. O resultado se refere à exposição farmacológica dentro do caso.');
  }
  function renderBenchmark() {
    if (!evidence) return;
    const m = evidence.metrics[metric];
    const descriptions = {
      within:t('Mean within-case AUC: each case is evaluated separately and receives equal weight.','AUC média por caso: cada caso é avaliado separadamente e recebe o mesmo peso.'),
      global:t('Global AUC: matched epochs are pooled across cases.','AUC global: as épocas alinhadas são reunidas entre casos.'),
      memory:t('Global AUC against a BIS-based model with causal history and state, under the V7 protocol. This is a research comparator.','AUC global frente a um modelo baseado no BIS com histórico causal e estado, no protocolo V7. É um comparador de pesquisa.')
    };
    $('metric-description').textContent = descriptions[metric];
    $('cohort-badge').textContent = metric === 'memory' ? 'Legacy V7 · '+t('matched control','controle alinhado') : 'V8 · '+t('additional cases','casos adicionais');
    $('comparator-header').textContent = metric === 'memory' ? 'BIS + M' : 'BIS';
    $('benchmark-panel').setAttribute('aria-labelledby','tab-'+metric);
    $('results-table').replaceChildren();
    m.rows.forEach(row => {
      const tr = document.createElement('tr'); tr.classList.toggle('selected',row.domain === domain);
      const th = document.createElement('th'); th.scope='row';
      const button = document.createElement('button'); button.textContent = (language === 'pt' ? namesPT : names)[row.domain];
      button.setAttribute('aria-pressed', String(row.domain === domain)); button.addEventListener('click', () => {domain=row.domain; renderBenchmark();});
      th.append(button); tr.append(th);
      [number(row.cases,0), number(row.tcr), number(row.bis), signed(row.delta)].forEach((value,i) => {const td=document.createElement('td'); td.textContent=value; if(i===3)td.className=row.delta>0?'positive':'negative'; tr.append(td);});
      $('results-table').append(tr);
    });
    const row = m.rows.find(r=>r.domain===domain);
    $('selected-domain').textContent = (language==='pt'?namesPT:names)[domain];
    $('domain-count').textContent = number(row.cases,0)+' '+t('cases','casos');
    $('tcr-value').textContent = number(row.tcr); $('bis-value').textContent = number(row.bis);
    $('bar-tcr').style.width = row.tcr*100+'%'; $('bar-bis').style.width = row.bis*100+'%';
    $('bis-label').textContent = metric==='memory' ? t('BIS + memory + state','BIS + memória + estado') : t('Observed BIS','BIS observado');
    $('delta-value').textContent = signed(row.delta);
    $('delta-ci').textContent = t('95% CI','IC95%')+' ['+number(row.ci[0])+'; '+number(row.ci[1])+']';
    $('interpretation').textContent = interpretation(row);
  }
  const tabs = Array.from(document.querySelectorAll('[data-metric]'));
  function chooseTab(tab, focus=false) { metric=tab.dataset.metric; tabs.forEach(b=>{b.setAttribute('aria-selected',String(b===tab));b.tabIndex=b===tab?0:-1;}); if(focus)tab.focus(); renderBenchmark(); }
  tabs.forEach(tab=>{tab.addEventListener('click',()=>chooseTab(tab)); tab.addEventListener('keydown',e=>{let i=tabs.indexOf(tab); if(e.key==='ArrowRight')i=(i+1)%tabs.length;else if(e.key==='ArrowLeft')i=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')i=0;else if(e.key==='End')i=tabs.length-1;else return;e.preventDefault();chooseTab(tabs[i],true);});});
  $('download-data').addEventListener('click',()=>{
    if(!evidence)return;
    const lines=['version,metric,domain,cases,epochs,tcr_auc,bis_auc,delta_auc,ci95_low,ci95_high'];
    evidence.metrics[metric].rows.forEach(r=>lines.push([evidence.metrics[metric].version,metric,r.domain,r.cases,r.epochs,r.tcr,r.bis,r.delta,...r.ci].join(',')));
    const url=URL.createObjectURL(new Blob([lines.join('\n')+'\n'],{type:'text/csv;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='PsiSense_'+evidence.metrics[metric].version+'_'+metric+'.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });

  // Concept illustration only. No patient data or model inference in this demo.
  const samples=Array.from({length:241},(_,i)=>0.52+0.14*Math.sin(i*0.077)+0.075*Math.sin(i*0.40)+0.035*Math.cos(i*0.86)+0.09*Math.tanh((i-118)/30));
  const xy=(i,v)=>[20+i/240*620,198-v*168];
  const path=(points)=>points.map((p,i)=>(i?'L':'M')+p.map(v=>v.toFixed(2)).join(',')).join(' ');
  const svgNS='http://www.w3.org/2000/svg';
  [40,80,120,160,200].forEach(y=>{const line=document.createElementNS(svgNS,'line');line.setAttribute('x1','20');line.setAttribute('x2','640');line.setAttribute('y1',y);line.setAttribute('y2',y);line.setAttribute('stroke','#e2e1e9');$('chart-grid').append(line);});
  function renderDemo() {
    const epoch=Number($('epoch-slider').value), index=epoch*10, x=xy(index,0)[0], start=Math.max(0,index-80);
    $('signal-past').setAttribute('d',path(samples.slice(0,index+1).map((v,i)=>xy(i,v))));
    $('signal-future').setAttribute('d',path(samples.slice(index).map((v,i)=>xy(index+i,v))));
    const means=[];
    for(let i=1;i<=index;i++){const earlier=samples.slice(Math.max(0,i-80),i);means.push(xy(i,earlier.reduce((a,b)=>a+b,0)/earlier.length));}
    $('history-mean').setAttribute('d',path(means));
    $('past-window').setAttribute('x',xy(start,0)[0]);$('past-window').setAttribute('width',x-xy(start,0)[0]);
    $('moment-line').setAttribute('x1',x);$('moment-line').setAttribute('x2',x);
    $('moment-dot').setAttribute('cx',x);$('moment-dot').setAttribute('cy',xy(index,samples[index])[1]);
    const seconds=epoch*30; const time=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
    $('demo-time').textContent=time;$('epoch-slider').setAttribute('aria-valuetext',time);
  }
  let playTimer=null;
  function updatePlayLabel(){ $('play-text').textContent=playTimer?t('Pause','Pausar'):t('Play','Reproduzir');$('play-icon').textContent=playTimer?'Ⅱ':'▶';$('demo-play').setAttribute('aria-pressed',String(Boolean(playTimer)));$('demo-play').setAttribute('aria-label',playTimer?t('Pause illustration','Pausar ilustração'):t('Play illustration','Reproduzir ilustração'));}
  function pauseDemo(){ if(playTimer)clearInterval(playTimer);playTimer=null;updatePlayLabel(); }
  $('demo-play').addEventListener('click',()=>{if(playTimer){pauseDemo();return;}if(Number($('epoch-slider').value)>=24)$('epoch-slider').value=1;playTimer=setInterval(()=>{const value=Number($('epoch-slider').value);if(value>=24){pauseDemo();return;}$('epoch-slider').value=value+1;renderDemo();},650);updatePlayLabel();renderDemo();});
  $('epoch-slider').addEventListener('input',()=>{pauseDemo();renderDemo();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseDemo();});
  renderDemo();

  // Decorative sphere, not a representation of measured brain connectivity.
  function project(lat,lon) {
    const a=lon+.45,x=Math.cos(lat)*Math.sin(a),y=Math.sin(lat),z=Math.cos(lat)*Math.cos(a);
    const tilt=.32,py=y*Math.cos(tilt)-z*Math.sin(tilt),pz=y*Math.sin(tilt)+z*Math.cos(tilt);
    return {x:240+x*178,y:240+py*178,z:pz};
  }
  function meshLine(points){const p=document.createElementNS(svgNS,'path');p.setAttribute('d',path(points.map(p=>[p.x,p.y])));p.setAttribute('fill','none');p.setAttribute('stroke','#e4dcff');p.setAttribute('stroke-width','.65');p.setAttribute('opacity','.32');$('neural-mesh').append(p);}
  for(let lat=-1.35;lat<=1.35;lat+=.225){meshLine(Array.from({length:121},(_,i)=>project(lat,i*Math.PI/60)));}
  for(let lon=0;lon<Math.PI*2;lon+=Math.PI/12){meshLine(Array.from({length:81},(_,i)=>project(-Math.PI/2+i*Math.PI/80,lon)));}
  let seed=27;function random(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646;}
  for(let i=0;i<90;i++){const p=project(Math.asin(random()*2-1),random()*Math.PI*2);if(p.z<-.1)continue;const c=document.createElementNS(svgNS,'circle');c.setAttribute('cx',p.x);c.setAttribute('cy',p.y);c.setAttribute('r',i%8===0?'3':'1.6');c.setAttribute('fill','#f3ecff');c.setAttribute('opacity',String(.45+(p.z+1)*.2));$('neural-nodes').append(c);}
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(window.matchMedia('(hover: hover) and (pointer: fine)').matches&&!motion.matches){const hero=document.querySelector('.hero');let frame=0;hero.addEventListener('pointermove',e=>{if(frame)cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const rect=hero.getBoundingClientRect();hero.style.setProperty('--mouse-x',String((e.clientX-rect.left)/rect.width-.5));hero.style.setProperty('--mouse-y',String((e.clientY-rect.top)/rect.height-.5));});});hero.addEventListener('pointerleave',()=>{if(frame)cancelAnimationFrame(frame);hero.style.setProperty('--mouse-x','0');hero.style.setProperty('--mouse-y','0');});}
  setLanguage(language);
  fetch('assets/evidence.json').then(r=>{if(!r.ok)throw new Error('Evidence unavailable');return r.json();}).then(data=>{evidence=data;renderBenchmark();}).catch(()=>{$('metric-description').textContent=t('Evidence could not load. Please reload, or download the evidence dataset below.','Não foi possível carregar as evidências. Recarregue a página ou baixe o arquivo de dados abaixo.');$('download-data').disabled=true;});
})();
