const PaginationResult = ({ page, pageIndex }) => {
    return (
        <>
            <div
                className="container flex flex-col items-center"
                key={pageIndex}
            >
                <h3 className="text-2xl font-bold">
                    Resultados de página {pageIndex + 1}
                </h3>
                <ol className="list-decimal">
                    {page.map((item, itemIndex) => (
                        <li key={itemIndex}>
                            {item.nombrePublicacion} → {item.decodedId} → Precio: ${item.price} mxn
                        </li>
                    ))}
                </ol>
                <br />
            </div>
        </>
    );
};

export default PaginationResult;
