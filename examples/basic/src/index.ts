import { createFetch } from "openapi-hooks";
import { paths } from "./schema.gen";

// Configure the fetcher with an explicit baseUrl so it works in Node.js as well
// as the browser.
const fetching = createFetch<paths>({ baseUrl: "http://localhost:3000" });

const response = await fetching('/site/{site_id}', 'get', {
    path: {
        site_id: '123'
    },
});

const data = response.data;

console.log(data);
