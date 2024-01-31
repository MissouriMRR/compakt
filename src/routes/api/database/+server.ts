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
    await client.connect();
    console.log('Connected to PostgreSQL database!');
    client.end();

    const responseBody = 'Connected to PostgreSQL database!';
    const responseHeaders = new Headers({ 'Content-Type': 'text/plain' });

    return new Response(responseBody, {
      status: 200,
      headers: responseHeaders,
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
