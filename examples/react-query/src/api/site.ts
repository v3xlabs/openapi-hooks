export const getSite = async () => {
    const response = await fetching('/api/site');

    return response.data;
};
