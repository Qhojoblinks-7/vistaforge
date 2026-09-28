// Frontend runtime configuration.
//
// The API is GraphQL-only. There is no REST layer on the backend, so any
// base URL or axios client pointing at /api would 404.
export const GRAPHQL_URL =
  import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8000/graphql';

export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';
