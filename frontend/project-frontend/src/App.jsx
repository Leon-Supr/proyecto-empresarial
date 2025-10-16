import React from "react";
import Pagination from "./components/Pagination";
import PaginationInput from "./components/PaginationInput";

function App() {
  return (
    <>
      <header className="bg-primary text-white p-4">
        <nav style={{ display: "flex", justifyContent: "space-between" }}>
          <p>Logo</p>
          <ul style={{ display: "flex", gap: "1rem", listStyle: "none" }}>
            <li>
              <a href="">Inicio</a>
            </li>
            <li>
              <a href="">Otra cosa</a>
            </li>
          </ul>
        </nav>
      </header>
      <PaginationInput />
    </>
  );
}

export default App;
