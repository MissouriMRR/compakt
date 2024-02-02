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
    const parameters = ['id','"date"','location'];
    const query = `SELECT ${parameters.join(',')} FROM "compakt-logs" ORDER BY id LIMIT 50 OFFSET 0`;
    await client.connect();
    const responseBody = await client.query(query);
    client.end();
    console.log(responseBody.rows)

    return new Response(null, {
      status: 200
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
    
    const responseBody = 'Error connecting to the database';
    const responseHeaders = new Headers({ 'Content-Type': 'text/plain' });

    return new Response(responseBody, {
      status: 500,
      headers: responseHeaders,
    });
  }
};
