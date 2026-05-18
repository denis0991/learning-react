import { useCallback, useEffect, useState, type JSX } from 'react';
import {
  Outlet,
  Route,
  Routes,
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
  const [inputValue, setInputValue] = useState<string>(() => {
    try {
      const savedValue = localStorage.getItem('request');
      return savedValue ? JSON.parse(savedValue) : '';
    } catch (e) {
      console.error('Error accessing localStorage:', e);
      return '';
    }
  });

  const [result, setResult] = useState<Animals[]>([]);
  const [status, setStatusState] = useState<Status>('default');
  const [lackOfResult, setLackOfResult] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [, setSearchParams] = useSearchParams();
  const [errorResetTrigger, setErrorResetTrigger] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPaginating, setIsPaginating] = useState(false);

  useEffect(() => {
    localStorage.setItem('request', JSON.stringify(inputValue));
  }, [inputValue]);

  const setStatus = useCallback((newStatus: Status) => {
    setStatusState(newStatus);
    setErrorResetTrigger((prev) => prev + 1);
  }, []);

  const setInputValueHandler = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const setError = useCallback((status: boolean) => {
    setLackOfResult(status);
  }, []);

  const setSearchErrorHandler = useCallback((status: boolean) => {
    setSearchError(status);
  }, []);

  const setErrorMessageHandler = useCallback((message: string) => {
    setErrorMessage(message);
  }, []);

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
    [updatePageInUrl]
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
  }, [currentPage, status, isPaginating]);

  return (
    <>
      <Header />
      <main>
        <Search
          setSearchState={setSearchState}
          setStatus={setStatus}
          setInputValue={setInputValueHandler}
          status={status}
          value={inputValue}
          setError={setError}
          setSearchError={setSearchErrorHandler}
          setErrorMessage={setErrorMessageHandler}
          errorMessage={errorMessage}
          resetPage={resetPage}
        />
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
          </Routes>
        </ErrorBoundary>
      </main>
    </>
  );
}
