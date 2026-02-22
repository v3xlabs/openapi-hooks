import solid from "vite-plugin-solid";
import { defineConfig } from 'vite';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        solid(),
        tailwindcss(),
    ],
    optimizeDeps: {
        esbuildOptions: {
            supported: {
                bigint: true,
            },
        },
    },
});
