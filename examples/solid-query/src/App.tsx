import { useQuery } from "@tanstack/solid-query";
import { getCat } from "./api/cataas";
import { createSignal, Show, Suspense } from "solid-js";

export const App = () => {
    const [text, setText] = createSignal('Hello');
    const catQuery = useQuery(() => ({
        queryKey: ['hello', text()],
        queryFn: () => getCat(text()),
    }));

    return (
        <div class="flex gap-2">
            <input type="text" value={text()} oninput={(e) => setText(e.target.value)} />
            <div class="border p-2">
                Hello {text()}
                {/* <Suspense fallback={<div>Loading...</div>}> */}
                    {JSON.stringify(catQuery.data)}
                    {catQuery.data && (
                        <>
                            {JSON.stringify(catQuery.data)}
                                {/* @ts-expect-error */}
                                <img src={catQuery.data?.url} alt="Cat" class="w-xl h-auto" />
                        </>
                    )}
                    {
                        catQuery.error && (
                            <div>Error: {catQuery.error.message}</div>
                        )
                    }
                {/* </Suspense> */}
            </div>
        </div>
    )
};
