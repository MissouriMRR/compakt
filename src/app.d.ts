// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type Cloudflare from "@types/cloudflare";

declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}

        interface Platform {
            env: {
                WEATHER_API_KEY: string;
                DB: Cloudflare.D1Database;
            };
            context: {
                waitUntil(promise: Promise): void;
            };
            caches: CacheStorage & { default: Cache }
        }
    }
}

export { };
