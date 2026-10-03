const byId = (id) => document.getElementById(id);

// ---------- TABS ----------
const PANELS = ["check", "quiz", "types", "help"];

function showTab(name) {
  for (const p of PANELS) {
    byId("panel-" + p).classList.toggle("hide", p !== name);
    byId("tab-btn-" + p).classList.toggle("active", p === name);
  }
}
for (const p of PANELS) {
  byId("tab-btn-" + p).addEventListener("click", () => showTab(p));
}

// ---------- LINK / DOMAIN HELPERS (data lives in rules.js) ----------
const URL_RE = new RegExp("(?:https?:\\/\\/)?((?:[a-z0-9-]+\\.)+(?:" + TLDS + "))(?![a-z0-9-])", "g");

function findHosts(t) {
  return [...t.matchAll(URL_RE)].map((m) => m[1]);
}

// "tra-marejesho.co.tz.malipo-online.com" -> "malipo-online.com"
function registrable(host) {
  const p = host.split(".");
  const last2 = p.slice(-2).join(".");
  return TWO_PART_TLDS.includes(last2) ? p.slice(-3).join(".") : last2;
}

const labels = (s) => s.split(/[.-]/);

// A brand name appears in the host, but NOT in the real (registrable) domain
function fakeBrandHosts(t) {
  return findHosts(t).filter((h) => {
    const realLabels = labels(registrable(h));
    return labels(h).some((l) => BRANDS.includes(l) && !realLabels.includes(l));
  });
}

// ---------- ANALYZE ----------
function analyze(raw) {
  const t = raw.toLowerCase();
  const hits = [];
  let score = 0;

  for (const rule of RULES) {
    const res = rule.test(t);
    if (res) {
      hits.push({ ...rule, detail: typeof res === "string" ? res : "" });
      score += rule.points;
    }
  }

  const safe = SAFE_RE.test(t);
  if (safe) score = Math.max(0, score - 2);
  return { score, hits, safe };
}

function verdict(score) {
  if (score === 0) return { cls: "ok", title: "Hakuna alama nyekundu zilizoonekana",
    text: "Hii haimaanishi ni salama 100%. Kama ujumbe unaomba pesa au taarifa zako, thibitisha kwa namba rasmi." };
  if (score <= 2) return { cls: "warn", title: "Tahadhari: alama chache zimepatikana",
    text: "Usiamini ujumbe huu bado. Thibitisha kabla ya kufanya chochote." };
  if (score <= 5) return { cls: "bad", title: "Tuhuma kubwa: huenda ni tapeli",
    text: "Usitume pesa wala taarifa yoyote. Thibitisha kwa namba rasmi ya kampuni." };
  return { cls: "bad", title: "Karibu hakika ni tapeli 🚨",
    text: "Usijibu, usibonyeze link, usitume pesa. Futa ujumbe huu na uripoti kwa kampuni yako ya simu." };
}

// ---------- SHOW THE RESULT (textContent only, never innerHTML) ----------
function render(raw) {
  const box = byId("check-result");
  box.replaceChildren();
  box.classList.remove("hide", "ok", "warn", "bad");

  if (!raw.trim()) {
    box.classList.add("warn");
    box.textContent = "Bandika ujumbe kwanza.";
    return;
  }

  const { score, hits, safe } = analyze(raw);
  const v = verdict(score);
  box.classList.add(v.cls);

  const h = document.createElement("h3");
  h.textContent = v.title + "  (alama: " + score + ")";
  const p = document.createElement("p");
  p.textContent = v.text;
  box.append(h, p);

  if (safe) {
    const note = document.createElement("p");
    note.className = "why";
    note.textContent = "👍 Ujumbe una onyo la kutoshiriki namba, ambayo ni ishara nzuri.";
    box.append(note);
  }

  if (hits.length) {
    const ul = document.createElement("ul");
    for (const hit of hits) {
      const li = document.createElement("li");
      const b = document.createElement("b");
      b.textContent = hit.label + (hit.detail ? " (" + hit.detail + ")" : "") + "  +" + hit.points;
      const why = document.createElement("div");
      why.className = "why";
      why.textContent = hit.why;
      li.append(b, why);
      ul.append(li);
    }
    box.append(ul);
  }
}

// ---------- "HOW IT WORKS" (built from RULES, so it never goes stale) ----------
function buildHowItWorks() {
  const body = byId("how-body");
  body.replaceChildren();

  const intro = document.createElement("p");
  intro.textContent = "Zana hii hutafuta alama nyekundu zinazojulikana za utapeli. Kila alama ina pointi, na pointi zikijumlishwa zinatoa jibu. Ni makadirio, si uamuzi wa mwisho.";

  const meta = document.createElement("p");
  meta.className = "why";
  meta.textContent = "Kanuni " + RULES.length + " | Zimesasishwa: " + RULES_UPDATED;

  const ul = document.createElement("ul");
  for (const r of RULES) {
    const li = document.createElement("li");
    const b = document.createElement("b");
    b.textContent = r.label + "  (+" + r.points + ")";
    const why = document.createElement("div");
    why.className = "why";
    why.textContent = r.why;
    li.append(b, why);
    ul.append(li);
  }
  body.append(intro, meta, ul);
}

