"""Static source/evidence checks; generates a DOM fixture for app-smoke.cjs."""
from pathlib import Path
from html.parser import HTMLParser
import json, re

ROOT = Path(__file__).resolve().parents[1]
VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
class Parser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root={'tag':'document','attrs':{},'children':[]}; self.stack=[self.root]; self.ids=[]
    def handle_starttag(self,tag,attrs):
        node={'tag':tag,'attrs':dict(attrs),'children':[]}
        self.stack[-1]['children'].append(node)
        if 'id' in node['attrs']: self.ids.append(node['attrs']['id'])
        if tag not in VOID: self.stack.append(node)
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,0,-1):
            if self.stack[i]['tag']==tag:
                self.stack=self.stack[:i];return
    def handle_data(self,data):
        if data: self.stack[-1]['children'].append({'tag':'#text','text':data})

html=(ROOT/'index.html').read_text(); parser=Parser(); parser.feed(html)
assert len(parser.ids)==len(set(parser.ids)), 'Duplicate IDs'
ids=set(parser.ids)
def visit(n):
    if n['tag']=='#text': return
    a=n['attrs']
    for key in ['href','src']:
        v=a.get(key,'')
        if not v:continue
        if v.startswith('#'):assert v[1:] in ids, f'Missing anchor: {v}'
        elif not re.match(r'^(https?:|mailto:|data:)',v):assert (ROOT/v.split('?')[0]).is_file(),f'Missing local asset: {v}'
    if a.get('aria-controls'):assert a['aria-controls'] in ids
    if a.get('aria-labelledby'):assert a['aria-labelledby'] in ids
    if a.get('for'):assert a['for'] in ids
    if n['tag']=='button':assert ''.join(c.get('text','') for c in n['children']).strip() or a.get('aria-label') or n['children']
    for c in n['children']:visit(c)
visit(parser.root)
app=(ROOT/'app.js').read_text()
for id_ in re.findall(r"(?<!\$)\$\('([^']+)'\)",app):assert id_ in ids,f'Missing JS target: {id_}'
data=json.loads((ROOT/'assets/evidence.json').read_text())
assert data['primary']['n']==886 and data['primary']['recordings']==43
assert abs(data['primary']['metrics']['TCR_HYBRID']['auc']-.9530845333057081)<1e-12
assert data['coverage']['n']==943 and data['coverage']['recordings']==43
assert abs(data['coverage']['metrics']['TCR_HYBRID']['auc']-.956427980621529)<1e-12
assert data['primary']['paired_deltas']['TCR_HYBRID_minus_WSMF_RAW']['ci95'][0]<0
def keys(value):
    if isinstance(value,dict):
        for k,v in value.items():yield k;yield from keys(v)
    elif isinstance(value,list):
        for v in value:yield from keys(v)
assert not {'coefficients','intercepts','medians','weights'}.intersection(keys(data))
assert not list(ROOT.rglob('*.joblib')) and not list(ROOT.rglob('*.parquet'))
assert 'TCR_HYBRID_equation.json' not in html
assert 'OS TRAÇOS PRETOS SÃO VULNERÁVEIS.' in html
css=(ROOT/'styles.css').read_text()
assert css.count('{')==css.count('}')
assert 'prefers-reduced-motion' in css and '@import' not in css
fixture=ROOT/'tests/dom-fixture.json';fixture.write_text(json.dumps(parser.root,ensure_ascii=False))
print(f'PASS: {len(ids)} unique IDs, local assets/anchors, aggregate evidence, private boundary, responsive/reduced-motion CSS. DOM fixture generated.')
