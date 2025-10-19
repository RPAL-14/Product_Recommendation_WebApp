// SearchResults.jsx
import ProductCard from "./ProductCard";
import { useState } from "react";

export default function SearchResults() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    const res = await fetch(`http://localhost:8000/semantic_search?q=${encodeURIComponent(query)}&top_n=5`);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h1 style={{ textAlign: "center", color: "#07689f" }}>Smart Product Search</h1>
      <div style={{ display: "flex", gap: 10, margin: "18px 0" }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for a product..."
          style={{
            flex: 1,
            padding: 10,
            border: "1.5px solid #07689f",
            borderRadius: 8,
            fontSize: 15
          }}
        />
        <button
          onClick={search}
          disabled={loading}
          style={{
            padding: "12px 22px",
            background: "#07689f",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      {products.map(prod => (
        <ProductCard key={prod.uniq_id || prod.title} product={prod} />
      ))}
      {products.length === 0 && !loading && <p style={{ textAlign: "center", color: "#aaa" }}>No products found yet. Try a search!</p>}
    </div>
  );
}
