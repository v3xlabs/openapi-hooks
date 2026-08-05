import { ApiError } from "./error.js";
import type { AnyApiResponse, AnyRoute, ApiRequestBody, ApiResponse, OpenApiHookOptions, PathMethods, Prettify, RouteFor, RouteParameters } from "./http.js";

/**
 * FetchOptions is a type that represents the options for the fetch function.
 * It can be a RequestInit object or a function that takes a base RequestInit object and returns a RequestInit object.
 * The function is useful for adding additional headers or other properties to the request or modifying properties.
 */
export type FetchOptions
  = | RequestInit
    | ((
      base: Pick<RequestInit, "body" | "headers" | "method" | "mode">,
    ) => RequestInit);

const defaultEncodeBody = (
  data: any,
  contentType: string | undefined,
): BodyInit | undefined => {
  if (contentType === undefined) {
    return;
  }

  switch (contentType) {
    case "application/json":
    case "application/json; charset=utf-8": {
      return JSON.stringify(data);
    }
    default: {
      throw new Error("Unsupported content type: " + contentType);
    }
  }
};

const defaultDecodeResponse = async (
  response: Response,
  responseContentType: string | null,
): Promise<AnyApiResponse> => {
  switch (responseContentType) {
    // eslint-disable-next-line unicorn/no-null
    case null: {
      return {
        status: response.status,
        headers: response.headers,
      };
    }

    case "text/plain; charset=utf-8": {
      return {
        status: response.status,
        contentType: responseContentType,
        data: await response.text(),
      };
    }

    case "application/json; charset=utf-8": {
      return {
        status: response.status,
        contentType: responseContentType,
        data: await response.json(),
        headers: response.headers,
      };
    }
    default: {
      throw new Error("Unsupported content type: " + responseContentType);
    }
  }
};

export type OptionsFor<TRoute extends AnyRoute> = RouteParameters<TRoute["parameters"]>
  & ApiRequestBody<TRoute["requestBody"]> & {
    fetchOptions?: FetchOptions;
  };

export const createFetch = <paths extends object>(
  options?: OpenApiHookOptions,
) => {
  const {
    baseUrl = globalThis.location.toString(),
    headers: defaultHeaders,
    onError,
    fetch: fetchFunction = fetch,
    decodeResponse = defaultDecodeResponse,
    encodeBody = defaultEncodeBody,
  } = options ?? {};

  /**
   * Makes a type-safe OpenAPI request using fetch
   *
   * @description
   * This function provides a strongly-typed interface for making API requests based on your OpenAPI schema.
   * It handles authentication, request/response serialization, and preserves type safety by not automatically
   * throwing on non-2xx responses. Use the onError callback for global error handling.
   *
   * @example
   * Basic GET request with status checking:
   * ```ts
   * const response = await fetching('/items', 'get', {
   *   query: { limit: 10, offset: 0 }
   * });
   *
   * if (response.status === 200) {
   *   // response.data is fully typed based on your API schema! 🎉
   *   console.log(response.data.items);
   * } else {
   *   console.error(`Request failed with status: ${response.status}`);
   * }
   * ```
   *
   * @example
   * POST request with JSON body:
   * ```ts
   * const response = await fetching('/items', 'post', {
   *   contentType: 'application/json',
   *   data: {
   *     name: 'Cool Item',
   *     description: 'A very cool item indeed'
   *   }
   * });
   *
   * if (response.status === 201) {
   *   console.log('Created:', response.data);
   * }
   * ```
   *
   * @example
   * Using path parameters:
   * ```ts
   * const response = await fetching('/items/{itemId}', 'get', {
   *   path: { itemId: '123' }
   * });
   *
   * if (response.status === 200) {
   *   console.log('Item:', response.data);
   * }
   * ```
   *
   * @example
   * Adding custom headers:
   * ```ts
   * const response = await fetching('/items', 'get', {
   *   header: {
   *     'X-Custom-Header': 'value'
   *   }
   * });
   * ```
   *
   * @example
   * Error handling with onError callback:
   * ```ts
   * const fetching = createFetch({
   *   baseUrl: 'https://api.example.com',
   *   onError: (error) => {
   *     console.error(`API Error ${error.status}: ${error.message}`);
   *     // Handle global errors (logging, notifications, token refresh, etc.)
   *   }
   * });
   *
   * const response = await fetching('/items', 'get', {});
   * // Check status manually for type safety
   * switch (response.status) {
   *   case 200:
   *     console.log('Success:', response.data);
   *     break;
   *   case 404:
   *     console.log('Not found');
   *     break;
   *   default:
   *     console.log(`Unexpected status: ${response.status}`);
   * }
   * ```
   *
   * @template TPath - The API endpoint path (must exist in your OpenAPI schema)
   * @template TMethod - The HTTP method to use (must be valid for the given path)
   * @template TRoute - Internal type representing the full route definition
   *
   * @param path - The API endpoint path (e.g., '/items')
   * @param method - The HTTP method to use (e.g., 'get', 'post')
   * @param options - Request configuration object containing:
   *   - query?: Record<string, any> - Query parameters
   *   - header?: Record<string, any> - Custom headers
   *   - path?: Record<string, any> - Path parameters
   *   - contentType?: string - Request content type
   *   - data?: any - Request body
   *   - fetchOptions?: RequestInit - Additional fetch options
   *
   * @returns A Promise resolving to a typed response object containing:
   *   - status: HTTP status code (preserves type safety by not throwing)
   *   - contentType: Response content type (if applicable)
   *   - data: Response body (if applicable, typed based on schema)
   *   - headers: Response headers
   *
   * @throws {Error} When an unsupported content type is encountered during encoding/decoding
   */
  return async <
    TPath extends keyof paths & string,
    TMethod extends PathMethods<paths, TPath>,
    TRoute extends AnyRoute = RouteFor<paths, TPath, TMethod>,
    TOptions extends OptionsFor<TRoute> = OptionsFor<TRoute>,
  >(
    path: TPath,
    method: TMethod,
    options: TOptions,
  ): Promise<Prettify<ApiResponse<TRoute["responses"]>>> => {
    const {
      query,
      header,
      path: pathParameters,
      contentType,
      data,
      fetchOptions,
    } = options;

    if (pathParameters) {
      for (const [key, value] of Object.entries(pathParameters)) {
        path = path.replace(`{${key}}`, value) as TPath;
      }
    }

    const url = new URL(`.${path}`, baseUrl);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (!value) continue;

        url.searchParams.set(key, value.toString());
      }
    }

    const headers = new Headers();

    if (defaultHeaders) {
      const addDefaultHeaders
        = typeof defaultHeaders === "function"
          ? await defaultHeaders()
          : defaultHeaders;

      for (const [key, value] of Object.entries(addDefaultHeaders)) {
        headers.set(key, value);
      }
    }

    if (contentType) {
      headers.set("Content-Type", contentType);
    }

    if (header) {
      for (const [key, value] of Object.entries(header)) {
        headers.set(key, value.toString());
      }
    }

    const baseOptions = {
      method: method.toUpperCase(),
      headers,
      body: encodeBody(data, contentType),
    };

    const response = await fetchFunction(
      url,
      fetchOptions
        ? (typeof fetchOptions === "function"
            ? fetchOptions(baseOptions)
            : {
                ...baseOptions,
                ...fetchOptions,
              })
        : baseOptions,
    );

    if (!response.ok) {
      onError?.(ApiError.fromResponse(response));
    }

    const responseContentType = response.headers.get("content-type");

    return (await decodeResponse(response, responseContentType)) as any;
  };
};
