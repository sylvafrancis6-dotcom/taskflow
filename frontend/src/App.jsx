import { useState, useEffect } from “react”;

// ── Design tokens ──────────────────────────────────────────────
const C = {
bg: “#F7F4EF”,
surface: “#FFFFFF”,
ink: “#1A1A1A”,
inkMid: “#6B6B6B”,
inkLight: “#ADADAD”,
border: “#E8E3DB”,
accent: “#E8500A”,
accentLight: “#FDF0EB”,
green: “#2D9E6B”,
greenLight: “#EBF7F2”,
yellow: “#F5A623”,
yellowLight: “#FEF8ED”,
red: “#D93025”,
redLight: “#FDECEA”,
};

const PRIORITIES = {
high: { label: “High”, color: C.red, bg: C.redLight },
medium: { label: “Medium”, color: C.yellow, bg: C.yellowLight },
low: { label: “Low”, color: C.green, bg: C.greenLight },
};

const CATEGORIES = [“All”, “Work”, “Personal”, “Design”, “Development”, “Other”];

const INITIAL_TASKS = [
{ id: 1, title: “Design new landing page mockups”, category: “Design”, priority: “high”, done: false, due: “2026-06-01”, created: Date.now() - 86400000 * 2 },
{ id: 2, title: “Set up FastAPI backend endpoints”, category: “Development”, priority: “high”, done: false, due: “2026-06-03”, created: Date.now() - 86400000 },
{ id: 3, title: “Write unit tests for auth module”, category: “Development”, priority: “medium”, done: true, due: “2026-05-28”, created: Date.now() - 86400000 * 3 },
{ id: 4, title: “Update Upwork portfolio”, category: “Work”, priority: “medium”, done: false, due: “2026-06-05”, created: Date.now() },
{ id: 5, title: “Review client proposal”, category: “Work”, priority: “low”, done: false, due: “2026-06-07”, created: Date.now() - 3600000 },
];

let nextId = 6;

// ── Utility ────────────────────────────────────────────────────
const fmt = (d) => d ? new Date(d).toLocaleDateString(“en-GB”, { day: “numeric”, month: “short” }) : “”;
const isOverdue = (due, done) => !done && due && new Date(due) < new Date();

// ── Sub-components ─────────────────────────────────────────────
function Badge({ priority }) {
const p = PRIORITIES[priority];
return (
<span style={{
background: p.bg, color: p.color, fontSize: “10px”, fontWeight: “700”,
letterSpacing: “0.8px”, textTransform: “uppercase”, padding: “3px 8px”,
borderRadius: “4px”, fontFamily: “inherit”,
}}>{p.label}</span>
);
}

function StatCard({ label, value, color }) {
return (
<div style={{
background: C.surface, border: `1px solid ${C.border}`, borderRadius: “16px”,
padding: “18px 20px”, flex: 1, minWidth: “80px”,
}}>
<div style={{ fontSize: “28px”, fontWeight: “800”, color: color || C.ink, fontFamily: “Georgia, serif”, lineHeight: 1 }}>{value}</div>
<div style={{ fontSize: “11px”, color: C.inkMid, marginTop: “4px”, fontWeight: “500” }}>{label}</div>
</div>
);
}

