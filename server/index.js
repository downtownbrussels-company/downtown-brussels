const { validateEnv, env } = require('./config/env');
const { runMigrations } = require('./database/db');
const app = require('./app');

async function start() {
  validateEnv();
  await runMigrations();

  app.listen(env.port, () => {
    console.log(`DownTown server running at ${env.siteUrl}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
