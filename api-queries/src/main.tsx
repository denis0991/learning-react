import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './tanstack/queryClient';
import './index.css';
import './themes/theme.css';
import { App } from './App';
import { ThemeProvider } from './context/theme-context';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const root: HTMLElement | null = document.getElementById('root');
if (root)
  createRoot(root).render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
