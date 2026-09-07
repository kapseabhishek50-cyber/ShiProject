import { createApp } from './app.js';
import { connectDb, disconnectDb } from './config/db.js';
import { env } from './config/env.js';
import { llmProviderName } from './services/llm/index.js';

/**
 * Entry point. The database is connected before the port is opened: a server that
 * accepts requests it cannot serve produces 500s that look like application bugs.
 */

async function main() {
  await connectDb();

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`[api] listening on http://127.0.0.1:${env.port} (${env.nodeEnv})`);
    console.log(`[api] llm provider: ${llmProviderName()}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`[api] port ${env.port} is already in use; using the existing API instance.`);
      server.close(() => process.exit(0));
      return;
    }
    console.error('[api] server error:', error);
    process.exit(1);
  });

  const shutdown = async (signal) => {
    console.log(`\n[api] ${signal} received, closing.`);
    server.close(async () => {
      await disconnectDb();
      process.exit(0);
    });
    // Don't hang forever on a stuck connection.
    setTimeout(() => process.exit(1), 8000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((error) => {
  console.error('[api] failed to start:', error.message);
  process.exit(1);
});
