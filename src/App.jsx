import { useState, useEffect } from "react";

// ─── CONSTANTS ───
const MORTGAGE = 1647000;
const PRIME = 5.5;
const PRICE = 3175000;
const EQUITY = 1528000;

// ─── DATA ───
const PHASES = [
  {
    id: 1, label: "לפני חתימה", time: "⏰ השבוע", color: "#4f9eff",
    tasks: [
      { id: "t1", text: "להירשם כנשואים ברבנות / במשרד הפנים", tag: "דחוף", tagColor: "#f87171" },
      { id: "t2", text: "לפתוח תיק אצל עורך דין (מכוסה ע״י אבא שלה)", tag: "משפטי", tagColor: "#a78bfa" },
      { id: "t3", text: "לפגוש יועץ משכנתאות עצמאי — לקבל אישור עקרוני", tag: "בנק", tagColor: "#4f9eff" },
      { id: "t4", text: "לבקש תעודת זכאות ממשרד הבינוי — 70 ₪ בבנק", tag: "חיסכון", tagColor: "#2dd4a0" },
      { id: "t5", text: "לוודא שכל כסף ההורים נזיל ומוכן (800K)", tag: "הון עצמי", tagColor: "#f6a623" },
    ]
  },
  {
    id: 2, label: "קבלת משכנתא", time: "📅 שבועות 1–3", color: "#2dd4a0",
    tasks: [
      { id: "t6", text: "לאסוף מסמכים לבנק (ראה לשונית מסמכים)", tag: "מסמכים", tagColor: "#a78bfa" },
      { id: "t7", text: "לפנות ל-3 בנקים לפחות לקבלת הצעות", tag: "בנק", tagColor: "#4f9eff" },
      { id: "t8", text: "לתאם מס עם קופות גמל לקראת משיכה", tag: "מס", tagColor: "#f87171" },
      { id: "t9", text: "לבנות תמהיל עם יועץ — לא צמוד, ניתן למיחזור", tag: "בנק", tagColor: "#4f9eff" },
      { id: "t10", text: "לקבל אישור עקרוני בכתב מהבנק שנבחר", tag: "בנק", tagColor: "#4f9eff" },
    ]
  },
  {
    id: 3, label: "חתימת חוזה", time: "📅 שבוע 3–4", color: "#f6a623",
    tasks: [
      { id: "t11", text: "שמאות לדירה — הבנק ידרוש זאת (~2,500 ₪)", tag: "עלות", tagColor: "#f6a623" },
      { id: "t12", text: "בדיקת עו״ד — נסח טאבו, שעבודים, היתרי בנייה", tag: "משפטי", tagColor: "#a78bfa" },
      { id: "t13", text: "חתימה על חוזה רכישה", tag: "משפטי", tagColor: "#a78bfa" },
      { id: "t14", text: "תשלום מקדמה 10% — 317,500 ₪", tag: "תשלום", tagColor: "#f6a623" },
    ]
  },
  {
    id: 4, label: "סגירת עסקה", time: "📅 חודשים 1–3", color: "#a78bfa",
    tasks: [
      { id: "t15", text: "ביטוח חיים + אובדן כושר עבודה — שניכם", tag: "חובה", tagColor: "#f87171" },
      { id: "t16", text: "ביטוח מבנה לדירה", tag: "חובה", tagColor: "#f87171" },
      { id: "t17", text: "תשלום מס רכישה (~53,500 ₪) — תוך 60 יום", tag: "מס", tagColor: "#f87171" },
      { id: "t18", text: "העברת יתרת תשלום + משכנתא למוכר", tag: "תשלום", tagColor: "#f6a623" },
      { id: "t19", text: "רישום בטאבו על שמכם", tag: "משפטי", tagColor: "#a78bfa" },
      { id: "t20", text: "קבלת מפתחות", tag: "סיום!", tagColor: "#2dd4a0" },
    ]
  }
];

