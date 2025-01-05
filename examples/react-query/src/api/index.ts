import { setupOpenApi } from 'openapi-hooks';
import { paths } from './schema.gen';

export const fetching = setupOpenApi<paths>({ baseUrl: 'http://localhost:3000' });

export * from './site';
