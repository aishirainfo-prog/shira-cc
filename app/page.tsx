"use client";
export const dynamic = "force-dynamic";

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
    } catch (e:any) {
      setStatusOut("Errore: " + (e?.message || e));
    }
  }

  async function generate() {
    setGenOut("…");
    try{
      const r = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: genPrompt }),
      });
      const t = await r.text();
      setGenOut(t);
    } catch(e:any){
      setGenOut("Errore: " + (e?.message || e));
    }
  }

  async function analyze() {
    try{
      const r = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: anText }),
      });
      const j = await r.json();
      setAnOut(j);
    } catch(e:any){
      setAnOut("Errore: " + (e?.message || e));
    }
  }

  async function runAlgos() {
    try{
      const r = await fetch("/api/algorithms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ numbers: algoNumbers }),
      });
      const j = await r.json();
      setAlgoOut(j);
    } catch(e:any){
      setAlgoOut("Errore: " + (e?.message || e));
    }
  }

  async function getMetrics() {
    try{
      const r = await fetch("/api/metrics", { cache: "no-store" });
      const j = await r.json();
      setMetricsOut(j);
    } catch(e:any){
      setMetricsOut("Errore: " + (e?.message || e));
    }
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
          <pre style={card.pre}>{genOut}</pre>
        </section>

        <section style={card.box}>
          <h2 style={card.h2}>Analisi rapida testo</h2>
          <textarea style={{ ...card.input, minHeight: 90 }} value={anText} onChange={(e) => setAnText(e.target.value)} />
          <div style={{ height: 8 }} />
          <button style={card.btn} onClick={analyze}>Analizza</button>
          <pre style={card.pre}>{typeof anOut === "string" ? anOut : JSON.stringify(anOut, null, 2)}</pre>
        </section>

        <section style={card.box}>
          <h2 style={card.h2}>Algoritmi & Calcoli</h2>
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
// app/page.tsx
"use client";

import { useEffect, useState } from "react";

type Json = any;

export default function ShiraCommandCenter() {
  const [statusOut, setStatusOut] = useState("—");
  const [genPrompt, setGenPrompt] = useState("Dimmi qualcosa su Shira.");
  const [genOut, setGenOut] = useState<Json>(null);

  const [anaText, setAnaText] = useState("Shira è fantastica. Lavora bene e velocemente!");
  const [anaOut, setAnaOut] = useState<Json>(null);

  const [algoIn, setAlgoIn] = useState("1, 2, 2, 3, 5, 8, 13");
  const [algoOut, setAlgoOut] = useState<Json>(null);

  const [history, setHistory] = useState<any[]>([]);

  // --- history in localStorage ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const h = localStorage.getItem("shira_history");
      if (h) setHistory(JSON.parse(h));
    }
  }, []);
  const pushHistory = (entry: any) => {
    const next = [entry, ...history].slice(0, 20);
    setHistory(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("shira_history", JSON.stringify(next));
    }
  };
  const clearHistory = () => {
    setHistory([]);
    if (typeof window !== "undefined") localStorage.removeItem("shira_history");
  };

  async function ping() {
    try {
      const r = await fetch("/api/status", { cache: "no-store" });
      setStatusOut(r.ok ? "HTTP 200 OK" : `HTTP ${r.status}`);
    } catch (e: any) {
      setStatusOut(`Errore: ${e?.message ?? e}`);
    }
  }
  function clickTest() {
    setStatusOut(`Clic OK: ${new Date().toLocaleTimeString()}`);
  }

  async function generate() {
    setGenOut(null);
    try {
      const r = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: genPrompt }),
      });
      const data = await r.json();
      setGenOut(data);
      pushHistory({ ts: Date.now(), kind: "generate", in: genPrompt, out: data });
    } catch (e: any) {
      setGenOut({ error: e?.message ?? String(e) });
    }
  }

  async function analyze() {
    setAnaOut(null);
    try {
      const r = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: anaText }),
      });
      const data = await r.json();
      setAnaOut(data);
      pushHistory({ ts: Date.now(), kind: "analyze", in: anaText, out: data });
    } catch (e: any) {
      setAnaOut({ error: e?.message ?? String(e) });
    }
  }

  async function runAlgo() {
    setAlgoOut(null);
    try {
      const r = await fetch("/api/algorithms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numbers: algoIn }),
      });
      const data = await r.json();
      setAlgoOut(data);
      pushHistory({ ts: Date.now(), kind: "algorithms", in: algoIn, out: data });
    } catch (e: any) {
      setAlgoOut({ error: e?.message ?? String(e) });
    }
  }

  // --- UI helpers ---
  const card = (children: any) => (
    <div style={{background:"#fff", border:"1px solid #111527", borderRadius:12, padding:16, marginBottom:16}}>
      {children}
    </div>
  );
  const btn = (label: string, onClick: any) => (
    <button onClick={onClick} style={{padding:"10px 14px", borderRadius:8, border:"1px solid #111527", background:"#f0f3ff"}}>
      {label}
    </button>
  );
  const area = (val: string, set: any, rows=5) => (
    <textarea rows={rows} value={val} onChange={e=>set(e.target.value)}
      style={{width:"100%", border:"1px solid #111527", borderRadius:8, padding:12}}/>
  );
  const outBox = (data: any) => (
    <pre style={{whiteSpace:"pre-wrap", background:"#0b1020", color:"#e5e7eb", padding:12, borderRadius:8, overflow:"auto"}}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );

  return (
    <main style={{fontFamily:"system-ui, sans-serif", color:"#0b0f1c", maxWidth:800, margin:"0 auto", padding:"20px 12px"}}>
      <h1 style={{fontSize:36, fontWeight:800, marginBottom:4}}>SHIRA Command Center</h1>
      <p style={{marginBottom:20, color:"#0b8f0c"}}>Online ✓</p>

      {card(
        <>
          <h2 style={{fontSize:22, fontWeight:700, marginBottom:8}}>Stato servizi</h2>
          <div style={{display:"flex", gap:12, marginBottom:12, flexWrap:"wrap"}}>
            {btn("Ping /api/status", ping)}
            {btn("TEST CLICK", clickTest)}
          </div>
          {outBox(statusOut)}
        </>
      )}

      {card(
        <>
          <h2 style={{fontSize:22, fontWeight:700, marginBottom:8}}>Generazione (OpenAI)</h2>
          {area(genPrompt, setGenPrompt, 5)}
          <div style={{marginTop:12}}>{btn("Genera", generate)}</div>
          <div style={{marginTop:12}}>{genOut && outBox(genOut)}</div>
        </>
      )}

      {card(
        <>
          <h2 style={{fontSize:22, fontWeight:700, marginBottom:8}}>Analisi rapida testo</h2>
          {area(anaText, setAnaText, 4)}
          <div style={{marginTop:12}}>{btn("Analizza", analyze)}</div>
          <div style={{marginTop:12}}>{anaOut && outBox(anaOut)}</div>
        </>
      )}

      {card(
        <>
          <h2 style={{fontSize:22, fontWeight:700, marginBottom:8}}>Algoritmi (statistiche)</h2>
          {area(algoIn, setAlgoIn, 3)}
          <div style={{marginTop:12}}>{btn("Calcola", runAlgo)}</div>
          <div style={{marginTop:12}}>{algoOut && outBox(algoOut)}</div>
        </>
      )}

      {card(
        <>
          <h2 style={{fontSize:22, fontWeight:700, marginBottom:8}}>Cronologia locale</h2>
          <div style={{display:"flex", gap:12, marginBottom:12, flexWrap:"wrap"}}>
            {btn("Svuota", clearHistory)}
          </div>
          {outBox(history)}
        </>
      )}
    </main>
  );
}
