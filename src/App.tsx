import './App.css';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { type ReactElement } from 'react';
import {
  Header,
  NotFound,
  ResultPage,
  CardDetails,
  type Status,
  type Animals,
} from './index';

export function App(): ReactElement {
  const [result, setResult] = useState<Animals[]>([]);
  const [status, setStatus] = useState<Status>('default');
  const [lackOfResult, setLackOfResult] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<boolean>(false);
  const [errorResetTrigger, setErrorResetTrigger] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams({ page: '1' });
  const currentPage = Number(searchParams.get('page')) || 1;
  const handleSetSearchState = useCallback(
    (result: Animals[], total: number) => {
      setResult(result);
      setTotalPages(total);
    },
    []
  );

  const handleSetStatus = useCallback((status: Status) => {
    setStatus(status);
    setErrorResetTrigger((prev) => prev + 1);
  }, []);

  const handleSetError = useCallback((error: boolean) => {
    setLackOfResult(error);
  }, []);

  const handleSetSearchError = useCallback((error: boolean) => {
    setSearchError(error);
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      setSearchParams({ page: page.toString() });
    },
    [setSearchParams]
  );

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route
            path={`/search`}
            element={
              <ResultPage
                status={status}
                setStatus={handleSetStatus}
                setSearchState={handleSetSearchState}
                setError={handleSetError}
                setSearchError={handleSetSearchError}
                result={result}
                lackOfResult={lackOfResult}
                searchError={searchError}
                errorResetTrigger={errorResetTrigger}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                searchParams={searchParams}
              />
            }
          >
            <Route path=":uid" element={<CardDetails result={result} />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