// ---------- BUTTONS ----------
const EXAMPLE = "Hongera! Umeshinda TSh 5,000,000 kwenye promosheni. Tuma TSh 20,000 ada ya usajili haraka ili upokee zawadi yako: bit.ly/zawadi-leo";

byId("btn-analyze").addEventListener("click", () => render(byId("msg-input").value));
byId("btn-example").addEventListener("click", () => { byId("msg-input").value = EXAMPLE; });
byId("btn-clear").addEventListener("click", () => {
  byId("msg-input").value = "";
  byId("check-result").classList.add("hide");
});

// ---------- SHARE (WhatsApp) + REPORT (GitHub Issues) ----------
const SHARE_TEXT = "Jaribu zana hii ya kuangalia ujumbe wa utapeli kabla ya kuuamini: ";
byId("btn-share").href = "https://wa.me/?text=" + encodeURIComponent(SHARE_TEXT + window.location.href);

const REPORT_BODY =
  "Ujumbe (ONDOA majina, namba za simu na taarifa binafsi kabla ya kutuma):\n\n\n" +
  "Uliupokea vipi? (SMS / WhatsApp / simu):\n\n" +
  "Kwa nini unadhani ni utapeli?\n";
byId("btn-report").href =
  "https://github.com/r0dn3y-bit/ni-tapeli/issues/new?title=" +
  encodeURIComponent("Ujumbe mpya wa utapeli") +
  "&body=" + encodeURIComponent(REPORT_BODY);

buildHowItWorks();

// ---------- LINK CHECKER (reads the text of the address, never opens it) ----------
function checkLink(raw) {
  const box = byId("link-result");
  box.replaceChildren();
  box.classList.remove("hide", "ok", "warn", "bad");

  const text = raw.trim();
  if (!text) {
    box.classList.add("warn");
    box.textContent = "Bandika link kwanza.";
    return;
  }

  let u;
  try {
    u = new URL(/^[a-z]+:\/\//i.test(text) ? text : "https://" + text);
  } catch {
    box.classList.add("warn");
    box.textContent = "Hii haionekani kama link sahihi.";
    return;
  }

  const host = u.hostname.toLowerCase();
  const real = registrable(host);
  const flags = [];

  const fakeBrand = labels(host).some((l) => BRANDS.includes(l) && !labels(real).includes(l));
  if (fakeBrand)
    flags.push({ pts: 4, text: "Jina la taasisi limo kwenye anwani, lakini si tovuti halisi ya taasisi hiyo." });
  if (SHORTENERS.includes(host))
    flags.push({ pts: 2, text: "Link fupi huficha unakoenda kweli." });
  if (host.includes("xn--"))
    flags.push({ pts: 3, text: "Ina herufi zinazoonekana kama za kawaida lakini si zile zile (mbinu ya kuiga)." });
  if (/^\d+\.\d+\.\d+\.\d+$/.test(host))
    flags.push({ pts: 3, text: "Ni namba ya IP badala ya jina la tovuti. Taasisi halisi hazitumi hivi." });
  if (u.username)
    flags.push({ pts: 3, text: "Ina '@' ndani ya link. Tovuti halisi ni ile iliyo BAADA ya '@'." });
  if (u.protocol === "http:")
    flags.push({ pts: 1, text: "Haitumii HTTPS (muunganisho usio salama)." });
  if (host.split(".").length - real.split(".").length >= 3)
    flags.push({ pts: 2, text: "Ina vipande vingi mbele ya jina halisi, mbinu ya kuficha tovuti halisi." });

  const score = flags.reduce((sum, f) => sum + f.pts, 0);
  const cls = score === 0 ? "ok" : score <= 2 ? "warn" : "bad";
  box.classList.add(cls);

  const h = document.createElement("h3");
  h.textContent = score === 0 ? "Hakuna dalili za wazi kwenye anwani"
                : score <= 2 ? "Tahadhari: dalili chache" : "Tuhuma kubwa: usibonyeze 🚨";
  const p = document.createElement("p");
  p.textContent = "Tovuti halisi ya link hii ni: ";
  const b = document.createElement("b");
  b.textContent = real;
  p.append(b);
  box.append(h, p);

  if (real.endsWith(".go.tz")) {
    const g = document.createElement("p");
    g.className = "why";
    g.textContent = "👍 Inaishia .go.tz, anwani ya taasisi za serikali ya Tanzania. Ni dalili nzuri, si dhamana. Angalia anwani nzima.";
    box.append(g);
  }

  if (flags.length) {
    const ul = document.createElement("ul");
    for (const f of flags) {
      const li = document.createElement("li");
      li.textContent = f.text + "  +" + f.pts;
      ul.append(li);
    }
    box.append(ul);
  }
  if (score === 0) {
    const n = document.createElement("p");
    n.className = "why";
    n.textContent = "Hii haimaanishi link ni salama. Kama uliipokea bila kutarajia, fungua tovuti rasmi mwenyewe.";
    box.append(n);
  }
}

byId("btn-link").addEventListener("click", () => checkLink(byId("link-input").value));
