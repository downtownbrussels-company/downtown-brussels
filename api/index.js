const { validateEnv } = require('../server/config/env');
const { runMigrations } = require('../server/database/db');
const app = require('../server/app');

let initialized;

async function ensureInitialized() {
  if (!initialized) {
    initialized = (async () => {
      validateEnv();
      await runMigrations();
    })();
  }

  return initialized;
}

module.exports = async (req, res) => {
  await ensureInitialized();
  return app(req, res);
};
