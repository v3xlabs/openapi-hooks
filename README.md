# openapi-hooks

Magical fetch inference for OpenAPI with React Query support

## Features

- **🔒 Type Safety**: Full TypeScript support with inferred types from your OpenAPI schema
- **🚫 No Automatic Throwing**: Preserves type safety by not automatically throwing on non-2xx responses
- **🎯 Flexible Error Handling**: Use the `onError` callback for custom error handling
- **📊 Status Code Awareness**: Comprehensive HTTP status code types for better type inference
- **🔄 React Query Ready**: Seamless integration with @tanstack/react-query
- **⚙️ Customizable**: Extensible with custom fetch, encoding, and decoding functions

## Installation

```bash
npm install openapi-hooks
```

### Recommended OpenAPI Setup

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

// Check the response status for type safety
if (response.status === 200) {
    console.log(response.data); // Fully typed based on your API schema! 🎉
} else {
    console.error(`Request failed with status: ${response.status}`);
}
```

### Error Handling

Unlike traditional fetch wrappers, `openapi-hooks` doesn't automatically throw on non-2xx responses. This preserves type safety and gives you full control over error handling:

```tsx
const response = await fetching("/items", "get", {});

// Manual status checking for type safety
switch (response.status) {
    case 200:
        console.log("Success:", response.data);
        break;
    case 404:
        console.log("Not found");
        break;
    case 500:
        console.log("Server error");
        break;
    default:
        console.log(`Unexpected status: ${response.status}`);
}
```

### @tanstack/react-query

You can easily use the `createFetch` function with [@tanstack/react-query](https://tanstack.com/query).

We recommend the following approach to setup your queries:

```tsx
import { useQuery, queryOptions } from "@tanstack/react-query";

export const getTodos = () =>
    queryOptions({
        queryKey: ["todos"],
        queryFn: async () => {
            const response = await fetching("/todos", "get", {});
            
            if (response.status === 200) {
                return response.data;
            }
            
            throw new Error(`Failed to fetch todos: ${response.status}`);
        },
    });

export const useTodos = () => useQuery(getTodos());
```

## Examples

Check out the [examples](./examples) directory for complete working examples:

- [Basic Example](./examples/basic) - Simple usage without React
- [React Query Example](./examples/react-query) - Integration with @tanstack/react-query
