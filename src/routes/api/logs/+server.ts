import type { RequestHandler } from '../weather/$types';
import { env } from '$env/dynamic/private';
import { FlightLog } from '$lib/structs';

/**
 * @description
 * Retrieves flight log data from the database
*/
export const GET: RequestHandler = async (ev) => {
	const query =
		`SELECT ${FlightLog.keys.filter(key => !(['v_props'].includes(key))).join(', ')} ` +
		`FROM ${env.DB_TABLE_NAME} LIMIT 50 OFFSET 0`;

	const stmt = env.DB.prepare(query);

	const results = await stmt.all();

	return new Response(JSON.stringify(results));
};

/**
 * @description
 * Posts a new flight log to the database
*/
export const POST: RequestHandler = async (ev) => {
	const props = await ev.request.json();
	const keys = FlightLog.keys.filter(key => !(['id', 'v_props'].includes(key)));
	const values = keys.map((key) => typeof props[key] === 'number' ? props[key] : `"${props[key]}"`);

	const query =
		`INSERT INTO ${env.DB_TABLE_NAME} (${keys.join(', ')}) VALUES (${values.join(', ')})`;
	
	const { success } = await env.DB.prepare(query).run();

	return new Response(null, { status: success ? 201 : 500 });
};

/**
 * @description
 * Removes a target flight log from the database
*/
export const DELETE: RequestHandler = async (ev) => {
	const ids = await ev.request.json();

	if (ids.length === 0) {
		return new Response(null, { status: 200 });
	}

	const query =
		`DELETE FROM ${env.DB_TABLE_NAME} WHERE id IN (${ids.join(',')})`;

	const { success } = await env.DB.prepare(query).run();

	return new Response(null, { status: success ? 201 : 500 });
};
