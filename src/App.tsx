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
import {
  Header,
  Search,
  Result,
  ErrorBoundary,
  type Status,
  type Animals,
} from './index';
import type { LayoutProps } from './types/app.interfaces';
import { Details } from './components/results/details.component';
import { About } from './components/about/about.component';
import { NotFound } from './components/not-found/not-found.component';
import { useAnimalStore } from './stores/animal.store';

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
    setResult,
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
  } = useAnimalStore();

  const [totalPages, setTotalPages] = useState(0);
  const [, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [isPaginating, setIsPaginating] = useState(false);
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';

  const validPaths = ['/', '/about'];
  const isValidPath =
    validPaths.includes(location.pathname) ||
    location.pathname.startsWith('/details/');

  useEffect(() => {
    try {
      const savedValue = localStorage.getItem('request');
      if (savedValue) {
        setInputValue(JSON.parse(savedValue));
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }
  }, [setInputValue]);

  useEffect(() => {
    localStorage.setItem('request', JSON.stringify(inputValue));
  }, [inputValue]);

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

  const setPage = useCallback(
    (page: number) => {
      setCurrentPage(page);
      updatePageInUrl(page);
      setIsPaginating(true);
    },
    [updatePageInUrl]
  );

  const setSearchState = useCallback(
    (newResult: Animals[], totalPages?: number) => {
      setResult(newResult);
      if (totalPages !== undefined) {
        setTotalPages(totalPages);
      }
      setCurrentPage(1);
      updatePageInUrl(1);
    },
    [setResult, updatePageInUrl]
  );

  const resetPage = useCallback(() => {
    setCurrentPage(1);
    updatePageInUrl(1);
  }, [updatePageInUrl]);

  useEffect(() => {
    if (status === 'success' && currentPage > 0 && isPaginating) {
      const handlePageChange = async () => {
        try {
          const response = await fetch(
            `https://stapi.co/api/v1/rest/animal/search?pageNumber=${currentPage - 1}&pageSize=12`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: `name=${encodeURIComponent(inputValue.trim())}`,
            }
          );
          const data = await response.json();
          if (data.animals) {
            setResult(data.animals);
            if (data.page?.totalPages) {
              setTotalPages(data.page.totalPages);
            }
          }
        } catch (error) {
          console.error('Page change error:', error);
        }
      };
      handlePageChange();
      setIsPaginating(false);
    }
  }, [currentPage, status, isPaginating, inputValue, setResult, setTotalPages]);

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
            resetPage={resetPage}
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
                  onPageChange={setPage}
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
