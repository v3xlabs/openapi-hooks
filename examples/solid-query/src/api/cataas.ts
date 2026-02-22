import { createFetch } from "openapi-hooks";
import type { components, paths } from "../../../_shared/cataas.gen";

export const fetching = createFetch<paths>({ baseUrl: 'https://cataas.com' });

export type Cat = components["schemas"]["Cat"];

export const getCat = async (text: string): Promise<Cat> => {
    const response = await fetching('/cat/says/{text}', "get", {
        path: { text },
        fetchOptions: {
            headers: {
                'Accept': 'application/json'
            }
        }
    });

    if (response.status !== 200) {
        throw new Error(`Failed to fetch site: ${response.status}`);
    }

    // @ts-expect-error
    if (response.contentType !== 'application/json; charset=utf-8' && response.contentType !== 'application/json') {
        throw new Error(`Expected application/json, got ${response.contentType}`);
    }

    return response.data;
};
