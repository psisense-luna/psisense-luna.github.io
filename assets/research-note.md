# PsiSense Luna · public research notes

Updated 2026-10-10 · research by Samuel Santos Oliveira da Silva.
Source: the author-supplied `PsiSense_Luna_Dossie_Completo_v03_RI16.zip`.

## Current evidence

TCR-RI16 hybrid primary test: AUC **0.9531**, recording-bootstrap 95% CI **0.9189–0.9807**, **886 assessments in 43 held-out DOSE-I recordings** (788 non-responsive, 98 responsive). Development: 2,408 assessments in 128 recordings. The endpoint is observed MOAA/S extremes encoded as 1 versus 5; intermediate categories are excluded. RI16 uses 16-second past windows. The hybrid includes EEG descriptors and inherited ECG-derived axes; ORI uses EEG.

Hybrid minus causal WSMF: ΔAUC +0.0077, 95% CI −0.0088 to +0.0407. Hybrid minus retrospective pEEG10: +0.0116, CI −0.0160 to +0.0601. Superiority over those references is not established. Hybrid minus the experiment's TCR10 + RF control: +0.0833, CI +0.0360 to +0.1542. TCR10 + RF is not the frozen Legacy V7.

Post-hoc frozen-model coverage: AUC **0.9564**, CI **0.9287–0.9798**, **943 assessments in the same 43 recordings**. It adds 57 assessments, without retraining, and is not an independent new cohort. It does not replace the primary result.

## Interpretation

MOAA/S measures observed responsiveness, not subjective conscious experience. AUC is discrimination, not an accuracy percentage. DOSE-I was explored before this experiment. A split by recording is not previously unseen external confirmation; global uniqueness of patients is not established. The original 2,000-replicate recording bootstrap is conditional on fitted models, does not cover all model selection and does not correct multiple comparisons. The October 10 packaging recalculated metrics from frozen predictions but did not retrain or rerun the bootstrap.

Legacy V7/V8 results preserve a different target: high/low within-case pharmacological exposure defined using retrospective quartiles in VitalDB. V8 uses additional cases from the same data source, with overlapping domain counts. Within-case and pooled AUCs are separate views. V7's BIS memory control is a research comparator, not the marketed BIS product. Those targets are not combined with MOAA/S.

## Public demonstration

The web laboratory runs a deterministic generator and two public educational computations on synthetic EEG/ECG. It does not execute the private research models, simulate a patient or treatment, or reproduce clinical performance. Its spectrum, time history and technical fault handling are interactive signal illustrations. No independent clinical labels exist in the synthetic session, so AUC is unavailable.

The visual black bars are vulnerable to source inspection and selection. Only educational mathematics is under them. Private models, coefficients, weights, raw patient signals and individual clinical predictions are absent from this public site. The private research monitor Luna 0.3 described in the supplied package is a distinct local research application.

Public aggregate data: [evidence.json](evidence.json).
Relevant source documents inside the supplied private package: `INDICE_ATUAL.md`, `04_tabelas/RI16_verificacao_resultados_10-10-2026.json`, `09_RI16/PsiSense_TCR_RI16_v01/evidence/summary.json`, and `evidence/coverage_sensitivity.json`.
