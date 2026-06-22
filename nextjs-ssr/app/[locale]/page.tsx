'use client';

import { Header } from '@/components/header/header.component';
import { Search } from '@/components/search/search.component';
import { Result } from '@/components/results/result.component';
import { SelectionPanel } from '@/components/selectionComponents/selectionPanel.component';
import { SelectionActions } from '@/components/selectionComponents/selectionActions.component';
import { useAnimalStore } from '@/stores/useAnimalStore';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useSearchAnimals } from '@/hooks/useAnimalQueries';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function HomePage() {
   const searchParams = useSearchParams();
  const queryParam = searchParams?.get('q') || '';
  const pageParam = parseInt(searchParams?.get('page') || '1');
  
  const {
    inputValue,
    setInputValue,
    status,
    setStatus,
    setSearchState,
    setSearchError,
    setErrorMessage,
    errorMessage,
    resetPage,
    setLackOfResult,
    result,
    totalPages,
  } = useAnimalStore();

   const [page, setPage] = useState(pageParam);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const { data, isFetching, isError, error, refetch } = useSearchAnimals(searchQuery, page);
  
  useLocalStorage();

  useEffect(() => {
      refetch();
  }, [searchQuery, page, refetch]);

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

  const updateUrl = useCallback((query: string, pageNum: number) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (pageNum > 1) params.set('page', pageNum.toString());
    const newUrl = params.toString() ? `/?${params.toString()}` : '/';
    window.history.pushState({}, '', newUrl);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
    setInputValue(value);
    resetPage();
    updateUrl(value, 1);
  }, [setInputValue, resetPage, updateUrl]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    updateUrl(searchQuery, newPage);
  }, [searchQuery, updateUrl]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div>
      <Header />
      <main>
        <Search
          setSearchState={setSearchState}
          setStatus={setStatus}
          setInputValue={setInputValue}
          status={isFetching ? 'searching' : status}
          value={inputValue}
          setError={setLackOfResult}
          setSearchError={setSearchError}
          setErrorMessage={setErrorMessage}
          errorMessage={errorMessage}
          resetPage={resetPage}
          onSearch={handleSearch}
        />
        <Result
          result={result}
          status={isFetching ? 'searching' : status}
          lackOfResult={result.length === 0 && searchQuery !== ''}
          searchError={isError}
          errorMessage={error?.message || errorMessage}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onRetry={handleRetry}
        />
        <SelectionPanel />
        <SelectionActions />
      </main>
    </div>
  );
}