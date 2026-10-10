# PsiSense Luna website

Public GitHub Pages website for **psisense-luna/psisense-luna.github.io**.
Research content updated from `PsiSense_Luna_Dossie_Completo_v03_RI16.zip` on 2026-10-10.

Open `index.html` directly or use the existing GitHub Pages publication. There is no build step, dependency installation, external script, analytics, account, backend, or API key.

## Experience

- Portuguese and English; responsive layouts and keyboard-accessible navigation/tabs.
- Perspective-projected 3D neural field, pointer rotation, layered scroll narrative and reduced-motion support.
- Five research views: RI16 primary, RI16 post-hoc coverage, Legacy V8 within-case/global and Legacy V7 memory control. AUC/CI plots preserve the relevant metric and cohort.
- Integrated synthetic EEG/ECG laboratory: deterministic 128 Hz generator, scenarios, signal controls, movement/line/clipping/disconnection faults, two educational past-window readings, computed spectrum, history, annotations, JSON export, pause/reset/fullscreen.
- Animation and synthetic streaming pause offscreen and while the document is hidden. Signals remain local.

## Public/private boundary

`signal-engine.js` is **educational synthetic computation**, not Legacy V7/RI16 model inference. The protected-model indicators remain unavailable in this public laboratory. There are no clinical labels or synthetic AUC claims. The black bars requested by the author cover educational equations visually, with an explicit warning that their contents are recoverable. They are not security controls.

Proprietary coefficients, weights, Python kernels, the uploaded private ZIP, individual patient predictions and raw patient EEG/ECG are not included. Public research exports contain aggregate metrics and methodological context only. The source of current content is recorded in `assets/evidence.json` and `assets/research-note.md`.

RI16 primary AUC: **0.9531**, CI95% 0.9189–0.9807, 886 assessments / 43 recordings. Post-hoc coverage: 0.9564, 943 assessments / the same 43 recordings. Superiority over causal WSMF is not established. Recording holdout in previously explored DOSE-I is not external patient-level confirmation.

## Verification

```sh
node --check signal-engine.js
node --check app.js
node --test tests/signal-engine.test.cjs
python3 tests/check_site.py
node tests/app-smoke.cjs
```

The app smoke check uses a lightweight DOM/canvas test harness to exercise the actual application scripts, navigation, controls and exports. It does not establish browser rendering quality. Browser-based visual QA was unavailable in the authoring environment.

The original website and assets remain in the Git history. The existing GitHub Pages audience/publication is retained.
