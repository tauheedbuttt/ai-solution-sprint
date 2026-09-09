import app from './app';
import { env } from './config/env';
import { langfuseSpanProcessor } from './instrumentation';

const server = app.listen(env.port, () => {
  console.log(`Backend listening on port ${env.port}`);
});

process.on('SIGTERM', () => {
  server.close(async () => {
    await langfuseSpanProcessor.forceFlush();
    process.exit(0);
  });
});
