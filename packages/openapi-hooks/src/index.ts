import type { HTTPStatusCode } from './statusCodes.js';

type Paths = {
  [key: string]: {
    [key: string]: any;
  };
};

type HTTPMethod =
  | "get"
  | "put"
  | "post"
  | "delete"
  | "options"
  | "head"
  | "patch"
  | "trace";

export type PathMethods<paths extends Paths, TPath extends keyof paths> = {
  [TMethod in HTTPMethod]: paths[TPath][TMethod] extends undefined
    ? never
    : TMethod;
}[HTTPMethod];

type AnyRequestBody = {
  content: Record<string, any>;
};

type AnyResponses = Record<
  number,
  { content?: Record<string, any>; headers?: Record<string, any> }
>;

type AnyParameters = {
  query?: Record<string, any>;
  header?: Record<string, any>;
  path?: Record<string, any>;
  cookie?: Record<string, any>;
};

type AnyRoute = {
  responses: AnyResponses;
  requestBody?: AnyRequestBody;
  parameters: AnyParameters;
};

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * ApiResponse is a utility type that infers the possible response shapes for an OpenAPI route.
 *
 * Given a set of possible HTTP responses (TResponses), it produces a union type representing
 * all possible response objects, including status, content type, data, and headers.
 *
 * For each status code (TStatus) in TResponses:
 *   - If TResponses[TStatus]['content'] is undefined (i.e., no content for this status):
 *       - The response object has:
 *           - status: the status code
 *           - contentType: never
 *           - data: never
 *           - headers: either a Map of header keys/values (if headers are a record), or the headers as-is
 *   - If TResponses[TStatus]['content'] is defined:
 *       - For each content type K in the content object:
 *           - The response object has:
 *               - status: the status code
 *               - contentType: K (the MIME type)
 *               - data: the data for that content type
 *               - headers: either a Map of header keys/values (if headers are a record), or the headers as-is
 *
 * The final type is a union of all possible response objects for all status codes and content types.
 */
export type ApiResponse<TResponses extends AnyResponses> = {
  [TStatus in keyof TResponses]: TStatus extends number // Only consider numeric status codes
    ? // If there is no content for this status code
      TResponses[TStatus]["content"] extends undefined
      ? {
          status: TStatus;
          contentType: never;
          data: never;
          headers: TResponses[TStatus]["headers"] extends Record<
            string,
            unknown
          >
            ? // If headers is a record, represent as a Map
              Map<
                keyof TResponses[TStatus]["headers"],
                TResponses[TStatus]["headers"][keyof TResponses[TStatus]["headers"]]
              >
            : // Otherwise, use headers as-is
              TResponses[TStatus]["headers"];
        }
      : // If there is content, create a union for each content type
        {
          [K in keyof TResponses[TStatus]["content"]]: {
            status: TStatus;
            contentType: K;
            data: TResponses[TStatus]["content"][K];
            headers: TResponses[TStatus]["headers"] extends Record<
              string,
              unknown
            >
              ? Map<
                  keyof TResponses[TStatus]["headers"],
                  TResponses[TStatus]["headers"][keyof TResponses[TStatus]["headers"]]
                >
              : TResponses[TStatus]["headers"];
          };
        }[keyof TResponses[TStatus]["content"]]
    : never;
}[keyof TResponses] | UnknownApiResponse<keyof TResponses>;

type ExcludedStatusCodes<TStatus> = Exclude<HTTPStatusCode, TStatus> & {};

type UnknownApiResponse<TStatus> = {
  status: ExcludedStatusCodes<TStatus>;
  contentType?: string;
  data?: unknown;
  headers?: Headers;
}

export type AnyApiResponse = {
  status: number;
  contentType?: string;
  data?: unknown;
  headers?: Headers;
};

export type ApiRequestBody<TBody extends AnyRequestBody | undefined> =
  TBody extends AnyRequestBody
    ? {
        [K in keyof TBody["content"]]: {
          contentType: K;
          data: TBody["content"][K];
        };
      }[keyof TBody["content"]]
    : {
        contentType?: undefined;
        data?: undefined;
      };

export type HeaderObject = Record<string, string>;
export type HeaderPredicate = () => PromiseLike<HeaderObject>;

export type OpenApiHookOptions = {
  baseUrl: URL | string;
  headers?: HeaderObject | HeaderPredicate;
  onError?: (error: ApiError) => void;
  fetch?: typeof fetch;
  decodeResponse?: (
    response: Response,
    responseContentType: string | null
  ) => Promise<AnyApiResponse>;
  encodeBody?: (
    data: any,
    contentType: string | undefined
  ) => BodyInit | undefined;
};

