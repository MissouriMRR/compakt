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
