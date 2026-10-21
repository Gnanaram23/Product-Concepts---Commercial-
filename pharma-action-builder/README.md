# Pharma Action Builder: Next Best Action for HCP Engagement

Pharma Action Builder connects the models a commercial analytics team builds to the field rep who has to act on them. Each rep gets a personalised weekly plan for every HCP (healthcare professional) on their list: which channel to use, when, and why. Analytics teams build, monitor and deploy the models behind those plans without writing code.

**[Open the live prototype](https://gnanaram23.github.io/Product-Concepts---Commercial-/pharma-action-builder/)** · [Concept document](docs/action-builder-concept.md) · [PRD](docs/action-builder-prd.md)

![HCP Engagement Console overview](screens/02-hec-overview.png)

## The problem

Most pharma companies already have propensity models: models that score how likely an HCP is to respond to an email, a rep visit or a speaker programme. Few of those scores reach the field in usable form. They arrive as spreadsheets weeks after the model was built, so reps fall back on generic call plans. HCPs end up over-contacted with irrelevant outreach and under-served with useful information. Field outcomes also never feed back into the models.

## The two modules

**HCP Engagement Console (HEC)**, for the field:
- weekly NBA (Next Best Action) journey plan per HCP
- tactic tracking across email, calls, CLM sessions and 1:1 meetings (CLM, closed-loop marketing, is the tablet-based detailing a rep shows an HCP, with engagement captured back into the CRM)
- HCP-level performance against target
- territory heat maps showing where HCPs are responsive and where they aren't

**Analytics Workbench (AWB)**, for analytics teams:
- no-code AutoML: pick a data source (CRM, ERP, data warehouse), choose a target, train
- model monitoring for drift and accuracy
- a model library with governance and one-click deployment to the HEC

Together they make a closed loop: the model recommends, the rep acts, the outcome is captured, and the model retrains.

## Who it's for

Field representatives, commercial analytics and data science teams, commercial excellence leaders, and marketing operations and brand teams.

## Screens

| | |
|---|---|
| ![Portal](screens/01-portal-landing.png) Portal landing | ![HCP status](screens/03-hec-hcp-status.png) HCP status |
| ![Performance](screens/04-hec-performance-target.png) Performance vs target | ![Heat map](screens/05-hec-heat-map-metrics.png) Territory heat map |
| ![HCP profile](screens/07-hec-hcp-profile-dr-sarah-chen.png) HCP profile | ![Journey map](screens/07b-hec-hcp-profile-journey-map.png) HCP journey map |
| ![Create model](screens/10-awb-create-model.png) AutoML: create model | ![Monitoring](screens/12-awb-monitoring.png) Model monitoring |

All HCP names and figures in the screens are fictional.

## The workbench trains real models

In **Analytics Workbench → Create Model**, clicking *Get Result* trains a model in the browser ([`prototype/ml.js`](prototype/ml.js), no libraries). The model learns from about 8,000 synthetic HCP touches. Each touch records the tactic, attributes such as specialty, decile, digital affinity, CLM engagement and KOL status, and whether new prescriptions rose within 30 days.

- **Algorithms written from scratch:** gradient-boosted trees (XGBoost-style), random forest, logistic regression and CART.
- **Honest evaluation:** the train/test split is by HCP. The results show ROC AUC, accuracy against the always-"no" baseline, precision, recall, F1, a confusion matrix and permutation importance.
- **Next Best Action:** each held-out HCP gets the tactic with the highest expected value, which is P(response) × the value of a response minus the tactic's cost. This policy is compared with sending everyone the single best channel.

With the default settings, gradient boosting reaches a test AUC of about 0.70. Its NBA policy adds about 27% expected value over the best one-channel policy. Logistic regression cannot learn channel-by-HCP interactions, so it gains nothing. Trained models can be sent to Monitoring with their real metrics.

![Trained model with next best actions](screens/15-awb-trained-model.png)

## Prototype

[`prototype/`](prototype/) holds two static files, `index.html` and `ml.js`. Open `index.html` in any browser; there is nothing to install. Hosting options are in [DEPLOY.md](../DEPLOY.md).

## Status

Concept v2.0. The model training, evaluation and NBA scoring work on synthetic data. CRM integration, live campaign data and the closed feedback loop are specified in the [PRD](docs/action-builder-prd.md) but not built. The HCP Engagement Console screens use sample data.
