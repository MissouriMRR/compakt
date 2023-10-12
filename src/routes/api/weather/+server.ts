import type { RequestEvent, RequestHandler } from './$types'
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
    try {
        const { location } = await request.json();

        const weather = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${env.WEATHER_API_KEY}&q=${location}&aqi=no`
        );

        return new Response(weather.body);
    } catch (err) {
        return new Response(null, { status: 500 });
    }
}