import { fetching } from ".";

export const getSite = async (team_id: string) => {
    const response = await fetching('/team/{team_id}', "get", { path: { team_id } });

    return response.data;
};
