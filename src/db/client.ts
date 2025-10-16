import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

// Initialize Turso client
const tursoClient = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Create Drizzle instance
export const db = drizzle(tursoClient, { schema });

// Export client for direct queries if needed
export const client = tursoClient;