/**
 * FetchOptions is a type that represents the options for the fetch function.
 * It can be a RequestInit object or a function that takes a base RequestInit object and returns a RequestInit object.
 * The function is useful for adding additional headers or other properties to the request or modifying properties.
 */
export type FetchOptions =
  | RequestInit
  | ((
      base: Pick<RequestInit, "body" | "headers" | "method" | "mode">
    ) => RequestInit);

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }

  static fromResponse(response: Response, data?: unknown) {
    return new ApiError(
      response.statusText || `HTTP ${response.status}`,
      response.status,
      response,
      data
    );
  }

  static fromNetworkError(error: Error) {
    return new ApiError(
      `Network error: ${error.message}`,
      0,
      undefined,
      undefined
    );
  }
}

const defaultEncodeBody = (
  data: any,
  contentType: string | undefined
): BodyInit | undefined => {
  if (contentType === undefined) {
    return;
  }

  switch (contentType) {
    case "application/json":
    case "application/json; charset=utf-8":
      return JSON.stringify(data);
    default:
      throw new Error("Unsupported content type: " + contentType);
  }
};

const defaultDecodeResponse = async (
  response: Response,
  responseContentType: string | null
): Promise<AnyApiResponse> => {
  switch (responseContentType) {
    // eslint-disable-next-line unicorn/no-null
    case null:
      return {
        status: response.status,
        headers: response.headers,
      };

    case "text/plain; charset=utf-8":
      return {
        status: response.status,
        contentType: responseContentType,
        data: await response.text(),
      };

    case "application/json; charset=utf-8":
      return {
        status: response.status,
        contentType: responseContentType,
        data: await response.json(),
        headers: response.headers,
      };
    default:
      throw new Error("Unsupported content type: " + responseContentType);
  }
};

export const createFetch = <paths extends Paths>(
  options?: OpenApiHookOptions
) => {
  const {
    baseUrl = window.location.toString(),
    headers: defaultHeaders,
    onError,
    fetch: fetchFn = fetch,
    decodeResponse = defaultDecodeResponse,
    encodeBody = defaultEncodeBody,
  } = options ?? {};

  /**
   * Makes a type-safe OpenAPI request using fetch
   *
   * @description
   * This function provides a strongly-typed interface for making API requests based on your OpenAPI schema.
   * It handles authentication, request/response serialization, and error handling automatically.
   *
   * @example
   * Basic GET request:
   * ```ts
   * const response = await fetching('/items', 'get', {
   *   query: { limit: 10, offset: 0 }
   * });
   * // response.data is fully typed based on your API schema! 🎉
   * console.log(response.data.items);
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
   * ```
   *
   * @example
   * Using path parameters:
   * ```ts
   * const response = await fetching('/items/{itemId}', 'get', {
   *   path: { itemId: '123' }
   * });
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
   * Handling errors:
   * ```ts
   * try {
   *   const response = await fetching('/items', 'get', {});
   * } catch (error) {
   *   if (error instanceof ApiError) {
   *     console.error(`API Error ${error.status}: ${error.message}`);
   *   }
   * }
   * ```
   *
   * @template TPath - The API endpoint path (must exist in your OpenAPI schema)
   * @template TMethod - The HTTP method to use (must be valid for the given path)
   * @template TOptions - Request options including query params, headers, and body
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
   *   - status: HTTP status code
   *   - contentType: Response content type (if applicable)
   *   - data: Response body (if applicable)
   *   - headers: Response headers
   *
   * @throws {ApiError} When the server returns a non-2xx status code
   * @throws {Error} When an unsupported content type is encountered
   */
  return async <
    TPath extends keyof paths,
    TMethod extends PathMethods<paths, TPath>,
    TRoute extends AnyRoute = paths[TPath][TMethod] extends AnyRoute
      ? paths[TPath][TMethod]
      : never,
  >(
    path: TPath,
    method: TMethod,
    options: TRoute["parameters"] &
      ApiRequestBody<TRoute["requestBody"]> & {
        fetchOptions?: FetchOptions;
      }
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
        path = path.toString().replace(`{${key}}`, value) as TPath;
      }
    }

    const url = new URL(`.${path.toString()}`, baseUrl);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (!value) continue;

        url.searchParams.set(key, value.toString());
      }
    }

    const headers = new Headers();

    if (defaultHeaders) {
      let addDefaultHeaders =
        typeof defaultHeaders === "function"
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

    const response = await fetchFn(
      url,
      fetchOptions
        ? typeof fetchOptions === "function"
          ? fetchOptions(baseOptions)
          : {
              ...baseOptions,
              ...fetchOptions,
            }
        : baseOptions
    );

    if (!response.ok) {
      onError?.(ApiError.fromResponse(response));
    }

    const responseContentType = response.headers.get("content-type");

    return (await decodeResponse(response, responseContentType)) as any;
  };
};
