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
                            {item.nombrePublicacion} → Precio: ${item.pricePerNight} mxn → <a href={item.postUrl}>Ver publicación</a>
                        </li>
                    ))}
                </ol>
                <br />
            </div>
        </>
    );
};

export default PaginationResult;
