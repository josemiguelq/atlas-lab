import { buildApp } from "./app.js";
import { env } from "./config/env.js";

async function main() {
  const app = await buildApp();
  try {
    await app.listen({ port: env.port, host: env.host });
    app.log.info(`Atlas API em http://${env.host}:${env.port} (db=${env.dbMode})`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

void main();
