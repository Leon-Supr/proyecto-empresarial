import React from "react";
import Pagination from "./components/Pagination";

function App() {
  return (
    <>
      <header>
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
      <Pagination />
    </>
  );
}

export default App;
