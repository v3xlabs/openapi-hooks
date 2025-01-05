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

To get started this package assumes you have some sort of OpenAPI schema that you want to generate typesafe calls from. In our case we will be using [openapi-typescript](https://openapi-ts.dev/) to generate the typesafe calls.

To get started you can generate your `schema.gen.ts` file with the following command:

```bash
npx openapi-typescript http://localhost:3000/openapi.json --output ./src/api/schema.gen.ts
```

### Basic Usage

A simple example of making a fetch call to an endpoint can be done easily.
You can setup your fetch call using the `createFetch` function.

In addition you can specify a baseUrl and global error handling behavior such that there is room for you to implement token refreshing, redirecting, etc.

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

You can also easily use the `createFetch` function with [@tanstack/react-query](https://tanstack.com/query).

We recommend the following approach to setup your queries:

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
