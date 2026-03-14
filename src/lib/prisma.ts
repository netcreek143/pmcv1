import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';

// Satisfaction for Prisma schema validation which requires a file: protocol for sqlite provider
process.env.PRISMA_DATABASE_URL = 'file:./dev.db';

let prisma: PrismaClient;

if (dbUrl.startsWith('libsql://')) {
  const libsql = createClient({
    url: dbUrl,
    authToken: dbUrl.includes('authToken=') ? dbUrl.split('authToken=')[1].split('&')[0] : undefined,
  });
  const adapter = new PrismaLibSQL(libsql);
  prisma = new PrismaClient({ adapter });
} else {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: dbUrl
      }
    }
  });
}

export default prisma;
