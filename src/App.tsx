import { useCallback, type JSX } from 'react';
import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useMatch,
  useSearchParams,
} from 'react-router-dom';
import './App.css';
import { Header, Search, Result, ErrorBoundary, type Status } from './index';
import type { LayoutProps } from './types/app.interfaces';
import { Details } from './components/results/details.component';
import { About } from './components/about/about.component';
import { NotFound } from './components/not-found/not-found.component';
import { useAnimalStore } from './stores/animal.store';
import { useAnimalSearch } from './hooks/useAnimalSearch';
import { useLocalStorage } from './hooks/useLocalStorage';

function Layout({
  result,
  status,
  lackOfResult,
  searchError,
  errorMessage,
  currentPage,
  totalPages,
  onPageChange,
}: LayoutProps) {
  const isDetailsRoute = useMatch('/details/:uid');

  return (
    <div className={`split-view${isDetailsRoute ? ' has-details' : ''}`}>
      <div className="left-panel">
        <Result
          result={result}
          status={status}
          lackOfResult={lackOfResult}
          searchError={searchError}
          errorMessage={errorMessage}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
      {isDetailsRoute && (
        <div className="right-panel">
          <Outlet />
        </div>
      )}
    </div>
  );
}

export function App(): JSX.Element {
  const {
    inputValue,
    setInputValue,
    result,
    status,
    setStatus,
    errorResetTrigger,
    setErrorResetTrigger,
    lackOfResult,
    setLackOfResult,
    searchError,
    setSearchError,
    errorMessage,
    setErrorMessage,
    totalPages,
    currentPage,
    resetPage,
    setSearchState,
  } = useAnimalStore();

  useLocalStorage();
  const { searchAnimals } = useAnimalSearch();

  const [, setSearchParams] = useSearchParams();
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';

  const validPaths = ['/', '/about'];
  const isValidPath =
    validPaths.includes(location.pathname) ||
    location.pathname.startsWith('/details/');

  const handleSetStatus = useCallback(
    (newStatus: Status) => {
      setStatus(newStatus);
      setErrorResetTrigger((prev) => prev + 1);
    },
    [setStatus, setErrorResetTrigger]
  );

  const updatePageInUrl = useCallback(
    (page: number) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set('page', page.toString());
        return params;
      });
    },
    [setSearchParams]
  );

  const handlePageChange = useCallback(
    async (page: number) => {
      await searchAnimals(inputValue, page);
      updatePageInUrl(page);
    },
    [inputValue, searchAnimals, updatePageInUrl]
  );

  const handleSearch = useCallback(
    async (value: string) => {
      await searchAnimals(value, 1);
      updatePageInUrl(1);
    },
    [searchAnimals, updatePageInUrl]
  );

  const handleResetPage = useCallback(() => {
    resetPage();
    updatePageInUrl(1);
  }, [resetPage, updatePageInUrl]);

  return (
    <>
      {isValidPath && <Header />}
      <main>
        {!isAboutPage && isValidPath && (
          <Search
            setSearchState={setSearchState}
            setStatus={handleSetStatus}
            setInputValue={setInputValue}
            status={status}
            value={inputValue}
            setError={setLackOfResult}
            setSearchError={setSearchError}
            setErrorMessage={setErrorMessage}
            errorMessage={errorMessage}
            resetPage={handleResetPage}
            onSearch={handleSearch}
          />
        )}
        <ErrorBoundary resetTrigger={errorResetTrigger}>
          <Routes>
            <Route
              path="/"
              element={
                <Layout
                  result={result}
                  status={status}
                  lackOfResult={lackOfResult}
                  searchError={searchError}
                  errorMessage={errorMessage}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              }
            >
              <Route index element={null} />
              <Route path="details/:uid" element={<Details />} />
            </Route>
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </>
  );
}
