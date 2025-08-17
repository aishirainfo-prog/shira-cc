"use client";
import { useState } from "react";
type Json = Record<string, any>;

export default function ShiraCommandCenter() {
  const [statusOut, setStatusOut] = useState("");
  const [genPrompt, setGenPrompt] = useState("Dimmi qualcosa su Shira.");
  const [genOut, setGenOut] = useState("");
  const [anText, setAnText] = useState("Shira è fantastica. Lavora bene e velocemente!");
  const [anOut, setAnOut] = useState<Json | string>("");
  const [algoNumbers, setAlgoNumbers] = useState("5, 8, 3, 9, 1, 4");
  const [algoOut, setAlgoOut] = useState<Json | string>("");
  const [metricsOut, setMetricsOut] = useState<Json | string>("");

  async function ping() {
    try {
      const r = await fetch("/api/status", { cache: "no-store" });
      setStatusOut(`HTTP ${r.status} ${r.ok ? "OK" : "ERR"}`);
    } catch (e:any) { setStatusOut("Errore: " + (e?.message || e)); }
  }

  async function generate() {
    setGenOut("…");
    try {
      const r = await fetch("/api/generate", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: genPrompt })
      });
      const j = await r.json();
      setGenOut(JSON.stringify(j, null, 2));
    } catch (e:any) { setGenOut("Errore: " + (e?.message || e)); }
  }

  async function analyze() {
    try {
      const r = await fetch("/api/analyze", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: anText })
      });
      const j = await r.json();
      setAnOut(j);
    } catch (e:any) { setAnOut("Errore: " + (e?.message || e)); }
  }

  async function runAlgos() {
    try {
      const r = await fetch("/api/algorithms", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ numbers: algoNumbers })
      });
      const j = await r.json();
      setAlgoOut(j);
    } catch (e:any) { setAlgoOut("Errore: " + (e?.message || e)); }
  }

  async function getMetrics() {
    try {
      const r = await fetch("/api/metrics", { cache: "no-store" });
      const j = await r.json();
      setMetricsOut(j);
    } catch (e:any) { setMetricsOut("Errore: " + (e?.message || e)); }
  }

  const card = {
    box: { padding: 16, border: "1px solid #ddd", borderRadius: 12, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,.06)" } as React.CSSProperties,
    h2: { margin: "0 0 8px 0", fontSize: 18 } as React.CSSProperties,
    btn: { padding: "8px 12px", borderRadius: 8, border: "1px solid #999", background: "#f5f5f5", cursor: "pointer" } as React.CSSProperties,
    input: { width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc" } as React.CSSProperties,
    pre: { whiteSpace: "pre-wrap", background: "#0b1020", color: "#e6e6e6", padding: 12, borderRadius: 8, fontSize: 13, marginTop: 8 } as React.CSSProperties
  };

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: 16, maxWidth: 1080, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>SHIRA Command Center</h1>
      <p style={{ marginTop: 0, color: "#0a7" }}>Online ✓</p>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <section style={card.box}>
          <h2 style={card.h2}>Stato servizi</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button style={card.btn} onClick={ping}>Ping /api/status</button>
            <button style={card.btn} onClick={() => setStatusOut("Clic OK: " + new Date().toLocaleTimeString())}>TEST CLICK</button>
          </div>
          <pre style={card.pre}>{statusOut}</pre>
        </section>

        <section style={card.box}>
          <h2 style={card.h2}>Generazione (OpenAI)</h2>
          <textarea style={{ ...card.input, minHeight: 90 }} value={genPrompt} onChange={(e) => setGenPrompt(e.target.value)} />
          <div style={{ height: 8 }} />
          <button style={card.btn} onClick={generate}>Genera</button>
          <pre style={card.pre}>{typeof genOut === "string" ? genOut : JSON.stringify(genOut, null, 2)}</pre>
        </section>

        <section style={card.box}>
          <h2 style={card.h2}>Analisi rapida testo</h2>
          <textarea style={{ ...card.input, minHeight: 90 }} value={anText} onChange={(e) => setAnText(e.target.value)} />
          <div style={{ height: 8 }} />
          <button style={card.btn} onClick={analyze}>Analizza</button>
          <pre style={card.pre}>{typeof anOut === "string" ? anOut : JSON.stringify(anOut, null, 2)}</pre>
        </section>

        <section style={card.box}>
          <h2 style={card.h2}>Algoritmi &amp; Calcoli</h2>
          <input style={card.input} value={algoNumbers} onChange={(e) => setAlgoNumbers(e.target.value)} placeholder="Es: 5, 8, 3, 9, 1, 4" />
          <div style={{ height: 8 }} />
          <button style={card.btn} onClick={runAlgos}>Calcola</button>
          <pre style={card.pre}>{typeof algoOut === "string" ? algoOut : JSON.stringify(algoOut, null, 2)}</pre>
        </section>

        <section style={card.box}>
          <h2 style={card.h2}>Metriche runtime</h2>
          <button style={card.btn} onClick={getMetrics}>Aggiorna metriche</button>
          <pre style={card.pre}>{typeof metricsOut === "string" ? metricsOut : JSON.stringify(metricsOut, null, 2)}</pre>
        </section>
      </div>
    </main>
  );
}
// dentro app/page.tsx, aggiungi una card:
<div className="rounded-lg border p-4 space-y-3">
  <h2 className="text-xl font-semibold">Dati sport (demo)</h2>
  <div className="flex gap-2">
    <button className="border px-3 py-2 rounded" onClick={async () => {
      const r = await fetch('/api/sync/fixtures')
      alert(await r.text())
    }}>Scarica partite di oggi</button>

    <button className="border px-3 py-2 rounded" onClick={async () => {
      const r = await fetch('/api/sync/results')
      alert(await r.text())
    }}>Aggiorna risultati</button>

    <button className="border px-3 py-2 rounded" onClick={async () => {
      const r = await fetch('/api/schedine/genera', { method: 'POST' })
      alert(await r.text())
    }}>Genera schedina (demo)</button>
  </div>
</div>
