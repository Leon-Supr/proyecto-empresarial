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

    if (url.pathname === "/search") {
        const numCursors = parseInt(url.searchParams.get("num"))
        const cursorArray = cursorGen(numCursors)

        const results = await Promise.all(cursorArray.map(cursor => fetchado(cursor)))
        console.log(results)

        return new Response(JSON.stringify(results), {headers})
    } else {
        return new Response("Not found", { status: 404, headers})
    }
})