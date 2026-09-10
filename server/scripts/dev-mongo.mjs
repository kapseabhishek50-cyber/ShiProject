/**
 * Boots a real mongod (binary downloaded on first run by mongodb-memory-server)
 * on 127.0.0.1:27017 so the API can serve live data in sandboxes/demos where no
 * system MongoDB is installed. Data is ephemeral: run `npm run seed` afterwards.
 *
 *   node scripts/dev-mongo.mjs
 */
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = await MongoMemoryServer.create({
  instance: { port: 27017, ip: '127.0.0.1', dbName: 'statskill' },
});

console.log(`[dev-mongo] mongod ready at ${mongod.getUri()} (ephemeral — seed with npm run seed)`);

function shutdown() {
  mongod.stop().then(() => process.exit(0));
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