const DOC_GROUPS = [
  {
    title: "זהות ונישואין", docs: [
      { id: "d1", text: "צילום תעודות זהות (שניכם)" },
      { id: "d2", text: "תעודת נישואין (מהרבנות / מנהל האוכלוסין)" },
    ]
  },
  {
    title: "מסמכי הכנסה", docs: [
      { id: "d3", text: "3 תלושי שכר אחרונים — שניכם" },
      { id: "d4", text: "אישור העסקה ממעסיק — שניכם" },
      { id: "d5", text: "שומת מס אחרונה / טופס 106" },
      { id: "d6", text: "אישור מילואים לנקודות זיכוי (מאתר המילואים)" },
    ]
  },
  {
    title: "חסכונות והון עצמי", docs: [
      { id: "d7", text: "דפי בנק 3 חודשים אחרונים — שניכם" },
      { id: "d8", text: "אישורי יתרה מקופות גמל + קרנות השתלמות" },
      { id: "d9", text: "מכתבי מתנה מההורים (נוסח מאושר ע״י עו״ד)" },
      { id: "d10", text: "אישור תעודת זכאות ממשרד השיכון" },
    ]
  },
  {
    title: "מסמכי הנכס", docs: [
      { id: "d11", text: "נסח טאבו עדכני" },
      { id: "d12", text: "חוזה רכישה חתום" },
      { id: "d13", text: "דוח שמאי" },
      { id: "d14", text: "היתר בנייה + טופס 4 (אישור אכלוס)" },
    ]
  },
  {
    title: "מסמכי מילואים", docs: [
      { id: "d15", text: "אישור שירות מילואים שש שנתי (מאתר צה״ל)" },
      { id: "d16", text: "אישור ימי שירות חובה (מאכ״א)" },
    ]
  }
];

// ─── HOOK ───
function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }, [key, val]);
  return [val, setVal];
}

// ─── UTILS ───
function calcMonthly(bank) {
  const fp = (bank.fixedPct || 33) / 100;
  const fa = MORTGAGE * fp, pa = MORTGAGE * (1 - fp);
  const r1 = (bank.fixed / 100) / 12;
  const r2 = ((PRIME + (parseFloat(bank.prime) || 0)) / 100) / 12;
  const n = 300;
  const m1 = r1 > 0 ? fa * r1 / (1 - Math.pow(1 + r1, -n)) : fa / n;
  const m2 = r2 > 0 ? pa * r2 / (1 - Math.pow(1 + r2, -n)) : pa / n;
  return Math.round(m1 + m2);
}

function calcAmortization(bank) {
  const fp = (bank.fixedPct || 33) / 100;
  const fa = MORTGAGE * fp, pa = MORTGAGE * (1 - fp);
  const r1 = (bank.fixed / 100) / 12;
  const r2 = ((PRIME + (parseFloat(bank.prime) || 0)) / 100) / 12;
  const n = 300;
  const m1 = r1 > 0 ? fa * r1 / (1 - Math.pow(1 + r1, -n)) : fa / n;
  const m2 = r2 > 0 ? pa * r2 / (1 - Math.pow(1 + r2, -n)) : pa / n;
  let bal1 = fa, bal2 = pa;
  const rows = [];
  for (let year = 1; year <= 25; year++) {
    let yearInterest = 0, yearPrincipal = 0;
    for (let m = 0; m < 12; m++) {
      const int1 = bal1 * r1, int2 = bal2 * r2;
      const prin1 = m1 - int1, prin2 = m2 - int2;
      yearInterest += int1 + int2;
      yearPrincipal += prin1 + prin2;
      bal1 = Math.max(0, bal1 - prin1);
      bal2 = Math.max(0, bal2 - prin2);
    }
    rows.push({
      year,
      payment: Math.round((m1 + m2) * 12),
      interest: Math.round(yearInterest),
      principal: Math.round(yearPrincipal),
      balance: Math.round(bal1 + bal2),
    });
  }
  return rows;
}

function fmt(n) { return Math.round(n).toLocaleString("he-IL"); }

function addDays(dateStr, days) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("he-IL");
}

// ─── THEMES ───
const THEMES = {
  dark: {
    bg: "#06080f", cardBg: "#0d1421", border: "#1a2840",
    text: "#dce5f5", textMuted: "#4d6080", inputBg: "#131d2e",
    progressBg: "#1a2840", tableAlt: "#080d17",
  },
  light: {
    bg: "#f0f4f8", cardBg: "#ffffff", border: "#d5dde8",
    text: "#1a2840", textMuted: "#7a90b0", inputBg: "#e8eef5",
    progressBg: "#d5dde8", tableAlt: "#f5f8fb",
  },
};

// ─── TASK ITEM ───
function TaskItem({ task, done, onToggle, T }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex", alignItems: "flex-start", gap: 10,
        padding: "9px 0", borderBottom: `1px solid ${T.border}`,
        cursor: "pointer", transition: "opacity .15s",
        opacity: done ? 0.6 : 1,
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
        border: done ? "none" : `2px solid ${T.border}`,
        background: done ? "#2dd4a0" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all .15s", fontSize: 11, color: "#000", fontWeight: 700,
      }}>
        {done && "✓"}
      </div>
      <div>
        <div style={{
          fontSize: ".78rem", lineHeight: 1.5,
          textDecoration: done ? "line-through" : "none",
          color: done ? T.textMuted : T.text,
        }}>{task.text}</div>
        <span style={{
          fontSize: ".62rem", padding: "2px 7px", borderRadius: 10,
          marginTop: 3, display: "inline-block",
          background: task.tagColor + "22", color: task.tagColor,
        }}>{task.tag}</span>
      </div>
    </div>
  );
}

