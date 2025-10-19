import React, { useEffect, useState } from "react";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/analytics")
      .then((resp) => resp.json())
      .then((data) => setAnalytics(data));
  }, []);

  if (!analytics) return <div>Loading analytics...</div>;

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
      <h2 style={{ color: "#07689f", fontWeight: 800, marginBottom: 16 }}>
        Product Analytics
      </h2>
      <div style={{
        display: "flex",
        gap: 30,
        marginBottom: 28,
        flexWrap: "wrap"
      }}>
        <div style={{
          background: "#f0fafb",
          padding: "18px 26px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px #ebebeb",
          minWidth: "210px",
          flex: 1
        }}>
          <span style={{ fontSize: 15, color: "#20b2aa" }}>Average Price</span>
          <div style={{ fontWeight: 700, fontSize: 22 }}>₹{analytics.average_price.toFixed(2)}</div>
        </div>
        <div style={{
          background: "#f7f7fd",
          padding: "18px 26px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px #ebebeb",
          minWidth: "210px",
          flex: 1
        }}>
          <span style={{ fontSize: 15, color: "#07689f" }}>Total Products</span>
          <div style={{ fontWeight: 700, fontSize: 22 }}>{analytics.total_products}</div>
        </div>
      </div>

      <h3 style={{ color: "#07689f", margin: "20px 0 12px" }}>
        Product Counts per Category
      </h3>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 10, overflow: "hidden", fontSize: 15 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", background: "#f5fafe", padding: "8px 14px", color: "#444" }}>Category</th>
            <th style={{ textAlign: "right", background: "#f5fafe", padding: "8px 14px", color: "#444" }}>Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(analytics.category_counts).map(([category, count], idx) => (
            <tr key={category} style={{ background: idx % 2 === 0 ? "#fff" : "#f5f7fb" }}>
              <td style={{ padding: "8px 14px" }}>{category}</td>
              <td style={{ padding: "8px 14px", textAlign: "right" }}>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Analytics;
