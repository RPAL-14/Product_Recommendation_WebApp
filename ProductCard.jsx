// ProductCard.jsx
export default function ProductCard({ product }) {
  return (
    <div style={{
      border: "1px solid #eee",
      borderRadius: "10px",
      boxShadow: "0 2px 12px #ececec",
      padding: "18px",
      margin: "18px 0",
      display: "flex",
      gap: "18px",
      background: "#fafcff"
    }}>
      <img
        src={product.images ? product.images[0] : ""}
        alt={product.title}
        style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8 }}
      />
      <div style={{ flex: 1 }}>
        <h2 style={{ margin: "0 0 10px" }}>{product.title}</h2>
        <div style={{ color: "#666", fontSize: "14px" }}>
          <span>Brand: <b>{product.brand}</b></span> &nbsp;|&nbsp; <span>{product.categories}</span>
        </div>
        <div style={{ margin: "8px 0" }}>{product.description}</div>
        <div style={{
          color: "#07689f",
          fontWeight: 700,
          fontSize: "18px"
        }}>
          {product.price ? `₹${product.price}` : "Price not listed"}
        </div>
      </div>
    </div>
  );
}
