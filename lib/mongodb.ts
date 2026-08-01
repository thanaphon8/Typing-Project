import { MongoClient } from 'mongodb';

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined;

function createClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI environment variable');
  return new MongoClient(uri).connect();
}

/* Connection is created lazily on first call instead of at module load, so
   `next build` (which imports route modules to collect page data) doesn't
   require MONGODB_URI or a reachable database at build time. */
export default function getClientPromise(): Promise<MongoClient> {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) global._mongoClientPromise = createClientPromise();
    return global._mongoClientPromise;
  }
  if (!clientPromise) clientPromise = createClientPromise();
  return clientPromise;
}
