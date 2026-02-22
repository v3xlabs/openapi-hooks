
import { QueryClientProvider } from '@tanstack/solid-query';
import { queryClient } from './query';
import { App } from './App';
import { render } from 'solid-js/web';
import { SolidQueryDevtools } from '@tanstack/solid-query-devtools';
import './style.css';

render(
    () => (
        <QueryClientProvider client={queryClient}>
            <App />
            <SolidQueryDevtools />
        </QueryClientProvider>
    ),
    document.querySelector('#root')!
);
