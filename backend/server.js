import { fetchado, cursorGen } from "./main.js";

Deno.serve(async (req) => {
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // tu frontend
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    const url = new URL(req.url) //Guarda la URL, para poder trabajar con ella

    if (req.method === "OPTIONS") {
        return new Response(null, { headers });
    }

    try {
        if (url.pathname === "/search") {
            const numCursors = parseInt(url.searchParams.get("num"))
            // const adultsQty = parseInt(url.searchParams.get("adults")) // Mañana le sigo, pero esto es lo que permitirá filtrar también por num de adultos
            const cursorArray = cursorGen(numCursors)

            const myIds = ["817970082933532688", "954473174946152883", "1015537343207542410", "1015555116231236815", "641235233453546192", "1015519545063348954"] // , "1400775007490054772", "1481205027967109303", "1359784698318409392" Últimas 3 no son mías

            const results = await Promise.all(cursorArray.map(cursor => fetchado(cursor)))

            const matches = []

            results.forEach((page, pageIndex) => {
                page.forEach((item, itemIndex) => {
                    if (myIds.includes(item.decodedId)) {
                        console.log(`\nHa coincidido: ${item.decodedId} en la posición ${itemIndex}\n`);
                        matches.push({
                            nombre: item.nombrePublicacion,
                            id: item.decodedId,
                            page: pageIndex + 1,
                            pos: itemIndex + 1,
                        });
                    }
                })
            })

            return new Response(JSON.stringify({ results, matches }), { headers })
        } else {
            return new Response("Not found", { status: 404, headers })
        }
    } catch (err) {
        console.error("Error interno:", err);
        return new Response(
            JSON.stringify({ error: "Error interno del servidor", details: err.message }),
            { status: 500, headers }
        );
    }
})