// ─── PAYMENT MILESTONES ───
const PAYMENT_MILESTONES = [
  { label: "חתימת חוזה", days: 0, amount: 0, color: "#4f9eff", desc: "מועד חתימת החוזה" },
  { label: "מקדמה 10%", days: 0, amount: 317500, color: "#f6a623", desc: `₪${(317500).toLocaleString("he-IL")} — בעת חתימה` },
  { label: "אישור עקרוני בנק", days: 14, amount: 0, color: "#2dd4a0", desc: "קבל אישור בנק בכתב" },
  { label: "מס רכישה", days: 45, amount: 53500, color: "#f87171", desc: "~₪53,500 — תוך 60 יום מחתימה" },
  { label: "יתרת תשלום + משכנתא", days: 75, amount: PRICE - 317500, color: "#a78bfa", desc: `₪${(PRICE - 317500).toLocaleString("he-IL")} — לסגירה` },
  { label: "קבלת מפתחות", days: 90, amount: 0, color: "#2dd4a0", desc: "סיום העסקה" },
];

// ─── MAIN ───
export default function MortgageManager() {
  const [theme, setTheme] = useLocalStorage("mm_theme", "dark");
  const T = THEMES[theme];

  const [tab, setTab] = useLocalStorage("mm_tab", "timeline");
  const [done, setDone] = useLocalStorage("mm_done", {});
  const [docsDone, setDocsDone] = useLocalStorage("mm_docsDone", {});
  const [banks, setBanks] = useLocalStorage("mm_banks", []);
  const [notes, setNotes] = useLocalStorage("mm_notes", "");
  const [contacts, setContacts] = useLocalStorage("mm_contacts", "");
  const [signingDate, setSigningDate] = useLocalStorage("mm_signingDate", "");

  const [bankForm, setBankForm] = useState({ name: "", fixed: "", prime: "", fixedPct: "33", fee: "", note: "" });
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [expandedBank, setExpandedBank] = useState(null);
  const [notesSaved, setNotesSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [eligForm, setEligForm] = useState({ married: true, children: 2, militaryYears: 2, reserveDays: 90, area: "center" });

  const allTasks = PHASES.flatMap(p => p.tasks);
  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter(t => done[t.id]).length;
  const pct = Math.round(doneTasks / totalTasks * 100);
  const bestBank = banks.length > 0 ? banks.reduce((a, b) => calcMonthly(a) < calcMonthly(b) ? a : b) : null;

  function toggleTask(id) { setDone(d => ({ ...d, [id]: !d[id] })); }
  function toggleDoc(id) { setDocsDone(d => ({ ...d, [id]: !d[id] })); }

  function addBank() {
    if (!bankForm.name || !bankForm.fixed) return;
    setBanks(b => [...b, {
      ...bankForm, id: Date.now(),
      fixed: parseFloat(bankForm.fixed),
      prime: parseFloat(bankForm.prime || 0),
      fixedPct: parseFloat(bankForm.fixedPct || 33),
      fee: parseFloat(bankForm.fee || 0),
    }]);
    setBankForm({ name: "", fixed: "", prime: "", fixedPct: "33", fee: "", note: "" });
  }

  function importJSON() {
    try {
      let parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) parsed = [parsed];
      const newBanks = parsed.map((b, i) => ({
        name: b.name || `בנק ${i + 1}`,
        fixed: parseFloat(b.fixed) || 0,
        prime: parseFloat(b.prime) || 0,
        fixedPct: parseFloat(b.fixedPct ?? b.fixed_pct ?? 33),
        fee: parseFloat(b.fee) || 0,
        note: b.note || "",
        id: Date.now() + i,
      }));
      setBanks(b => [...b, ...newBanks]);
      setJsonInput("");
      setJsonError("");
    } catch (e) {
      setJsonError("JSON לא תקין: " + e.message);
    }
  }

  function calcEligibility() {
    const { married, children, militaryYears, reserveDays, area } = eligForm;
    let pts = 0;
    if (married) pts += 2;
    pts += Math.min(parseInt(children) || 0, 6);
    const mil = parseInt(militaryYears) || 0;
    if (mil >= 2) pts += 2; else if (mil >= 1) pts += 1;
    pts += Math.min(Math.floor((parseInt(reserveDays) || 0) / 30) * 0.5, 4);
    const eligible = pts >= 7;
    let base = pts >= 15 ? 200000 : pts >= 10 ? 150000 : pts >= 7 ? 100000 : 0;
    const mult = area === "a" ? 2.2 : area === "b" ? 1.5 : 1;
    const cap = area === "a" ? 450000 : area === "b" ? 250000 : 200000;
    return { pts, eligible, grant: Math.min(Math.round(base * mult), cap), cap };
  }

  function exportSummary() {
    const lines = [
      "=== מנהל משכנתא — יפו ===",
      `תאריך: ${new Date().toLocaleDateString("he-IL")}`,
      "",
      "── פרטי העסקה ──",
      `מחיר דירה: ₪${fmt(PRICE)}`,
      `הון עצמי:  ₪${fmt(EQUITY)}`,
      `משכנתא:   ₪${fmt(MORTGAGE)}`,
      "",
      "── התקדמות ──",
      `משימות: ${doneTasks}/${totalTasks} (${pct}%)`,
      "",
      "── הצעות בנקים ──",
      ...(banks.length === 0 ? ["(אין הצעות)"] : banks.map(b =>
        `${b.name}: ₪${fmt(calcMonthly(b))}/חודש | קל"צ ${b.fixed}% | פריים ${(PRIME + b.prime).toFixed(2)}% | עמלה ₪${fmt(b.fee)}`
      )),
      bestBank ? `\nהכי זול: ${bestBank.name} — ₪${fmt(calcMonthly(bestBank))}/חודש` : "",
      "",
      "── הערות ──",
      notes || "(אין)",
      "",
      "── אנשי קשר ──",
      contacts || "(אין)",
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const S = {
    card: { background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 14, padding: 14, marginBottom: 10 },
    label: { fontSize: ".63rem", color: T.textMuted },
    val: { fontSize: ".82rem", fontWeight: 700 },
    input: {
      background: T.inputBg, border: `1px solid ${T.border}`, borderRadius: 8,
      padding: "7px 10px", color: T.text, fontFamily: "Heebo, sans-serif",
      fontSize: ".78rem", width: "100%", outline: "none",
    },
    btn: (bg = "#4f9eff") => ({
      background: bg, color: "#fff", border: "none", borderRadius: 8,
      padding: "9px 16px", fontFamily: "Heebo, sans-serif", fontSize: ".78rem",
      fontWeight: 700, cursor: "pointer", width: "100%",
    }),
    ghostBtn: {
      background: "none", border: `1px solid ${T.border}`, color: T.textMuted,
      fontSize: ".68rem", cursor: "pointer", padding: "4px 10px",
      borderRadius: 6, fontFamily: "Heebo, sans-serif",
    },
  };

  return (
    <div style={{
      background: T.bg, color: T.text, fontFamily: "Heebo, sans-serif",
      minHeight: "100vh", padding: "16px 13px 48px", direction: "rtl",
      transition: "background .2s, color .2s",
    }}>

      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 4 }}>
          <div style={{
            fontSize: "1.4rem", fontWeight: 900,
            background: "linear-gradient(120deg,#60a5fa,#34d399)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            מנהל משכנתא — יפו
          </div>
          <button
            onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
            style={{
              background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 20,
              padding: "4px 10px", cursor: "pointer", fontSize: ".72rem", color: T.text,
              fontFamily: "Heebo, sans-serif", transition: "all .2s", flexShrink: 0,
            }}
          >
            {theme === "dark" ? "☀ בהיר" : "● כהה"}
          </button>
        </div>
        <div style={{ fontSize: ".75rem", color: T.textMuted, marginBottom: 12 }}>
          3,175,000 ₪ | מעקב תהליך + השוואת בנקים
        </div>

        {/* SUMMARY ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 14 }}>
          {[
            { l: "מחיר דירה", v: `₪${fmt(PRICE)}`, c: "#4f9eff" },
            { l: "הון עצמי", v: `₪${fmt(EQUITY)}`, c: "#2dd4a0" },
            { l: "משכנתא", v: `₪${fmt(MORTGAGE)}`, c: "#f6a623" },
            { l: "החזר משוער", v: "7,600–8,200", c: "#a78bfa" },
          ].map(({ l, v, c }) => (
            <div key={l} style={{ ...S.card, padding: 10, marginBottom: 0 }}>
              <div style={S.label}>{l}</div>
              <div style={{ ...S.val, color: c, fontSize: ".75rem" }}>{v}</div>
            </div>
          ))}
        </div>

        {/* PROGRESS */}
        <div style={{ ...S.card, padding: "10px 14px", marginBottom: 14, textAlign: "right" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: ".7rem", color: T.textMuted }}>התקדמות כוללת</span>
            <span style={{ fontSize: ".78rem", fontWeight: 700, color: "#2dd4a0" }}>{pct}% ({doneTasks}/{totalTasks})</span>
          </div>
          <div style={{ background: T.progressBg, borderRadius: 10, height: 8, overflow: "hidden" }}>
            <div style={{
              background: "linear-gradient(90deg,#4f9eff,#2dd4a0)",
              height: "100%", width: `${pct}%`, borderRadius: 10, transition: "width .4s ease",
            }} />
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 2 }}>
        {[
          { id: "timeline", label: "תהליך" },
          { id: "banks", label: "בנקים" },
          { id: "docs", label: "מסמכים" },
          { id: "notes", label: "הערות" },
          { id: "tools", label: "כלים" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab === t.id ? T.cardBg : "transparent",
            border: `1px solid ${tab === t.id ? T.border : "transparent"}`,
            borderRadius: 20, padding: "6px 14px", fontSize: ".75rem",
            fontFamily: "Heebo, sans-serif",
            color: tab === t.id ? T.text : T.textMuted,
            cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s",
            fontWeight: tab === t.id ? 700 : 400,
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── TIMELINE TAB ── */}
      {tab === "timeline" && PHASES.map(phase => (
        <div key={phase.id} style={S.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: ".75rem",
              fontWeight: 700, flexShrink: 0,
              background: phase.color + "22", color: phase.color,
            }}>{phase.id}</div>
            <div>
              <div style={{ fontSize: ".85rem", fontWeight: 700 }}>{phase.label}</div>
              <div style={{ fontSize: ".68rem", color: T.textMuted }}>{phase.time}</div>
            </div>
            <div style={{ marginRight: "auto", fontSize: ".7rem", color: T.textMuted }}>
              {phase.tasks.filter(t => done[t.id]).length}/{phase.tasks.length}
            </div>
          </div>
          {phase.tasks.map((task, i) => (
            <div key={task.id} style={{ borderBottom: i === phase.tasks.length - 1 ? "none" : undefined }}>
              <TaskItem task={task} done={!!done[task.id]} onToggle={() => toggleTask(task.id)} T={T} />
            </div>
          ))}
        </div>
      ))}

      {/* ── BANKS TAB ── */}
      {tab === "banks" && (
        <div>
          {/* COMPARISON CHART */}
          {banks.length > 1 && (
            <div style={S.card}>
              <div style={{ fontSize: ".78rem", fontWeight: 700, color: "#4f9eff", marginBottom: 12 }}>
                השוואת החזר חודשי
              </div>
              {(() => {
                const max = Math.max(...banks.map(b => calcMonthly(b)));
                return banks
                  .slice()
                  .sort((a, b) => calcMonthly(a) - calcMonthly(b))
                  .map(bank => {
                    const monthly = calcMonthly(bank);
                    const isBest = bestBank?.id === bank.id;
                    return (
                      <div key={bank.id} style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: ".72rem", color: T.text }}>
                            {bank.name}{isBest ? " ★" : ""}
                          </span>
                          <span style={{ fontSize: ".72rem", fontWeight: 700, color: isBest ? "#2dd4a0" : T.text }}>
                            ₪{fmt(monthly)}
                          </span>
                        </div>
                        <div style={{ background: T.progressBg, borderRadius: 6, height: 10, overflow: "hidden" }}>
                          <div style={{
                            background: isBest ? "linear-gradient(90deg,#2dd4a0,#4f9eff)" : "#4f9eff88",
                            height: "100%", width: `${(monthly / max) * 100}%`,
                            borderRadius: 6, transition: "width .4s",
                          }} />
                        </div>
                      </div>
                    );
                  });
              })()}
            </div>
          )}

          {/* ADD FORM */}
          <div style={S.card}>
            <div style={{ fontSize: ".78rem", fontWeight: 700, color: "#4f9eff", marginBottom: 10 }}>הוסף הצעת בנק</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
              {[
                { key: "name", label: "שם הבנק", ph: "לאומי / הפועלים..." },
                { key: "fixed", label: 'ריבית קל"צ (%)', ph: "4.5", type: "number" },
                { key: "prime", label: "פריים +/– (%)", ph: "-0.5", type: "number" },
                { key: "fixedPct", label: 'אחוז קל"צ', ph: "33", type: "number" },
                { key: "fee", label: "עמלת פתיחה (₪)", ph: "3500", type: "number" },
                { key: "note", label: "הערה", ph: "הצעה ראשונית..." },
              ].map(f => (
                <div key={f.key}>
                  <div style={{ fontSize: ".65rem", color: T.textMuted, marginBottom: 3 }}>{f.label}</div>
                  <input
                    type={f.type || "text"}
                    placeholder={f.ph}
                    value={bankForm[f.key]}
                    onChange={e => setBankForm(b => ({ ...b, [f.key]: e.target.value }))}
                    style={S.input}
                  />
                </div>
              ))}
            </div>
            <button onClick={addBank} style={S.btn()}>הוסף הצעה</button>
          </div>

          {/* JSON IMPORT */}
          <div style={S.card}>
            <div style={{ fontSize: ".78rem", fontWeight: 700, color: "#a78bfa", marginBottom: 6 }}>ייבוא JSON</div>
            <div style={{ fontSize: ".65rem", color: T.textMuted, marginBottom: 6 }}>
              הדבק אובייקט יחיד או מערך עם שדות: name, fixed, prime, fixedPct, fee, note
            </div>
            <textarea
              value={jsonInput}
              onChange={e => { setJsonInput(e.target.value); setJsonError(""); }}
              placeholder={'{"name":"לאומי","fixed":4.3,"prime":-0.3,"fixedPct":33,"fee":3500}'}
              rows={3}
              style={{ ...S.input, resize: "vertical", fontFamily: "monospace", fontSize: ".7rem", marginBottom: 6 }}
            />
            {jsonError && <div style={{ fontSize: ".68rem", color: "#f87171", marginBottom: 6 }}>{jsonError}</div>}
            <button onClick={importJSON} style={S.btn("#a78bfa")}>ייבא</button>
          </div>

          {/* BANK CARDS */}
          {banks.length === 0 ? (
            <div style={{ textAlign: "center", color: T.textMuted, fontSize: ".78rem", padding: 24 }}>
              עדיין אין הצעות — הוסף הצעה ידנית או ייבא JSON
            </div>
          ) : banks.map(bank => {
            const monthly = calcMonthly(bank);
            const isBest = bestBank?.id === bank.id;
            const totalCost = monthly * 300 + bank.fee;
            const primeRate = PRIME + bank.prime;
            const isExpanded = expandedBank === bank.id;
            const amort = isExpanded ? calcAmortization(bank) : [];

            return (
              <div key={bank.id} style={{ ...S.card, border: `1px solid ${isBest ? "#2dd4a0" : T.border}`, position: "relative" }}>
                {isBest && (
                  <div style={{
                    position: "absolute", top: 10, left: 10,
                    background: "#2dd4a0", color: "#000",
                    fontSize: ".62rem", fontWeight: 700, padding: "2px 8px", borderRadius: 10,
                  }}>
                    הכי זול
                  </div>
                )}
                <div style={{ fontSize: ".9rem", fontWeight: 700, marginBottom: 10 }}>{bank.name}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 10 }}>
                  {[
                    { l: 'ריבית קל"צ', v: `${bank.fixed}%`, c: "#4f9eff" },
                    { l: "ריבית פריים", v: `${primeRate.toFixed(2)}%`, c: "#f6a623" },
                    { l: 'קל"צ / פריים', v: `${bank.fixedPct}% / ${100 - bank.fixedPct}%`, c: T.text },
                    { l: "עמלת פתיחה", v: `₪${fmt(bank.fee)}`, c: T.text },
                    { l: "עלות כוללת 25 שנה", v: `₪${fmt(totalCost)}`, c: "#f87171" },
                    bank.note ? { l: "הערה", v: bank.note, c: T.textMuted } : null,
                  ].filter(Boolean).map(({ l, v, c }) => (
                    <div key={l}>
                      <div style={S.label}>{l}</div>
                      <div style={{ ...S.val, color: c, fontSize: ".76rem" }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{
                  borderTop: `1px solid ${T.border}`, paddingTop: 8,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ fontSize: ".72rem", color: T.textMuted }}>החזר חודשי משוער</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#2dd4a0" }}>₪{fmt(monthly)}</span>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button
                    onClick={() => setExpandedBank(isExpanded ? null : bank.id)}
                    style={S.ghostBtn}
                  >
                    {isExpanded ? "▲ סגור לוח סילוקין" : "▼ לוח סילוקין"}
                  </button>
                  <button
                    onClick={() => setBanks(b => b.filter(x => x.id !== bank.id))}
                    style={{ ...S.ghostBtn, color: "#f87171", border: "none" }}
                  >
                    מחק
                  </button>
                </div>

                {/* AMORTIZATION TABLE */}
                {isExpanded && (
                  <div style={{ marginTop: 12, overflowX: "auto" }}>
                    <div style={{ fontSize: ".68rem", color: T.textMuted, marginBottom: 6 }}>לוח סילוקין — סיכום שנתי</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".64rem" }}>
                      <thead>
                        <tr>
                          {["שנה", "תשלום שנתי", "ריבית", "קרן", "יתרה"].map(h => (
                            <th key={h} style={{
                              padding: "5px 6px", textAlign: "right",
                              color: T.textMuted, fontWeight: 600,
                              borderBottom: `1px solid ${T.border}`,
                            }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {amort.map((row, i) => (
                          <tr key={row.year} style={{ background: i % 2 === 0 ? "transparent" : T.tableAlt }}>
                            <td style={{ padding: "4px 6px", color: T.textMuted }}>{row.year}</td>
                            <td style={{ padding: "4px 6px" }}>₪{fmt(row.payment)}</td>
                            <td style={{ padding: "4px 6px", color: "#f87171" }}>₪{fmt(row.interest)}</td>
                            <td style={{ padding: "4px 6px", color: "#2dd4a0" }}>₪{fmt(row.principal)}</td>
                            <td style={{ padding: "4px 6px", color: "#4f9eff" }}>₪{fmt(row.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ ...S.card, fontSize: ".73rem", color: T.textMuted, lineHeight: 1.8 }}>
            <b style={{ color: T.text }}>טיפים:</b><br />
            • פנה לפחות ל-3 בנקים — הפועלים, לאומי, מזרחי-טפחות, דיסקונט<br />
            • תמיד יש מקום למשא ומתן — אל תקבל הצעה ראשונה<br />
            • תמהיל מומלץ 2026: ~33% קל״צ + ~67% פריים לא צמוד<br />
            • בקש מסלולים ניתנים למיחזור ללא קנס גבוה
          </div>
        </div>
      )}

      {/* ── DOCS TAB ── */}
      {tab === "docs" && DOC_GROUPS.map(group => {
        const total = group.docs.length;
        const doneCount = group.docs.filter(d => docsDone[d.id]).length;
        return (
          <div key={group.title} style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: ".78rem", fontWeight: 700, color: "#f6a623" }}>{group.title}</div>
              <div style={{ fontSize: ".68rem", color: T.textMuted }}>{doneCount}/{total}</div>
            </div>
            {group.docs.map((doc, i) => (
              <div
                key={doc.id}
                onClick={() => toggleDoc(doc.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "7px 0", cursor: "pointer",
                  borderBottom: i < group.docs.length - 1 ? `1px solid ${T.border}` : "none",
                  opacity: docsDone[doc.id] ? 0.5 : 1,
                }}
              >
                <div style={{
                  width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                  border: docsDone[doc.id] ? "none" : `2px solid ${T.border}`,
                  background: docsDone[doc.id] ? "#2dd4a0" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, color: "#000", fontWeight: 700, transition: "all .15s",
                }}>{docsDone[doc.id] && "✓"}</div>
                <div style={{
                  fontSize: ".75rem",
                  textDecoration: docsDone[doc.id] ? "line-through" : "none",
                  color: docsDone[doc.id] ? T.textMuted : T.text,
                }}>{doc.text}</div>
              </div>
            ))}
          </div>
        );
      })}

      {/* ── NOTES TAB ── */}
      {tab === "notes" && (
        <div>
          {[
            {
              key: "notes", val: notes, set: setNotes,
              title: "הערות ותיעוד שיחות", color: "#a78bfa",
              ph: `תעד כאן שיחות עם בנקים, יועצים, עורכי דין...\n\nלדוגמה:\n15/05 — שיחה עם יועץ בנק לאומי. הצעה: 4.3% קל"צ, פריים-0.3%.`,
            },
            {
              key: "contacts", val: contacts, set: setContacts,
              title: "אנשי קשר", color: "#4f9eff",
              ph: "עורך דין: ___\nיועץ משכנתאות: ___\nסוכן ביטוח: ___\nשמאי: ___\nמוכר / נציג מוכר: ___",
            },
          ].map(({ key, val, set, title, ph, color }) => (
            <div key={key} style={S.card}>
              <div style={{ fontSize: ".78rem", fontWeight: 700, color, marginBottom: 8 }}>{title}</div>
              <textarea
                value={val}
                onChange={e => set(e.target.value)}
                placeholder={ph}
                rows={6}
                style={{ ...S.input, resize: "vertical", lineHeight: 1.6 }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                <button onClick={() => { setNotesSaved(true); setTimeout(() => setNotesSaved(false), 2000); }}
                  style={{ ...S.btn(color), width: "auto", padding: "7px 16px" }}>
                  שמור
                </button>
                {notesSaved && <span style={{ fontSize: ".68rem", color: "#2dd4a0" }}>נשמר</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TOOLS TAB ── */}
      {tab === "tools" && (
        <div>
          {/* PAYMENT TIMELINE */}
          <div style={S.card}>
            <div style={{ fontSize: ".78rem", fontWeight: 700, color: "#f6a623", marginBottom: 10 }}>לוח תשלומים</div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: ".65rem", color: T.textMuted, marginBottom: 3 }}>תאריך חתימת חוזה (משוער)</div>
              <input
                type="date"
                value={signingDate}
                onChange={e => setSigningDate(e.target.value)}
                style={S.input}
              />
            </div>
            <div style={{ position: "relative", paddingRight: 28 }}>
              <div style={{
                position: "absolute", right: 11, top: 6, bottom: 6,
                width: 2, background: T.border, borderRadius: 2,
              }} />
              {PAYMENT_MILESTONES.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", marginBottom: 18, position: "relative" }}>
                  <div style={{
                    position: "absolute", right: -28, top: 4,
                    width: 12, height: 12, borderRadius: "50%",
                    background: m.color, border: `2px solid ${T.bg}`, flexShrink: 0,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: ".78rem", fontWeight: 700, color: m.color }}>{m.label}</span>
                      {signingDate && (
                        <span style={{ fontSize: ".64rem", color: T.textMuted }}>
                          {m.days === 0
                            ? new Date(signingDate + "T12:00:00").toLocaleDateString("he-IL")
                            : `~${addDays(signingDate, m.days)}`}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: ".67rem", color: T.textMuted }}>{m.desc}</div>
                    {m.amount > 0 && (
                      <div style={{ fontSize: ".72rem", fontWeight: 700, color: m.color, marginTop: 2 }}>
                        ₪{fmt(m.amount)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ELIGIBILITY CALCULATOR */}
          <div style={S.card}>
            <div style={{ fontSize: ".78rem", fontWeight: 700, color: "#2dd4a0", marginBottom: 4 }}>
              מחשבון זכאות למשכנתא
            </div>
            <div style={{ fontSize: ".63rem", color: T.textMuted, marginBottom: 10 }}>
              הערכה בלבד — אינה מחליפה ייעוץ מקצועי
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              <label style={{ gridColumn: "1/-1", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: ".75rem" }}>
                <input
                  type="checkbox"
                  checked={eligForm.married}
                  onChange={e => setEligForm(f => ({ ...f, married: e.target.checked }))}
                  style={{ width: 16, height: 16, accentColor: "#2dd4a0" }}
                />
                נשוי/ה
              </label>
              {[
                { key: "children", label: "מספר ילדים", type: "number", min: 0 },
                { key: "militaryYears", label: "שנות שירות סדיר", type: "number", min: 0, max: 4 },
                { key: "reserveDays", label: "סה״כ ימי מילואים", type: "number", min: 0 },
              ].map(f => (
                <div key={f.key}>
                  <div style={{ fontSize: ".65rem", color: T.textMuted, marginBottom: 3 }}>{f.label}</div>
                  <input
                    type={f.type}
                    min={f.min}
                    max={f.max}
                    value={eligForm[f.key]}
                    onChange={e => setEligForm(f2 => ({ ...f2, [f.key]: e.target.value }))}
                    style={S.input}
                  />
                </div>
              ))}
              <div>
                <div style={{ fontSize: ".65rem", color: T.textMuted, marginBottom: 3 }}>אזור עדיפות</div>
                <select
                  value={eligForm.area}
                  onChange={e => setEligForm(f => ({ ...f, area: e.target.value }))}
                  style={S.input}
                >
                  <option value="center">מרכז / ללא עדיפות</option>
                  <option value="b">עדיפות לאומית ב׳</option>
                  <option value="a">עדיפות לאומית א׳</option>
                </select>
              </div>
            </div>
            {(() => {
              const { pts, eligible, grant, cap } = calcEligibility();
              return (
                <div style={{
                  background: eligible ? "#2dd4a018" : "#f8717118",
                  border: `1px solid ${eligible ? "#2dd4a044" : "#f8717144"}`,
                  borderRadius: 10, padding: 12,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: ".75rem" }}>ניקוד משוער: <b>{pts.toFixed(1)}</b></span>
                    <span style={{ fontSize: ".75rem", fontWeight: 700, color: eligible ? "#2dd4a0" : "#f87171" }}>
                      {eligible ? "זכאי" : "לא זכאי (נדרש 7+ נקודות)"}
                    </span>
                  </div>
                  {eligible && (
                    <>
                      <div style={{ fontSize: ".78rem", marginBottom: 4 }}>
                        הלוואת זכאות משוערת:{" "}
                        <b style={{ color: "#2dd4a0" }}>₪{fmt(grant)}</b>
                      </div>
                      <div style={{ fontSize: ".63rem", color: T.textMuted }}>
                        בריבית מסובסדת | מקסימום באזור זה: ₪{fmt(cap)}
                      </div>
                    </>
                  )}
                </div>
              );
            })()}
          </div>

          {/* EXPORT */}
          <div style={S.card}>
            <div style={{ fontSize: ".78rem", fontWeight: 700, color: "#a78bfa", marginBottom: 6 }}>ייצוא סיכום</div>
            <div style={{ fontSize: ".65rem", color: T.textMuted, marginBottom: 10 }}>
              מעתיק ללוח: פרטי עסקה, הצעות בנקים, התקדמות משימות, הערות
            </div>
            <button onClick={exportSummary} style={S.btn(copied ? "#2dd4a0" : "#a78bfa")}>
              {copied ? "הועתק!" : "העתק סיכום ללוח"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
