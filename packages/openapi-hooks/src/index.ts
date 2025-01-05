type Paths = {
    [key: string]: {
        [key: string]: any;
    };
}

type HTTPMethod =
    | 'get'
    | 'put'
    | 'post'
    | 'delete'
    | 'options'
    | 'head'
    | 'patch'
    | 'trace';

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


export type ApiResponse<TResponses extends AnyResponses> = {
    [TStatus in keyof TResponses]: TStatus extends number
    ? TResponses[TStatus]['content'] extends undefined
    ? {
        status: TStatus;
        contentType: never;
        data: never;
        headers: TResponses[TStatus]['headers'] extends Record<
            string,
            unknown
        >
        ? Map<
            keyof TResponses[TStatus]['headers'],
            TResponses[TStatus]['headers'][keyof TResponses[TStatus]['headers']]
        >
        : TResponses[TStatus]['headers'];
    }
    : {
        [K in keyof TResponses[TStatus]['content']]: {
            status: TStatus;
            contentType: K;
            data: TResponses[TStatus]['content'][K];
            headers: TResponses[TStatus]['headers'] extends Record<
                string,
                unknown
            >
            ? Map<
                keyof TResponses[TStatus]['headers'],
                TResponses[TStatus]['headers'][keyof TResponses[TStatus]['headers']]
            >
            : TResponses[TStatus]['headers'];
        };
    }[keyof TResponses[TStatus]['content']]
    : never;
}[keyof TResponses];

export type ApiRequestBody<TBody extends AnyRequestBody | undefined> =
    TBody extends AnyRequestBody
    ? {
        [K in keyof TBody['content']]: {
            contentType: K;
            data: TBody['content'][K];
        };
    }[keyof TBody['content']]
    : {
        contentType?: undefined;
        data?: undefined;
    };

export type OpenApiHookOptions = {
    baseUrl: URL | string;
};


const convertBody = (
    data: any,
    contentType: string | undefined
): // eslint-disable-next-line no-undef
    BodyInit | undefined => {
    if (contentType === undefined) {
        return;
    }

    switch (contentType) {
        case 'application/json':
        case 'application/json; charset=utf-8':
            return JSON.stringify(data);
        default:
            throw new Error('Unsupported content type: ' + contentType);
    }
};

const decodeResponse = async (response, responseContentType) => {
    switch (responseContentType) {
        // eslint-disable-next-line unicorn/no-null
        case null:
            return {
                status: response.status,
                headers: response.headers,
            } as any;

        case 'text/plain; charset=utf-8':
            return {
                status: response.status,
                contentType: responseContentType,
                data: await response.text(),
            } as any;

        case 'application/json; charset=utf-8':
            return {
                status: response.status,
                contentType: responseContentType,
                data: await response.json(),
                headers: response.headers,
            } as any;
        default:
            throw new Error('Unsupported content type: ' + responseContentType);
    }
};

export const setupOpenApi = <paths extends Paths>(options?: OpenApiHookOptions) => {
    const { baseUrl = window.location.toString() } = options ?? {};

    return async <
        TPath extends keyof paths,
        TMethod extends PathMethods<paths, TPath>,
        TOptions extends TRoute['parameters'] &
        ApiRequestBody<TRoute['requestBody']> & {
            fetchOptions?: RequestInit;
        },
        TRoute extends AnyRoute = paths[TPath][TMethod] extends AnyRoute
        ? paths[TPath][TMethod]
        : never
    >(
        path: TPath,
        method: TMethod,
        options: TOptions
    ): Promise<Prettify<ApiResponse<TRoute['responses']>>> => {
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

        const url = new URL(path.toString(), baseUrl);

        if (query) {
            for (const [key, value] of Object.entries(query)) {
                url.searchParams.set(key, value.toString());
            }
        }

        const headers = new Headers();

        if (header) {
            for (const [key, value] of Object.entries(header)) {
                headers.set(key, value.toString());
            }
        }

        // TODO: Introduce Middlewares here

        // The fetch request
        const response = await fetch(url, {
            method: method.toUpperCase(),
            headers,
            body: convertBody(data, contentType),
            ...fetchOptions,
        });

        // error handling here

        const responseContentType = response.headers.get('content-type');

        return await decodeResponse(response, responseContentType);
    };
};
