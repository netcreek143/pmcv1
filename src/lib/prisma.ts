import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';

let prisma: PrismaClient;

if (dbUrl.startsWith('libsql://')) {
  const config = {
    url: dbUrl,
    authToken: dbUrl.includes('authToken=') ? dbUrl.split('authToken=')[1].split('&')[0] : undefined,
  };
  const adapter = new PrismaLibSql(config);
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
