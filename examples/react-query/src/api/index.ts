import { createFetch } from 'openapi-hooks';
import { paths } from './schema.gen';

export const fetching = createFetch<paths>({ baseUrl: 'http://localhost:3000' });

export * from './site';