function TaskItem({ task, onToggle, onDelete, onEdit }) {
const overdue = isOverdue(task.due, task.done);
return (
<div style={{
background: C.surface, border: `1px solid ${task.done ? C.border : overdue ? "#FBBABA" : C.border}`,
borderLeft: `3px solid ${task.done ? C.border : PRIORITIES[task.priority].color}`,
borderRadius: “12px”, padding: “14px 16px”, display: “flex”,
alignItems: “flex-start”, gap: “12px”, transition: “all 0.2s”,
opacity: task.done ? 0.6 : 1,
}}>
{/* Checkbox */}
<button onClick={() => onToggle(task.id)} style={{
width: “20px”, height: “20px”, borderRadius: “6px”, flexShrink: 0, marginTop: “1px”,
border: `2px solid ${task.done ? C.green : C.border}`,
background: task.done ? C.green : “transparent”, cursor: “pointer”,
display: “flex”, alignItems: “center”, justifyContent: “center”, transition: “all 0.15s”,
}}>
{task.done && <span style={{ color: “#fff”, fontSize: “11px”, fontWeight: “bold” }}>✓</span>}
</button>

```
  {/* Content */}
  <div style={{ flex: 1, minWidth: 0 }}>
    <div style={{
      fontSize: "14px", fontWeight: "600", color: C.ink,
      textDecoration: task.done ? "line-through" : "none",
      marginBottom: "6px", lineHeight: "1.4",
    }}>{task.title}</div>
    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
      <Badge priority={task.priority} />
      <span style={{
        fontSize: "11px", color: C.inkMid, background: C.bg,
        padding: "2px 8px", borderRadius: "4px", fontWeight: "500",
      }}>{task.category}</span>
      {task.due && (
        <span style={{
          fontSize: "11px", color: overdue ? C.red : C.inkMid, fontWeight: overdue ? "700" : "400",
        }}>
          {overdue ? "⚠ " : "📅 "}{fmt(task.due)}
        </span>
      )}
    </div>
  </div>

  {/* Actions */}
  <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
    <button onClick={() => onEdit(task)} style={{
      background: "none", border: "none", cursor: "pointer", color: C.inkLight,
      fontSize: "14px", padding: "4px", borderRadius: "6px", transition: "color 0.15s",
    }}>✏️</button>
    <button onClick={() => onDelete(task.id)} style={{
      background: "none", border: "none", cursor: "pointer", color: C.inkLight,
      fontSize: "14px", padding: "4px", borderRadius: "6px", transition: "color 0.15s",
    }}>🗑</button>
  </div>
</div>
```

);
}

function Modal({ task, onSave, onClose }) {
const [form, setForm] = useState(task || { title: “”, category: “Work”, priority: “medium”, due: “”, done: false });
const set = (k, v) => setForm(f => ({ …f, [k]: v }));

return (
<div style={{
position: “fixed”, inset: 0, background: “rgba(0,0,0,0.4)”, backdropFilter: “blur(4px)”,
display: “flex”, alignItems: “center”, justifyContent: “center”, zIndex: 100, padding: “20px”,
}} onClick={onClose}>
<div style={{
background: C.surface, borderRadius: “20px”, padding: “28px”, width: “100%”,
maxWidth: “440px”, boxShadow: “0 20px 60px rgba(0,0,0,0.15)”,
}} onClick={e => e.stopPropagation()}>
<h2 style={{ fontSize: “18px”, fontWeight: “800”, color: C.ink, marginBottom: “20px”, fontFamily: “Georgia, serif” }}>
{task?.id ? “Edit Task” : “New Task”}
</h2>

```
    <label style={labelStyle}>Task Title</label>
    <input value={form.title} onChange={e => set("title", e.target.value)}
      placeholder="What needs to be done?"
      style={inputStyle} />

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
      <div>
        <label style={labelStyle}>Category</label>
        <select value={form.category} onChange={e => set("category", e.target.value)} style={inputStyle}>
          {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Priority</label>
        <select value={form.priority} onChange={e => set("priority", e.target.value)} style={inputStyle}>
          {Object.keys(PRIORITIES).map(p => <option key={p} value={p}>{PRIORITIES[p].label}</option>)}
        </select>
      </div>
    </div>

    <label style={labelStyle}>Due Date</label>
    <input type="date" value={form.due} onChange={e => set("due", e.target.value)} style={{ ...inputStyle, marginBottom: "20px" }} />

    <div style={{ display: "flex", gap: "10px" }}>
      <button onClick={onClose} style={{
        flex: 1, padding: "12px", borderRadius: "10px", border: `1px solid ${C.border}`,
        background: "none", color: C.inkMid, fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
      }}>Cancel</button>
      <button onClick={() => form.title.trim() && onSave(form)} style={{
        flex: 2, padding: "12px", borderRadius: "10px", border: "none",
        background: C.accent, color: "#fff", fontWeight: "700", cursor: "pointer",
        fontSize: "14px", fontFamily: "inherit",
      }}>{task?.id ? "Save Changes" : "Add Task"}</button>
    </div>
  </div>
</div>
```

);
}

const labelStyle = { display: “block”, fontSize: “11px”, fontWeight: “700”, color: C.inkMid, letterSpacing: “0.8px”, textTransform: “uppercase”, marginBottom: “6px” };
const inputStyle = { width: “100%”, padding: “10px 12px”, borderRadius: “10px”, border: `1px solid ${C.border}`, background: C.bg, color: C.ink, fontSize: “14px”, fontFamily: “inherit”, outline: “none”, boxSizing: “border-box”, marginBottom: “14px” };

// ── Main App ───────────────────────────────────────────────────
export default function App() {
const [tasks, setTasks] = useState(INITIAL_TASKS);
const [filter, setFilter] = useState(“All”);
const [statusFilter, setStatusFilter] = useState(“all”);
const [search, setSearch] = useState(””);
const [modal, setModal] = useState(null); // null | “new” | task object
const [sortBy, setSortBy] = useState(“created”);

const stats = {
total: tasks.length,
done: tasks.filter(t => t.done).length,
overdue: tasks.filter(t => isOverdue(t.due, t.done)).length,
high: tasks.filter(t => t.priority === “high” && !t.done).length,
};

const filtered = tasks
.filter(t => filter === “All” || t.category === filter)
.filter(t => statusFilter === “all” ? true : statusFilter === “done” ? t.done : !t.done)
.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
.sort((a, b) => {
if (sortBy === “priority”) return [“high”,“medium”,“low”].indexOf(a.priority) - [“high”,“medium”,“low”].indexOf(b.priority);
if (sortBy === “due”) return new Date(a.due || “9999”) - new Date(b.due || “9999”);
return b.created - a.created;
});

const toggleTask = id => setTasks(ts => ts.map(t => t.id === id ? { …t, done: !t.done } : t));
const deleteTask = id => setTasks(ts => ts.filter(t => t.id !== id));
const saveTask = (form) => {
if (form.id) {
setTasks(ts => ts.map(t => t.id === form.id ? { …form } : t));
} else {
setTasks(ts => […ts, { …form, id: nextId++, created: Date.now() }]);
}
setModal(null);
};

return (
<div style={{ minHeight: “100vh”, background: C.bg, fontFamily: “‘DM Sans’, system-ui, sans-serif”, color: C.ink }}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; } input, select { appearance: none; -webkit-appearance: none; } button { font-family: inherit; }`}</style>

```
  {/* Header */}
  <header style={{
    background: C.surface, borderBottom: `1px solid ${C.border}`,
    padding: "0 24px", display: "flex", alignItems: "center",
    justifyContent: "space-between", height: "60px", position: "sticky", top: 0, zIndex: 10,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{
        width: "32px", height: "32px", background: C.accent, borderRadius: "10px",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
      }}>✦</div>
      <div>
        <div style={{ fontSize: "16px", fontWeight: "800", color: C.ink, letterSpacing: "-0.3px" }}>TaskFlow</div>
        <div style={{ fontSize: "10px", color: C.inkMid }}>Project Manager</div>
      </div>
    </div>
    <button onClick={() => setModal("new")} style={{
      background: C.accent, color: "#fff", border: "none", borderRadius: "10px",
      padding: "8px 16px", fontWeight: "700", fontSize: "13px", cursor: "pointer",
      display: "flex", alignItems: "center", gap: "6px",
    }}>+ New Task</button>
  </header>

  <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px 16px" }}>

    {/* Stats */}
    <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
      <StatCard label="Total" value={stats.total} />
      <StatCard label="Done" value={stats.done} color={C.green} />
      <StatCard label="Overdue" value={stats.overdue} color={C.red} />
      <StatCard label="High Priority" value={stats.high} color={C.accent} />
    </div>

    {/* Progress bar */}
    <div style={{ marginBottom: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", fontWeight: "600", color: C.inkMid }}>Overall Progress</span>
        <span style={{ fontSize: "12px", fontWeight: "700", color: C.green }}>
          {stats.total ? Math.round((stats.done / stats.total) * 100) : 0}%
        </span>
      </div>
      <div style={{ height: "6px", background: C.border, borderRadius: "10px", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: "10px", background: `linear-gradient(90deg, ${C.green}, #4FD1A5)`,
          width: `${stats.total ? (stats.done / stats.total) * 100 : 0}%`, transition: "width 0.4s ease",
        }} />
      </div>
    </div>

    {/* Search & Filters */}
    <div style={{ marginBottom: "16px" }}>
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="🔍  Search tasks..."
        style={{
          width: "100%", padding: "11px 16px", borderRadius: "12px",
          border: `1px solid ${C.border}`, background: C.surface,
          fontSize: "14px", outline: "none", marginBottom: "12px", color: C.ink,
        }} />

      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: "6px 14px", borderRadius: "20px", border: `1px solid ${filter === c ? C.accent : C.border}`,
            background: filter === c ? C.accentLight : C.surface, color: filter === c ? C.accent : C.inkMid,
            fontSize: "12px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s",
          }}>{c}</button>
        ))}
      </div>
    </div>

    {/* Status + Sort row */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
      <div style={{ display: "flex", gap: "6px" }}>
        {[["all","All"],["pending","Pending"],["done","Done"]].map(([v, l]) => (
          <button key={v} onClick={() => setStatusFilter(v)} style={{
            padding: "5px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "600",
            border: "none", cursor: "pointer", transition: "all 0.15s",
            background: statusFilter === v ? C.ink : C.border,
            color: statusFilter === v ? "#fff" : C.inkMid,
          }}>{l}</button>
        ))}
      </div>
      <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
        padding: "5px 10px", borderRadius: "8px", border: `1px solid ${C.border}`,
        background: C.surface, color: C.inkMid, fontSize: "12px", cursor: "pointer", outline: "none",
      }}>
        <option value="created">Newest</option>
        <option value="priority">Priority</option>
        <option value="due">Due Date</option>
      </select>
    </div>

    {/* Task list */}
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {filtered.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "48px 20px", color: C.inkLight,
          background: C.surface, borderRadius: "16px", border: `1px solid ${C.border}`,
        }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>✦</div>
          <div style={{ fontSize: "14px", fontWeight: "600" }}>No tasks found</div>
          <div style={{ fontSize: "12px", marginTop: "4px" }}>Try a different filter or add a new task</div>
        </div>
      ) : (
        filtered.map(task => (
          <TaskItem key={task.id} task={task}
            onToggle={toggleTask} onDelete={deleteTask} onEdit={t => setModal(t)} />
        ))
      )}
    </div>

    {/* Footer */}
    <div style={{ textAlign: "center", marginTop: "32px", fontSize: "11px", color: C.inkLight }}>
      {filtered.length} task{filtered.length !== 1 ? "s" : ""} · Built by Sylvester Francis
    </div>
  </div>

  {/* Modal */}
  {modal && (
    <Modal
      task={modal === "new" ? null : modal}
      onSave={saveTask}
      onClose={() => setModal(null)}
    />
  )}
</div>
```

);
}
