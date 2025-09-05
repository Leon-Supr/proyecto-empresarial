import { useEffect, useState } from "react";

const Pagination = ({totalPages}) => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/search?num=${totalPages}`)
      .then((res) => res.json())
      .then((data) => setPages(data))
      .catch((err) => console.error("Error:", err));
  }, [totalPages]);

  return (
    <div>
      
      {pages.map((page, pageIndex) => (
        <div className="container flex flex-col items-center" key={pageIndex}>
          <h3 className="text-2xl font-bold">
            Resultados de página {pageIndex + 1}
          </h3>
          <ol className="list-decimal">
            {page.map((item, itemIndex) => (
              <li key={itemIndex}>
                {item.nombrePublicacion} → {item.decodedId}
              </li>
            ))}
          </ol>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Pagination;
