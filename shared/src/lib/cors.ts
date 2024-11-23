import { CorsOptions } from 'cors';

export function getCorsConfig() {
  const corsConfig: CorsOptions = {
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    origin: '*',
  };
  return corsConfig;
}
