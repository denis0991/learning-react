import { useCallback, useEffect, useState, type JSX } from 'react';
import './App.css';
import {
  Header,
  Search,
  Result,
  ErrorBoundary,
  type Status,
  type Animals,
} from './index';
import type { ApiResponse } from './components/search/search.interfaces';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [errorResetTrigger, setErrorResetTrigger] = useState(0);

  useEffect(() => {
    localStorage.setItem('request', JSON.stringify(inputValue));
  }, [inputValue]);

  const setSearchState = useCallback(
    (newResult: Animals[], totalPages?: number) => {
      setResult(newResult);
      if (totalPages !== undefined) {
        setTotalPages(totalPages);
      }
    },
    []
  );

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

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  useEffect(() => {
    if (status === 'success') {
      const handlePageChange = async () => {
        try {
          const response = await fetch(
            `https://stapi.co/api/v1/rest/animal/search?pageNumber=${currentPage - 1}&pageSize=12`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: `name=${encodeURIComponent(inputValue)}`,
            }
          );
          const data: ApiResponse = await response.json();
          if (data.animals) {
            setSearchState(data.animals, data.page?.totalPages);
          }
        } catch (error) {
          console.error('Page change error:', error);
        }
      };
      handlePageChange();
    }
  }, [currentPage]);

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
        />
        <ErrorBoundary resetTrigger={errorResetTrigger}>
          <Result
            result={result}
            lackOfResult={lackOfResult}
            searchError={searchError}
            errorMessage={errorMessage}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </ErrorBoundary>
      </main>
    </>
  );
}
