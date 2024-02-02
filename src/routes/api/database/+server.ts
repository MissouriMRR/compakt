import { Client } from 'pg';
import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async () => {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'compakt',
    password: env.DATABASE_PASS,
    port: 5432
  });

  try {
    const parameters = ['id','"date"','location','start_time','stop_time'];
    const query = `SELECT ${parameters.join(',')} FROM "compakt-logs" ORDER BY id LIMIT 50 OFFSET 0`;
    await client.connect();
    const queryResponse = await client.query(query);
    client.end();
    return new Response(JSON.stringify(queryResponse.rows, null, 2));
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return new Response(null, {status: 500});
  }
};

export const POST: RequestHandler = async (ev) => {
  const { id, date, location, startTime, stopTime, tempF, tempC, windSpeed, windDirection, windDegree, gustSpeed, humidity, pilotID, remoteID } = await ev.request.json();

  const N = "null";
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'compakt',
    password: env.DATABASE_PASS,
    port: 5432
  });

  try {
    const keys = ['id','date','location','start_time','stop_time', 'temp_f', 'temp_c', 'wind_speed','wind_direction','wind_degree','gust_speed','humidity','pilot_id','remote_id'];
    const values = [id, date||N, location||N, startTime||N, stopTime||N, tempF||N, tempC||N, windSpeed||N, windDirection||N, windDegree||N, gustSpeed||N, humidity||N, pilotID||N, remoteID||N];
    const query = `INSERT INTO "compakt-logs"(${keys.join(',')}) VALUES(${values.join(',')})`;
    console.log(query)
    await client.connect();
    const queryResponse = await client.query(query);
    client.end();
    return new Response(JSON.stringify(queryResponse.rows, null, 2));
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return new Response(null, {status: 500});
  }
};
