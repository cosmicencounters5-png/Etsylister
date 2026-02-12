"use client";

import { useState } from "react";

export default function OptimizePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function optimize() {
    if (!url) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Optimization failed");
      }

      setResult(data);
      
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Optimization failed");
    } finally {
      setLoading(false);
    }
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
        marginBottom: 40 
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
        <span style={{ 
          background: "#e6f3ff", 
          padding: "4px 12px", 
          borderRadius: 20,
          fontSize: 14,
          color: "#0070f3"
        }}>
          Beta
        </span>
      </div>
      
      <div style={{ 
        background: "white", 
        borderRadius: 16,
        padding: 32,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        marginBottom: 24
      }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.etsy.com/listing/123456789/..."
            style={{
              flex: 1,
              padding: "14px 16px",
              borderRadius: 12,
              border: "2px solid #e2e8f0",
              fontSize: 16,
              outline: "none",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#f1641e"}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
          />
          
          <button
            onClick={optimize}
            disabled={loading}
            style={{
              padding: "14px 32px",
              background: loading ? "#94a3b8" : "#f1641e",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            {loading ? "⏳" : "🚀"}
            {loading ? "Optimizing..." : "Optimize"}
          </button>
        </div>
        <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
          Paste any Etsy listing URL to get AI-powered title optimization
        </p>
      </div>

      {error && (
        <div style={{
          padding: 16,
          background: "#fef2f2",
          borderRadius: 12,
          marginBottom: 24,
          color: "#dc2626",
          border: "1px solid #fee2e2"
        }}>
          ❌ {error}
        </div>
      )}

      {result && (
        <div style={{ 
          background: "white", 
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
        }}>
          
          {/* Source Badge */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: 24 
          }}>
            <span style={{ 
              background: result.source === "proxy" ? "#10b981" : "#64748b",
              color: "white",
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 500
            }}>
              {result.source === "proxy" ? "✨ DeepSeek API" : "⚡ Enhanced Fallback"}
            </span>
            {result.source === "fallback" && (
              <span style={{ fontSize: 13, color: "#64748b" }}>
                Using smart pattern detection
              </span>
            )}
          </div>

          {/* Original Title */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ 
              fontSize: 14, 
              fontWeight: 600, 
              color: "#64748b",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              📦 Original Title
            </h3>
            <div style={{ 
              padding: 16, 
              background: "#f8fafc", 
              borderRadius: 12,
              border: "1px solid #e2e8f0"
            }}>
              <p style={{ margin: 0, color: "#0f172a" }}>
                {result.original?.title}
              </p>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ 
              fontSize: 14, 
              fontWeight: 600, 
              color: "#64748b",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              📝 Description
            </h3>
            <div style={{ 
              padding: 16, 
              background: "#f8fafc", 
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              maxHeight: 120,
              overflow: "auto"
            }}>
              <p style={{ margin: 0, color: "#334155" }}>
                {result.original?.description || "No description available"}
              </p>
            </div>
          </div>

          {/* Optimized Title */}
          <div style={{ 
            background: "linear-gradient(135deg, #fef3c7, #ffedd5)",
            padding: 24,
            borderRadius: 16,
            marginBottom: 24
          }}>
            <h3 style={{ 
              fontSize: 14, 
              fontWeight: 600, 
              color: "#92400e",
              marginBottom: 12,
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              ✨ Optimized Title
            </h3>
            <p style={{ 
              fontSize: 20, 
              fontWeight: 700,
              margin: "0 0 16px 0",
              color: "#0f172a",
              lineHeight: 1.4
            }}>
              {result.optimized?.title}
            </p>
            
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ 
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                background: "white",
                borderRadius: 30,
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
              }}>
                <span style={{ fontWeight: 600 }}>SEO Score:</span>
                <span style={{ 
                  fontWeight: 700,
                  color: result.optimized?.seoScore > 85 ? "#059669" : "#d97706"
                }}>
                  {result.optimized?.seoScore}%
                </span>
              </div>
              
              <span style={{ fontSize: 14, color: "#64748b" }}>
                {result.optimized?.characterCount}/140 chars
              </span>
            </div>
          </div>

          {/* Keywords */}
          {result.optimized?.keywords?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ 
                fontSize: 14, 
                fontWeight: 600, 
                color: "#64748b",
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                🔑 Keywords
              </h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {result.optimized.keywords.map((kw: string, i: number) => (
                  <span key={i} style={{
                    padding: "6px 16px",
                    background: "#f1f5f9",
                    borderRadius: 30,
                    fontSize: 14,
                    color: "#0f172a",
                    border: "1px solid #e2e8f0"
                  }}>
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div style={{ 
            fontSize: 12, 
            color: "#94a3b8",
            borderTop: "1px solid #e2e8f0",
            paddingTop: 16,
            marginTop: 16,
            display: "flex",
            gap: 16,
            flexWrap: "wrap"
          }}>
            <span>🆔 Listing ID: {result.meta?.listingId}</span>
            <span>⏱️ Fetched: {new Date(result.meta?.fetchedAt).toLocaleString()}</span>
            <span>🤖 Model: {result.meta?.model}</span>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div style={{ 
        marginTop: 40, 
        textAlign: "center", 
        fontSize: 13, 
        color: "#94a3b8"
      }}>
        Powered by DeepSeek Etsy API • Optimized for Etsy Sellers
      </div>
    </main>
  );
}