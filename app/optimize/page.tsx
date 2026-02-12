"use client";

import { useState } from "react";

export default function OptimizePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [manualTitle, setManualTitle] = useState("");
  const [manualDesc, setManualDesc] = useState("");
  const [popupBlocked, setPopupBlocked] = useState(false);

  // 🌟 POPUP-LØSNING - HENTER DATA DIREKTE FRA ETSY
  async function fetchWithPopup() {
    if (!url) return;
    
    setLoading(true);
    setPopupBlocked(false);
    
    // Valider URL
    const listingId = url.match(/listing\/(\d+)/)?.[1];
    if (!listingId) {
      alert("❌ Ugyldig Etsy URL. Vennligst lim inn en gyldig Etsy-listing URL.");
      setLoading(false);
      return;
    }

    // Åpne popup-vindu (usynlig plassert utenfor skjermen)
    const popup = window.open(
      `https://www.etsy.com/listing/${listingId}`,
      'etsyPopup',
      'width=1000,height=700,left=-1000,top=-1000,popup=1'
    );
    
    if (!popup) {
      setPopupBlocked(true);
      setLoading(false);
      return;
    }

    // Vent på at siden laster
    const timeout = setTimeout(() => {
      popup.close();
      setLoading(false);
      alert("⏱️ Tidsavbrudd - Etsy-siden lastet for sakte. Prøv igjen eller bruk manuell innliming.");
    }, 15000);

    // Forsøk å lese data med intervaller
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      
      try {
        // Sjekk om popup er lukket
        if (popup.closed) {
          clearInterval(interval);
          clearTimeout(timeout);
          setLoading(false);
          return;
        }

        const doc = popup.document;
        
        // TITTEL - flere forsøk
        let title = 
          doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
          doc.querySelector('h1[data-buy-box-listing-title]')?.textContent ||
          doc.querySelector('h1.wt-text-heading-01')?.textContent ||
          doc.querySelector('h1')?.textContent ||
          doc.title.replace(' - Etsy', '').trim() ||
          `Etsy Listing #${listingId}`;
        
        // BESKRIVELSE - flere forsøk
        let description = 
          doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
          doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
          doc.querySelector('[data-buy-box-description]')?.textContent ||
          doc.querySelector('.wt-text-body-01')?.textContent ||
          "Ingen beskrivelse funnet";
        
        // BILDE
        let image = 
          doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
          doc.querySelector('img[data-buy-box-listing-image]')?.src ||
          "";

        // PRIS
        let price = 
          doc.querySelector('[data-buy-box-price]')?.textContent ||
          doc.querySelector('.wt-text-title-03')?.textContent ||
          "";

        // Hvis vi fant en tittel, lukk popup og returner data
        if (title && !title.includes('Etsy Listing #')) {
          clearInterval(interval);
          clearTimeout(timeout);
          
          // Rens tittel
          title = title.replace(/\s+/g, ' ').trim();
          
          // Oppdater state
          setManualTitle(title);
          setManualDesc(description);
          
          // Optimaliser og vis resultat
          const optimized = optimizeTitle(title, description);
          
          setResult({
            source: "popup",
            original: {
              title: title,
              description: description,
              image: image,
              price: price
            },
            optimized: optimized,
            meta: {
              listingId: listingId,
              fetchedAt: new Date().toLocaleString('no-NO')
            }
          });
          
          popup.close();
          setLoading(false);
        }
        
        // Gi opp etter 20 forsøk (~10 sekunder)
        if (attempts > 20) {
          clearInterval(interval);
          clearTimeout(timeout);
          popup.close();
          setLoading(false);
          alert("❌ Kunne ikke lese data fra Etsy. Prøv manuell innliming.");
        }
        
      } catch (error) {
        // Ignorer feil - Etsy-siden er fortsatt under lasting
        console.log("Venter på Etsy-side...", attempts);
      }
    }, 500); // Sjekk hvert 0.5 sekund
  }

  // Optimaliseringsfunksjon
  function optimizeTitle(title: string, description: string) {
    if (!title) return null;
    
    const words = title.split(' ');
    let emoji = '🧶';
    const lower = title.toLowerCase();
    
    // Velg emoji basert på innhold
    if (lower.includes('elefant') || lower.includes('elephant')) emoji = '🐘';
    else if (lower.includes('bjørn') || lower.includes('bear')) emoji = '🧸';
    else if (lower.includes('katt') || lower.includes('cat')) emoji = '🐱';
    else if (lower.includes('hund') || lower.includes('dog')) emoji = '🐶';
    else if (lower.includes('baby')) emoji = '👶';
    else if (lower.includes('teppe') || lower.includes('blanket')) emoji = '🛏️';
    else if (lower.includes('lue') || lower.includes('hat')) emoji = '🧢';
    else if (lower.includes('skjerf') || lower.includes('scarf')) emoji = '🧣';
    else if (lower.includes('amigurumi')) emoji = '🧸';
    
    // Rens tittel
    let optimized = title
      .replace(/Etsy\s*\|?\s*/g, '')
      .replace(/\s*\|\s*Etsy$/i, '')
      .trim();
    
    // Fjern emoji hvis den allerede finnes
    optimized = optimized.replace(/[\u{1F300}-\u{1F6FF}]/gu, '').trim();
    
    // Legg til kategori hvis mangler
    if (!optimized.toLowerCase().includes('pattern') && !optimized.toLowerCase().includes('mønster')) {
      if (optimized.toLowerCase().includes('elefant')) {
        optimized = `${optimized} Crochet Pattern`;
      }
    }
    
    // Forkort hvis for lang
    if (optimized.length > 100) {
      optimized = optimized.substring(0, 97) + '...';
    }
    
    // Legg til emoji og CTA
    if (!optimized.toLowerCase().includes('download')) {
      optimized = `${emoji} ${optimized} - Instant PDF Download`;
    } else {
      optimized = `${emoji} ${optimized}`;
    }
    
    // Generer keywords
    const keywords: string[] = [];
    const allText = `${title} ${description}`.toLowerCase();
    
    const keywordPatterns = [
      'amigurumi', 'crochet', 'knit', 'pattern', 'mønster',
      'elefant', 'elephant', 'bear', 'bjørn', 'cat', 'katt',
      'dog', 'hund', 'baby', 'blanket', 'teppe', 'hat', 'lue',
      'scarf', 'skjerf', 'pdf', 'digital', 'download', 'beginner'
    ];
    
    keywordPatterns.forEach(pattern => {
      if (allText.includes(pattern) && !keywords.includes(pattern)) {
        keywords.push(pattern);
      }
    });
    
    // Beregn SEO score
    let seoScore = 70;
    if (optimized.length > 50 && optimized.length < 120) seoScore += 10;
    if (emoji !== '🧶') seoScore += 5;
    if (keywords.length >= 3) seoScore += 10;
    if (optimized.includes('PDF') || optimized.includes('Download')) seoScore += 8;
    if (!title.includes('Etsy')) seoScore += 5;
    if (optimized.includes('Beginner') || optimized.includes('Easy')) seoScore += 7;
    
    return {
      title: optimized,
      seoScore: Math.min(99, seoScore),
      keywords: keywords.slice(0, 6),
      characterCount: optimized.length,
      emoji: emoji
    };
  }

  // Manuell optimalisering
  function optimizeManually() {
    if (!manualTitle) return;
    const optimized = optimizeTitle(manualTitle, manualDesc);
    setResult({
      source: "manual",
      original: {
        title: manualTitle,
        description: manualDesc || "Ingen beskrivelse angitt"
      },
      optimized: optimized,
      meta: {
        fetchedAt: new Date().toLocaleString('no-NO')
      }
    });
  }

  return (
    <main style={{ 
      maxWidth: 900, 
      margin: "0 auto", 
      padding: 40,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    }}>
      
      {/* Header */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 12, 
        marginBottom: 40 
      }}>
        <span style={{ fontSize: 48 }}>🧶</span>
        <div>
          <h1 style={{ 
            fontSize: 32, 
            fontWeight: 700, 
            margin: "0 0 4px 0",
            background: "linear-gradient(135deg, #f1641e, #b04510)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Etsy Listing Optimizer
          </h1>
          <p style={{ margin: 0, color: "#64748b" }}>
            ⚡ Hent data direkte fra Etsy med ett klikk
          </p>
        </div>
      </div>

      {/* POPUP-LØSNING - HOVEDSEKSJON */}
      <div style={{ 
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        borderRadius: 24,
        padding: 36,
        marginBottom: 32,
        color: "white",
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <span style={{ 
            background: "rgba(255,255,255,0.2)", 
            padding: "12px 16px", 
            borderRadius: 16,
            fontSize: 28
          }}>
            🚀
          </span>
          <div>
            <h2 style={{ margin: "0 0 4px 0", fontSize: 24 }}>
              Auto-henting med popup
            </h2>
            <p style={{ margin: 0, opacity: 0.9 }}>
              ✅ Åpner Etsy i bakgrunnen, leser data, og lukker seg selv
            </p>
          </div>
        </div>
        
        <div style={{ 
          background: "rgba(255,255,255,0.1)", 
          borderRadius: 16, 
          padding: 24 
        }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Lim inn Etsy URL her..."
              style={{
                flex: 1,
                padding: "16px 20px",
                borderRadius: 12,
                border: "2px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.05)",
                color: "white",
                fontSize: 16,
                outline: "none",
                transition: "all 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#f1641e"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.2)"}
            />
            <button
              onClick={fetchWithPopup}
              disabled={loading}
              style={{
                padding: "16px 32px",
                background: loading ? "#94a3b8" : "#f1641e",
                color: "white",
                border: "none",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 8,
                minWidth: 140,
                justifyContent: "center"
              }}
            >
              {loading ? (
                <>⏳ Henter...</>
              ) : (
                <>🔍 Hent fra Etsy</>
              )}
            </button>
          </div>

          {loading && (
            <div style={{ 
              marginTop: 20, 
              padding: 16, 
              background: "rgba(255,255,255,0.05)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              gap: 12
            }}>
              <span style={{ fontSize: 20 }}>⏳</span>
              <div>
                <div style={{ fontWeight: 600 }}>Åpner Etsy og leser data...</div>
                <div style={{ fontSize: 14, opacity: 0.8 }}>
                  Popup-vinduet lukkes automatisk når data er hentet
                </div>
              </div>
            </div>
          )}

          {popupBlocked && (
            <div style={{ 
              marginTop: 20, 
              padding: 16, 
              background: "rgba(239, 68, 68, 0.2)",
              borderRadius: 12,
              border: "1px solid rgba(239, 68, 68, 0.5)",
              color: "#fee2e2"
            }}>
              <strong>⚠️ Popup blokkert!</strong><br />
              Vennligst tillat popups for denne siden og prøv igjen.
            </div>
          )}
        </div>
        
        <div style={{ 
          marginTop: 20, 
          display: "flex", 
          gap: 16, 
          fontSize: 14, 
          opacity: 0.8,
          flexWrap: "wrap"
        }}>
          <span>✨ Henter automatisk tittel, beskrivelse og bilde</span>
          <span>•</span>
          <span>⏱️ Tar ca. 3-5 sekunder</span>
          <span>•</span>
          <span>🔒 Vinduet lukkes automatisk</span>
        </div>
      </div>

      {/* MANUELL FALLBACK */}
      <details style={{ 
        marginBottom: 32, 
        background: "#f8fafc", 
        borderRadius: 16, 
        padding: "20px",
        border: "1px solid #e2e8f0"
      }}>
        <summary style={{ 
          cursor: "pointer", 
          color: "#475569", 
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          <span style={{ fontSize: 20 }}>📋</span>
          Manuell innliming (fungerer alltid)
        </summary>
        <div style={{ marginTop: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ 
              display: "block", 
              marginBottom: 8, 
              fontWeight: 600,
              color: "#475569"
            }}>
              Etsy-tittel *
            </label>
            <input
              value={manualTitle}
              onChange={(e) => setManualTitle(e.target.value)}
              placeholder="Lim inn tittelen fra Etsy..."
              style={{ 
                width: "100%", 
                padding: 14, 
                fontSize: 15,
                border: "2px solid #e2e8f0",
                borderRadius: 12,
                marginBottom: 8
              }}
            />
          </div>
          
          <div style={{ marginBottom: 20 }}>
            <label style={{ 
              display: "block", 
              marginBottom: 8, 
              fontWeight: 600,
              color: "#475569"
            }}>
              Beskrivelse (valgfritt)
            </label>
            <textarea
              value={manualDesc}
              onChange={(e) => setManualDesc(e.target.value)}
              placeholder="Lim inn beskrivelsen fra Etsy..."
              rows={4}
              style={{ 
                width: "100%", 
                padding: 14, 
                fontSize: 14,
                border: "2px solid #e2e8f0",
                borderRadius: 12,
                fontFamily: "inherit"
              }}
            />
          </div>
          
          <button
            onClick={optimizeManually}
            disabled={!manualTitle}
            style={{
              padding: "12px 24px",
              background: manualTitle ? "#475569" : "#94a3b8",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: manualTitle ? "pointer" : "not-allowed"
            }}
          >
            ✨ Optimaliser manuelt
          </button>
        </div>
      </details>

      {/* RESULTATSEKSJON */}
      {result && (
        <div style={{ 
          background: "white", 
          borderRadius: 24,
          padding: 32,
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0"
        }}>
          
          {/* Kilde-indikator */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: 24 
          }}>
            <span style={{ 
              background: result.source === "popup" ? "#10b981" : "#64748b",
              color: "white",
              padding: "6px 16px",
              borderRadius: 30,
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}>
              {result.source === "popup" ? "✅ Hentet direkte fra Etsy" : "📋 Manuell innliming"}
            </span>
            {result.meta?.listingId && (
              <span style={{ fontSize: 13, color: "#64748b" }}>
                ID: {result.meta.listingId}
              </span>
            )}
          </div>

          {/* Original tittel */}
          <div style={{ 
            background: "#f8fafc",
            borderRadius: 16,
            padding: 20,
            marginBottom: 24
          }}>
            <h3 style={{ 
              fontSize: 14, 
              fontWeight: 600, 
              color: "#475569",
              margin: "0 0 12px 0",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}>
              <span>📌</span> Original tittel
            </h3>
            <p style={{ 
              margin: 0,
              padding: 16,
              background: "white",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              fontSize: 16,
              lineHeight: 1.5
            }}>
              {result.original.title}
            </p>
          </div>

          {/* Original beskrivelse */}
          {result.original.description && (
            <div style={{ 
              background: "#f8fafc",
              borderRadius: 16,
              padding: 20,
              marginBottom: 24
            }}>
              <h3 style={{ 
                fontSize: 14, 
                fontWeight: 600, 
                color: "#475569",
                margin: "0 0 12px 0",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}>
                <span>📝</span> Beskrivelse
              </h3>
              <p style={{ 
                margin: 0,
                padding: 16,
                background: "white",
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                fontSize: 15,
                lineHeight: 1.6,
                maxHeight: 200,
                overflow: "auto"
              }}>
                {result.original.description}
              </p>
            </div>
          )}

          {/* Optimert resultat */}
          <div style={{ 
            background: "linear-gradient(135deg, #fef3c7, #ffedd5)",
            borderRadius: 20,
            padding: 28,
            marginBottom: 20,
            border: "2px solid #fcd34d"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: 16 
            }}>
              <h2 style={{ 
                margin: 0, 
                display: "flex", 
                alignItems: "center", 
                gap: 8,
                color: "#92400e",
                fontSize: 20
              }}>
                <span style={{ fontSize: 28 }}>✨</span>
                Optimalisert tittel
              </h2>
              <div style={{ 
                background: "#f1641e",
                color: "white",
                padding: "8px 20px",
                borderRadius: 40,
                fontWeight: 700,
                fontSize: 24
              }}>
                {result.optimized.seoScore}%
              </div>
            </div>
            
            <div style={{ 
              background: "white",
              borderRadius: 16,
              padding: 24,
              marginBottom: 20,
              border: "2px solid #fcd34d",
              boxShadow: "0 8px 16px rgba(251, 191, 36, 0.1)"
            }}>
              <p style={{ 
                fontSize: 24, 
                fontWeight: 700,
                margin: 0,
                color: "#0f172a",
                lineHeight: 1.4
              }}>
                {result.optimized.title}
              </p>
            </div>

            <div style={{ 
              display: "flex", 
              gap: 24, 
              alignItems: "center",
              marginBottom: 20,
              flexWrap: "wrap"
            }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 8,
                background: "white",
                padding: "8px 16px",
                borderRadius: 40
              }}>
                <span>📏</span>
                <span style={{ fontWeight: 600 }}>{result.optimized.characterCount}</span>
                <span style={{ color: "#64748b" }}>/140 tegn</span>
              </div>
              <div style={{ 
                padding: "8px 16px",
                background: result.optimized.characterCount <= 140 ? "#d1fae5" : "#fee2e2",
                color: result.optimized.characterCount <= 140 ? "#065f46" : "#991b1b",
                borderRadius: 40,
                fontSize: 14,
                fontWeight: 600
              }}>
                {result.optimized.characterCount <= 140 ? "✅ Optimal lengde" : "⚠️ For lang"}
              </div>
            </div>

            {result.optimized.keywords && result.optimized.keywords.length > 0 && (
              <div>
                <h4 style={{ 
                  fontSize: 14, 
                  color: "#92400e",
                  margin: "0 0 12px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}>
                  <span>🔑</span> Anbefalte nøkkelord
                </h4>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {result.optimized.keywords.map((kw: string, i: number) => (
                    <span key={i} style={{
                      padding: "8px 18px",
                      background: "white",
                      borderRadius: 40,
                      fontSize: 14,
                      fontWeight: 500,
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                      color: "#475569"
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
              alert("✅ Optimalisert tittel kopiert til utklippstavlen!");
            }}
            style={{
              padding: "16px 24px",
              background: "#f1641e",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              width: "100%",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#b04510"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#f1641e"}
          >
            <span style={{ fontSize: 20 }}>📋</span>
            Kopier optimalisert tittel
          </button>

          {/* Metadata */}
          {result.meta?.fetchedAt && (
            <div style={{ 
              marginTop: 20, 
              fontSize: 12, 
              color: "#94a3b8",
              textAlign: "center"
            }}>
              Hentet: {result.meta.fetchedAt}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ 
        marginTop: 48, 
        padding: 24,
        textAlign: "center", 
        fontSize: 13, 
        color: "#94a3b8",
        borderTop: "1px solid #e2e8f0"
      }}>
        <p style={{ margin: "0 0 8px 0" }}>
          🧶 Etsy Listing Optimizer • Popup-løsning • 100% gratis
        </p>
        <p style={{ margin: 0, fontSize: 12 }}>
          ⚡ Data hentes direkte fra Etsy via ditt eget vindu • Lukkes automatisk
        </p>
      </div>
    </main>
  );
}