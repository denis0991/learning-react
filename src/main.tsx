import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './themes/theme.css';
import { App } from './App';
import { ThemeProvider } from './context/theme-context';

const root: HTMLElement | null = document.getElementById('root');
if (root)
  createRoot(root).render(
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  );
