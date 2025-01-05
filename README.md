# openapi-hooks

Magical fetch inference for OpenAPI with React Query support

## Installation

```bash
npm install openapi-hooks
```

### Recommended OpenApi Setup

```bash
npm install openapi-typescript
npx openapi-typescript https://api.example.com/openapi.json --output ./src/api/schema.gen.ts
```

## Usage

### Basic Usage

```tsx
import { createFetch } from "openapi-hooks";

const fetching = createFetch({
    baseUrl: "https://api.example.com",
    onError: (error) => {
        console.error(error);
    },
});

const response = await fetching("/items", "get", {});

console.log(response.data);
```

### @tanstack/react-query

```tsx
import { useQuery } from "@tanstack/react-query";

export const getTodos = () =>
    queryOptions({
        queryKey: ["todos"],
        queryFn: async () => {
            const response = await fetching("/todos", "get", {});

            return response.data;
        },
    });

export const useTodos = () => useQuery(getTodos());
```
