import React, { useState } from "react";
import Recommendations from "./pages/Recommendations";
import Analytics from "./pages/Analytics";
import ImageUpload from "./components/ImageUpload"; // Import ImageUpload component
import './index.css';
import Navbar from './components/Navbar';

function App() {
  // Initialize page state here
  const [page, setPage] = useState("recommend");

  return (
    <div>
      {/* Use the Navbar component with props */}
      <Navbar page={page} setPage={setPage} />

      {/* Conditional rendering based on current page */}
      {page === "recommend" && <Recommendations />}
      {page === "analytics" && <Analytics />}
      {page === "upload" && <ImageUpload />}
    </div>
  );
}

export default App;
