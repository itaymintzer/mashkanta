import { useState, useEffect, useCallback } from "react";

const MORTGAGE = 1647000;
const PRIME = 5.5;
const PRICE = 3175000;
const EQUITY = 1528000;

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
      { id: "t20", text: "קבלת מפתחות 🎉", tag: "סיום!", tagColor: "#2dd4a0" },
    ]
  }
];

const DOC_GROUPS = [
  {
    title: "👤 זהות ונישואין", docs: [
      { id: "d1", text: "צילום תעודות זהות (שניכם)" },
      { id: "d2", text: "תעודת נישואין (מהרבנות / מנהל האוכלוסין)" },
    ]
  },
  {
    title: "💰 מסמכי הכנסה", docs: [
      { id: "d3", text: "3 תלושי שכר אחרונים — שניכם" },
      { id: "d4", text: "אישור העסקה ממעסיק — שניכם" },
      { id: "d5", text: "שומת מס אחרונה / טופס 106" },
      { id: "d6", text: "אישור מילואים לנקודות זיכוי (מאתר המילואים)" },
    ]
  },
  {
    title: "🏦 חסכונות והון עצמי", docs: [
      { id: "d7", text: "דפי בנק 3 חודשים אחרונים — שניכם" },
      { id: "d8", text: "אישורי יתרה מקופות גמל + קרנות השתלמות" },
      { id: "d9", text: "מכתבי מתנה מההורים (נוסח מאושר ע״י עו״ד)" },
      { id: "d10", text: "אישור תעודת זכאות ממשרד השיכון" },
    ]
  },
  {
    title: "🏠 מסמכי הנכס", docs: [
      { id: "d11", text: "נסח טאבו עדכני" },
      { id: "d12", text: "חוזה רכישה חתום" },
      { id: "d13", text: "דוח שמאי" },
      { id: "d14", text: "היתר בנייה + טופס 4 (אישור אכלוס)" },
    ]
  },
  {
    title: "⚔️ מסמכי מילואים", docs: [
      { id: "d15", text: "אישור שירות מילואים שש שנתי (מאתר צה״ל)" },
      { id: "d16", text: "אישור ימי שירות חובה (מאכ״א)" },
    ]
  }
];

function calcMonthly(bank) {
  const fp = (bank.fixedPct || 33) / 100;
  const pp = 1 - fp;
  const fa = MORTGAGE * fp, pa = MORTGAGE * pp;
  const r1 = (bank.fixed / 100) / 12;
  const r2 = ((PRIME + (parseFloat(bank.prime) || 0)) / 100) / 12;
  const n = 300;
  const m1 = r1 > 0 ? fa * r1 / (1 - Math.pow(1 + r1, -n)) : fa / n;
  const m2 = r2 > 0 ? pa * r2 / (1 - Math.pow(1 + r2, -n)) : pa / n;
  return Math.round(m1 + m2);
}

function fmt(n) { return n.toLocaleString("he-IL"); }

// ─── TASK CHECK ───
function TaskItem({ task, done, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex", alignItems: "flex-start", gap: 10,
        padding: "9px 0", borderBottom: "1px solid #0d1422",
        cursor: "pointer", transition: "opacity .15s",
        opacity: done ? 0.6 : 1
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
        border: done ? "none" : "2px solid #1a2840",
        background: done ? "#2dd4a0" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all .15s", fontSize: 11, color: "#000", fontWeight: 700
      }}>
        {done && "✓"}
      </div>
      <div>
        <div style={{
          fontSize: ".78rem", lineHeight: 1.5,
          textDecoration: done ? "line-through" : "none",
          color: done ? "#4d6080" : "#dce5f5"
        }}>{task.text}</div>
        <span style={{
          fontSize: ".62rem", padding: "2px 7px", borderRadius: 10,
          marginTop: 3, display: "inline-block",
          background: task.tagColor + "22", color: task.tagColor
        }}>{task.tag}</span>
      </div>
    </div>
  );
}

