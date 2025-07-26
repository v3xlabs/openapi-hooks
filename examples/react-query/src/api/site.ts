import { fetching } from ".";

export const getSite = async (team_id: string) => {
    const response = await fetching('/team/{team_id}', "get", { path: { team_id } });

    if (response.status === 200) {
        return response.data;
    }
    
    throw new Error(`Failed to fetch site: ${response.status}`);
};
