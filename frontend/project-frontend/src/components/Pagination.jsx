import { useEffect, useState } from "react";
import PaginationResult from "./PaginationResult.jsx";
import PaginationMatch from "./PaginationMatch.jsx";

const Pagination = ({ totalPages }) => {
  const [data, setData] = useState({ results: [], matches: [] });

  useEffect(() => {
    fetch(`http://localhost:8000/search?num=${totalPages}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Respuesta del backend:", data);
        setData(data);
      })
      .catch((err) => console.error("Error:", err));
  }, [totalPages]);

  return (
    <div>
      {data.matches.map(({ nombre, page, pos }, matchIndex) => (
        <PaginationMatch
          nombre={nombre}
          page={page}
          pos={pos}
          matchIndex={matchIndex}
          key={matchIndex}
        />
      ))}

      {data.results.map((page, pageIndex) => (
        <PaginationResult page={page} pageIndex={pageIndex} key={pageIndex}/>
      ))}
    </div>
  );
};

export default Pagination;
