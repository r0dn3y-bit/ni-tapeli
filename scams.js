// ===== SCAM TYPES: edit or add cards here =====
const SCAM_TYPES = [
  {
    icon: "💸",
    name: "Pesa ya makosa",
    how: "Anakutumia ujumbe wa muamala wa uongo, kisha anakupigia kusema alituma pesa kwa makosa na anakuomba umrudishie.",
    example: "\"Nimetuma pesa kwa makosa kwenye namba yako, tafadhali nirudishie 50,000 haraka.\"",
    defense: "Angalia salio lako kwa menyu rasmi ya mtandao, si kwa ujumbe. Kama pesa haipo, hakuna cha kurudisha."
  },
  {
    icon: "📞",
    name: "Mfanyakazi bandia wa kampuni ya simu",
    how: "Anajifanya ni mfanyakazi wa mtandao wako au benki, anasema kuna tatizo kwenye akaunti yako, kisha anakuomba PIN au namba ya uthibitisho.",
    example: "\"Mimi ni mfanyakazi wa huduma kwa wateja. Akaunti yako itafungwa leo, nipe namba ya uthibitisho.\"",
    defense: "Hakuna mfanyakazi halali anayeomba PIN yako. Kata simu, kisha piga namba rasmi ya huduma kwa wateja mwenyewe."
  },
  {
    icon: "🎁",
    name: "Zawadi au bahati nasibu ya uongo",
    how: "Anakuambia umeshinda zawadi kubwa, lakini lazima ulipe ada ya usajili au usafirishaji kwanza.",
    example: "\"Hongera! Umeshinda TSh 5,000,000. Tuma 20,000 ada ya usajili.\"",
    defense: "Hukushiriki shindano, kwa hiyo hakuna cha kushinda. Zawadi halali haitaki ulipe ili uipokee."
  },
  {
    icon: "💼",
    name: "Kazi au mkopo wa uongo",
    how: "Anaahidi kazi rahisi yenye malipo makubwa, au mkopo bila dhamana, lakini anataka ulipe ada ya mafunzo au usajili mbele.",
    example: "\"Kazi ya nyumbani, lipwa 300,000 kwa wiki. Lipia 30,000 ya mafunzo kwanza.\"",
    defense: "Kampuni halali haikulipishi ili ufanye kazi kwao. Tafuta jina la kampuni mwenyewe na uthibitishe."
  },
  {
    icon: "🚑",
    name: "Dharura ya ndugu",
    how: "Anajifanya ni ndugu au rafiki anayetumia namba mpya, anasema ana dharura na anaomba pesa haraka, na wakati mwingine anakuambia usimwambie mtu.",
    example: "\"Mjomba, nimepata ajali, nitumie 100,000 kwenye namba hii mpya, nitaeleza baadaye.\"",
    defense: "Mpigie ndugu yako kwenye namba yake ya zamani kabla ya kutuma chochote. Usifanye maamuzi kwa presha."
  },
  {
    icon: "🔗",
    name: "Link ya kuiba taarifa",
    how: "Ujumbe unaodai ni kutoka taasisi rasmi (kodi, benki, kitambulisho) na unakuelekeza kwenye tovuti ya uongo inayoiba taarifa zako.",
    example: "\"Una marejesho ya kodi. Bonyeza hapa kudai.\"",
    defense: "Usibonyeze. Fungua tovuti rasmi mwenyewe, au bandika link kwenye zana ya \"Angalia link\" hapa."
  },
  {
    icon: "📱",
    name: "Kusajili laini kwa ajili ya mtu mwingine",
    how: "Mtu anakulipa kiasi kidogo ili umsajilie laini kwa jina lako. Laini hiyo ikitumika kwa utapeli, jina lako ndilo litakalohusishwa.",
    example: "\"Sajili laini hii kwa kitambulisho chako, nitakupa 10,000.\"",
    defense: "Usisajili laini kwa ajili ya mtu mwingine. Angalia laini zilizosajiliwa kwa jina lako kwa kupiga *106#."
  }
];

function buildScamTypes() {
  const wrap = document.getElementById("types-list");
  wrap.replaceChildren();

  for (const s of SCAM_TYPES) {
    const d = document.createElement("details");
    d.className = "card type";

    const sum = document.createElement("summary");
    sum.textContent = s.icon + "  " + s.name;
    d.append(sum);

    const parts = [
      ["Inavyofanya kazi", s.how],
      ["Mfano", s.example],
      ["Jinsi ya kujilinda", s.defense],
    ];
    for (const [title, text] of parts) {
      const p = document.createElement("p");
      const b = document.createElement("b");
      b.textContent = title + ": ";
      p.append(b, document.createTextNode(text));
      d.append(p);
    }
    wrap.append(d);
  }
}

buildScamTypes();
