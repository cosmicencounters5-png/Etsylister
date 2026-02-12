"use client";

import { useState } from "react";

export default function OptimizePage() {
  const [manualTitle, setManualTitle] = useState("");
  const [manualDesc, setManualDesc] = useState("");
  const [result, setResult] = useState<any>(null);

  function optimizeTitle() {
    if (!manualTitle.trim()) return;

    // SEO-optimering direkt i webbläsaren - INGA API-ANROP!
    const words = manualTitle.split(" ");
    const lastFour = manualTitle.slice(-4);
    const hasEmoji = /\p{Emoji}/u.test(manualTitle);
    
    // Generera keywords från titeln
    const keywords = words
      .filter(w => w.length > 3)
      .slice(0, 5)
      .map(w => w.toLowerCase().replace(/[^a-zåäöæø]/g, ""));
    
    // Välj emoji baserat på innehåll
    let emoji = "🧶";
    const titleLower = manualTitle.toLowerCase();
    if (titleLower.includes("elefant") || titleLower.includes("elephant")) emoji = "🐘";
    else if (titleLower.includes("bjørn") || titleLower.includes("bear")) emoji = "🧸";
    else if (titleLower.includes("katt") || titleLower.includes("cat")) emoji = "🐱";
    else if (titleLower.includes("hund") || titleLower.includes("dog")) emoji = "🐶";
    else if (titleLower.includes("baby")) emoji = "👶";
    else if (titleLower.includes("teppe") || titleLower.includes("blanket")) emoji = "🛏️";
    else if (titleLower.includes("lue") || titleLower.includes("hat")) emoji = "🧢";
    else if (titleLower.includes("skjerf") || titleLower.includes("scarf")) emoji = "🧣";
    
    // Generera optimerad titel
    let optimized = manualTitle;
    
    // Ta bort "Etsy" och onödiga ord
    optimized = optimized.replace(/Etsy\s*\|?\s*/g, "");
    optimized = optimized.replace(/\s*\|\s*Etsy$/i, "");
    
    // Förkorta om för lång
    if (optimized.length > 100) {
      optimized = optimized.substring(0, 97) + "...";
    }
    
    // Lägg till emoji och CTA
    if (!optimized.includes("Download") && !optimized.includes("Nedlasting")) {
      optimized = `${emoji} ${optimized} - Instant PDF Download`;
    } else {
      optimized = `${emoji} ${optimized}`;
    }

    // SEO Score beräkning
    let seoScore = 70;
    if (optimized.length > 50 && optimized.length < 120) seoScore += 10;
    if (emoji !== "🧶") seoScore += 5;
    if (keywords.length >= 3) seoScore += 8;
    if (optimized.includes("PDF") || optimized.includes("Download")) seoScore += 7;
    if (!manualTitle.includes("Etsy")) seoScore += 5;

    setResult({
      original: {
        title: manualTitle,
        description: manualDesc || "Ingen beskrivning angiven"
      },
      optimized: {
        title: optimized,
        seoScore: Math.min(98, seoScore),
        keywords: keywords.slice(0, 5),
        characterCount: optimized.length,
        emoji: emoji
      }
    });
  }

  return (
    <main style={{ 
      maxWidth: 800, 
      margin: "0 auto", 
      padding: 40,
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 12, 
        marginBottom: 20 
      }}>
        <span style={{ fontSize: 40 }}>🧶</span>
        <h1 style={{ 
          fontSize: 28, 
          fontWeight: 600, 
          margin: 0,
          background: "linear-gradient(135deg, #f1641e, #b04510)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Etsy Listing Optimizer
        </h1>
      </div>

      {/* VIKTIG INFO - ALLTID SYNLIG */}
      <div style={{
        background: "#fff3cd",
        border: "2px solid #ffeeba",
        borderRadius: 16,
        padding: 24,
        marginBottom: 32
      }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <span style={{ fontSize: 32 }}>⚠️</span>
          <div>
            <h2 style={{ margin: "0 0 8px 0", color: "#856404" }}>
              Etsy blokkerer automatisk henting
            </h2>
            <p style={{ margin: 0, color: "#856404", fontSize: 16 }}>
              🚫 Vi kan dessverre ikke hente data direkte fra Etsy-lenker lenger.<br />
              ✅ <strong>Men du kan fortsatt bruke optimeringsverktøyet!</strong> Lim inn tittel og beskrivelse manuelt nedenfor.
            </p>
          </div>
        </div>
      </div>

      {/* MANUELL INNMATNING - FUNGERER ALLTID */}
      <div style={{ 
        background: "white", 
        borderRadius: 16,
        padding: 32,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        marginBottom: 24,
        border: "2px solid #f1641e"
      }}>
        <h2 style={{ marginTop: 0, marginBottom: 24, display: "flex", gap: 8 }}>
          <span>✍️</span>
          Lim inn din Etsy-tittel
        </h2>
        
        <div style={{ marginBottom: 24 }}>
          <label style={{ 
            display: "block", 
            marginBottom: 8, 
            fontWeight: 600,
            color: "#475569"
          }}>
            📌 Tittel *
          </label>
          <input
            value={manualTitle}
            onChange={(e) => setManualTitle(e.target.value)}
            placeholder="F.eks. Amigurumi Elephant Crochet Pattern: Multilingual PDF"
            style={{ 
              width: "100%", 
              padding: 16, 
              fontSize: 16,
              border: "2px solid #e2e8f0",
              borderRadius: 12,
              marginBottom: 8
            }}
          />
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between",
            color: "#64748b",
            fontSize: 14
          }}>
            <span>{manualTitle.length} tegn</span>
            {manualTitle.length > 140 && (
              <span style={{ color: "#dc2626" }}>⚠️ For lang (max 140)</span>
            )}
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <label style={{ 
            display: "block", 
            marginBottom: 8, 
            fontWeight: 600,
            color: "#475569"
          }}>
            📝 Beskrivelse (valgfritt)
          </label>
          <textarea
            value={manualDesc}
            onChange={(e) => setManualDesc(e.target.value)}
            placeholder="Lim inn produktbeskrivelsen her..."
            rows={5}
            style={{ 
              width: "100%", 
              padding: 16, 
              fontSize: 14,
              border: "2px solid #e2e8f0",
              borderRadius: 12,
              fontFamily: "inherit",
              resize: "vertical"
            }}
          />
        </div>

        <button 
          onClick={optimizeTitle}
          disabled={!manualTitle.trim()}
          style={{ 
            padding: "16px 32px",
            background: manualTitle.trim() ? "#f1641e" : "#94a3b8",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 600,
            cursor: manualTitle.trim() ? "pointer" : "not-allowed",
            transition: "background 0.2s",
            width: "100%"
          }}
        >
          ✨ Optimaliser tittel nå
        </button>
      </div>

      {/* RESULTAT */}
      {result && (
        <div style={{ 
          background: "white", 
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
        }}>
          
          {/* Original */}
          <div style={{ 
            background: "#f8fafc",
            borderRadius: 12,
            padding: 20,
            marginBottom: 24
          }}>
            <h3 style={{ 
              margin: "0 0 16px 0", 
              color: "#475569",
              display: "flex",
              gap: 8,
              fontSize: 16
            }}>
              <span>📋</span> Original tittel
            </h3>
            <p style={{ 
              margin: 0,
              padding: 16,
              background: "white",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              fontSize: 16
            }}>
              {result.original.title}
            </p>
          </div>

          {/* Optimert resultat */}
          <div style={{ 
            background: "linear-gradient(135deg, #fef9e7, #fff4e6)",
            borderRadius: 16,
            padding: 28,
            border: "2px solid #fbd38d"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, display: "flex", gap: 8, color: "#7b341e" }}>
                <span>✨</span> Optimalisert tittel
              </h2>
              <span style={{
                background: "#f1641e",
                color: "white",
                padding: "8px 16px",
                borderRadius: 30,
                fontWeight: "bold",
                fontSize: 18
              }}>
                {result.optimized.seoScore}%
              </span>
            </div>
            
            <p style={{ 
              fontSize: 22, 
              fontWeight: 700,
              margin: "0 0 16px 0",
              color: "#0f172a",
              lineHeight: 1.4,
              padding: 20,
              background: "white",
              borderRadius: 12,
              border: "2px solid #fed7aa"
            }}>
              {result.optimized.title}
            </p>

            <div style={{ 
              display: "flex", 
              gap: 24, 
              alignItems: "center",
              marginBottom: 20
            }}>
              <span style={{ fontSize: 14, color: "#64748b" }}>
                📏 {result.optimized.characterCount}/140 tegn
              </span>
              <span style={{ 
                padding: "4px 12px",
                background: "#e6f3ff",
                borderRadius: 20,
                fontSize: 13,
                color: "#0070f3"
              }}>
                {result.optimized.characterCount <= 140 ? "✅ OK" : "⚠️ For lang"}
              </span>
            </div>

            {/* Keywords */}
            {result.optimized.keywords.length > 0 && (
              <div>
                <h4 style={{ fontSize: 14, color: "#64748b", marginBottom: 12 }}>
                  🔑 Foreslåtte nøkkelord
                </h4>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {result.optimized.keywords.map((kw: string, i: number) => (
                    <span key={i} style={{
                      padding: "6px 16px",
                      background: "white",
                      borderRadius: 30,
                      fontSize: 14,
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                    }}>
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Kopier-knapp */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(result.optimized.title);
              alert("✅ Optimalisert tittel kopiert!");
            }}
            style={{
              marginTop: 24,
              padding: "12px 24px",
              background: "white",
              border: "2px solid #f1641e",
              color: "#f1641e",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              width: "100%"
            }}
          >
            📋 Kopier optimalisert tittel
          </button>
        </div>
      )}
      
      {/* Footer */}
      <div style={{ 
        marginTop: 40, 
        textAlign: "center", 
        fontSize: 13, 
        color: "#94a3b8"
      }}>
        <p>⚠️ Etsy blokkerer automatisk datainnhenting • Bruk manuell innliming</p>
        <p style={{ marginTop: 8 }}>
          🎯 100% fungerende SEO-optimalisering • Ingen API nødvendig
        </p>
      </div>
    </main>
  );
}