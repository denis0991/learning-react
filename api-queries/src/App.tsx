import { useCallback, useEffect, useRef, useState, type JSX } from 'react';
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
import { SelectionPanel } from './components/selectionComponents/selectionPanel.component';
import { SelectionActions } from './components/selectionComponents/selectionActions.component';
import { animalKeys, useSearchAnimals } from './hooks/useAnimalQueries';
import { queryClient } from './tanstack/queryClient';

function Layout({
  result,
  status,
  lackOfResult,
  searchError,
  errorMessage,
  currentPage,
  totalPages,
  onPageChange,
  onRetry,
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
          onRetry={onRetry}
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
  const { data, isFetching, isError, error, refetch } = useSearchAnimals(
    inputValue,
    page
  );
  const hasInitialSearch = useRef(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const lastSearchRef = useRef({ value: '', page: 1 });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!hasInitialSearch.current && inputValue !== undefined) {
      hasInitialSearch.current = true;
      setTimeout(() => {
        refetch();
      }, 0);
    }
  }, [inputValue, refetch]);

  useEffect(() => {
    if (data) {
      setSearchState(data.animals, data.page?.totalPages);
      setStatus(data.animals.length === 0 ? 'missing' : 'success');
      setLackOfResult(data.animals.length === 0);
    }
  }, [data, setSearchState, setStatus, setLackOfResult]);
  useEffect(() => {
    if (isFetching) {
      setStatus('searching');
    }
  }, [isFetching, setStatus]);

  useEffect(() => {
    if (isError) {
      setStatus('error');
      setSearchError(true);
      setErrorMessage(error?.message || 'Something went wrong');
    }
  }, [isError, error, setStatus, setSearchError, setErrorMessage]);
  useEffect(() => {
    if (hasInitialSearch.current) {
      refetch();
    }
  }, [page, refetch]);

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
      refetch();
    },
    [updatePageInUrl, refetch]
  );

  const handleSearch = useCallback(
    async (value: string) => {
      if (
        isSearchLoading ||
        (lastSearchRef.current.value === value &&
          lastSearchRef.current.page === 1)
      ) {
        return;
      }

      lastSearchRef.current = { value, page: 1 };
      setInputValue(value);
      setPage(1);
      setIsSearchLoading(true);

      try {
        queryClient.invalidateQueries({
          queryKey: animalKeys.search(value, 1),
        });
        await refetch();
      } finally {
        setIsSearchLoading(false);
      }
    },
    [setInputValue, refetch]
  );

  const handleResetPage = useCallback(() => {
    resetPage();
    updatePageInUrl(1);
  }, [resetPage, updatePageInUrl]);

  const refreshData = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: animalKeys.all });

      await queryClient.refetchQueries({ queryKey: animalKeys.all });

      console.log('🔄 Refresh complete');
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }

    const currentUid = location.pathname.match(/\/details\/(.+)/)?.[1];
    if (currentUid) {
      queryClient.invalidateQueries({
        queryKey: animalKeys.details(currentUid),
      });
    }
  }, [queryClient, refetch, location.pathname, isRefreshing]);

  return (
    <>
      {isValidPath && <Header onRefresh={refreshData} />}
      <main>
        {!isAboutPage && isValidPath && (
          <Search
            setSearchState={setSearchState}
            setStatus={handleSetStatus}
            setInputValue={setInputValue}
            status={isSearchLoading || isFetching ? 'searching' : status}
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
                    status={isFetching ? 'searching' : status}
                    lackOfResult={data?.animals?.length === 0}
                    searchError={isError}
                    errorMessage={error?.message || errorMessage}
                    currentPage={page}
                    totalPages={data?.page?.totalPages || 0}
                    onPageChange={handlePageChange}
                    onRetry={refetch}
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
