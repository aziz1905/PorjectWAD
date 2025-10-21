import 'dotenv/config'; 

import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg'; 

const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5440;

// Cek debug Anda akan menunjukkan variabel sudah terisi
console.log(`DB_DEBUG: User=${process.env.DB_USER}, Port=${dbPort}, PasswordLength=${process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 'UNDEFINED'}`);

const pool = new pg.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: dbPort,
    database: process.env.DB_NAME,
});

const db = drizzle(pool);

export default db;