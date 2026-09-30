// Frontend runtime configuration.
//
// The API is GraphQL-only. There is no REST layer on the backend, so any
// base URL or axios client pointing at /api would 404.
//
// VITE_GRAPHQL_URL is set per Vite mode:
//   - .env.development -> /graphql, a same-origin path that the Vite dev
//     server proxies to http://localhost:8000 (see vite.config.js). No CORS
//     preflight is involved, so dev works even if the backend's CORS allow
//     list is stale.
//   - .env / deployment env -> the absolute deployed URL
//     (https://vistaforge.onrender.com/graphql), which does need the backend
//     to allow this origin.
// The fallback below matches the dev proxy target for a checkout with no env
// file at all.
export const GRAPHQL_URL =
  import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8000/graphql';

export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';
