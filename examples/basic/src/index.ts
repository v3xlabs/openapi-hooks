import { createFetch } from "openapi-hooks";
import { paths } from "./schema.gen";

const fetching = createFetch<paths>();

const response = await fetching('/site/{site_id}', 'get', {
    path: {
        site_id: '123'
    },
});

const data = response.data;

console.log(data);
