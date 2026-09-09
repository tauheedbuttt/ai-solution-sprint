import app from './app.js';
import { env } from './config/env.js';
import { langfuseSpanProcessor } from './instrumentation.js';

const server = app.listen(env.port, () => {
  console.log(`Backend listening on port ${env.port}`);
});

process.on('SIGTERM', () => {
  server.close(async () => {
    await langfuseSpanProcessor.forceFlush();
    process.exit(0);
  });
});
