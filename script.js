// ---- 1. DATA: add your own questions here ----
const questions = [
  {
    from: "+255 7XX XXX XXX",
    text: "Habari, nimetuma pesa kwa makosa kwenye namba yako. Tafadhali nirudishie TSh 50,000 haraka.",
    isScam: true,
    explain: "Tapeli hutuma ujumbe wa uongo wa muamala kisha anakuomba urudishe pesa. Angalia salio lako halisi kwa menyu rasmi ya mtandao kabla ya kutuma chochote."
  },
  {
    from: "BENKI",
    text: "Nambari yako ya siri ya mara moja ni 483920. Usimpe mtu yeyote, hata wafanyakazi wa benki.",
    isScam: false,
    explain: "Ujumbe halali wa OTP unakuja ukiwa umeufanyia ombi mwenyewe, na unakuonya usishiriki namba."
  },
  {
    from: "PROMO",
    text: "HONGERA! Umeshinda TSh 5,000,000. Tuma TSh 20,000 ada ya usajili ili upokee zawadi yako.",
    isScam: true,
    explain: "Hukushiriki shindano lolote, na zawadi halali haitaki ada mbele."
  },
  {
    from: "+255 6XX XXX XXX",
    text: "Mimi ni mfanyakazi wa M-Pesa. Akaunti yako itafungwa leo. Tuma PIN yako sasa kuthibitisha.",
    isScam: true,
    explain: "Hakuna mfanyakazi halali anayeomba PIN yako. Kamwe usimpe mtu PIN."
  },
  {
    from: "LUKU",
    text: "Umenunua umeme TSh 10,000. Token: 1234-5678-9012-3456-7890. Ahsante kwa kutumia huduma zetu.",
    isScam: false,
    explain: "Hii ni risiti ya kawaida ya ununuzi uliofanya mwenyewe, bila kuomba pesa wala kubonyeza link."
  },
  {
    from: "SMS",
    text: "TRA: Una marejesho ya kodi. Bonyeza hapa kudai: tra-marejesho.co.tz.malipo-online.com",
    isScam: true,
    explain: "Angalia sehemu ya mwisho ya anwani kabla ya '/'. Hapa kikoa halisi ni malipo-online.com, si tra.go.tz."
  },
  {
    from: "+255 7XX XXX XXX",
    text: "Mjomba, nimepata ajali, nitumie TSh 100,000 kwenye namba hii mpya haraka. Nitaeleza baadaye.",
    isScam: true,
    explain: "Namba mpya, dharura, na 'nitaeleza baadaye' ni dalili kuu. Mpigie ndugu yako kwenye namba yake ya zamani kwanza."
  },
  {
    from: "WhatsApp",
    text: "Kazi ya nyumbani! Lipwa TSh 300,000 kwa wiki. Lipia TSh 30,000 ya mafunzo kwanza ili uanze.",
    isScam: true,
    explain: "Kazi halali hailipishi mwombaji ada ya kuanza."
  },
  {
    from: "MWALIMU",
    text: "Habari wanafunzi, darasa la kesho limehamishwa kuwa saa 4 asubuhi, ukumbi ule ule. Tafadhali mjulishane.",
    isScam: false,
    explain: "Ujumbe wa kawaida bila kuomba pesa, PIN, wala link, na hakuna presha."
  },
  {
    from: "MKOPO",
    text: "Mkopo bila dhamana! Pata TSh 1,000,000 leo. Tuma ada ya TSh 15,000 kwanza kwenye namba hii.",
    isScam: true,
    explain: "Wakopeshaji halali hawakuombi utume pesa kwa namba binafsi kabla ya mkopo."
  }
];

// shuffle so the order changes every game
questions.sort(() => Math.random() - 0.5);

// ---- 2. STATE ----
let current = 0;
let score = 0;
let answered = false;

const $ = (id) => document.getElementById(id);

// ---- 3. FUNCTIONS ----
function updateCounter() {
  $("counter").textContent =
    "Swali " + (current + 1) + " / " + questions.length + "  |  Alama: " + score;
}

function showQuestion() {
  const q = questions[current];
  answered = false;
  updateCounter();
  $("sender").textContent = "Kutoka: " + q.from;
  $("message").textContent = q.text;
  $("result").classList.add("hide");
  $("btn-next").classList.add("hide");
  $("btn-real").disabled = false;
  $("btn-scam").disabled = false;
}

function checkAnswer(userSaidScam) {
  if (answered) return;
  answered = true;

  const q = questions[current];
  const correct = userSaidScam === q.isScam;
  if (correct) score++;

  $("result").textContent =
    (correct ? "Sahihi! ✅ " : "Si sahihi ❌ ") +
    "Hii ni " + (q.isScam ? "tapeli" : "halali") + ". " + q.explain;

  $("result").classList.remove("hide");
  $("btn-real").disabled = true;
  $("btn-scam").disabled = true;
  $("btn-next").textContent =
    current === questions.length - 1 ? "Ona matokeo" : "Endelea →";
  $("btn-next").classList.remove("hide");
  updateCounter();
}

function nextQuestion() {
  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  $("quiz").classList.add("hide");
  $("end").classList.remove("hide");
  $("final-score").textContent =
    "Umepata " + score + " kati ya " + questions.length + ".";
}

function restart() {
  current = 0;
  score = 0;
  questions.sort(() => Math.random() - 0.5);
  $("end").classList.add("hide");
  $("quiz").classList.remove("hide");
  showQuestion();
}

// ---- 4. CONNECT BUTTONS, THEN START ----
$("btn-real").addEventListener("click", () => checkAnswer(false));
$("btn-scam").addEventListener("click", () => checkAnswer(true));
$("btn-next").addEventListener("click", nextQuestion);
$("btn-restart").addEventListener("click", restart);

showQuestion();
