const { MongoClient } = require('mongodb');
const { env } = require('../config/env');

let clientPromise;
let collectionPromise;

async function getClient() {
  if (!clientPromise) {
    const client = new MongoClient(env.mongoUri);
    clientPromise = client.connect();
  }

  return clientPromise;
}

async function getDatabase() {
  const client = await getClient();
  return client.db(env.mongoDbName);
}

async function getBlogCollection() {
  if (!collectionPromise) {
    collectionPromise = (async () => {
      const db = await getDatabase();
      const collection = db.collection('blog_posts');
      await collection.createIndex({ slug: 1 }, { unique: true });
      await collection.createIndex({ status: 1, published_at: -1, created_at: -1 });
      await collection.createIndex({ updated_at: -1 });
      return collection;
    })();
  }

  return collectionPromise;
}

async function runMigrations() {
  await getBlogCollection();
}

module.exports = {
  getBlogCollection,
  getDatabase,
  runMigrations
};
