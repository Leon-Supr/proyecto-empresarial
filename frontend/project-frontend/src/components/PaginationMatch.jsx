

const PaginationMatch = ({ nombre, page, pos, matchIndex }) => {
    return (
        <>
            <div
                className="container flex flex-col items-center"
                key={matchIndex}
            >
                <h3>
                    Hubo match en id {nombre}, página {page} y posición {pos}
                </h3>
            </div>
        </> 
    );
};

export default PaginationMatch;
