# openapi-hooks

Magical fetch inference for OpenAPI with React Query support

## Installation

```bash
npm install openapi-hooks
```

### Development Setup

For development and testing, you can also install the package locally:

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Run tests
pnpm test

# Generate test schemas
pnpm test:schema:scalar-galaxy
pnpm test:schema:ethereum-forum
```

### Recommended OpenAPI Setup

```bash
npm install openapi-typescript
npx openapi-typescript https://api.example.com/openapi.json --output ./src/api/schema.gen.ts
```

## Features

- **🔒 Type Safety**: Full TypeScript support with inferred types from your OpenAPI schema
- **🚫 No Automatic Throwing**: Preserves type safety by not automatically throwing on non-2xx responses
- **🎯 Flexible Error Handling**: Use the `onError` callback for custom error handling
- **📊 Status Code Awareness**: Comprehensive HTTP status code types for better type inference
- **🔄 React Query Ready**: Seamless integration with @tanstack/react-query
- **⚙️ Customizable**: Extensible with custom fetch, encoding, and decoding functions

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

// Check the response status manually for type safety
if (response.status === 200) {
    console.log(response.data); // Fully typed based on your API schema! 🎉
} else {
    console.error(`Request failed with status: ${response.status}`);
}
```

### Error Handling

Unlike traditional fetch wrappers, `openapi-hooks` doesn't automatically throw on non-2xx responses. This preserves type safety and gives you full control over error handling:

```tsx
import { createFetch, ApiError } from "openapi-hooks";

const fetching = createFetch({
    baseUrl: "https://api.example.com",
    onError: (error: ApiError) => {
        // Handle errors globally (logging, notifications, etc.)
        console.error(`API Error ${error.status}: ${error.message}`);
        
        // You can implement token refresh, redirects, etc. here
        if (error.status === 401) {
            // Handle unauthorized
        }
    },
});

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

### Advanced Examples

#### POST request with JSON body:
```tsx
const response = await fetching("/items", "post", {
    contentType: "application/json",
    data: {
        name: "Cool Item",
        description: "A very cool item indeed"
    }
});

if (response.status === 201) {
    console.log("Created:", response.data);
}
```

#### Using path parameters:
```tsx
const response = await fetching("/items/{itemId}", "get", {
    path: { itemId: "123" }
});

if (response.status === 200) {
    console.log("Item:", response.data);
}
```

#### Adding custom headers:
```tsx
const response = await fetching("/items", "get", {
    header: {
        "X-Custom-Header": "value"
    }
});
```

#### Using query parameters:
```tsx
const response = await fetching("/items", "get", {
    query: { 
        limit: 10, 
        offset: 0,
        category: "electronics"
    }
});
```

### @tanstack/react-query

You can easily use the `createFetch` function with [@tanstack/react-query](https://tanstack.com/query).

We recommend the following approach to setup your queries:

```tsx
import { useQuery, queryOptions } from "@tanstack/react-query";
import { createFetch } from "openapi-hooks";

const fetching = createFetch({
    baseUrl: "https://api.example.com",
    onError: (error) => {
        console.error("API Error:", error);
    },
});

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

#### Mutation example:
```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const createTodo = () =>
    queryOptions({
        mutationFn: async (todo: { title: string; completed: boolean }) => {
            const response = await fetching("/todos", "post", {
                contentType: "application/json",
                data: todo,
            });
            
            if (response.status === 201) {
                return response.data;
            }
            
            throw new Error(`Failed to create todo: ${response.status}`);
        },
    });

export const useCreateTodo = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        ...createTodo(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });
};
```

## API Reference

### `createFetch(options?)`

Creates a type-safe fetch function based on your OpenAPI schema.

#### Options

- `baseUrl?: URL | string` - Base URL for all requests (defaults to `window.location.toString()`)
- `headers?: HeaderObject | HeaderPredicate` - Default headers or function returning headers
- `onError?: (error: ApiError) => void` - Global error handler
- `fetch?: typeof fetch` - Custom fetch implementation
- `decodeResponse?: (response: Response, contentType: string | null) => Promise<AnyApiResponse>` - Custom response decoder
- `encodeBody?: (data: any, contentType: string | undefined) => BodyInit | undefined` - Custom body encoder

### `ApiError`

Error class for API-related errors.

```tsx
class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public response?: Response,
        public data?: unknown
    )
}
```

### Response Types

All responses are typed based on your OpenAPI schema:

```tsx
type ApiResponse = {
    status: number;           // HTTP status code
    contentType?: string;     // Response content type
    data?: unknown;          // Response body (typed based on schema)
    headers?: Headers;       // Response headers
}
```

## Type Safety

The library provides comprehensive type safety:

- **Path validation**: Only valid paths from your OpenAPI schema are accepted
- **Method validation**: Only valid HTTP methods for each path are accepted
- **Parameter validation**: Query, path, and header parameters are typed
- **Response typing**: Response data is fully typed based on your schema
- **Status code awareness**: All possible status codes are included in the type system

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
