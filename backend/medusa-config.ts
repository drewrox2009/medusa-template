/**
 * Medusa configuration file
 *
 * This file configures your Medusa backend.  It reads most settings
 * from environment variables.  The general deployment guide recommends
 * setting secrets, CORS and database URLs via the environment【611812571810596†L446-L479】.
 */

import { loadEnv, defineConfig } from "@medusajs/framework/utils"

// Load environment variables based on the current NODE_ENV.  Defaults
// to `production`.  You can override by setting NODE_ENV explicitly.
loadEnv(process.env.NODE_ENV || "production", process.cwd())

export default defineConfig({
  /**
   * projectConfig controls database and cache connections as well as
   * other top‑level Medusa options.
   */
  projectConfig: {
    // PostgreSQL connection URL
    database: {
      url: process.env.DATABASE_URL,
    },

    // Disable SSL when connecting to Postgres.  Without this a self‑hosted
    // instance may throw an SSL error when starting under Docker【497537701300052†L447-L463】.
    databaseDriverOptions: {
      ssl: false,
      sslmode: "disable",
    },

    // Redis connection URL
    redisUrl: process.env.REDIS_URL,
  },

  /**
   * Configure the admin UI.  The backend URL is set via the
   * MEDUSA_BACKEND_URL environment variable so that the admin can reach
   * the API when served from a custom domain.
   */
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },

  /**
   * Register plugins here.  The Minio file service plugin is included as
   * an example.  It uses environment variables documented in the Minio
   * guide【335184576063223†L171-L180】.  Comment out or remove this block if
   * you don’t need Minio.
   */
  // plugins: [
  //   {
  //     resolve: "medusa-file-minio",
  //     options: {
  //       endpoint: process.env.MINIO_ENDPOINT,
  //       bucket: process.env.MINIO_BUCKET,
  //       access_key_id: process.env.MINIO_ACCESS_KEY,
  //       secret_access_key: process.env.MINIO_SECRET_KEY,
  //       private_bucket: process.env.MINIO_PRIVATE_BUCKET,
  //       private_access_key_id: process.env.MINIO_PRIVATE_ACCESS_KEY,
  //       private_secret_access_key: process.env.MINIO_PRIVATE_SECRET_KEY,
  //     },
  //   },
  //   // Add other plugins (Stripe, Search, etc.) as needed.
  // ],
})