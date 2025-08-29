import { fetchado, cursorGen } from "./main.js";

Deno.serve((_req) => {
    const url = new URL(_req.url)

    if (url.pathname === "/search") {
        const cursorArray = cursorGen(10)

        const cursorsToFetch = []
        for (const cursor of cursorArray) {
            cursorsToFetch.push(() => fetchado(cursor))
        }


        return new Response(JSON.stringify({ message: "Hola desde Deno", status: 200 }), { headers: { "Content-Type": "application/json" } })
    } else {
        return new Response("Not found", { status: 404 })
    }
})