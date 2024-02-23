import type { RequestHandler } from '@sveltejs/kit';
// import { env } from '$env/dynamic/private';

// const { Client } = pkg;

export const GET: RequestHandler = async () => {
	// const client = new Client({
	// 	user: 'postgres',
	// 	host: 'localhost',
	// 	database: 'compakt',
	// 	password: env.DATABASE_PASS,
	// 	port: 5432
	// });

	// try {
	// 	const parameters = ['id', 'flight_date', 'location', 'start_time', 'stop_time'];
	// 	const query = `SELECT ${parameters.join(',')} FROM "compakt-logs" ORDER BY id LIMIT 50 OFFSET 0`;
	// 	await client.connect();
	// 	const queryResponse = await client.query(query);
	// 	client.end();
	// 	return new Response(JSON.stringify(queryResponse.rows, null, 2));
	// } catch (error) {
	// 	console.error('Error connecting to the database:', error);
	// 	return new Response(null, { status: 500 });
	// }

	return new Response(null, { status: 200 });
};

export const POST: RequestHandler = async (ev) => {
	// const query_data = await ev.request.json();
	// const query_keys = [];
	// const query_values = [];

	// for(const [key, value] of Object.entries(query_data)) {
	// 	if(value === null || value === undefined || key == "v_props") continue;
	// 	const str_value = `'${(value)}'`;
	// 	query_keys.push(key);

	// 	if(['flight_date','location','start_time','stop_time','wind_direction','pilot_id','remote_id'].includes(key)) {
	// 		query_values.push(str_value);
	// 	} else {
	// 		query_values.push(value);
	// 	}
	// }

	// const client = new Client({
	// 	user: 'postgres',
	// 	host: 'localhost',
	// 	database: 'compakt',
	// 	password: env.DATABASE_PASS,
	// 	port: 5432
	// });
	// const query = `INSERT INTO "compakt-logs" (${query_keys.join(',')}) VALUES (${query_values.join(',')})`;

	// try {
	// 	await client.connect();
	// 	const queryResponse = await client.query(query);
	// 	client.end();
	// 	return new Response(JSON.stringify(queryResponse.rows, null, 2));
	// } catch (error) {
	// 	console.error('Error connecting to the database:', error);
	// 	return new Response(null, { status: 500 });
	// }
	return new Response(null, { status: 200 });
};


export const DELETE: RequestHandler = async (ev) => {
	// const query_data = await ev.request.json();

	// if(query_data.length === 0) {
	// 	return new Response(null, { status: 200 });
	// }

	// const client = new Client({
	// 	user: 'postgres',
	// 	host: 'localhost',
	// 	database: 'compakt',
	// 	password: env.DATABASE_PASS,
	// 	port: 5432
	// });
	// const query = `DELETE FROM "compakt-logs" WHERE id IN (${query_data.join(',')})`;

	// try {
	// 	await client.connect();
	// 	const queryResponse = await client.query(query);
	// 	client.end();
	// 	return new Response(JSON.stringify(queryResponse.rows, null, 2));
	// } catch (error) {
	// 	console.error('Error connecting to the database:', error);
	// 	return new Response(null, { status: 500 });
	// }

	return new Response(null, { status: 200 });
}