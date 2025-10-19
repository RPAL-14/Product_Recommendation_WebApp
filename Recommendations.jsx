import React, { useState } from "react";
import ProductCard from "../components/ProductCard";

function Recommendations() {
  const [data, setData] = useState(null);
  const [category, setCategory] = useState("");
  const [recommended, setRecommended] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  const fetchRecommendations = async () => {
    setActiveSection("recommend");
    setData(null);
    setRecommended([]);
    setSearchResults([]);
    const response = await fetch("http://localhost:8000/");
    const result = await response.json();
    setData(result.message);
  };

  const fetchFirstProduct = async () => {
    setActiveSection("firstProduct");
    setData(null);
    setRecommended([]);
    setSearchResults([]);
    const response = await fetch("http://localhost:8000/first_product");
    const result = await response.json();
    setData(result);
  };

  const fetchCategoryRecommendations = async () => {
    setActiveSection("category");
    setData(null);
    setRecommended([]);
    setSearchResults([]);
    const response = await fetch(
      `http://localhost:8000/recommend?category=${encodeURIComponent(category)}`
    );
    const result = await response.json();
    setRecommended(result);
  };

  const performSemanticSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    setActiveSection("semantic");
    setData(null);
    setRecommended([]);
    setSearchResults([]);
    const response = await fetch(
      `http://localhost:8000/semantic_search?q=${encodeURIComponent(searchQuery)}&top_n=5`
    );
    const data = await response.json();
    setSearchResults(data);
    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        padding: "32px 24px",
        background: "#fbfbfc",
        borderRadius: 16,
        boxShadow: "0 3px 16px #ececec",
      }}
    >
      <h2 style={{ color: "#07689f", fontWeight: 800, marginBottom: 10 }}>
        Recommendations
      </h2>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <button
          style={{
            background: "#07689f",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            padding: "10px 22px",
            cursor: "pointer",
            boxShadow: "0 2px 6px #eee",
          }}
          onClick={fetchRecommendations}
        >
          Get Recommendation
        </button>
        <button
          style={{
            background: "#07689f",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            padding: "10px 22px",
            cursor: "pointer",
            boxShadow: "0 2px 6px #eee",
          }}
          onClick={fetchFirstProduct}
        >
          Get First Product
        </button>
      </div>
      <div style={{ marginBottom: 24, display: "flex", gap: 10 }}>
        <input
          type="text"
          placeholder="Enter category (e.g. CHAIR)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1.5px solid #07689f",
            fontSize: 16,
          }}
        />
        <button
          onClick={fetchCategoryRecommendations}
          style={{
            background: "#20b2aa",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            padding: "10px 20px",
            cursor: "pointer",
            boxShadow: "0 2px 6px #eee",
          }}
        >
          Get Recommendations by Category
        </button>
      </div>

      {/* Only show results for active section */}
      {activeSection === "firstProduct" && data && typeof data === "object" && data.title && (
        <ProductCard product={data} />
      )}

      {activeSection === "recommend" && data && (
        <pre
          style={{
            backgroundColor: "#f5f5f5",
            padding: 15,
            marginTop: 15,
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          {typeof data === "string" ? data : JSON.stringify(data, null, 2)}
        </pre>
      )}

      {activeSection === "category" && recommended.length > 0 && (
        <div>
          {recommended.map((item, idx) => (
            <ProductCard key={item.uniq_id || idx} product={item} />
          ))}
        </div>
      )}

      {/* Semantic Search Section */}
      <hr style={{ margin: "50px 0 24px", borderColor: "#ddeef6" }} />
      <h2 style={{ color: "#07689f", fontWeight: 700 }}>Semantic Search</h2>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flexGrow: 1,
            padding: "12px",
            fontSize: 16,
            borderRadius: 8,
            border: "1.5px solid #07689f",
          }}
        />
        <button
          onClick={performSemanticSearch}
          disabled={loading}
          style={{
            backgroundColor: "#07689f",
            color: "white",
            border: "none",
            padding: "10px 24px",
            borderRadius: 8,
            fontWeight: 700,
            cursor: "pointer",
            minWidth: 104,
            boxShadow: "0 2px 6px #eee",
          }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {activeSection === "semantic" && (
        <>
          {searchResults.length > 0 ? (
            searchResults.map((prod) => (
              <ProductCard key={prod.uniq_id || prod.title} product={prod} />
            ))
          ) : (
            !loading && (
              <p style={{ color: "#bbb", textAlign: "center" }}>
                No semantic search results yet. Try searching above.
              </p>
            )
          )}
        </>
      )}
    </div>
  );
}

export default Recommendations;
