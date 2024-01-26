import type { RequestHandler } from '../weather/$types';
import { env } from '$env/dynamic/private';
import { authorized } from '$lib/auth';

export const GET: RequestHandler = async (ev) => {
	// if (!(await authorized(ev, 'logs_r'))) return new Response(null, { status: 401 });

	const stmt = env.DB.prepare(
		'SELECT id, t_start, t_end, location FROM logs ORDER BY t_start LIMIT 50 OFFSET 0'
	);

	const results = await stmt.all();

	return new Response(results);
};

export const POST: RequestHandler = async (ev) => {
	// if (!(await authorized(ev, 'logs_w'))) return new Response(null, { status: 401 });

	const {
		location,
		t_start,
		t_end,
		condition,
		wind_speed,
		wind_heading,
		temperature,
		gust_speed,
		humidity
	} = await ev.request.json();

	const { success } = await env.DB.prepare(
		'INSERT INTO logs (location, t_start, t_end, condition, wind_speed, wind_heading, temperature, gust_speed, humidity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
	)
		.bind(
			location,
			t_start,
			t_end,
			condition,
			wind_speed,
			wind_heading,
			temperature,
			gust_speed,
			humidity
		)
		.run();

	return new Response(null, { status: success ? 201 : 500 });
};
