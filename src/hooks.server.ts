/*import { dev } from '$app/environment';
import type { RequestEvent } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
    const req: typeof event = {
        ...event,
        platform: {
            ...event.platform
        }
    };
    if (dev && event.platform) {
        event.platform.env = process.env;
    }

    return await resolve(req);
}*/