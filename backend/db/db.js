import 'dotenv/config'; 

import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg'; 

const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5440;


const pool = new pg.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: dbPort,
    database: process.env.DB_NAME,
});

const db = drizzle(pool);

export default db;