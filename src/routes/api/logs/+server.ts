import type { RequestHandler } from "../weather/$types";
import { env } from "$env/dynamic/private";

export const GET: RequestHandler = async () => {
    const stmt = env.DB.prepare('SELECT id, t_start, t_end, location FROM logs ORDER BY t_start LIMIT 50 OFFSET 0');

    const results = await stmt.all();

    return new Response(results);
}

export const POST: RequestHandler = async (ev) => {
    const { location, t_start, t_end, condition, wind_speed, wind_heading, temperature, gust_speed, humidity, pilot_id, remote_id } = await ev.request.json();

    const access_jwt = ev.request.headers.get("Cf-Access-Jwt-Assertion");

    if (!access_jwt)
        return new Response(null, { status: 400 });

    const jwt_data = JSON.parse(Buffer.from(access_jwt.split('.')[1], 'base64').toString());

    const added_by: string = (jwt_data.email as string).split('@')[0];

    const { success } = await env.DB.prepare('INSERT INTO logs (location, t_start, t_end, condition, wind_speed, wind_heading, temperature, gust_speed, humidity, added_by, pilot_id, remote_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(location, t_start, t_end, condition, wind_speed, wind_heading, temperature, gust_speed, humidity, added_by, pilot_id, remote_id).run();

    return new Response(null, { status: success ? 201 : 500 });
}