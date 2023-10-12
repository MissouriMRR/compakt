import type { RequestEvent, RequestHandler } from './$types'
import { WEATHER_API_KEY } from '$env/static/private';

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
    try {
        const { location } = await request.json();

        console.log("using api key", WEATHER_API_KEY);

        const weather = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${location}&aqi=no`
        );

        return new Response(weather.body);
    } catch (err) {
        return new Response(null, { status: 500 });
    }
}