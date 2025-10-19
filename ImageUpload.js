import React, { useState } from "react";

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const onFileChange = (e) => {
    const newFile = e.target.files[0];
    setFile(newFile);
    setResult(null);
    if (newFile) setPreview(URL.createObjectURL(newFile));
    else setPreview(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an image file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/classify_image", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
      console.log("Backend result:", data); // For debugging
    } catch (error) {
      alert("Error uploading or classifying image");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        padding: "32px 24px",
        background: "#fbfbfc",
        borderRadius: 16,
        boxShadow: "0 3px 16px #ececec",
      }}
    >
      <h2 style={{ color: "#07689f", fontWeight: 800, marginBottom: 18 }}>
        Upload Product Image
      </h2>
      <form onSubmit={onSubmit} style={{ marginBottom: 24 }}>
        <label
          style={{
            display: "block",
            margin: "18px 0 10px",
            fontSize: 16,
            color: "#666",
            fontWeight: 500,
          }}
        >
          Choose image
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{
              display: "block",
              marginTop: 12,
              padding: "10px",
            }}
          />
        </label>
        {preview && (
          <div style={{ textAlign: "center", margin: "22px 0" }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: "90%",
                maxHeight: 240,
                borderRadius: 12,
                boxShadow: "0 2px 12px #eee",
              }}
            />
          </div>
        )}
        <button
          type="submit"
          disabled={loading || !file}
          style={{
            background: "#07689f",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            padding: "13px 32px",
            marginTop: 10,
            boxShadow: "0 2px 6px #eee",
            cursor: loading || !file ? "not-allowed" : "pointer",
            opacity: loading || !file ? 0.7 : 1,
          }}
        >
          {loading ? "Classifying..." : "Upload"}
        </button>
      </form>
      {result && (
        <div
          style={{
            background: "#f5f7fa",
            border: "1.5px solid #e9eff5",
            borderRadius: "10px",
            padding: "16px 20px",
            fontSize: 16,
            color: "#144434",
            marginTop: 20,
            boxShadow: "0 2px 10px #d0dceb",
          }}
        >
          <h3 style={{ color: "#07689f", marginBottom: 12 }}>
            Classification Result
          </h3>
          {result.classification && (
            <p>
              <strong>Class: </strong>
              {result.classification}
            </p>
          )}
          {result.label && (
            <p>
              <strong>Label: </strong>
              {result.label}
            </p>
          )}
          {result.confidence !== undefined && (
            <p>
              <strong>Confidence: </strong>
              {(result.confidence * 100).toFixed(2)}%
            </p>
          )}
          {/* Always show the result JSON for debugging */}
          <details style={{
            marginTop: 10,
            color: "#235b9f",
            background: "#f8fafc",
            borderRadius: 6,
            padding: "8px 0"
          }}>
            <summary style={{ cursor: "pointer", marginBottom: 4 }}>
              Show raw response
            </summary>
            <pre
              style={{
                background: "#f0f8ff",
                color: "#555",
                fontSize: 14,
                margin: 0,
                padding: 10,
                borderRadius: 6
              }}
            >
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
