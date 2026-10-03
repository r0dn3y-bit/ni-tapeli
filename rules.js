// ===== RULES FILE: edit this when you learn about a new scam pattern =====
const RULES_UPDATED = "2026-10-02";   // <- change this date every time you edit

const BRANDS = ["tra", "nida", "mpesa", "vodacom", "tigo", "airtel", "halotel",
                "nmb", "crdb", "nbc", "tanesco", "luku", "selcom", "tcra"];
const SHORTENERS = ["bit.ly", "tinyurl.com", "cutt.ly", "is.gd", "rb.gy"];
const TWO_PART_TLDS = ["co.tz", "go.tz", "or.tz", "ac.tz", "ne.tz", "co.ke", "go.ke"];
const TLDS = "tz|com|net|org|info|xyz|top|click|link|online|site|club|biz|ly|me|cc|app|shop|live|icu|gd|gy";

// A message that WARNS you not to share codes is a good sign
const SAFE_RE = /(usimpe mtu|usishiriki|do not share|never share|don't share)/;

// test(t) gets the lowercased message.
// Return false = not found, true = found, or a string = found + detail.
const RULES = [
  {
    points: 4,
    label: "Anaomba PIN, nywila au OTP",
    why: "Benki na kampuni za simu hazikuombi PIN yako kamwe.",
    test: (t) => /(tuma|nipe|nitumie|toa|ingiza|thibitisha|weka|send|share|give|enter|confirm)[^.!?\n]{0,40}(pin|nywila|namba ya siri|nambari ya siri|neno la siri|password|otp)/.test(t),
  },
  {
    points: 4,
    label: "Anataka ulipe ada ili upokee kitu",
    why: "Zawadi, mkopo au kazi halali haihitaji ulipe mbele.",
    test: (t) =>
      /(tuma|lipa|lipia|toa|weka)[^.!?\n]{0,40}\b(ada|usajili|mafunzo|gharama)/.test(t) ||
      /\bada\b[^.!?\n]{0,40}\b(usajili|kupokea|kupata|kuanza|zawadi|mkopo|kwanza)/.test(t),
  },
  {
    points: 3,
    label: "Anadai alituma pesa kwa makosa na anataka urudishe",
    why: "Hii ni njia ya kawaida ya utapeli. Angalia salio lako halisi kwanza.",
    test: (t) =>
      (/kwa makosa|by mistake/.test(t) && /rudisha|nirudishie|return|refund/.test(t)) ||
      /nirudishie/.test(t),
  },
  {
    points: 4,
    label: "Kikoa cha link kinajifanya taasisi rasmi",
    why: "Taasisi halisi ni sehemu ya mwisho ya anwani (kabla ya '/'), si jina lililo mwanzoni.",
    test: (t) => {
      const bad = fakeBrandHosts(t);
      return bad.length ? bad.join(", ") : false;
    },
  },
  {
    points: 2,
    label: "Link fupi iliyofichwa",
    why: "Link fupi huficha unakoenda kweli.",
    test: (t) => {
      const s = findHosts(t).filter((h) => SHORTENERS.includes(h));
      return s.length ? s.join(", ") : false;
    },
  },
  {
    points: 1,
    label: "Ina link",
    why: "Usibonyeze link kwenye ujumbe usiotarajia. Fungua tovuti rasmi mwenyewe.",
    test: (t) =>
      findHosts(t).length > 0 &&
      fakeBrandHosts(t).length === 0 &&
      !findHosts(t).some((h) => SHORTENERS.includes(h)),
  },
  {
    points: 2,
    label: "Anasema umeshinda zawadi",
    why: "Hukushiriki shindano lolote, kwa hiyo hakuna cha kushinda.",
    test: (t) => /(hongera|umeshinda|umechaguliwa|bahati nasibu|promosheni|congratulations|you have won|you won|winner)/.test(t),
  },
  {
    points: 2,
    label: "Anatishia kufunga akaunti yako",
    why: "Tapeli hutumia hofu ili ufanye haraka bila kufikiri.",
    test: (t) => /(akaunti yako (itafungwa|imefungwa|imezuiwa|itazuiwa|itafutwa)|account (will be )?(blocked|suspended|closed|deactivated))/.test(t),
  },
  {
    points: 1,
    label: "Anakupa presha ya haraka",
    why: "Ujumbe halali hauhitaji ufanye maamuzi ndani ya dakika chache.",
    test: (t) => /(haraka|sasa hivi|mara moja|ndani ya saa|masaa \d+|leo tu|urgent|immediately|last chance|usichelewe)/.test(t),
  },
  {
    points: 1,
    label: "Anajitambulisha kama mfanyakazi wa kampuni",
    why: "Mtu yeyote anaweza kusema hivyo. Piga namba rasmi ya huduma kwa wateja kuthibitisha.",
    test: (t) => /(mfanyakazi wa|huduma kwa wateja|customer (care|service)|afisa wa)/.test(t),
  },
  {
    points: 2,
    label: "Namba mpya au dharura ya ndugu",
    why: "Mpigie ndugu yako kwenye namba yake ya zamani kabla ya kutuma pesa.",
    test: (t) => /(namba mpya|nambari mpya|new number|nimepata ajali|nimekamatwa|niko hospitali|niko polisi)/.test(t),
  },
  {
    points: 2,
    label: "Mkopo bila dhamana",
    why: "Wakopeshaji halali hawakuombi utume pesa kwa namba binafsi.",
    test: (t) => /(mkopo bila dhamana|mkopo wa haraka|bila dhamana|loan without)/.test(t),
  },
  {
    points: 2,
    label: "Ahadi ya kazi rahisi yenye malipo makubwa",
    why: "Kazi isiyo na vigezo vyovyote lakini yenye malipo makubwa mara nyingi ni utapeli.",
    test: (t) => /(kazi ya nyumbani|work from home|lipwa[^.!?\n]{0,30}kwa (wiki|siku))/.test(t),
  },
  {
    points: 2,
    label: "Anakuambia usimwambie mtu",
    why: "Tapeli hataki umuulize mtu mwingine kabla ya kutuma pesa.",
    test: (t) => /(usimwambie|usimuambie|usiwaambie|siri kati yetu|don't tell|do not tell)/.test(t),
  },
];
