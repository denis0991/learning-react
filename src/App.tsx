import './App.css';
import { useState, useCallback } from 'react';
import { type ReactElement } from 'react';
import {
  Header,
  Search,
  Result,
  ErrorBoundary,
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
      <Header></Header>
      <main>
        <Search
          setStatus={handleSetStatus}
          status={status}
          setError={handleSetError}
          setSearchError={handleSetSearchError}
          setSearchState={handleSetSearchState}
        ></Search>
        <ErrorBoundary resetTrigger={errorResetTrigger}>
          <Result
            result={result}
            lackOfResult={lackOfResult}
            searchError={searchError}
          ></Result>
        </ErrorBoundary>
      </main>
    </>
  );
}
