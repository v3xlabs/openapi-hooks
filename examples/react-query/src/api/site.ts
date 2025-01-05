import { fetching } from ".";

export const getSite = async (siteId: string) => {
    const response = await fetching('/site/{site_id}', 'get', {
        path: {
            site_id: siteId,
        },
    });

    return response.data;
};
