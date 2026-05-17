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
  const [errorResetTrigger, setErrorResetTrigger] = useState(0);

  useEffect(() => {
    localStorage.setItem('request', JSON.stringify(inputValue));
  }, [inputValue]);

  const setSearchState = useCallback((newResult: Animals[]) => {
    setResult(newResult);
  }, []);

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
          />
        </ErrorBoundary>
      </main>
    </>
  );
}
