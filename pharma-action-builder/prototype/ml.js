/*
 * Pharma Action Builder: in-browser machine learning for Next Best Action.
 *
 * 1. A seeded synthetic dataset of HCP touches (email, call, CLM, 1:1,
 *    social) with HCP attributes and whether the HCP's new prescriptions
 *    rose within 30 days (the response).
 * 2. Four real classifiers written from scratch: logistic regression,
 *    a CART decision tree, a random forest and gradient-boosted trees.
 * 3. Honest evaluation on a held-out split: accuracy, precision, recall,
 *    F1, ROC AUC, a confusion matrix and permutation feature importance.
 * 4. Next Best Action: for each HCP, score every tactic with the trained
 *    model and pick the one with the highest expected value
 *    (response probability x value of a response - cost of the tactic).
 *
 * No dependencies; works from any static host or straight from disk.
 */
(function (global) {
  "use strict";

  // ── Random numbers ───────────────────────────────────────────────────────
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gauss(r) {
    const u = Math.max(r(), 1e-12), v = r();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  const sigmoid = (z) => 1 / (1 + Math.exp(-z));

  // ── Synthetic data ───────────────────────────────────────────────────────
  const SPECIALTIES = ["Oncology", "Cardiology", "Neurology", "Rheumatology", "Endocrinology", "Primary Care"];
  const REGIONS = ["Northeast", "Southeast", "Midwest", "Southwest", "West"];
  const TACTICS = ["Email", "Call", "CLM", "1:1 Meeting", "Social"];
  const TACTIC_COST = { Email: 5, Social: 8, CLM: 60, Call: 150, "1:1 Meeting": 400 };
  const VALUE_PER_RESPONSE = 2500; // illustrative margin from the added scripts after a response
  const FIRST = ["Sarah", "Michael", "Priya", "James", "Linda", "Robert", "Aisha", "David", "Elena", "Omar", "Grace", "Daniel", "Mei", "Carlos", "Hannah", "Samuel"];
  const LAST = ["Chen", "Torres", "Nair", "Whitfield", "Park", "Okafor", "Rossi", "Kim", "Patel", "Lopez", "Novak", "Haddad", "Brennan", "Ito", "Mensah", "Fischer"];

  /** The true response model (hidden from the learners). Includes interactions on purpose. */
  function trueLogit(h, tactic) {
    let z = -1.2 + 0.35 * (h.decile - 5.5) / 2.9 + 1.0 * h.rxTrend;
    if (tactic === "Email") z += 2.2 * (h.digital - 0.5) + 1.5 * (h.emailOpen - 0.35) - 0.3;
    if (tactic === "Social") z += 3.0 * (h.digital - 0.65) - 0.4;
    if (tactic === "CLM") z += 2.5 * (h.clm - 0.45) + (h.specialty === "Oncology" || h.specialty === "Neurology" ? 0.7 : -0.2);
    if (tactic === "Call") z += 0.18 * (h.calls - 6) - 1.5 * (h.digital - 0.5) + (h.specialty === "Primary Care" || h.specialty === "Cardiology" ? 0.8 : -0.3);
    if (tactic === "1:1 Meeting") z += (h.kol ? 1.8 : -0.4) + 0.08 * (h.years - 4) + (h.decile >= 8 ? 0.6 : -0.4);
    return z;
  }

  function generate(seed) {
    const r = rng(seed || 20250317);
    const pick = (xs) => xs[Math.floor(r() * xs.length)];
    const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
    const hcps = [];
    for (let i = 0; i < 2000; i++) {
      const specialty = pick(SPECIALTIES);
      const digital = clamp(0.5 + 0.22 * gauss(r) + (specialty === "Oncology" ? 0.05 : 0), 0, 1);
      hcps.push({
        id: i + 1,
        name: `Dr. ${pick(FIRST)} ${pick(LAST)}`,
        specialty,
        region: pick(REGIONS),
        decile: 1 + Math.floor(r() * 10),
        digital: +digital.toFixed(2),
        emailOpen: +clamp(0.15 + 0.45 * digital + 0.12 * gauss(r), 0, 1).toFixed(2),
        clm: +clamp(0.45 + 0.2 * gauss(r), 0, 1).toFixed(2),
        calls: Math.max(0, Math.round(6 + 3 * gauss(r))),
        kol: r() < 0.12,
        years: Math.max(0, Math.round(4 + 3 * gauss(r))),
        rxTrend: +clamp(0.25 * gauss(r), -0.8, 0.8).toFixed(2),
      });
    }
    const rows = [];
    for (const h of hcps) {
      const n = 3 + Math.floor(r() * 3);
      for (let k = 0; k < n; k++) {
        const tactic = pick(TACTICS);
        const p = sigmoid(trueLogit(h, tactic) + 0.25 * gauss(r));
        rows.push({ ...h, hcpId: h.id, tactic, responded: r() < p ? 1 : 0 });
      }
    }
    return { hcps, rows };
  }

  // ── Features ─────────────────────────────────────────────────────────────
  const FEATURES = [
    { key: "tactic", label: "Tactic (channel)", type: "cat", values: TACTICS },
    { key: "digital", label: "Digital Affinity Index", type: "num" },
    { key: "emailOpen", label: "Email Open Rate", type: "num" },
    { key: "clm", label: "CLM Engagement Score", type: "num" },
    { key: "calls", label: "Sales Call Frequency", type: "num" },
    { key: "kol", label: "KOL Affiliation", type: "num" },
    { key: "decile", label: "Prescriber Decile", type: "num" },
    { key: "rxTrend", label: "Recent Rx Trend", type: "num" },
    { key: "years", label: "Relationship Years", type: "num" },
    { key: "specialty", label: "Specialty", type: "cat", values: SPECIALTIES },
    { key: "region", label: "Region", type: "cat", values: REGIONS },
  ];

  function encoder(featureKeys) {
    const feats = FEATURES.filter((f) => featureKeys.includes(f.key) || f.key === "tactic");
    const cols = [];
    for (const f of feats) {
      if (f.type === "num") cols.push({ group: f.key, get: (r) => Number(r[f.key]) });
      else for (const v of f.values.slice(1)) cols.push({ group: f.key, get: (r) => (r[f.key] === v ? 1 : 0) });
    }
    return { feats, cols, encode: (rows) => rows.map((r) => cols.map((c) => c.get(r))) };
  }

  // ── Learners ─────────────────────────────────────────────────────────────
  function logisticRegression(X, y, opts) {
    const n = X.length, d = X[0].length;
    const mean = new Array(d).fill(0), sd = new Array(d).fill(0);
    for (const x of X) for (let j = 0; j < d; j++) mean[j] += x[j] / n;
    for (const x of X) for (let j = 0; j < d; j++) sd[j] += (x[j] - mean[j]) ** 2 / n;
    for (let j = 0; j < d; j++) sd[j] = Math.sqrt(sd[j]) || 1;
    const Z = X.map((x) => x.map((v, j) => (v - mean[j]) / sd[j]));
    const w = new Array(d).fill(0);
    let b = 0;
    const lr = 0.5, l2 = 1e-3, iters = (opts && opts.iters) || 300;
    for (let it = 0; it < iters; it++) {
      const gw = new Array(d).fill(0);
      let gb = 0;
      for (let i = 0; i < n; i++) {
        let z = b;
        for (let j = 0; j < d; j++) z += w[j] * Z[i][j];
        const e = sigmoid(z) - y[i];
        gb += e;
        for (let j = 0; j < d; j++) gw[j] += e * Z[i][j];
      }
      b -= (lr * gb) / n;
      for (let j = 0; j < d; j++) w[j] -= lr * (gw[j] / n + l2 * w[j]);
    }
    return {
      predict: (x) => {
        let z = b;
        for (let j = 0; j < d; j++) z += (w[j] * (x[j] - mean[j])) / sd[j];
        return sigmoid(z);
      },
      coefficients: w,
    };
  }

  /** Candidate split points: up to `bins` quantiles per column. */
  function thresholds(X, idx, j, bins) {
    const vals = Array.from(new Set(idx.map((i) => X[i][j]))).sort((a, b) => a - b);
    if (vals.length <= bins) return vals.slice(0, -1).map((v, k) => (v + vals[k + 1]) / 2);
    const out = [];
    for (let q = 1; q < bins; q++) out.push(vals[Math.floor((q * vals.length) / bins)]);
    return Array.from(new Set(out));
  }

  /** Regression tree on gradients (used by boosting) or class labels (CART). */
  function buildTree(X, target, idx, opts, depth, r) {
    const { maxDepth, minLeaf, featureFrac, leafValue, bins } = opts;
    const node = { value: leafValue(idx) };
    if (depth >= maxDepth || idx.length < 2 * minLeaf) return node;
    const d = X[0].length;
    let cols = [...Array(d).keys()];
    if (featureFrac < 1) {
      cols = cols.filter(() => r() < featureFrac);
      if (!cols.length) cols = [Math.floor(r() * d)];
    }
    // Variance reduction on `target` (labels or gradients).
    let sum = 0, sq = 0;
    for (const i of idx) { sum += target[i]; sq += target[i] * target[i]; }
    const parent = sq - (sum * sum) / idx.length;
    let best = null;
    for (const j of cols) {
      for (const t of thresholds(X, idx, j, bins)) {
        let ls = 0, lq = 0, ln = 0;
        for (const i of idx) if (X[i][j] <= t) { ls += target[i]; lq += target[i] * target[i]; ln++; }
        const rn = idx.length - ln;
        if (ln < minLeaf || rn < minLeaf) continue;
        const rs = sum - ls, rq = sq - lq;
        const gain = parent - (lq - (ls * ls) / ln) - (rq - (rs * rs) / rn);
        if (!best || gain > best.gain) best = { j, t, gain };
      }
    }
    if (!best || best.gain <= 1e-9) return node;
    const L = [], R = [];
    for (const i of idx) (X[i][best.j] <= best.t ? L : R).push(i);
    node.j = best.j; node.t = best.t; node.gain = best.gain;
    node.left = buildTree(X, target, L, opts, depth + 1, r);
    node.right = buildTree(X, target, R, opts, depth + 1, r);
    return node;
  }
  function treeValue(node, x) {
    while (node.left) node = x[node.j] <= node.t ? node.left : node.right;
    return node.value;
  }

  function decisionTree(X, y) {
    const idx = [...Array(X.length).keys()];
    const mean = (ii) => ii.reduce((s, i) => s + y[i], 0) / Math.max(1, ii.length);
    const tree = buildTree(X, y, idx, { maxDepth: 6, minLeaf: 30, featureFrac: 1, leafValue: mean, bins: 24 }, 0, rng(1));
    return { predict: (x) => treeValue(tree, x) };
  }

  function randomForest(X, y) {
    const r = rng(7);
    const trees = [];
    for (let k = 0; k < 40; k++) {
      const idx = Array.from({ length: X.length }, () => Math.floor(r() * X.length));
      const mean = (ii) => ii.reduce((s, i) => s + y[i], 0) / Math.max(1, ii.length);
      trees.push(buildTree(X, y, idx, { maxDepth: 7, minLeaf: 15, featureFrac: 0.5, leafValue: mean, bins: 16 }, 0, r));
    }
    return { predict: (x) => trees.reduce((s, t) => s + treeValue(t, x), 0) / trees.length };
  }

  function gradientBoosting(X, y) {
    const n = X.length;
    const base = y.reduce((a, b) => a + b, 0) / n;
    const f0 = Math.log(base / (1 - base));
    const F = new Array(n).fill(f0);
    const trees = [];
    const lr = 0.1;
    const r = rng(11);
    for (let m = 0; m < 80; m++) {
      const p = F.map(sigmoid);
      const g = y.map((yi, i) => yi - p[i]);
      const h = p.map((pi) => pi * (1 - pi));
      // Subsample rows (stochastic boosting) for speed and regularisation.
      const idx = [];
      for (let i = 0; i < n; i++) if (r() < 0.7) idx.push(i);
      const leaf = (ii) => {
        let gs = 0, hs = 0;
        for (const i of ii) { gs += g[i]; hs += h[i]; }
        return gs / (hs + 1);
      };
      const tree = buildTree(X, g, idx, { maxDepth: 3, minLeaf: 20, featureFrac: 1, leafValue: leaf, bins: 16 }, 0, r);
      trees.push(tree);
      for (let i = 0; i < n; i++) F[i] += lr * treeValue(tree, X[i]);
    }
    return { predict: (x) => sigmoid(trees.reduce((s, t) => s + lr * treeValue(t, x), f0)) };
  }

  const ALGORITHMS = {
    gbm: { label: "Gradient Boosting (XGBoost-style)", fit: gradientBoosting },
    rf: { label: "Random Forest", fit: randomForest },
    logreg: { label: "Logistic Regression", fit: logisticRegression },
    tree: { label: "Decision Tree (CART)", fit: decisionTree },
  };

  // ── Evaluation ───────────────────────────────────────────────────────────
  function auc(p, y) {
    const pairs = p.map((v, i) => [v, y[i]]).sort((a, b) => a[0] - b[0]);
    let rank = 0, sumPos = 0, nPos = 0;
    for (let i = 0; i < pairs.length; ) {
      let j = i;
      while (j < pairs.length && pairs[j][0] === pairs[i][0]) j++;
      const avg = (i + j + 1) / 2;
      for (let k = i; k < j; k++) if (pairs[k][1]) { sumPos += avg; nPos++; }
      rank = j;
      i = j;
    }
    const nNeg = pairs.length - nPos;
    return nPos && nNeg ? (sumPos - (nPos * (nPos + 1)) / 2) / (nPos * nNeg) : 0.5;
  }

  function metrics(p, y, threshold) {
    let tp = 0, fp = 0, fn = 0, tn = 0;
    p.forEach((v, i) => {
      const yhat = v >= threshold ? 1 : 0;
      if (yhat && y[i]) tp++; else if (yhat) fp++; else if (y[i]) fn++; else tn++;
    });
    const precision = tp / Math.max(1, tp + fp), recall = tp / Math.max(1, tp + fn);
    return {
      tp, fp, fn, tn,
      accuracy: (tp + tn) / y.length,
      precision, recall,
      f1: (2 * precision * recall) / Math.max(1e-9, precision + recall),
      auc: auc(p, y),
    };
  }

  function shuffleIdx(n, seed) {
    const r = rng(seed), a = [...Array(n).keys()];
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  /**
   * Train and evaluate. Splits by HCP, so no HCP appears in both train and
   * test (otherwise the score would be inflated).
   */
  function train(opts) {
    const { algorithm = "gbm", trainPct = 80, features = FEATURES.map((f) => f.key), seed } = opts || {};
    const data = generate(seed);
    const enc = encoder(features);
    const hcpOrder = shuffleIdx(data.hcps.length, 99);
    const nTrainH = Math.round((data.hcps.length * Math.min(95, Math.max(50, trainPct))) / 100);
    const trainH = new Set(hcpOrder.slice(0, nTrainH).map((i) => data.hcps[i].id));
    const trainRows = data.rows.filter((r) => trainH.has(r.hcpId));
    const testRows = data.rows.filter((r) => !trainH.has(r.hcpId));
    const Xtr = enc.encode(trainRows), ytr = trainRows.map((r) => r.responded);
    const Xte = enc.encode(testRows), yte = testRows.map((r) => r.responded);

    const t0 = performance.now();
    const model = ALGORITHMS[algorithm].fit(Xtr, ytr);
    const trainMs = performance.now() - t0;

    const pte = Xte.map(model.predict);
    const baseRate = ytr.reduce((a, b) => a + b, 0) / ytr.length;
    // Classify at the training base rate so precision and recall are balanced for an imbalanced target.
    const threshold = 0.5 * baseRate + 0.25;
    const m = metrics(pte, yte, threshold);
    const majority = Math.max(baseRate, 1 - baseRate);

    // Permutation importance: drop in test AUC when one feature group is shuffled.
    const importance = enc.feats.map((f) => {
      const cols = enc.cols.map((c, j) => (c.group === f.key ? j : -1)).filter((j) => j >= 0);
      const perm = shuffleIdx(Xte.length, 5);
      const Xp = Xte.map((x, i) => {
        const z = x.slice();
        for (const j of cols) z[j] = Xte[perm[i]][j];
        return z;
      });
      return { key: f.key, label: f.label, drop: m.auc - auc(Xp.map(model.predict), yte) };
    }).sort((a, b) => b.drop - a.drop);

    // Next Best Action for the highest-value HCPs in the test set (never seen in training).
    const testHcps = data.hcps.filter((h) => !trainH.has(h.id));
    const scored = testHcps.map((h) => {
      const options = TACTICS.map((t) => {
        const p = model.predict(enc.encode([{ ...h, tactic: t }])[0]);
        return { tactic: t, p, ev: p * VALUE_PER_RESPONSE - TACTIC_COST[t] };
      }).sort((a, b) => b.ev - a.ev);
      return { hcp: h, best: options[0], next: options[1], options };
    });
    const nba = scored.sort((a, b) => b.best.ev - a.best.ev);
    const mix = TACTICS.map((t) => ({ tactic: t, n: scored.filter((s) => s.best.tactic === t).length }));

    // Uplift of NBA over a "same tactic for everyone" policy, using the true response model.
    const trueEv = (h, t) => sigmoid(trueLogit(h, t)) * VALUE_PER_RESPONSE - TACTIC_COST[t];
    const nbaValue = scored.reduce((s, x) => s + trueEv(x.hcp, x.best.tactic), 0);
    const bestSingle = TACTICS.map((t) => ({ t, v: testHcps.reduce((s, h) => s + trueEv(h, t), 0) })).sort((a, b) => b.v - a.v)[0];

    return {
      algorithm: ALGORITHMS[algorithm].label,
      trainRows: trainRows.length,
      testRows: testRows.length,
      trainHcps: nTrainH,
      testHcps: testHcps.length,
      trainMs,
      baseRate,
      majority,
      threshold,
      metrics: m,
      importance,
      nba,
      mix,
      policy: { nbaValue, bestSingle: bestSingle.t, bestSingleValue: bestSingle.v, uplift: (nbaValue - bestSingle.v) / Math.abs(bestSingle.v) },
      sample: data.rows.slice(0, 6),
      features: enc.feats.map((f) => f.label),
    };
  }

  global.PAB_ML = { train, generate, FEATURES, TACTICS, TACTIC_COST, VALUE_PER_RESPONSE, ALGORITHMS };
})(typeof window !== "undefined" ? window : globalThis);
