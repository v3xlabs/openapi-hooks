import type { ApiError } from "./error.js";
import type { HTTPStatusCode } from "./status.js";

export type HTTPMethod =
  | "get"
  | "put"
  | "post"
  | "delete"
  | "options"
  | "head"
  | "patch"
  | "trace";

export type RouteFor<
  TPaths,
  TPath extends keyof TPaths,
  TMethod extends HTTPMethod,
> = TMethod extends keyof TPaths[TPath]
  ? Extract<NonNullable<TPaths[TPath][TMethod]>, AnyRoute>
  : never;

export type EmptyParameters = {
  query?: never;
  header?: never;
  path?: never;
  cookie?: never;
};

export type RouteParameters<TParameters> = [Extract<TParameters, AnyParameters>] extends [
  never,
]
  ? EmptyParameters
  : Extract<TParameters, AnyParameters>;

export type PathMethods<TPaths, TPath extends keyof TPaths> = {
  [TMethod in HTTPMethod]: [RouteFor<TPaths, TPath, TMethod>] extends [never]
  ? never
  : TMethod;
}[HTTPMethod];

export type AnyRequestBody = {
  content: Record<string, any>;
};

export type AnyResponses = Record<
  number,
  { content?: Record<string, any>; headers?: Record<string, any> }
>;

export type AnyParameters = {
  query?: Record<string, any>;
  header?: Record<string, any>;
  path?: Record<string, any>;
  cookie?: Record<string, any>;
};

export type AnyRoute = {
  responses: AnyResponses;
  requestBody?: AnyRequestBody;
  parameters?: AnyParameters;
};

export type Prettify<T> = {
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

export type ExcludedStatusCodes<TStatus> = Exclude<HTTPStatusCode, TStatus> & {};

export type UnknownApiResponse<TStatus> = {
  status: ExcludedStatusCodes<TStatus>;
  contentType?: string;
  data?: unknown;
  headers?: Headers;
};

export type AnyApiResponse = {
  status: number;
  contentType?: string;
  data?: unknown;
  headers?: Headers;
};

export type NoRequestBody = {
  contentType?: undefined;
  data?: undefined;
};

export type RequestBodyContentType<TBody extends AnyRequestBody | undefined> = Extract<
  keyof Extract<TBody, AnyRequestBody>["content"],
  string
>;

export type ApiRequestBody<TBody extends AnyRequestBody | undefined> = [
  Extract<TBody, AnyRequestBody>,
] extends [never]
  ? NoRequestBody
  : {
    [K in RequestBodyContentType<TBody>]: {
      contentType: K;
      data: Extract<TBody, AnyRequestBody>["content"][K];
    };
  }[RequestBodyContentType<TBody>];

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
