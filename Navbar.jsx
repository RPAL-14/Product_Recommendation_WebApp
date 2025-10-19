export default function Navbar({ page, setPage }) {
  return (
    <nav style={{
      background: "#07689f",
      padding: "18px 0",
      display: "flex",
      justifyContent: "center",
      gap: "18px",
      boxShadow: "0 2px 12px #ecf0f3"
    }}>
      <button
        onClick={() => setPage("recommend")}
        style={{
          background: page === "recommend" ? "#20b2aa" : "#fff",
          color: page === "recommend" ? "#fff" : "#07689f",
          fontWeight: 700,
          padding: "10px 26px",
          border: "none",
          borderRadius: "8px",
          boxShadow: "0 2px 6px #eee",
          fontSize: "16px",
          cursor: "pointer",
          transition: "background .3s"
        }}
      >
        Recommendations
      </button>
      <button
        onClick={() => setPage("analytics")}
        style={{
          background: page === "analytics" ? "#20b2aa" : "#fff",
          color: page === "analytics" ? "#fff" : "#07689f",
          fontWeight: 700,
          padding: "10px 26px",
          border: "none",
          borderRadius: "8px",
          boxShadow: "0 2px 6px #eee",
          fontSize: "16px",
          cursor: "pointer",
          transition: "background .3s"
        }}
      >
        Analytics
      </button>
      <button
        onClick={() => setPage("upload")}
        style={{
          background: page === "upload" ? "#20b2aa" : "#fff",
          color: page === "upload" ? "#fff" : "#07689f",
          fontWeight: 700,
          padding: "10px 26px",
          border: "none",
          borderRadius: "8px",
          boxShadow: "0 2px 6px #eee",
          fontSize: "16px",
          cursor: "pointer",
          transition: "background .3s"
        }}
      >
        Upload Image
      </button>
    </nav>
  );
}
