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
      fontFamily: "system-ui, sans-serif"
    }}>
      <h1 style={{ marginBottom: 32 }}>✨ Etsy Listing Optimizer</h1>
      
      <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.etsy.com/listing/123456789/..."
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ddd",
            fontSize: 16
          }}
        />
        
        <button
          onClick={optimize}
          disabled={loading}
          style={{
            padding: "12px 24px",
            background: loading ? "#ccc" : "#0070f3",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "⏳ Optimizing..." : "🚀 Optimize"}
        </button>
      </div>

      {error && (
        <div style={{
          padding: 16,
          background: "#fee",
          borderRadius: 8,
          marginBottom: 24,
          color: "#c00"
        }}>
          ❌ {error}
        </div>
      )}

      {result && (
        <div style={{ 
          background: "#f9f9f9", 
          padding: 24, 
          borderRadius: 12,
          border: "1px solid #eee"
        }}>
          {result.meta?.fallback && (
            <div style={{
              padding: 12,
              background: "#fff3cd",
              border: "1px solid #ffeeba",
              borderRadius: 6,
              marginBottom: 16,
              color: "#856404"
            }}>
              ⚠️ Could not fetch live data. Showing fallback title.
            </div>
          )}

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 8 }}>📦 Original Title</h3>
            <p style={{ 
              padding: 12, 
              background: "white", 
              borderRadius: 6,
              border: "1px solid #eee"
            }}>
              {result.original?.title}
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 8 }}>📝 Description</h3>
            <p style={{ 
              padding: 12, 
              background: "white", 
              borderRadius: 6,
              border: "1px solid #eee",
              maxHeight: 200,
              overflow: "auto"
            }}>
              {result.original?.description || "No description available"}
            </p>
          </div>

          <div style={{ 
            background: "#e6f3ff", 
            padding: 16, 
            borderRadius: 8,
            marginBottom: 16
          }}>
            <h3 style={{ marginBottom: 12 }}>✨ Optimized Title</h3>
            <p style={{ 
              fontSize: 18, 
              fontWeight: 600,
              marginBottom: 12
            }}>
              {result.optimized?.title}
            </p>
            
            {result.optimized?.seoScore && (
              <div style={{ 
                display: "inline-block",
                padding: "4px 12px",
                background: result.optimized.seoScore > 80 ? "#00c853" : "#ffb300",
                color: "white",
                borderRadius: 16,
                fontSize: 14
              }}>
                SEO Score: {result.optimized.seoScore}
              </div>
            )}
            
            {result.optimized?.keywords?.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <small style={{ color: "#666" }}>Keywords:</small>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                  {result.optimized.keywords.map((kw: string, i: number) => (
                    <span key={i} style={{
                      padding: "4px 12px",
                      background: "#e3f2fd",
                      borderRadius: 16,
                      fontSize: 13
                    }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ 
            fontSize: 12, 
            color: "#999",
            borderTop: "1px solid #ddd",
            paddingTop: 16,
            marginTop: 16
          }}>
            Listing ID: {result.meta?.listingId} • 
            Fetched: {new Date(result.meta?.fetchedAt).toLocaleString()} • 
            Model: {result.meta?.model}
          </div>
        </div>
      )}
    </main>
  );
}