// ─── MAIN ───
export default function MortgageManager() {
  const [tab, setTab] = useState("timeline");
  const [done, setDone] = useState({});
  const [docsDone, setDocsDone] = useState({});
  const [banks, setBanks] = useState([]);
  const [notes, setNotes] = useState("");
  const [contacts, setContacts] = useState("");
  const [bankForm, setBankForm] = useState({ name: "", fixed: "", prime: "", fixedPct: "33", fee: "", note: "" });
  const [notesSaved, setNotesSaved] = useState(false);

  const allTasks = PHASES.flatMap(p => p.tasks);
  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter(t => done[t.id]).length;
  const pct = Math.round(doneTasks / totalTasks * 100);

  const bestBank = banks.length > 0 ? banks.reduce((a, b) => calcMonthly(a) < calcMonthly(b) ? a : b) : null;

  function toggleTask(id) { setDone(d => ({ ...d, [id]: !d[id] })); }
  function toggleDoc(id) { setDocsDone(d => ({ ...d, [id]: !d[id] })); }

  function addBank() {
    if (!bankForm.name || !bankForm.fixed) return;
    setBanks(b => [...b, { ...bankForm, id: Date.now(), fixed: parseFloat(bankForm.fixed), prime: parseFloat(bankForm.prime || 0), fixedPct: parseFloat(bankForm.fixedPct || 33), fee: parseFloat(bankForm.fee || 0) }]);
    setBankForm({ name: "", fixed: "", prime: "", fixedPct: "33", fee: "", note: "" });
  }

  function saveNotes() {
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  }

  const S = { // styles
    card: { background: "#0d1421", border: "1px solid #1a2840", borderRadius: 14, padding: 14, marginBottom: 10 },
    label: { fontSize: ".63rem", color: "#4d6080" },
    val: { fontSize: ".82rem", fontWeight: 700 },
    input: {
      background: "#131d2e", border: "1px solid #1a2840", borderRadius: 8,
      padding: "7px 10px", color: "#dce5f5", fontFamily: "Heebo, sans-serif",
      fontSize: ".78rem", width: "100%", outline: "none"
    },
    btn: {
      background: "#4f9eff", color: "#000", border: "none", borderRadius: 8,
      padding: "9px 16px", fontFamily: "Heebo, sans-serif", fontSize: ".78rem",
      fontWeight: 700, cursor: "pointer", width: "100%"
    }
  };

  return (
    <div style={{ background: "#06080f", color: "#dce5f5", fontFamily: "Heebo, sans-serif", minHeight: "100vh", padding: "16px 13px 48px", direction: "rtl" }}>

      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: "1.4rem", fontWeight: 900, background: "linear-gradient(120deg,#60a5fa,#34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          🏠 מנהל משכנתא — יפו
        </div>
        <div style={{ fontSize: ".75rem", color: "#4d6080", marginBottom: 12 }}>3,175,000 ₪ | מעקב תהליך + השוואת בנקים</div>

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
            <span style={{ fontSize: ".7rem", color: "#4d6080" }}>התקדמות כוללת</span>
            <span style={{ fontSize: ".78rem", fontWeight: 700, color: "#2dd4a0" }}>{pct}% ({doneTasks}/{totalTasks})</span>
          </div>
          <div style={{ background: "#1a2840", borderRadius: 10, height: 8, overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(90deg,#4f9eff,#2dd4a0)", height: "100%", width: `${pct}%`, borderRadius: 10, transition: "width .4s ease" }} />
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 2 }}>
        {[
          { id: "timeline", label: "📋 תהליך" },
          { id: "banks", label: "🏦 בנקים" },
          { id: "docs", label: "📄 מסמכים" },
          { id: "notes", label: "📝 הערות" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab === t.id ? "#131d2e" : "#0d1421",
            border: `1px solid ${tab === t.id ? "#253650" : "#1a2840"}`,
            borderRadius: 20, padding: "6px 14px", fontSize: ".75rem",
            fontFamily: "Heebo, sans-serif", color: tab === t.id ? "#dce5f5" : "#4d6080",
            cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s"
          }}>{t.label}</button>
        ))}
      </div>

      {/* TIMELINE */}
      {tab === "timeline" && PHASES.map(phase => (
        <div key={phase.id} style={S.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: ".75rem",
              fontWeight: 700, flexShrink: 0,
              background: phase.color + "22", color: phase.color
            }}>{phase.id}</div>
            <div>
              <div style={{ fontSize: ".85rem", fontWeight: 700 }}>{phase.label}</div>
              <div style={{ fontSize: ".68rem", color: "#4d6080" }}>{phase.time}</div>
            </div>
            <div style={{ marginRight: "auto", fontSize: ".7rem", color: "#4d6080" }}>
              {phase.tasks.filter(t => done[t.id]).length}/{phase.tasks.length}
            </div>
          </div>
          {phase.tasks.map((task, i) => (
            <div key={task.id} style={{ borderBottom: i === phase.tasks.length - 1 ? "none" : undefined }}>
              <TaskItem task={task} done={!!done[task.id]} onToggle={() => toggleTask(task.id)} />
            </div>
          ))}
        </div>
      ))}

      {/* BANKS */}
      {tab === "banks" && (
        <div>
          {/* ADD FORM */}
          <div style={S.card}>
            <div style={{ fontSize: ".78rem", fontWeight: 700, color: "#4f9eff", marginBottom: 10 }}>➕ הוסף הצעת בנק</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
              {[
                { key: "name", label: "שם הבנק", ph: "לאומי / הפועלים..." },
                { key: "fixed", label: 'ריבית קל"צ (%)', ph: "4.5", type: "number" },
                { key: "prime", label: "פריים + / — (%)", ph: "-0.5", type: "number" },
                { key: "fixedPct", label: 'אחוז קל"צ', ph: "33", type: "number" },
                { key: "fee", label: "עמלת פתיחה (₪)", ph: "3500", type: "number" },
                { key: "note", label: "הערה", ph: "הצעה ראשונית..." },
              ].map(f => (
                <div key={f.key}>
                  <div style={{ fontSize: ".65rem", color: "#4d6080", marginBottom: 3 }}>{f.label}</div>
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
            <button onClick={addBank} style={S.btn}>הוסף הצעה</button>
          </div>

          {/* BANK CARDS */}
          {banks.length === 0 ? (
            <div style={{ textAlign: "center", color: "#4d6080", fontSize: ".78rem", padding: 24 }}>
              עדיין אין הצעות — הוסף את הצעת הבנק הראשונה
            </div>
          ) : banks.map(bank => {
            const monthly = calcMonthly(bank);
            const isBest = bestBank?.id === bank.id;
            const totalCost = monthly * 300 + bank.fee;
            const primeRate = PRIME + bank.prime;
            return (
              <div key={bank.id} style={{ ...S.card, border: `1px solid ${isBest ? "#2dd4a0" : "#1a2840"}`, position: "relative" }}>
                {isBest && (
                  <div style={{ position: "absolute", top: 10, left: 10, background: "#2dd4a0", color: "#000", fontSize: ".62rem", fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>
                    ⭐ הכי זול
                  </div>
                )}
                <div style={{ fontSize: ".9rem", fontWeight: 700, marginBottom: 10 }}>{bank.name}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 10 }}>
                  {[
                    { l: 'ריבית קל"צ', v: `${bank.fixed}%`, c: "#4f9eff" },
                    { l: "ריבית פריים", v: `${primeRate.toFixed(2)}%`, c: "#f6a623" },
                    { l: 'חלוקה קל"צ/פריים', v: `${bank.fixedPct}% / ${100 - bank.fixedPct}%`, c: "#dce5f5" },
                    { l: "עמלת פתיחה", v: `₪${fmt(bank.fee)}`, c: "#dce5f5" },
                    { l: "עלות כוללת 25 שנה", v: `₪${fmt(totalCost)}`, c: "#f87171" },
                    bank.note ? { l: "הערה", v: bank.note, c: "#4d6080" } : null,
                  ].filter(Boolean).map(({ l, v, c }) => (
                    <div key={l}>
                      <div style={S.label}>{l}</div>
                      <div style={{ ...S.val, color: c, fontSize: ".76rem" }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid #1a2840", paddingTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: ".72rem", color: "#4d6080" }}>החזר חודשי משוער</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#2dd4a0" }}>₪{fmt(monthly)}</span>
                </div>
                <button onClick={() => setBanks(b => b.filter(x => x.id !== bank.id))}
                  style={{ background: "none", border: "none", color: "#f87171", fontSize: ".72rem", cursor: "pointer", marginTop: 6, fontFamily: "Heebo, sans-serif" }}>
                  🗑 מחק הצעה
                </button>
              </div>
            );
          })}

          <div style={{ ...S.card, fontSize: ".73rem", color: "#4d6080", lineHeight: 1.8 }}>
            <b style={{ color: "#dce5f5" }}>💡 טיפים:</b><br />
            • פנה לפחות ל-3 בנקים — הפועלים, לאומי, מזרחי-טפחות, דיסקונט<br />
            • תמיד יש מקום למשא ומתן — אל תקבל הצעה ראשונה<br />
            • תמהיל מומלץ 2026: ~33% קל״צ + ~67% פריים לא צמוד<br />
            • בקש מסלולים ניתנים למיחזור ללא קנס גבוה
          </div>
        </div>
      )}

      {/* DOCS */}
      {tab === "docs" && DOC_GROUPS.map(group => {
        const total = group.docs.length;
        const done_ = group.docs.filter(d => docsDone[d.id]).length;
        return (
          <div key={group.title} style={S.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: ".78rem", fontWeight: 700, color: "#f6a623" }}>{group.title}</div>
              <div style={{ fontSize: ".68rem", color: "#4d6080" }}>{done_}/{total}</div>
            </div>
            {group.docs.map((doc, i) => (
              <div key={doc.id} onClick={() => toggleDoc(doc.id)} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "7px 0", cursor: "pointer",
                borderBottom: i < group.docs.length - 1 ? "1px solid #0d1422" : "none",
                opacity: docsDone[doc.id] ? 0.5 : 1
              }}>
                <div style={{
                  width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                  border: docsDone[doc.id] ? "none" : "2px solid #1a2840",
                  background: docsDone[doc.id] ? "#2dd4a0" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, color: "#000", fontWeight: 700, transition: "all .15s"
                }}>{docsDone[doc.id] && "✓"}</div>
                <div style={{
                  fontSize: ".75rem",
                  textDecoration: docsDone[doc.id] ? "line-through" : "none",
                  color: docsDone[doc.id] ? "#4d6080" : "#dce5f5"
                }}>{doc.text}</div>
              </div>
            ))}
          </div>
        );
      })}

      {/* NOTES */}
      {tab === "notes" && (
        <div>
          {[
            { key: "notes", val: notes, set: setNotes, title: "📝 הערות ותיעוד שיחות", ph: `תעד כאן שיחות עם בנקים, יועצים, עורכי דין...\n\nלדוגמה:\n15/05 — שיחה עם יועץ בנק לאומי. הצעה: 4.3% קל"צ, פריים-0.3%.`, color: "#a78bfa" },
            { key: "contacts", val: contacts, set: setContacts, title: "📞 אנשי קשר", ph: "עורך דין: ___\nיועץ משכנתאות: ___\nסוכן ביטוח: ___\nשמאי: ___\nמוכר / נציג מוכר: ___", color: "#4f9eff" },
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
              <button onClick={saveNotes} style={{ ...S.btn, width: "auto", padding: "7px 16px", marginTop: 8, background: color }}>
                שמור
              </button>
              {notesSaved && <span style={{ fontSize: ".68rem", color: "#2dd4a0", marginRight: 8 }}>✓ נשמר</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
