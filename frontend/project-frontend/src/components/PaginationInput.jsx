import {useState} from "react";
import Pagination from "./Pagination";

const PaginationInput = () => {

    const [pages, setPages] = useState(0)

    return (
        <div className="container flex flex-col items-center">
            <input
                type="number"
                placeholder="Num Pag"
                value={pages}
                onChange={(event) => setPages(event.target.value)}
            />
            {pages > 0 && <Pagination totalPages={pages}/>}
        </div>
    );
};

export default PaginationInput;
