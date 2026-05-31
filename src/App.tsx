import { useCallback, useEffect, useState, type JSX } from 'react';
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
import { NotFound } from './components/notFound/notFound.component';
import { useAnimalStore } from './stores/useAnimalStore';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SelectionPanel } from './components/selectionComponents/selection-panel.component';
import { SelectionActions } from './components/selectionComponents/selectionActions.component';
import { useSearchAnimals } from './hooks/useAnimalQueries';

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
    status,
    setStatus,
    errorResetTrigger,
    setErrorResetTrigger,
    setLackOfResult,
    setSearchError,
    errorMessage,
    setErrorMessage,
    currentPage,
    resetPage,
    setSearchState,
  } = useAnimalStore();

  const [page, setPage] = useState(currentPage);

  const { data, isLoading, isError, error, refetch } = useSearchAnimals(
    inputValue,
    page
  );

  useEffect(() => {
    if (data) {
      setSearchState(data.animals, data.page?.totalPages);
      setStatus(data.animals.length === 0 ? 'missing' : 'success');
      setLackOfResult(data.animals.length === 0);
    }
  }, [data, setSearchState, setStatus, setLackOfResult]);
  useEffect(() => {
    if (isLoading) {
      setStatus('searching');
    }
  }, [isLoading, setStatus]);

  useEffect(() => {
    if (isError) {
      setStatus('error');
      setSearchError(true);
      setErrorMessage(error?.message || 'Something went wrong');
    }
  }, [isError, error, setStatus, setSearchError, setErrorMessage]);
  useLocalStorage();

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
    (page: number) => {
      setPage(page);
      updatePageInUrl(page);
    },
    [updatePageInUrl]
  );

  const handleSearch = useCallback(
    (value: string) => {
      setInputValue(value);
      setPage(1);
      refetch();
    },
    [setInputValue, refetch]
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
            status={isLoading ? 'searching' : status}
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
                <>
                  <Layout
                    result={data?.animals || []}
                    status={
                      isLoading ? 'searching' : isError ? 'error' : status
                    }
                    lackOfResult={data?.animals?.length === 0}
                    searchError={isError}
                    errorMessage={error?.message || errorMessage}
                    currentPage={page}
                    totalPages={data?.page?.totalPages || 0}
                    onPageChange={handlePageChange}
                  />
                  <SelectionPanel />
                  <SelectionActions />
                </>
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
