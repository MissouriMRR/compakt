import type { RequestHandler } from '../weather/$types';
import { env } from '$env/dynamic/private';

/**
 * @description
 * Retrieves flight log data from the database
*/
export const GET: RequestHandler = async (ev) => {
	const query =
		'SELECT id, location, flight_date, start_time, stop_time, temp_f, wind_speed_mph, wind_direction, wind_degree, gust_speed_mph, humidity, pilot_id, remote_id FROM logs ORDER BY start_time LIMIT 50 OFFSET 0';

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
	const vals = [
		'"'+props.location+'"',
		'"'+props.flight_date+'"',
		'"'+props.start_time+'"',
		'"'+props.stop_time+'"',
		props.temp_f,
		props.wind_speed_mph,
		'"'+props.wind_direction+'"',
		props.wind_degree,
		props.gust_speed_mph,
		props.humidity,
		'"'+props.pilot_id+'"',
		'"'+props.remote_id+'"'
	];

	const query =
		'INSERT INTO logs (location, flight_date, start_time, stop_time, temp_f, wind_speed_mph, wind_direction, wind_degree, gust_speed_mph, humidity, pilot_id, remote_id)' +
		` VALUES (${vals.join(', ')})`;
	
	const { success } = await env.DB.prepare(query).run();

	return new Response(null, { status: success ? 201 : 500 });
};

/**
 * @description
 * Removes a target flight log from the database
*/
export const DELETE: RequestHandler = async (ev) => {
	const query_data = await ev.request.json();

	if (query_data.length === 0) {
		return new Response(null, { status: 200 });
	}

	const query = `DELETE FROM logs WHERE id IN (${query_data.join(',')})`;

	const { success } = await env.DB.prepare(query).run();

	return new Response(null, { status: success ? 201 : 500 });
};
