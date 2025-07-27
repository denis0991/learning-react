import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { type ReactElement } from 'react';
import {
  Header,
  NotFound,
  ResultPage,
  type Status,
  type Animals,
} from './index';

export function App(): ReactElement {
  const [result, setResult] = useState<Animals[]>([]);
  const [status, setStatus] = useState<Status>('default');
  const [lackOfResult, setLackOfResult] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<boolean>(false);
  const [errorResetTrigger, setErrorResetTrigger] = useState<number>(0);

  const handleSetSearchState = useCallback((result: Animals[]) => {
    setResult(result);
  }, []);

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

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route
            path="/search"
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
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
