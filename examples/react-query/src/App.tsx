import { useQuery } from "@tanstack/react-query";
import { fetching } from "./api";

export const App = () => {
    const { data } = useQuery({
        queryKey: ['hello'],
        queryFn: async () => (await fetching('/auth/bootstrap', 'get', {} as never)).data,
    });

    return (
        <div>
            Hello World
            {JSON.stringify(data)}
        </div>
    )
};
