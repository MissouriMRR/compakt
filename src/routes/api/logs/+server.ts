import type { RequestHandler } from '../weather/$types';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async (ev) => {
	const query =
		'SELECT id, start_time, stop_time, location FROM logs ORDER BY start_time LIMIT 50 OFFSET 0';

	const stmt = env.DB.prepare(query);

	const results = await stmt.all();

	return new Response(JSON.stringify(results));
};

export const POST: RequestHandler = async (ev) => {
	const {
		location,
		flight_date,
		start_time,
		stop_time,
		temp_f,
		wind_speed_mph,
		wind_direction,
		wind_degree,
		gust_speed_mph,
		humidity,
		pilot_id,
		remote_id
	} = await ev.request.json();

	const query =
		'INSERT INTO logs (location, flight_date, start_time, stop_time, temp_f, wind_speed_mph, wind_direction, wind_degree, gust_speed_mph, humidity, pilot_id, remote_id' +
		'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

	const { success } = await env.DB.prepare(query)
		.bind(
			location,
			flight_date,
			start_time,
			stop_time,
			temp_f,
			wind_speed_mph,
			wind_direction,
			wind_degree,
			gust_speed_mph,
			humidity,
			pilot_id,
			remote_id
		)
		.run();

	return new Response(null, { status: success ? 201 : 500 });
};

export const DELETE: RequestHandler = async (ev) => {
	const query_data = await ev.request.json();

	if (query_data.length === 0) {
		return new Response(null, { status: 200 });
	}

	const query = `DELETE FROM logs WHERE id IN (${query_data.join(',')})`;
	console.log(query);

	const { success } = await env.DB.prepare(query).run();

	return new Response(null, { status: success ? 201 : 500 });
};
