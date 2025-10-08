# Medusa Template (Backend & Storefront)

This repository contains a minimal skeleton for deploying a Medusa v2 backend and a Next.js storefront.  It is designed to be deployed on platforms like **Coolify** using **Dockerfiles** rather than a single `docker‑compose.yml`.  You will need to provide your own PostgreSQL, Redis and Minio services; those are not bundled here.

## Structure

```
medusa-template/
├── backend/            # Medusa server (API + Admin)
│   ├── Dockerfile      # Dockerfile for the Medusa server
│   ├── .env.example    # Example environment variables for the backend
│   └── medusa-config.ts # Medusa configuration with sensible defaults
└── storefront/         # Next.js storefront
    ├── Dockerfile      # Dockerfile for the storefront
    └── .env.local.example # Example env for the storefront
```

## Getting started

1. **Populate the backend folder with your Medusa backend code.**  You can generate a new project with [`create-medusa-app`](https://docs.medusajs.com/resources/create-medusa-app) or copy your existing backend into `backend/`.  Make sure that the `package.json` and lock file live in the `backend` folder.

2. **Populate the storefront folder with your Next.js storefront code.**  Medusa provides a [Next.js starter](https://github.com/medusajs/nextjs-starter-medusa) you can clone directly into `storefront/`.  Again, your `package.json` and lock file should live in that folder.

3. **Copy the example environment files** and fill in your secrets and connection URLs:

   ```sh
   cp backend/.env.example backend/.env
   cp storefront/.env.local.example storefront/.env.local
   ```

   Update the placeholders as appropriate (database URLs, redis URL, Minio credentials, etc.).  See the comments in each file for guidance.

4. **Build and run the images.**  Both folders include a `Dockerfile` that installs dependencies, builds your application and exposes the proper port.  When deploying with Coolify you can point it at the root of this repository and it will build both images separately.

5. **Configure your DNS:**

   * **Storefront** — point `store.eww‑pew.com` to your storefront container (port `3000` by default).
   * **Admin panel and API** — point `admin.eww‑pew.com` to your backend container.  The Medusa admin dashboard is served under the `/app` path (e.g. `https://admin.eww‑pew.com/app`).  The REST API is served under `/` (e.g. `https://admin.eww‑pew.com/store/products`).

## Environment variables

When deploying a Medusa application you need to provide a few critical environment variables.  The [General Deployment Guide](https://docs.medusajs.com/learn/deployment/general#content) highlights that you should set secrets for cookies and JWTs as well as CORS and database URLs【611812571810596†L446-L477】.  Additionally, if you enable the [Minio file service plugin](https://docs.medusajs.com/v1/plugins/file-service/minio) you need to provide `MINIO_ENDPOINT`, `MINIO_BUCKET`, `MINIO_ACCESS_KEY` and `MINIO_SECRET_KEY`【335184576063223†L171-L180】.

Refer to the example env files in each folder for the full set of variables required.

## Notes

* This repository intentionally **does not include** Docker Compose.  You must supply your own PostgreSQL, Redis and Minio services.  Ensure those services are reachable from your containers and that the connection strings in your `.env` files are correct.
* The Medusa server is configured in `backend/medusa-config.ts` to disable database SSL by default and to read its backend URL from `MEDUSA_BACKEND_URL`.  Feel free to adjust this file to suit your requirements.
* The Next.js storefront reads `NEXT_PUBLIC_MEDUSA_BACKEND_URL` from its environment to determine where to fetch data from.

---

For more details on Medusa deployment, consult the [official documentation](https://docs.medusajs.com/learn/deployment/general#content).